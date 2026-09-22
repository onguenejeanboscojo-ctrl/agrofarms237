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
      .order("created_at", { ascending: false });

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

async function getGeneralMedia(): Promise<GeneralMedia[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select(
        "id,url,kind,published"
      )
      .eq("published", true)
      .eq("kind", "photo")
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

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
 * Construit le slideshow global du Hero.
 *
 * Sources :
 * - Galerie générale
 * - Photos de Notre élevage
 * - Photos des produits de l'accueil
 *
 * Les doublons sont supprimés.
 */
function buildHeroImages(
  generalMedia: GeneralMedia[],
  farmMedia: FarmMedia[],
  farmItems: FarmItem[],
  productMedia: ProductMedia[],
  products: HomeProduct[]
) {
  const publishedFarmIds = new Set(
    farmItems.map((item) => item.id)
  );

  const publishedProductIds = new Set(
    products.map((product) => product.id)
  );

  const urls = [
    ...generalMedia.map(
      (item) => item.url
    ),

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

function statusLabel(
  status: HomeProduct["status"]
) {
  if (status === "disponible") {
    return "Disponible";
  }

  if (status === "rupture") {
    return "Rupture de stock";
  }

  return "Bientôt disponible";
}

function statusStyle(
  status: HomeProduct["status"]
) {
  if (status === "disponible") {
    return "border-white/20 bg-white/10 text-white";
  }

  if (status === "rupture") {
    return "border-red-300/20 bg-red-500/10 text-red-100";
  }

  return "border-gold/30 bg-gold/10 text-gold";
}

function splitParagraphs(
  text: string
) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph.trim()
    )
    .filter(Boolean);
}

export default async function HomePage() {
  const [
    content,
    products,
    productMedia,
    farmItems,
    farmMedia,
    generalMedia,
    storyMedia,
    reviews,
  ] = await Promise.all([
    getHomeContent(),
    getHomeProducts(),
    getProductMedia(),
    getFarmItems(),
    getFarmMedia(),
    getGeneralMedia(),
    getStoryMedia(),
    getReviews(),
  ]);

  const heroImages = buildHeroImages(
    generalMedia,
    farmMedia,
    farmItems,
    productMedia,
    products
  );

  const mediaByProduct: Record<
    string,
    string[]
  > = {};

  for (const photo of productMedia) {
    if (!mediaByProduct[photo.home_product_id]) {
      mediaByProduct[
        photo.home_product_id
      ] = [];
    }

    mediaByProduct[
      photo.home_product_id
    ].push(photo.url);
  }

  const storyParagraphs =
    splitParagraphs(
      content.story_text
    );

  return (
    <>
      {/* ================================================================ */}
      {/* ================================================================ */}
      {/* ================================================================ */}
      {/* HERO PREMIUM — image fixe issue des médias publiés               */}
      {/* ================================================================ */}

      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_78%_20%,#1C4A3D_0%,#102F27_38%,#081B16_100%)] px-5 py-14 text-paper sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-gold/10" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full border border-gold/10" />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="max-w-[720px]">
            <div className="mb-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gold sm:text-[13px]">
              <span className="h-px w-10 bg-gold" />
              <span>{content.hero_label || "Agrofarms237 · Production locale"}</span>
            </div>

            <h1 className="max-w-[760px] font-serif text-[clamp(42px,7vw,82px)] font-semibold leading-[0.98] tracking-[-0.035em] text-paper">
              {content.hero_title}
            </h1>

            <p className="mt-6 max-w-[620px] text-[16px] leading-7 text-paper/80 sm:mt-7 sm:text-[18px] sm:leading-8">
              {content.hero_description}
            </p>

            <p className="mt-4 text-sm font-semibold tracking-wide text-paper/90 sm:text-[15px]">
              Pisciculture <span className="px-1.5 text-gold">•</span> Élevage porcin <span className="px-1.5 text-gold">•</span> Aviculture
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
              {content.hero_button_primary_label && (
                <Link
                  href={content.hero_button_primary_url || "/commander"}
                  className="btn btn-gold min-h-[52px] justify-center sm:justify-start"
                >
                  {content.hero_button_primary_label}
                  <span aria-hidden="true" className="ml-1 text-lg">↗</span>
                </Link>
              )}

              {content.hero_button_secondary_label && (
                <Link
                  href={content.hero_button_secondary_url || "#histoire"}
                  className="btn btn-outline min-h-[52px] justify-center border-paper/45 bg-white/5 backdrop-blur-sm sm:justify-start"
                >
                  {content.hero_button_secondary_label}
                  <span aria-hidden="true" className="ml-1 text-lg">→</span>
                </Link>
              )}
            </div>

            <div className="mt-9 grid max-w-[650px] grid-cols-1 gap-4 border-t border-paper/20 pt-6 sm:mt-12 sm:grid-cols-3 sm:gap-5">
              {[
                { title: "Production locale", text: "Ancrée au Cameroun" },
                { title: "Qualité suivie", text: "De la ferme à la table" },
                { title: "Ferme diversifiée", text: "Plusieurs filières agricoles" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/70 text-gold" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-paper">{item.title}</p>
                    <p className="mt-1 text-[12px] leading-5 text-paper/65">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visuel fixe : première image issue des médias publiés de la ferme. */}
          <div className="relative mx-auto w-full max-w-[600px] lg:pl-2">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/25" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-paper/15 bg-[#16382F]/70 p-2.5 shadow-2xl shadow-black/30 sm:p-3">
              <div className="relative min-h-[300px] overflow-hidden rounded-[1.1rem] bg-[radial-gradient(circle_at_30%_20%,#2A5E56_0%,#0E2622_60%,#081815_100%)] sm:min-h-[390px] lg:min-h-[470px]">
                {heroImages.length > 0 ? (
                  <img
                    src={heroImages[0]}
                    alt="Agrofarms237 — visuel de la ferme et de ses activités agricoles"
                    className="absolute inset-0 h-full w-full object-cover"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Agrofarms237</span>
                      <p className="mt-3 font-serif text-2xl text-paper sm:text-3xl">La qualité commence à la ferme.</p>
                      <p className="mt-3 text-sm text-paper/65">Ajoutez une photo publiée de votre ferme pour l’afficher ici.</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/85 via-transparent to-[#071D18]/5" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <span className="inline-flex rounded-full border border-gold/50 bg-[#0B211C]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold backdrop-blur-sm">
                    Pisciculture · Élevage porcin · Aviculture
                  </span>
                  <p className="mt-3 max-w-[380px] font-serif text-xl leading-tight text-white sm:text-2xl">
                    Une ferme, plusieurs filières, un même engagement.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-paper/15 bg-[#0B211C]/95 px-5 py-3 shadow-xl backdrop-blur-md xl:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Notre démarche</p>
              <p className="mt-1 text-sm font-semibold text-paper">Produire localement, progresser durablement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI                                                         */}
      {/* ================================================================ */}

      <section className="px-5 py-[82px]">
        <div className="mx-auto max-w-[1280px]">
          <span className="mb-3 inline-block text-[13px] font-bold uppercase tracking-[0.16em] text-goldDeep">
            Pourquoi Agrofarms237
          </span>

          <h2 className="max-w-[900px] font-serif text-[clamp(30px,4.5vw,46px)] font-semibold leading-tight">
            {content.commitments_title}
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                content.commitment1_title,
                content.commitment1_text,
              ],
              [
                content.commitment2_title,
                content.commitment2_text,
              ],
              [
                content.commitment3_title,
                content.commitment3_text,
              ],
              [
                content.commitment4_title,
                content.commitment4_text,
              ],
            ].map(([title, text], index) => (
              <div
                key={`${title}-${index}`}
                className="border-t border-ink/15 pt-5"
              >
                <span className="text-xs font-bold tracking-[0.15em] text-goldDeep">
                  0{index + 1}
                </span>

                <h3 className="mt-4 text-[20px] font-semibold">
                  {title}
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-inkSoft">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PRODUITS                                                         */}
      {/* ================================================================ */}

      <section className="bg-ink px-5 py-[82px] text-paper">
        <div className="mx-auto max-w-[1280px]">
          <span className="mb-3 inline-block text-[13px] font-bold uppercase tracking-[0.16em] text-gold">
            {content.products_label}
          </span>

          <h2 className="font-serif text-[clamp(30px,4.5vw,46px)] font-semibold leading-tight">
            {content.products_title}
          </h2>

          <p className="mt-5 max-w-[720px] text-[16px] leading-7 text-paper/65">
            {content.products_description}
          </p>

          {products.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-paper/10 bg-white/5 p-10 text-center">
              <p className="text-paper/60">
                Nos produits seront bientôt
                disponibles ici.
              </p>
            </div>
          ) : (
            <div className="mt-12 space-y-8">
              {products.map((product) => {
                const images =
                  mediaByProduct[
                    product.id
                  ] || [];

                const canOrder =
                  product.status ===
                    "disponible" &&
                  product.order_enabled;

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-paper/10 bg-waterDeep"
                  >
                    <div className="grid md:grid-cols-2">
                      {/* IMAGE */}
                      <div className="min-h-[330px] bg-[#102B26]">
                        {images.length >
                        0 ? (
                          <ProductCarousel
                            images={images}
                          />
                        ) : (
                          <div className="flex h-full min-h-[330px] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#2A5E56_0%,#0E2622_60%,#081815_100%)]">
                            <div className="text-center">
                              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-gold">
                                Agrofarms237
                              </span>

                              <p className="mt-2 font-serif text-xl text-paper/80">
                                Photos à venir
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* INFOS */}
                      <div className="flex flex-col justify-center p-8 md:p-11">
                        <div>
                          <span
                            className={`inline-flex rounded-full border px-3.5 py-1.5 text-[12px] font-bold ${statusStyle(
                              product.status
                            )}`}
                          >
                            {
                              statusLabel(
                                product.status
                              )
                            }
                          </span>
                        </div>

                        <h3 className="mt-5 font-serif text-[30px] font-semibold">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="mt-4 max-w-[580px] text-[15px] leading-7 text-paper/65">
                            {
                              product.description
                            }
                          </p>
                        )}

                        {/* TARIFS */}
                        <div className="mt-7 border-t border-paper/10">
                          {product.price_1 !==
                            null && (
                            <div className="flex items-center justify-between gap-6 border-b border-paper/10 py-4">
                              <span className="text-[14px] text-paper/70">
                                {product.price_1_label ||
                                  "Prix 1"}
                              </span>

                              <strong className="font-serif text-[20px] text-gold">
                                {formatFCFA(
                                  product.price_1
                                )}
                              </strong>
                            </div>
                          )}

                          {product.price_2 !==
                            null && (
                            <div className="flex items-center justify-between gap-6 border-b border-paper/10 py-4">
                              <span className="text-[14px] text-paper/70">
                                {product.price_2_label ||
                                  "Prix 2"}
                              </span>

                              <strong className="font-serif text-[20px] text-gold">
                                {formatFCFA(
                                  product.price_2
                                )}
                              </strong>
                            </div>
                          )}

                          {product.price !==
                            null && (
                            <div className="flex items-center justify-between gap-6 border-b border-paper/10 py-4">
                              <span className="text-[14px] text-paper/70">
                                Prix
                              </span>

                              <strong className="font-serif text-[20px] text-gold">
                                {formatFCFA(
                                  product.price
                                )}{" "}
                                /{" "}
                                {product.price_unit ||
                                  "unité"}
                              </strong>
                            </div>
                          )}
                        </div>

                        {/* COMMANDE */}
                        {canOrder && (
                          <div className="mt-7">
                            <Link
                              href="/commander"
                              className="btn btn-gold"
                            >
                              Commander
                            </Link>
                          </div>
                        )}

                        {product.status ===
                          "bientot" && (
                          <p className="mt-6 text-sm text-gold/80">
                            Ce produit sera
                            prochainement
                            disponible.
                          </p>
                        )}

                        {product.status ===
                          "rupture" && (
                          <p className="mt-6 text-sm text-red-200/70">
                            Ce produit est
                            actuellement en
                            rupture de stock.
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* HISTOIRE                                                         */}
      {/* ================================================================ */}

      <section
        id="histoire"
        className="px-5 py-[88px]"
      >
        <div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-2 md:items-center">
          <div className="overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_30%_20%,#2A5E56_0%,#0E2622_60%,#081815_100%)]">
            {storyMedia.length > 0 ? (
              <img
                src={storyMedia[0].url}
                alt="Notre histoire — Agrofarms237"
                className="aspect-[5/4] h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[5/4] items-center justify-center px-6 text-center">
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-gold">
                    Agrofarms237
                  </span>
                  <p className="mt-2 font-serif text-lg text-paper/80">
                    Photo à venir
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <span className="mb-3 inline-block text-[13px] font-bold uppercase tracking-[0.16em] text-goldDeep">
              {content.story_label}
            </span>

            <h2 className="font-serif text-[clamp(30px,4vw,42px)] font-semibold leading-tight">
              {content.story_title}
            </h2>

            <div className="mt-6 space-y-4">
              {storyParagraphs.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-[650px] text-[16px] leading-8 text-inkSoft"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>

            {content.story_button_label && (
              <Link
                href={
                  content.story_button_url ||
                  "/la-vie-de-la-ferme"
                }
                className="btn btn-outline mt-7 border-ink/20 text-ink"
              >
                {
                  content.story_button_label
                }
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* VISION                                                           */}
      {/* ================================================================ */}

      <section className="bg-bgAlt px-5 py-[82px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-[900px]">
            <span className="mb-3 inline-block text-[13px] font-bold uppercase tracking-[0.16em] text-goldDeep">
              {content.future_label}
            </span>

            <h2 className="font-serif text-[clamp(30px,4.5vw,48px)] font-semibold leading-tight">
              {content.future_title}
            </h2>

            <p className="mt-6 max-w-[760px] text-[16px] leading-8 text-inkSoft">
              {content.future_text}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* AVIS                                                             */}
      {/* ================================================================ */}

      <section className="px-5 py-[82px]">
        <div className="mx-auto max-w-[1280px]">
          <span className="mb-3 inline-block text-[13px] font-bold uppercase tracking-[0.16em] text-goldDeep">
            Ils nous font confiance
          </span>

          <h2 className="font-serif text-[clamp(30px,4.5vw,44px)] font-semibold">
            Avis clients.
          </h2>

          {reviews.length ===
          0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-bgAlt p-10 text-center">
              <p className="text-inkSoft">
                Les avis de nos clients
                seront publiés ici au
                fur et à mesure des
                livraisons.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {reviews.map(
                (review) => (
                  <article
                    key={
                      review.id
                    }
                    className="rounded-2xl border border-ink/10 bg-bgAlt p-7"
                  >
                    <p className="text-[15px] leading-7 text-inkSoft">
                      «{" "}
                      {
                        review.content
                      }{" "}
                      »
                    </p>

                    <p className="mt-5 text-[14px] font-semibold text-ink">
                      {
                        review.author_name
                      }

                      {review.client_type && (
                        <span className="font-normal text-inkSoft">
                          {" "}
                          —{" "}
                          {
                            review.client_type
                          }
                        </span>
                      )}
                    </p>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA FINAL                                                        */}
      {/* ================================================================ */}

      <section className="bg-ink px-5 py-[90px] text-paper">
        <div className="mx-auto max-w-[1100px] text-center">
          <span className="mb-3 inline-block text-[13px] font-bold uppercase tracking-[0.18em] text-gold">
            {content.cta_label}
          </span>

          <h2 className="font-serif text-[clamp(32px,5vw,54px)] font-semibold leading-tight">
            {content.cta_title}
          </h2>

          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-7 text-paper/65">
            {content.cta_text}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {content.cta_button_primary_label && (
              <Link
                href={
                  content.cta_button_primary_url ||
                  "/produits"
                }
                className="btn btn-gold"
              >
                {
                  content.cta_button_primary_label
                }
              </Link>
            )}

            {content.cta_button_secondary_label && (
              <Link
                href={
                  content.cta_button_secondary_url ||
                  "/contact"
                }
                className="btn btn-outline"
              >
                {
                  content.cta_button_secondary_label
                }
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
