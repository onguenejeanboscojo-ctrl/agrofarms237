import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatFCFA } from "@/lib/whatsapp";
import ProductCarousel from "@/components/ProductCarousel";
import HomeProductOrderModal, {
  HomeOrderProduct,
} from "@/components/HomeProductOrderModal";

export const revalidate = 30;

type MediaItem = {
  id: string;
  url: string;
  kind: "photo" | "video";
  category?: string | null;
  caption?: string | null;
};

type Product = {
  id: string;
  name: string;
  price_standard: number | null;
  price_bulk: number | null;
  bulk_min_kg: number | null;
  stock_status: "disponible" | "stock_limite" | "indisponible" | string;
  stock_quantity: number;
  stock_threshold: number;
  category: string | null;
  product_group: string | null;
  variant: string | null;
  unit: string | null;
  display_order: number;
};

const CATEGORY_ORDER = ["Pisciculture", "Élevage porcin", "Aviculture"];

const CATEGORY_INTRO: Record<string, string> = {
  Pisciculture:
    "Poissons issus de notre production piscicole, proposés selon les formes disponibles à la ferme.",
  "Élevage porcin":
    "Une gamme porcine qui s’élargira progressivement selon la production et les disponibilités.",
  Aviculture:
    "Poulets et œufs issus de notre activité avicole, avec des formats adaptés aux particuliers et aux professionnels.",
};

async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("products")
      .select(
        "id,name,price_standard,price_bulk,bulk_min_kg,stock_status,stock_quantity,stock_threshold,category,product_group,variant,unit,display_order"
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) return [];
    return (data || []) as Product[];
  } catch {
    return [];
  }
}

async function getMedia(): Promise<MediaItem[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select("*")
      .eq("published", true)
      .eq("kind", "photo")
      .order("position")
      .order("created_at", { ascending: false });

    return (data || []) as MediaItem[];
  } catch {
    return [];
  }
}

function mediaCategories(product: Product) {
  const group = (product.product_group || "").toLowerCase();
  const variant = (product.variant || "").toLowerCase();

  if (group === "silure") return ["elevage_silure", "silure"];
  if (group === "carpe") return ["carpe", "produit_carpe"];
  if (group === "porc" && variant.includes("fum")) return ["produit_porc_fume"];
  if (group === "porc") return ["porc", "elevage_porc"];
  if (group === "poulet de chair" && variant.includes("fum")) {
    return ["produit_poulet_fume"];
  }
  if (group === "poulet de chair") return ["produit_poulet_frais", "poulet"];
  if (group === "œufs" || group === "oeufs") return ["oeufs", "œufs"];

  return [];
}

function getImages(product: Product, media: MediaItem[]) {
  const categories = mediaCategories(product);
  if (!categories.length) return [];

  return media
    .filter((item) => item.category && categories.includes(item.category))
    .map((item) => item.url);
}

function statusLabel(status: string) {
  if (status === "disponible") return "Disponible";
  if (status === "stock_limite") return "Stock limité";
  return "Indisponible";
}

function statusClass(status: string) {
  if (status === "disponible") {
    return "border-ok/20 bg-ok/10 text-ok";
  }

  if (status === "stock_limite") {
    return "border-gold/25 bg-gold/10 text-goldDeep";
  }

  return "border-ink/10 bg-ink/5 text-inkSoft";
}

function priceText(product: Product) {
  if (typeof product.price_standard !== "number") {
    return "Prix à confirmer";
  }

  const unit = product.unit ? `/${product.unit}` : "";
  const standard = `${formatFCFA(product.price_standard)}${unit}`;

  if (
    typeof product.price_bulk === "number" &&
    typeof product.bulk_min_kg === "number" &&
    product.bulk_min_kg > 0 &&
    product.unit === "kg"
  ) {
    return `${standard} · ${formatFCFA(product.price_bulk)}/kg dès ${product.bulk_min_kg} kg`;
  }

  return standard;
}

function toOrderProduct(product: Product): HomeOrderProduct {
  return {
    id: product.id,
    name: product.name,
    description: null,
    status: product.stock_status,
    price: product.price_standard,
    price_unit: product.unit,
    price_1_label: null,
    price_1: product.price_standard,
    price_2_label:
      typeof product.bulk_min_kg === "number"
        ? `À partir de ${product.bulk_min_kg} kg`
        : null,
    price_2: product.price_bulk,
    order_enabled:
      product.stock_status !== "indisponible" &&
      typeof product.price_standard === "number",
    order_options: [],
  };
}

function ProductImage({ images, title }: { images: string[]; title: string }) {
  if (images.length > 0) {
    return <ProductCarousel images={images} />;
  }

  return (
    <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
      <div className="px-6 text-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
          Agrofarms237
        </span>
        <p className="mt-2 font-serif text-[23px] font-semibold text-paper">
          {title}
        </p>
        <p className="mt-1 text-[13px] text-paper/60">Photo à venir</p>
      </div>
    </div>
  );
}

function ProductCard({ product, media }: { product: Product; media: MediaItem[] }) {
  const images = getImages(product, media);
  const hasPrice = typeof product.price_standard === "number";
  const canOrder =
    product.stock_status !== "indisponible" && hasPrice;

  return (
    <article className="overflow-hidden rounded-l border border-ink/10 bg-paper shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <ProductImage images={images} title={product.name} />

      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-bold ${statusClass(
              product.stock_status
            )}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusLabel(product.stock_status)}
          </span>

          <span className="text-[12px] font-medium text-inkSoft">
            {product.unit || ""}
          </span>
        </div>

        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-goldDeep">
          {product.product_group}
        </p>

        <h3 className="mt-1 font-serif text-[28px] font-semibold text-ink">
          {product.variant || product.name}
        </h3>

        <p className="mt-3 text-[14px] leading-6 text-inkSoft">
          {product.variant} · vendu au {product.unit || "format indiqué"}.
        </p>

        <div className="mt-5 rounded-2xl bg-bgAlt px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-inkSoft">
            Tarif actuel
          </p>
          <p className="mt-1 text-[17px] font-semibold text-ink">
            {priceText(product)}
          </p>
        </div>

        <div className="mt-5">
          {canOrder ? (
            <HomeProductOrderModal
              product={toOrderProduct(product)}
              useDefaultOptions={false}
            />
          ) : (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center rounded-full border border-ink/10 bg-ink/5 px-5 py-3.5 text-sm font-semibold text-inkSoft"
            >
              {hasPrice ? "Commande indisponible" : "Prix à confirmer"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function ProduitsPage() {
  const [products, media] = await Promise.all([getProducts(), getMedia()]);

  const categories = CATEGORY_ORDER.filter((category) =>
    products.some((product) => product.category === category)
  );

  const availableCount = products.filter(
    (product) =>
      product.stock_status !== "indisponible" &&
      typeof product.price_standard === "number"
  ).length;

  return (
    <main>
      <section className="relative overflow-hidden bg-ink px-5 py-[100px] text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)]" />
        <div className="relative mx-auto max-w-[1180px]">
          <span className="mb-3 inline-block text-[13px] font-bold text-gold">
            Notre catalogue
          </span>
          <h1 className="max-w-[850px] font-serif text-[clamp(40px,7vw,68px)] font-semibold leading-[1.05]">
            Toute la gamme Agrofarms237, au même endroit.
          </h1>
          <p className="mt-5 max-w-[700px] text-[17px] leading-7 text-paper/75">
            Découvrez les produits issus de nos différentes activités agricoles.
            Les tarifs sont actualisés selon les conditions du marché et la
            disponibilité est pilotée directement depuis notre administration.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-[12px] font-semibold">
            <span className="rounded-full border border-paper/15 bg-paper/5 px-4 py-2">
              {products.length} produits au catalogue
            </span>
            <span className="rounded-full border border-paper/15 bg-paper/5 px-4 py-2">
              {availableCount} disponible{availableCount > 1 ? "s" : ""} à la commande
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px] space-y-20">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category === category
            );

            return (
              <section key={category}>
                <div className="mb-9 max-w-[760px]">
                  <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-goldDeep">
                    {category}
                  </span>
                  <h2 className="mt-2 font-serif text-[clamp(31px,5vw,46px)] font-semibold">
                    {category}
                  </h2>
                  <p className="mt-3 text-[15px] leading-7 text-inkSoft">
                    {CATEGORY_INTRO[category]}
                  </p>
                </div>

                <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      media={media}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {products.length === 0 && (
        <section className="px-5 py-20 text-center">
          <p className="text-inkSoft">
            Le catalogue est momentanément indisponible.
          </p>
        </section>
      )}

      <section className="bg-ink px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[13px] font-bold text-gold">Agrofarms237</span>
          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Une gamme qui grandit avec la ferme.
          </h2>
          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-paper/70">
            Les produits, les prix et les disponibilités peuvent évoluer avec
            notre production et les conditions du marché. Le catalogue public
            est alimenté directement depuis notre espace d’administration.
          </p>
        </div>
      </section>
    </main>
  );
}
