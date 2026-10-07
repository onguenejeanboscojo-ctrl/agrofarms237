import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductCarousel from "@/components/ProductCarousel";

export const revalidate = 60;

type HomeContent = {
  hero_label: string;
  hero_title: string;
  hero_description: string;
  hero_button_primary_label: string;
  hero_button_primary_url: string;
  hero_button_secondary_label: string;
  hero_button_secondary_url: string;

  commitments_title: string;
  commitment1_title: string;
  commitment1_text: string;
  commitment2_title: string;
  commitment2_text: string;
  commitment3_title: string;
  commitment3_text: string;
  commitment4_title: string;
  commitment4_text: string;

  products_label: string;
  products_title: string;
  products_description: string;

  story_label: string;
  story_title: string;
  story_text: string;
  story_button_label: string;
  story_button_url: string;

  future_label: string;
  future_title: string;
  future_text: string;

  cta_label: string;
  cta_title: string;
  cta_text: string;
  cta_button_primary_label: string;
  cta_button_primary_url: string;
  cta_button_secondary_label: string;
  cta_button_secondary_url: string;
};

type HomeProduct = {
  id: string;
  name: string;
  description: string | null;
  status: "disponible" | "bientot" | "rupture";
  price: number | null;
  price_unit: string | null;
  price_1_label: string | null;
  price_1: number | null;
  price_2_label: string | null;
  price_2: number | null;
  order_enabled: boolean;
  position: number;
  published: boolean;
};

type ProductMedia = {
  id: string;
  home_product_id: string;
  url: string;
  position: number;
};

type FarmMedia = {
  id: string;
  farm_breeding_id: string;
  url: string;
  position: number;
};

type FarmItem = {
  id: string;
  published: boolean;
};

type GeneralMedia = {
  id: string;
  url: string;
  kind: string;
  published: boolean;
  site_location: string | null;
};

type Review = {
  id: string;
  content: string;
  author_name: string;
  client_type?: string | null;
};

const FALLBACK_CONTENT: HomeContent = {
  hero_label: "Agrofarms237",
  hero_title: "Une agriculture camerounaise pensée pour durer.",
  hero_description:
    "Nous développons une production agricole locale, responsable et proche des consommateurs.",
  hero_button_primary_label: "Commander",
  hero_button_primary_url: "/commander",
  hero_button_secondary_label: "Découvrir Agrofarms237",
  hero_button_secondary_url: "#histoire",

  commitments_title:
    "Une production pensée pour durer, pas pour paraître.",
  commitment1_title: "Production locale",
  commitment1_text:
    "Des produits issus d'une production camerounaise, élevée et suivie avec attention.",
  commitment2_title: "Fraîcheur",
  commitment2_text:
    "Un suivi de la ferme jusqu'au client, avec une attention particulière portée à la qualité.",
  commitment3_title: "Transparence",
  commitment3_text:
    "Nous montrons notre manière de produire et faisons évoluer notre ferme avec clarté.",
  commitment4_title: "Proximité",
  commitment4_text:
    "Une marque accessible aux familles comme aux professionnels de l'alimentation.",

  products_label: "Nos produits",
  products_title: "De la ferme à votre table.",
  products_description:
    "Découvrez les produits issus de notre ferme et ceux que nous préparons pour demain.",

  story_label: "Notre histoire",
  story_title:
    "Une entreprise agricole camerounaise, construite pas à pas.",
  story_text:
    "Agrofarms237 développe progressivement une ferme diversifiée autour d'une conviction simple : produire localement des aliments de qualité tout en construisant une activité agricole durable.",
  story_button_label: "Découvrir notre histoire",
  story_button_url: "/la-vie-de-la-ferme",

  future_label: "Notre vision",
  future_title:
    "Construire une ferme agricole camerounaise diversifiée.",
  future_text:
    "Notre ambition est de développer progressivement plusieurs filières d'élevage et de production afin de proposer davantage de produits issus de notre ferme.",

  cta_label: "Agrofarms237",
  cta_title: "De la production à la table.",
  cta_text:
    "Découvrez notre ferme, nos produits et notre manière de construire une agriculture locale.",
  cta_button_primary_label: "Voir nos produits",
  cta_button_primary_url: "/produits",
  cta_button_secondary_label: "Nous contacter",
  cta_button_secondary_url: "/contact",
};

async function getHomeContent(): Promise<HomeContent> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("home_content")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_CONTENT;
    }

    return {
      ...FALLBACK_CONTENT,
      ...data,
    } as HomeContent;
  } catch {
    return FALLBACK_CONTENT;
  }
}

async function getHomeProducts(): Promise<HomeProduct[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("home_products")
      .select("*")
      .eq("published", true)
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur récupération produits accueil :",
        error
      );

      return [];
    }

    return (data || []) as HomeProduct[];
  } catch {
    return [];
  }
}

async function getProductMedia(): Promise<ProductMedia[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("home_product_media")
      .select(
        "id,home_product_id,url,position"
      )
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur récupération photos produits accueil :",
        error
      );

      return [];
    }

    return (data || []) as ProductMedia[];
  } catch {
    return [];
  }
}

async function getFarmItems(): Promise<FarmItem[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("farm_breeding")
      .select("id,published")
      .eq("published", true);

    return (data || []) as FarmItem[];
  } catch {
    return [];
  }
}

async function getFarmMedia(): Promise<FarmMedia[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("farm_breeding_media")
      .select(
        "id,farm_breeding_id,url,position"
      )
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    return (data || []) as FarmMedia[];
  } catch {
    return [];
  }
}

type StoryMedia = {
  id: string;
  url: string;
  created_at: string;
};

async function getStoryMedia(): Promise<StoryMedia[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("home_story_media")
      .select("id,url,created_at")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Erreur récupération photo Notre histoire :",
        error
      );

      return [];
    }

    return (data || []) as StoryMedia[];
  } catch {
    return [];
  }
}

/**
 * Médias généraux du nouveau système.
 *
 * site_location permet maintenant de savoir
 * où chaque média doit être utilisé sur le site.
 */
async function getGeneralMedia(): Promise<GeneralMedia[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select(
        "id,url,kind,published,site_location"
      )
      .eq("published", true)
      .eq("kind", "photo")
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Erreur récupération médias généraux :",
        error
      );

      return [];
    }

    return (data || []) as GeneralMedia[];
  } catch {
    return [];
  }
}

async function getReviews(): Promise<Review[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("created_at", {
        ascending: false,
      })
      .limit(3);

    return (data || []) as Review[];
  } catch {
    return [];
  }
}

/**
 * Retourne uniquement les médias affectés
 * à un emplacement précis du site.
 */
function getMediaForLocation(
  generalMedia: GeneralMedia[],
  location: string
) {
  return generalMedia
    .filter(
      (item) =>
        item.site_location === location &&
        Boolean(item.url)
    )
    .map((item) => item.url);
}

/**
 * Construit le slideshow du Hero.
 *
 * Priorité :
 * 1. médias ayant explicitement l'emplacement "hero"
 * 2. ancien système général + élevage + produits
 *
 * Cela permet de migrer progressivement sans casser
 * les anciennes images déjà présentes.
 */
function buildHeroImages(
  generalMedia: GeneralMedia[],
  farmMedia: FarmMedia[],
  farmItems: FarmItem[],
  productMedia: ProductMedia[],
  products: HomeProduct[]
) {
  const heroMedia = getMediaForLocation(
    generalMedia,
    "hero"
  );

  if (heroMedia.length > 0) {
    return Array.from(
      new Set(heroMedia.filter(Boolean))
    );
  }

  const publishedFarmIds = new Set(
    farmItems.map((item) => item.id)
  );

  const publishedProductIds = new Set(
    products.map((product) => product.id)
  );

  const urls = [
    ...generalMedia
      .filter(
        (item) =>
          !item.site_location ||
          item.site_location === "hero"
      )
      .map((item) => item.url),

    ...farmMedia
      .filter((item) =>
        publishedFarmIds.has(
          item.farm_breeding_id
        )
      )
      .map((item) => item.url),

    ...productMedia
      .filter((item) =>
        publishedProductIds.has(
          item.home_product_id
        )
      )
      .map((item) => item.url),
  ];

  return Array.from(
    new Set(
      urls.filter(Boolean)
    )
  );
}

function formatFCFA(
  value: number | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return `${value.toLocaleString(
    "fr-FR"
  )} FCFA`;
}

export default async function HomePage() {
  const [
    content,
    products,
    productMedia,
    farmItems,
    farmMedia,
    storyMedia,
    generalMedia,
    reviews,
  ] = await Promise.all([
    getHomeContent(),
    getHomeProducts(),
    getProductMedia(),
    getFarmItems(),
    getFarmMedia(),
    getStoryMedia(),
    getGeneralMedia(),
    getReviews(),
  ]);

  const heroImages = buildHeroImages(
    generalMedia,
    farmMedia,
    farmItems,
    productMedia,
    products
  );

  const productionImages = getMediaForLocation(
    generalMedia,
    "production"
  );

  const heroImage =
    heroImages[0] ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90";

  const storyImage =
    storyMedia[0]?.url ||
    productionImages[0] ||
    generalMedia[0]?.url ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85";

  return (
    <main className="bg-[#FBFAF6] text-[#173D2D]">

      {/* HERO */}
      <section className="relative min-h-[82vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="AgroFarms237"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#102D21]/55" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#102D21]/80 via-[#102D21]/45 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[82vh] max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-10">
          <div className="max-w-3xl text-white">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#D6B36A]">
              {content.hero_label}
            </p>

            <h1 className="font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {content.hero_title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
              {content.hero_description}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href={content.hero_button_primary_url}
                className="rounded-full bg-[#D6B36A] px-7 py-3.5 text-sm font-bold text-[#173D2D] transition hover:bg-[#E3C98E]"
              >
                {content.hero_button_primary_label}
              </Link>

              <Link
                href={content.hero_button_secondary_url}
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                {content.hero_button_secondary_label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="bg-[#FBFAF6] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
              Notre engagement
            </p>

            <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl">
              {content.commitments_title}
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                title: content.commitment1_title,
                text: content.commitment1_text,
              },
              {
                title: content.commitment2_title,
                text: content.commitment2_text,
              },
              {
                title: content.commitment3_title,
                text: content.commitment3_text,
              },
              {
                title: content.commitment4_title,
                text: content.commitment4_text,
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[22px] border border-[#173D2D]/10 bg-white p-7"
              >
                <div className="mb-5 h-10 w-10 rounded-full bg-[#E7EBDD]" />

                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#627166]">
                  {item.text}
                </p>
              </article>
            ))}

          </div>
        </div>
      </section>

      {/* PRODUITS */}
      <section
        id="produits"
        className="bg-[#EDE9DE] px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
                {content.products_label}
              </p>

              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl">
                {content.products_title}
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-[#627166]">
                {content.products_description}
              </p>
            </div>

            <Link
              href="/produits"
              className="rounded-full border border-[#173D2D]/15 px-5 py-2.5 text-sm font-semibold text-[#173D2D] transition hover:bg-white"
            >
              Voir tous les produits
            </Link>
          </div>

          {products.length > 0 ? (
            <ProductCarousel
              products={products}
              media={productMedia}
            />
          ) : (
            <div className="rounded-[22px] bg-[#FBFAF6] p-8">
              <p className="text-sm text-[#627166]">
                Nos produits seront bientôt présentés ici.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* NOTRE PRODUCTION */}
      {productionImages.length > 0 && (
        <section className="bg-[#FBFAF6] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
                Notre production
              </p>

              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl">
                Une production qui prend forme à la ferme.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-[#627166]">
                Découvrez les images de notre production directement
                sélectionnées depuis l’administration AgroFarms237.
              </p>

              <Link
                href="/notre-elevage"
                className="mt-7 inline-flex rounded-full bg-[#173D2D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#28563F]"
              >
                Découvrir notre élevage
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {productionImages.slice(0, 4).map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className={`overflow-hidden rounded-[22px] ${
                    index === 0
                      ? "col-span-2 h-[320px]"
                      : "h-48"
                  }`}
                >
                  <img
                    src={url}
                    alt="Production AgroFarms237"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* HISTOIRE */}
      <section
        id="histoire"
        className="bg-[#173D2D] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div className="overflow-hidden rounded-[28px]">
            <img
              src={storyImage}
              alt="AgroFarms237"
              className="h-[460px] w-full object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#D6B36A]">
              {content.story_label}
            </p>

            <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">
              {content.story_title}
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-white/70">
              {content.story_text}
            </p>

            <Link
              href={content.story_button_url}
              className="mt-8 inline-flex rounded-full bg-[#D6B36A] px-6 py-3 text-sm font-bold text-[#173D2D] transition hover:bg-[#E3C98E]"
            >
              {content.story_button_label}
            </Link>
          </div>

        </div>
      </section>

      {/* VISION */}
      <section className="bg-[#EDE9DE] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
            {content.future_label}
          </p>

          <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">
            {content.future_title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#627166]">
            {content.future_text}
          </p>

        </div>
      </section>

      {/* AVIS */}
      {reviews.length > 0 && (
        <section className="bg-[#FBFAF6] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">

            <div className="mb-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
                Ils nous font confiance
              </p>

              <h2 className="font-serif text-3xl font-semibold sm:text-5xl">
                Quelques mots de nos clients.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-[22px] border border-[#173D2D]/10 bg-white p-7"
                >
                  <div className="text-3xl text-[#B7863D]">
                    “
                  </div>

                  <p className="mt-3 text-sm leading-7 text-[#627166]">
                    {review.content}
                  </p>

                  <div className="mt-6">
                    <p className="font-semibold">
                      {review.author_name}
                    </p>

                    {review.client_type && (
                      <p className="mt-1 text-xs text-[#7B867E]">
                        {review.client_type}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="bg-[#173D2D] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-5xl text-center">

          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#D6B36A]">
            {content.cta_label}
          </p>

          <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-6xl">
            {content.cta_title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/70">
            {content.cta_text}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href={content.cta_button_primary_url}
              className="rounded-full bg-[#D6B36A] px-7 py-3.5 text-sm font-bold text-[#173D2D] transition hover:bg-[#E3C98E]"
            >
              {content.cta_button_primary_label}
            </Link>

            <Link
              href={content.cta_button_secondary_url}
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {content.cta_button_secondary_label}
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
