import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import HeroSlideshow from "@/components/HeroSlideshow";
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
    reviews,
  ] = await Promise.all([
    getHomeContent(),
    getHomeProducts(),
    getProductMedia(),
    getFarmItems(),
    getFarmMedia(),
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
      {/* HERO                                                             */}
      {/* ================================================================ */}

      <section className="relative min-h-[680px] overflow-hidden px-5 py-[150px] pb-24 text-paper">
        {heroImages.length > 0 ? (
          <>
            <HeroSlideshow
              images={heroImages}
            />

            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-[#0E2622]/55 to-[#081815]/90" />
          </>
        ) : (
          <div className="absolute inset-0 z-0 bg-[radial-gradient(120%_140%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)]" />
        )}

        <div className="relative z-10 mx-auto max-w-[1280px]">
          <div className="max-w-[950px]">
            <span className="mb-5 inline-block text-[13px] font-bold uppercase tracking-[0.2em] text-gold">
              {content.hero_label}
            </span>

            <h1 className="font-serif text-[clamp(44px,7vw,86px)] font-semibold leading-[1.02] tracking-[-0.03em] text-paper">
              {content.hero_title}
            </h1>

            <p className="mt-7 max-w-[720px] text-[17px] leading-8 text-paper/80 md:text-[19px]">
              {content.hero_description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {content.hero_button_primary_label && (
                <Link
                  href={
                    content.hero_button_primary_url ||
                    "/commander"
                  }
                  className="btn btn-gold"
                >
                  {
                    content.hero_button_primary_label
                  }
                </Link>
              )}

              {content.hero_button_secondary_label && (
                <Link
                  href={
                    content.hero_button_secondary_url ||
                    "#histoire"
                  }
                  className="btn btn-outline"
                >
                  {
                    content.hero_button_secondary_label
                  }
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
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
            {generalMedia.length >
            0 ? (
              <img
                src={
                  generalMedia[0]
                    .url
                }
                alt="Agrofarms237"
                className="aspect-[5/4] h-full w-full object-cover"
              />
            ) : (
              <div className="aspect-[5/4]" />
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
