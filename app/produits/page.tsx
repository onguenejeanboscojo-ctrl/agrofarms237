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
 * Les statuts sont volontairement séparés des photos.
 *
 * Ajouter une photo dans l'administration ne change donc jamais
 * automatiquement la disponibilité du produit.
 */
const PRODUCTS = [
  {
    category: "produit_poisson_fume",
    title: "Poisson fumé",
    eyebrow: "Pisciculture",
    status: "disponible",
    statusLabel: "Disponible",
    description:
      "Une déclinaison fumée de notre production piscicole, pensée pour la conservation et pour offrir une autre manière de savourer notre poisson.",
  },
  {
    category: "produit_porc_fume",
    title: "Porc fumé",
    eyebrow: "Élevage porcin",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Une future gamme issue de notre développement en élevage porcin. La commercialisation sera lancée progressivement.",
  },
  {
    category: "produit_poulet_fume",
    title: "Poulet fumé",
    eyebrow: "Aviculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Une future offre de poulet fumé qui viendra compléter progressivement notre gamme de produits issus de la ferme.",
  },
  {
    category: "produit_poulet_frais",
    title: "Poulet frais nettoyé",
    eyebrow: "Aviculture",
    status: "disponible",
    statusLabel: "Disponible",
    description:
      "Poulet frais nettoyé et préparé pour faciliter la commande et la préparation chez nos clients.",
    note: "Vendu au kilogramme.",
  },
  {
    category: "produit_porcelet",
    title: "Porcelet",
    eyebrow: "Élevage porcin",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Des porcelets issus de notre future activité d’élevage porcin seront proposés progressivement.",
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
    status: "disponible",
    statusLabel: "Disponible",
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

  function getImages(category: string) {
    return media
      .filter((item) => item.category === category)
      .map((item) => item.url);
  }

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
            De la ferme à votre table.
          </h1>

          <p className="mt-5 max-w-[680px] text-[17px] leading-7 text-paper/75">
            Découvrez les produits proposés par Agrofarms237 aujourd’hui
            et ceux qui viendront progressivement compléter notre gamme.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PRODUITS DISPONIBLES                                  */}
      {/* ===================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              Disponible aujourd’hui
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Nos produits disponibles
            </h2>

            <p className="mt-2 max-w-[680px] text-[15px] leading-7 text-inkSoft">
              Les produits actuellement proposés par Agrofarms237.
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
                    <div className="mb-5">
                      <StatusBadge
                        status={product.status}
                        label={product.statusLabel}
                      />
                    </div>

                    <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-goldDeep">
                      {product.eyebrow}
                    </span>

                    <h3 className="mt-2 font-serif text-[30px] font-semibold">
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
              d’Agrofarms237.
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
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA                                                     */}
      {/* ===================================================== */}

      <section className="bg-ink px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[13px] font-bold text-gold">
            Agrofarms237
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Un produit qui commence par une bonne production.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-paper/70">
            Notre objectif est de développer progressivement une gamme
            issue de la ferme, tout en conservant une attention particulière
            à la qualité et à la traçabilité.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link href="/commander" className="btn btn-gold">
              Commander
            </Link>

            <Link href="/contact" className="btn btn-outline">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
