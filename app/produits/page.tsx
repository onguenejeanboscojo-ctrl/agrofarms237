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
 * Produits Agrofarms237
 *
 * Pour le moment, aucun de ces produits n'est commercialisé.
 * Le seul produit actuellement disponible est le silure frais,
 * présenté dans la page « Notre élevage ».
 *
 * Les statuts sont indépendants des photos.
 */

const PRODUCTS = [
  {
    category: "produit_poisson_fume",
    title: "Poisson fumé",
    eyebrow: "Pisciculture",
    description:
      "Une future gamme de poisson fumé développée à partir de notre production piscicole.",
  },
  {
    category: "produit_porc_fume",
    title: "Porc fumé",
    eyebrow: "Élevage porcin",
    description:
      "Une future gamme de porc fumé qui sera développée avec l'évolution de notre élevage porcin.",
  },
  {
    category: "produit_poulet_fume",
    title: "Poulet fumé",
    eyebrow: "Aviculture",
    description:
      "Une future offre de poulet fumé qui viendra compléter progressivement notre gamme.",
  },
  {
    category: "produit_poulet_frais",
    title: "Poulet frais nettoyé",
    eyebrow: "Aviculture",
    description:
      "Poulet frais nettoyé et préparé pour faciliter la commande et la préparation chez nos clients.",
    note: "Vente au kilogramme prévue ultérieurement.",
  },
  {
    category: "produit_porcelet",
    title: "Porcelet",
    eyebrow: "Élevage porcin",
    description:
      "Des porcelets seront proposés lorsque notre activité d'élevage porcin sera opérationnelle.",
  },
  {
    category: "produit_poussins",
    title: "Poussins",
    eyebrow: "Aviculture",
    description:
      "Une future offre destinée aux éleveurs souhaitant démarrer ou développer leur activité avicole.",
  },
  {
    category: "produit_alevins",
    title: "Alevins",
    eyebrow: "Pisciculture",
    description:
      "Des alevins destinés aux éleveurs souhaitant démarrer ou renforcer leur production piscicole.",
  },
];

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3.5 py-1.5 text-[12.5px] font-bold text-goldDeep">
      <span className="h-2 w-2 rounded-full bg-gold" />
      Bientôt disponible
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

  return (
    <main>
      {/* HERO */}
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
            Notre gamme se développera progressivement au rythme de
            l’évolution de nos différentes activités agricoles et
            d’élevage.
          </p>
        </div>
      </section>

      {/* PRODUITS */}
      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              Notre gamme
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Produits à venir
            </h2>

            <p className="mt-2 max-w-[680px] text-[15px] leading-7 text-inkSoft">
              Ces produits font partie du développement progressif
              d’Agrofarms237. Leur disponibilité sera annoncée au fur et à
              mesure de leur mise en production.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {PRODUCTS.map((product) => {
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
                    <StatusBadge />

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

      {/* SITUATION ACTUELLE */}
      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[13px] font-bold text-goldDeep">
            Aujourd’hui
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            La production commence avec le silure.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-inkSoft">
            Agrofarms237 développe progressivement ses activités. Pour le
            moment, notre élevage de silure constitue notre production
            principale. Les autres produits présentés ici seront ajoutés
            au catalogue au fur et à mesure de leur disponibilité.
          </p>
        </div>
      </section>

      {/* VISION */}
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
