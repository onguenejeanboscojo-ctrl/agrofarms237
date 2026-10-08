import Link from "next/link";
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
    if (
      variant.includes("fum") ||
      name.includes("fume")
    ) {
      return ["produit_carpe_fumee"];
    }

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

  // Silure : fallback strict selon la forme du produit.
  // On ne doit jamais utiliser la catégorie générique "silure"
  // pour les deux produits, sinon le frais apparaît aussi dans le fumé.
  if (group === "silure") {
    if (
      variant.includes("fum") ||
      name.includes("fume")
    ) {
      return ["produit_silure_fume"];
    }

    return ["produit_silure_frais", "elevage_silure"];
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
  const images = getImages(product, media);

  const hasPrice = typeof product.price_standard === "number";
  const canOrder = product.stock_status !== "indisponible" && hasPrice;

  return (
    <article className="group overflow-hidden border border-[#18352B]/10 bg-white shadow-[0_12px_35px_rgba(24,53,43,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(24,53,43,0.12)]">
      <div className="relative overflow-hidden bg-[#E8EDE5]">
        <div className="aspect-[4/3] overflow-hidden">
          <ProductImage images={images} title={product.name} />
        </div>

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
          <span
            className={`inline-flex items-center gap-2 rounded-full border bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm backdrop-blur ${statusClass(
              product.stock_status
            )}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusLabel(product.stock_status)}
          </span>

          {product.unit && (
            <span className="rounded-full border border-white/60 bg-[#18352B]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
              {product.unit}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67D1A]">
          {product.product_group || product.category || "AgroFarms237"}
        </p>

        <h3 className="mt-3 font-serif text-[29px] leading-[1.05] text-[#18352B] sm:text-[31px]">
          {product.variant || product.name}
        </h3>

        <p className="mt-3 min-h-[48px] text-[13px] leading-6 text-[#18352B]/60">
          {product.variant
            ? `${product.variant} · proposé selon les disponibilités de la ferme.`
            : `Une production AgroFarms237 proposée selon les disponibilités de la ferme.`}
        </p>

        <div className="my-6 h-px bg-[#18352B]/10" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#18352B]/45">
              Tarif actuel
            </p>
            <p className="mt-1 text-[16px] font-semibold leading-6 text-[#18352B]">
              {priceText(product)}
            </p>
          </div>

          {product.stock_status === "stock_limite" && (
            <span className="text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A67D1A]">
              Quantités limitées
            </span>
          )}
        </div>

        <div className="mt-6">
          {canOrder ? (
            <HomeProductOrderModal
              product={toOrderProduct(product)}
              useDefaultOptions={false}
            />
          ) : (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center border border-[#18352B]/10 bg-[#18352B]/5 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#18352B]/50"
            >
              {hasPrice ? "Commande indisponible" : "Prix à confirmer"}
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
  const [products, media] = await Promise.all([
    getProducts(),
    getMedia(),
  ]);

  const categories = CATEGORY_ORDER.filter((category) =>
    products.some((product) => product.category === category)
  );

  const availableCount = products.filter(
    (product) =>
      product.stock_status !== "indisponible" &&
      typeof product.price_standard === "number"
  ).length;

  const heroMedia =
    media.find((item) => item.site_location === "produits_hero") ||
    media.find((item) => item.site_location === "produits_catalogue_hero") ||
    media.find((item) => item.site_location?.startsWith("produit_"));

  const introProduct = products[0];
  const introImages = introProduct ? getImages(introProduct, media) : [];
  const introImage = introImages[0] || heroMedia?.url;

  const categoryVisuals = categories.map((category) => {
    const categoryProduct = products.find(
      (product) => product.category === category
    );
    const categoryImages = categoryProduct
      ? getImages(categoryProduct, media)
      : [];

    return {
      category,
      image: categoryImages[0],
    };
  });

  return (
    <main className="bg-white text-[#18352B]">
      {/* =====================================================
          HERO — IMMERSIF
      ====================================================== */}
      <section className="relative min-h-[680px] overflow-hidden bg-[#18352B] text-white lg:min-h-[760px]">
        {heroMedia ? (
          <>
            <img
              src={heroMedia.url}
              alt="AgroFarms237 — nos produits"
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
            />
            <div className="absolute inset-0 bg-[#071D18]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071D18]/90 via-[#071D18]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/85 via-transparent to-[#071D18]/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,#315F50_0%,#18352B_48%,#081B16_100%)]" />
        )}

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-20 pt-32 lg:min-h-[760px] lg:px-8 lg:pb-24">
          <div className="max-w-4xl">
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#D5A62A] sm:text-xs">
              Nos produits
            </p>

            <h1 className="font-serif text-[clamp(48px,7vw,86px)] leading-[0.96] tracking-[-0.025em]">
              Du travail de la ferme
              <span className="block text-white/70">à votre table.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              Découvrez les productions d’AgroFarms237, issues de nos différentes
              filières et proposées selon les disponibilités de la ferme.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <span className="border border-white/20 bg-white/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                {products.length} produit{products.length > 1 ? "s" : ""}
              </span>
              <span className="border border-white/20 bg-white/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                {availableCount} disponible{availableCount > 1 ? "s" : ""} à la commande
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION — CHEVAUCHEMENT
      ====================================================== */}
      <section className="relative z-10 -mt-12 px-5 sm:-mt-16">
        <div className="mx-auto grid max-w-7xl overflow-hidden border border-black/10 bg-white shadow-[0_24px_70px_rgba(24,53,43,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[340px] bg-[#E8EDE5] lg:min-h-[430px]">
            {introImage ? (
              <img
                src={introImage}
                alt="AgroFarms237 — production agricole"
                className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full min-h-[340px] items-center justify-center bg-[radial-gradient(circle_at_70%_20%,#315F50_0%,#18352B_55%,#081B16_100%)] p-10 text-center text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D5A62A]">
                    AgroFarms237
                  </p>
                  <p className="mt-3 font-serif text-3xl">
                    La qualité commence à la ferme.
                  </p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/30 to-transparent" />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A67D1A]">
              Notre catalogue
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[1.02] sm:text-5xl">
              Plus qu’un catalogue,
              <span className="block text-[#A67D1A]">
                une fenêtre sur notre ferme.
              </span>
            </h2>

            <p className="mt-6 text-[15px] leading-7 text-black/62">
              Derrière chaque produit, il y a une production, des soins, du
              travail et une histoire. Ce catalogue vous permet de découvrir
              ce que nous produisons aujourd’hui, au rythme d’une ferme qui se
              construit progressivement.
            </p>

            <p className="mt-5 text-[15px] leading-7 text-black/62">
              Pisciculture, élevage porcin et aviculture : plusieurs filières,
              une même volonté de produire localement et de mieux valoriser le
              travail réalisé à la ferme.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILIÈRES
      ====================================================== */}
      {categoryVisuals.length > 0 && (
        <section className="bg-[#F3EFE5]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A67D1A]">
                  Nos filières
                </p>
                <h2 className="mt-5 font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                  Plusieurs productions,
                  <span className="block text-[#A67D1A]">une même direction.</span>
                </h2>
              </div>

              <p className="max-w-2xl text-base leading-8 text-black/60 sm:text-lg">
                Chaque filière occupe une place particulière dans le
                développement d’AgroFarms237. Leur évolution progressive nous
                permet de construire une ferme plus diversifiée et plus
                complète.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {categoryVisuals.map(({ category, image }, index) => (
                <article
                  key={category}
                  className="group relative min-h-[360px] overflow-hidden bg-[#18352B] text-white"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`AgroFarms237 — ${category}`}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#315F50_0%,#18352B_55%,#081B16_100%)]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/95 via-[#071D18]/35 to-transparent" />

                  <div className="relative flex min-h-[360px] flex-col justify-end p-7 sm:p-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D5A62A]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-3 font-serif text-3xl leading-tight">
                      {category}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                      {CATEGORY_INTRO[category]}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CATALOGUE
      ====================================================== */}
      <section id="catalogue" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="flex flex-col gap-8 border-b border-[#18352B]/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A67D1A]">
                Le catalogue
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                Ce que nous produisons
                <span className="block text-[#A67D1A]">aujourd’hui.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-black/55">
              Les produits, prix et disponibilités sont actualisés depuis notre
              espace d’administration et peuvent évoluer avec la production.
            </p>
          </div>

          <div className="mt-20 space-y-24">
            {categories.map((category) => {
              const categoryProducts = products.filter(
                (product) => product.category === category
              );

              return (
                <section key={category}>
                  <div className="mb-9 flex flex-col gap-4 border-l-2 border-[#D5A62A] pl-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67D1A]">
                        {category}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl sm:text-4xl">
                        {category}
                      </h3>
                    </div>

                    <p className="max-w-xl text-sm leading-6 text-black/55">
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
        </div>
      </section>

      {/* =====================================================
          CATALOGUE VIDE
      ====================================================== */}
      {products.length === 0 && (
        <section className="bg-[#F3EFE5] px-6 py-24 text-center">
          <div className="mx-auto max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A67D1A]">
              Catalogue
            </p>
            <h2 className="mt-4 font-serif text-4xl">
              Notre catalogue se prépare.
            </h2>
            <p className="mt-5 text-sm leading-7 text-black/55">
              Les produits seront présentés ici dès que les premières
              informations seront disponibles.
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          DU PRODUIT À LA FERME
      ====================================================== */}
      <section className="bg-[#F3EFE5]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8 lg:py-32">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A67D1A]">
              Du produit à la ferme
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.03] sm:text-5xl lg:text-6xl">
              Chaque produit raconte une partie de notre ferme.
            </h2>
          </div>

          <div className="max-w-xl">
            <p className="text-base leading-8 text-black/65 sm:text-lg">
              Pisciculture, élevage porcin, aviculture : chaque production
              participe à la construction progressive d’une exploitation
              agricole diversifiée.
            </p>
            <p className="mt-6 text-base leading-8 text-black/65 sm:text-lg">
              Notre catalogue évolue avec la ferme, selon nos productions et
              nos disponibilités. Notre objectif est de rapprocher davantage
              le travail réalisé à la ferme de la valeur proposée au client.
            </p>
            <div className="mt-8 h-px w-14 bg-[#D5A62A]" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA FINAL
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#18352B] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#315F50_0%,transparent_45%)] opacity-60" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#D5A62A]">
              AgroFarms237
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
              Vous avez trouvé ce que vous cherchez ?
              <span className="block text-white/60">
                Passez à l’étape suivante.
              </span>
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Découvrez nos productions disponibles ou passez directement votre
              commande. La gamme évolue avec la ferme, au rythme de nos
              productions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href="#catalogue"
              className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-[10px] font-bold uppercase tracking-[0.14em] text-[#18352B] transition hover:bg-[#D5A62A]"
            >
              Voir le catalogue
            </Link>
            <Link
              href="/commander"
              className="inline-flex min-h-12 items-center justify-center border border-white/25 px-7 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition hover:border-white"
            >
              Commander
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


