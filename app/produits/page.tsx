import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductCarousel from "@/components/ProductCarousel";

export const revalidate = 30;

type MediaItem = {
  id: string;
  url: string;
  kind: "photo" | "video";
  category?: string | null;
  caption?: string | null;
};

async function getMedia() {
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

/*
 * ============================================================
 * PRODUITS AGROFARMS237
 * ============================================================
 *
 * Le silure frais est actuellement disponible.
 *
 * Tous les autres produits sont en développement et restent
 * volontairement affichés comme "Bientôt disponible".
 *
 * IMPORTANT :
 * Le statut d'un produit est indépendant des photos.
 * Ajouter une photo depuis l'administration ne rend donc pas
 * automatiquement un produit disponible.
 */

const PRODUCTS = [
  {
    category: "elevage_silure",
    title: "Silure frais",
    eyebrow: "Pisciculture",
    status: "disponible",
    statusLabel: "Disponible",
    description:
      "Notre production actuelle de silure, élevée localement à la ferme Agrofarms237 et proposée fraîche aux familles et aux professionnels.",
    note: "Produit actuellement disponible.",
  },
  {
    category: "produit_poisson_fume",
    title: "Poisson fumé",
    eyebrow: "Pisciculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Une future gamme de poisson fumé développée à partir de notre production piscicole.",
  },
  {
    category: "produit_porc_fume",
    title: "Porc fumé",
    eyebrow: "Élevage porcin",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Une future gamme de porc fumé qui sera développée avec l'évolution de notre élevage porcin.",
  },
  {
    category: "produit_poulet_fume",
    title: "Poulet fumé",
    eyebrow: "Aviculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Une future offre de poulet fumé qui viendra compléter progressivement notre gamme.",
  },
  {
    category: "produit_poulet_frais",
    title: "Poulet frais nettoyé",
    eyebrow: "Aviculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Poulet frais nettoyé et préparé pour faciliter la commande et la préparation chez nos clients.",
    note: "Vente au kilogramme prévue ultérieurement.",
  },
  {
    category: "produit_porcelet",
    title: "Porcelet",
    eyebrow: "Élevage porcin",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Des porcelets seront proposés lorsque notre activité d'élevage porcin sera opérationnelle.",
  },
  {
    category: "produit_poussins",
    title: "Poussins",
    eyebrow: "Aviculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Une future offre destinée aux éleveurs souhaitant démarrer ou développer leur activité avicole.",
  },
  {
    category: "produit_alevins",
    title: "Alevins",
    eyebrow: "Pisciculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Des alevins destinés aux éleveurs souhaitant démarrer ou renforcer leur production piscicole.",
  },
];

function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const available = status === "disponible";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold ${
        available
          ? "border-ok/20 bg-ok/10 text-ok"
          : "border-gold/25 bg-gold/10 text-goldDeep"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          available ? "bg-ok" : "bg-gold"
        }`}
      />

      {label}
    </span>
  );
}

function ProductMedia({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (images.length > 0) {
    return <ProductCarousel images={images} />;
  }

  return (
    <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
      <div className="px-6 text-center">
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-gold">
          Agrofarms237
        </span>

        <p className="mt-2 font-serif text-[22px] font-semibold text-paper">
          {title}
        </p>

        <p className="mt-1 text-[13px] text-paper/60">
          Photo à venir
        </p>
      </div>
    </div>
  );
}

export default async function ProduitsPage() {
  const media = await getMedia();

  const getImages = (category: string) =>
    media
      .filter((item) => item.category === category)
      .map((item) => item.url);

  const availableProducts = PRODUCTS.filter(
    (product) => product.status === "disponible"
  );

  const upcomingProducts = PRODUCTS.filter(
    (product) => product.status === "avenir"
  );

  return (
    <main>
      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-ink px-5 py-[100px] text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)]" />

        <div className="relative mx-auto max-w-[1180px]">
          <span className="mb-3 inline-block text-[13px] font-bold text-gold">
            Nos produits
          </span>

          <h1 className="max-w-[850px] font-serif text-[clamp(40px,7vw,68px)] font-semibold leading-[1.05]">
            Des produits issus de notre ferme.
          </h1>

          <p className="mt-5 max-w-[680px] text-[17px] leading-7 text-paper/75">
            Découvrez les produits proposés par Agrofarms237 aujourd’hui
            ainsi que ceux qui viendront progressivement compléter notre
            gamme.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PRODUIT DISPONIBLE                                    */}
      {/* ===================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <span className="mb-2 inline-block text-[13px] font-bold text-ok">
              Disponible aujourd’hui
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Notre produit disponible
            </h2>

            <p className="mt-2 max-w-[680px] text-[15px] leading-7 text-inkSoft">
              Pour le moment, notre production commercialisée est centrée
              sur le silure frais issu de notre élevage.
            </p>
          </div>

          <div className="grid gap-8">
            {availableProducts.map((product) => {
              const images = getImages(product.category);

              return (
                <article
                  key={product.category}
                  className="grid overflow-hidden rounded-l border border-ink/10 bg-bgAlt md:grid-cols-2"
                >
                  <ProductMedia
                    images={images}
                    title={product.title}
                  />

                  <div className="flex flex-col justify-center p-7 md:p-10">
                    <StatusBadge
                      status={product.status}
                      label={product.statusLabel}
                    />

                    <span className="mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-goldDeep">
                      {product.eyebrow}
                    </span>

                    <h3 className="mt-2 font-serif text-[32px] font-semibold">
                      {product.title}
                    </h3>

                    <p className="mt-3 max-w-[55ch] text-[15px] leading-7 text-inkSoft">
                      {product.description}
                    </p>

                    {product.note && (
                      <p className="mt-4 text-[14px] font-bold text-goldDeep">
                        {product.note}
                      </p>
                    )}

                    {/* Bouton uniquement pour le produit disponible */}
                    <div className="mt-7">
                      <Link
                        href="/commander"
                        className="btn btn-ink"
                      >
                        Commander
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PRODUITS À VENIR                                      */}
      {/* ===================================================== */}

      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              Prochainement
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Bientôt disponibles
            </h2>

            <p className="mt-2 max-w-[680px] text-[15px] leading-7 text-inkSoft">
              Ces produits font partie du développement progressif
              d’Agrofarms237. Leur disponibilité sera annoncée au fur et à
              mesure de leur mise en production.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {upcomingProducts.map((product) => {
              const images = getImages(product.category);

              return (
                <article
                  key={product.category}
                  className="overflow-hidden rounded-l border border-ink/10 bg-paper"
                >
                  <ProductMedia
                    images={images}
                    title={product.title}
                  />

                  <div className="p-7 md:p-8">
                    <StatusBadge
                      status={product.status}
                      label={product.statusLabel}
                    />

                    <span className="mt-5 block text-[12px] font-bold uppercase tracking-[0.12em] text-goldDeep">
                      {product.eyebrow}
                    </span>

                    <h3 className="mt-2 font-serif text-[27px] font-semibold">
                      {product.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-7 text-inkSoft">
                      {product.description}
                    </p>

                    {product.note && (
                      <p className="mt-4 text-[14px] font-bold text-goldDeep">
                        {product.note}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SITUATION ACTUELLE                                    */}
      {/* ===================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[13px] font-bold text-goldDeep">
            Aujourd’hui
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            La production commence avec le silure.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-inkSoft">
            Agrofarms237 développe progressivement ses activités. Pour le
            moment, le silure frais constitue notre produit actuellement
            disponible. Les autres produits seront ajoutés au catalogue
            au fur et à mesure de leur disponibilité.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* VISION                                                 */}
      {/* ===================================================== */}

      <section className="bg-ink px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[13px] font-bold text-gold">
            Agrofarms237
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Une gamme qui grandit avec la ferme.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-paper/70">
            Chaque nouveau produit sera introduit progressivement, avec
            l’objectif de proposer une offre issue directement de nos
            activités agricoles et d’élevage.
          </p>
        </div>
      </section>
    </main>
  );
}
