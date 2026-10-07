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
  site_location?: string | null;
  caption?: string | null;
};

type Product = {
  id: string;
  name: string;
  price_standard: number | null;
  price_bulk: number | null;
  bulk_min_kg: number | null;
  stock_status:
    | "disponible"
    | "stock_limite"
    | "indisponible"
    | string;
  stock_quantity: number;
  stock_threshold: number;
  category: string | null;
  product_group: string | null;
  variant: string | null;
  unit: string | null;
  display_order: number;
};

const CATEGORY_ORDER = [
  "Pisciculture",
  "Élevage porcin",
  "Aviculture",
];

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


// ============================================================
// NORMALISATION
// ============================================================

function normalize(value: string | null | undefined) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}


// ============================================================
// EMPLACEMENTS MÉDIA D'UN PRODUIT
// ============================================================
//
// Le nouveau système utilise site_location.
//
// Les anciennes catégories sont conservées en fallback afin
// de ne pas casser les photos déjà enregistrées dans Supabase.
//

function mediaLocations(product: Product): string[] {
  const group = normalize(product.product_group);
  const variant = normalize(product.variant);
  const name = normalize(product.name);

  // ==========================================================
  // SILURE
  // ==========================================================

  if (group === "silure") {
    if (
      variant.includes("fum") ||
      name.includes("fume")
    ) {
      return ["produit_silure_fume"];
    }

    return ["produit_silure_frais"];
  }

  // ==========================================================
  // CARPE
  // ==========================================================

  if (group === "carpe") {
    return ["produit_carpe_fraiche"];
  }

  // ==========================================================
  // PORC
  // ==========================================================

  if (group === "porc") {
    if (
      variant.includes("fum") ||
      name.includes("fume")
    ) {
      return ["produit_porc_fume"];
    }

    if (
      variant.includes("entier") ||
      name.includes("entier")
    ) {
      return ["produit_porc_entier"];
    }

    if (
      variant.includes("frais") ||
      name.includes("frais")
    ) {
      return ["produit_porc_frais"];
    }

    return ["produit_porc_frais"];
  }

  // ==========================================================
  // PORCELET
  // ==========================================================

  if (
    group === "porcelet" ||
    name.includes("porcelet")
  ) {
    return ["produit_porcelet"];
  }

  // ==========================================================
  // POULET DE CHAIR
  // ==========================================================

  if (
    group === "poulet de chair" ||
    group === "poulet"
  ) {
    if (
      variant.includes("fum") ||
      name.includes("fume")
    ) {
      return ["produit_poulet_fume"];
    }

    if (
      variant.includes("vivant") ||
      name.includes("vivant")
    ) {
      return ["produit_poulet_vivant"];
    }

    if (
      variant.includes("frais") ||
      variant.includes("nettoye") ||
      name.includes("frais") ||
      name.includes("nettoye")
    ) {
      return ["produit_poulet_frais_nettoye"];
    }

    return ["produit_poulet_frais_nettoye"];
  }

  // ==========================================================
  // ŒUFS / ALVÉOLES
  // ==========================================================

  if (
    group === "oeufs" ||
    group === "oeuf" ||
    name.includes("alveole") ||
    name.includes("alvéole") ||
    variant.includes("alveole") ||
    variant.includes("alvéole")
  ) {
    return ["produit_alveoles_oeufs"];
  }

  // ==========================================================
  // POUSSINS
  // ==========================================================

  if (
    group === "poussins" ||
    name.includes("poussin")
  ) {
    return ["produit_poussins"];
  }

  // ==========================================================
  // ALEVINS
  // ==========================================================

  if (
    group === "alevins" ||
    name.includes("alevin")
  ) {
    return ["produit_alevins"];
  }

  return [];
}


// ============================================================
// ANCIENNES CATÉGORIES — FALLBACK
// ============================================================
//
// Ces valeurs permettent aux anciennes photos de continuer
// à fonctionner tant qu'elles n'ont pas encore été migrées
// vers site_location.
//

function legacyMediaCategories(product: Product): string[] {
  const group = normalize(product.product_group);
  const variant = normalize(product.variant);
  const name = normalize(product.name);

  // Silure
  if (group === "silure") {
    return ["elevage_silure", "silure"];
  }

  // Carpe
  if (group === "carpe") {
    return ["carpe", "produit_carpe"];
  }

  // Porc fumé
  if (
    group === "porc" &&
    (variant.includes("fum") || name.includes("fume"))
  ) {
    return ["produit_porc_fume"];
  }

  // Porc
  if (group === "porc") {
    return ["porc", "elevage_porc"];
  }

  // Poulet fumé
  if (
    (group === "poulet de chair" || group === "poulet") &&
    (variant.includes("fum") || name.includes("fume"))
  ) {
    return ["produit_poulet_fume"];
  }

  // Poulet
  if (
    group === "poulet de chair" ||
    group === "poulet"
  ) {
    return [
      "produit_poulet_frais",
      "poulet",
    ];
  }

  // Œufs
  if (
    group === "oeufs" ||
    group === "oeuf"
  ) {
    return [
      "oeufs",
      "œufs",
    ];
  }

  // Porcelets
  if (
    group === "porcelet" ||
    name.includes("porcelet")
  ) {
    return ["produit_porcelet"];
  }

  // Poussins
  if (
    group === "poussins" ||
    name.includes("poussin")
  ) {
    return ["produit_poussins"];
  }

  // Alevins
  if (
    group === "alevins" ||
    name.includes("alevin")
  ) {
    return ["produit_alevins"];
  }

  return [];
}


// ============================================================
// RÉCUPÉRATION DES IMAGES
// ============================================================

function getImages(
  product: Product,
  media: MediaItem[]
) {
  const locations = mediaLocations(product);
  const legacyCategories = legacyMediaCategories(product);

  if (
    locations.length === 0 &&
    legacyCategories.length === 0
  ) {
    return [];
  }

  return media
    .filter((item) => {
      // ------------------------------------------------------
      // NOUVEAU SYSTÈME
      // ------------------------------------------------------
      //
      // Dès qu'un média possède un site_location,
      // celui-ci devient la référence principale.
      //

      if (
        item.site_location &&
        locations.includes(item.site_location)
      ) {
        return true;
      }

      // ------------------------------------------------------
      // ANCIEN SYSTÈME
      // ------------------------------------------------------
      //
      // On utilise category uniquement pour les anciens médias
      // qui n'ont pas encore de site_location.
      //

      if (
        !item.site_location &&
        item.category &&
        legacyCategories.includes(item.category)
      ) {
        return true;
      }

      return false;
    })
    .map((item) => item.url);
}


// ============================================================
// STATUT
// ============================================================

function statusLabel(status: string) {
  if (status === "disponible") return "Disponible";

  if (status === "stock_limite") {
    return "Stock limité";
  }

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


// ============================================================
// PRIX
// ============================================================

function priceText(product: Product) {
  if (typeof product.price_standard !== "number") {
    return "Prix à confirmer";
  }

  const unit = product.unit
    ? `/${product.unit}`
    : "";

  const standard =
    `${formatFCFA(product.price_standard)}${unit}`;

  if (
    typeof product.price_bulk === "number" &&
    typeof product.bulk_min_kg === "number" &&
    product.bulk_min_kg > 0 &&
    product.unit === "kg"
  ) {
    return `${standard} · ${formatFCFA(
      product.price_bulk
    )}/kg dès ${product.bulk_min_kg} kg`;
  }

  return standard;
}


// ============================================================
// COMMANDE
// ============================================================

function toOrderProduct(
  product: Product
): HomeOrderProduct {
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


// ============================================================
// IMAGE PRODUIT
// ============================================================

function ProductImage({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (images.length > 0) {
    return (
      <ProductCarousel
        images={images}
      />
    );
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

        <p className="mt-1 text-[13px] text-paper/60">
          Photo à venir
        </p>
      </div>
    </div>
  );
}


// ============================================================
// CARTE PRODUIT
// ============================================================

function ProductCard({
  product,
  media,
}: {
  product: Product;
  media: MediaItem[];
}) {
  const images = getImages(
    product,
    media
  );

  const hasPrice =
    typeof product.price_standard === "number";

  const canOrder =
    product.stock_status !== "indisponible" &&
    hasPrice;

  return (
    <article className="overflow-hidden rounded-l border border-ink/10 bg-paper shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <ProductImage
        images={images}
        title={product.name}
      />

      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-bold ${statusClass(
              product.stock_status
            )}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {statusLabel(
              product.stock_status
            )}
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
          {product.variant} · vendu au{" "}
          {product.unit || "format indiqué"}.
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
              {hasPrice
                ? "Commande indisponible"
                : "Prix à confirmer"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}


// ============================================================
// PAGE PRODUITS
// ============================================================

export default async function ProduitsPage() {
  const [
    products,
    media,
  ] = await Promise.all([
    getProducts(),
    getMedia(),
  ]);

  const categories =
    CATEGORY_ORDER.filter((category) =>
      products.some(
        (product) =>
          product.category === category
      )
    );

  const availableCount =
    products.filter(
      (product) =>
        product.stock_status !==
          "indisponible" &&
        typeof product.price_standard ===
          "number"
    ).length;

  return (
    <main>
      {/* ======================================================
          HERO
      ====================================================== */}

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
              {availableCount} disponible
              {availableCount > 1 ? "s" : ""} à la commande
            </span>
          </div>
        </div>
      </section>


      {/* ======================================================
          CATALOGUE
      ====================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px] space-y-20">
          {categories.map(
            (category) => {
              const categoryProducts =
                products.filter(
                  (product) =>
                    product.category ===
                    category
                );

              return (
                <section
                  key={category}
                >
                  <div className="mb-9 max-w-[760px]">
                    <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-goldDeep">
                      {category}
                    </span>

                    <h2 className="mt-2 font-serif text-[clamp(31px,5vw,46px)] font-semibold">
                      {category}
                    </h2>

                    <p className="mt-3 text-[15px] leading-7 text-inkSoft">
                      {
                        CATEGORY_INTRO[
                          category
                        ]
                      }
                    </p>
                  </div>

                  <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map(
                      (product) => (
                        <ProductCard
                          key={
                            product.id
                          }
                          product={
                            product
                          }
                          media={
                            media
                          }
                        />
                      )
                    )}
                  </div>
                </section>
              );
            }
          )}
        </div>
      </section>


      {/* ======================================================
          CATALOGUE VIDE
      ====================================================== */}

      {products.length === 0 && (
        <section className="px-5 py-20 text-center">
          <p className="text-inkSoft">
            Le catalogue est momentanément indisponible.
          </p>
        </section>
      )}


      {/* ======================================================
          FOOTER CTA
      ====================================================== */}

      <section className="bg-ink px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[13px] font-bold text-gold">
            Agrofarms237
          </span>

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
