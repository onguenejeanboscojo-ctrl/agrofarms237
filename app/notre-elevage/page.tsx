import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductCarousel from "@/components/ProductCarousel";

export const revalidate = 30;

type MediaItem = {
  id: string;
  url: string;
  kind: "photo" | "video";
  caption?: string | null;
  category?: string | null;
};

const STEPS = [
  {
    label: "Aujourd’hui",
    title: "Silure frais",
    text: "Production active à Yaoundé, Mimboman, vendue directement aux familles et professionnels.",
  },
  {
    label: "Prochaine étape",
    title: "Produits fumés",
    text: "Une gamme de silure fumé, pensée pour la conservation et pour étendre la livraison au-delà de Yaoundé.",
  },
  {
    label: "Développement",
    title: "Porcs, poulets de chair, poules pondeuses",
    text: "Une diversification progressive.",
  },
];

const ELEVAGE = [
  {
    name: "Silure",
    group: "Poissons",
    status: "disponible",
    description:
      "Notre production principale aujourd’hui. Des silures élevés à Yaoundé, Mimboman, pour une consommation locale et une qualité maîtrisée.",
  },
  {
    name: "Carpe",
    group: "Poissons",
    status: "avenir",
    description:
      "Une prochaine espèce qui viendra compléter notre production piscicole et offrir davantage de choix à nos clients.",
  },
  {
    name: "Porcs",
    group: "Élevage porcin",
    status: "avenir",
    description:
      "Un projet d’élevage porcin en développement, avec une approche progressive et orientée vers la qualité.",
  },
  {
    name: "Poules pondeuses",
    group: "Aviculture",
    status: "avenir",
    description:
      "Une future activité dédiée à la production d’œufs frais, avec une ambition de production régulière et locale.",
  },
  {
    name: "Poulets de chair",
    group: "Aviculture",
    status: "avenir",
    description:
      "Une future production de poulets de chair destinée à répondre à la demande locale en viande de volaille.",
  },
];

async function getMedia(): Promise<MediaItem[]> {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("media")
    .select("id,url,kind,caption,category")
    .eq("published", true)
    .eq("kind", "photo")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération média :", error);
    return [];
  }

  return data ?? [];
}

function getMediaForCategory(
  media: MediaItem[],
  categories: string[]
): MediaItem[] {
  return media.filter((item) => {
    const category = item.category?.toLowerCase() ?? "";

    return categories.some((value) =>
      category.toLowerCase().includes(value.toLowerCase())
    );
  });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "disponible") {
    return (
      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        Disponible
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
      Bientôt disponible
    </span>
  );
}

function MediaBlock({
  media,
  fallback,
}: {
  media: MediaItem[];
  fallback: string;
}) {
  if (media.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-black/5 px-6 text-center">
        <p className="text-sm text-black/45">{fallback}</p>
      </div>
    );
  }

  return (
    <ProductCarousel
      images={media.map((item) => item.url)}
    />
  );
}

export default async function NotreElevagePage() {
  const media = await getMedia();

  const silureMedia = getMediaForCategory(media, [
    "silure",
    "poisson",
    "pisciculture",
  ]);

  const carpeMedia = getMediaForCategory(media, ["carpe"]);

  const porcMedia = getMediaForCategory(media, [
    "porc",
    "élevage porcin",
    "elevage porcin",
  ]);

  const pouletMedia = getMediaForCategory(media, [
    "poulet",
    "pondeuse",
    "volaille",
    "aviculture",
  ]);

  const poissons = ELEVAGE.filter(
    (item) => item.group === "Poissons"
  );

  const porcs = ELEVAGE.filter(
    (item) => item.group === "Élevage porcin"
  );

  const poulets = ELEVAGE.filter(
    (item) => item.group === "Aviculture"
  );

  return (
    <main className="bg-white text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#18352B] text-white">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-gold">
              Notre élevage
            </p>

            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Une ferme qui grandit,
              <br />
              élevage après élevage.
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
              Le silure constitue aujourd’hui notre activité principale,
              produite à Yaoundé, Mimboman. Demain, notre ferme accueillera
              progressivement d’autres productions pour construire un modèle
              agricole plus complet, local et durable.
            </p>
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {step.label}
                </p>

                <h2 className="mt-3 font-serif text-2xl">
                  {step.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-black/60">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POISSONS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Notre production
            </p>

            <h2 className="mt-3 font-serif text-4xl">
              Poissons
            </h2>

            <p className="mt-4 text-base leading-8 text-black/60">
              Une production piscicole qui commence avec le silure et
              s’élargira progressivement à d’autres espèces.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {poissons.map((item) => {
              const itemMedia =
                item.name === "Silure"
                  ? silureMedia
                  : carpeMedia;

              return (
                <article
                  key={item.name}
                  className="overflow-hidden border border-black/10 bg-white"
                >
                  <MediaBlock
                    media={itemMedia}
                    fallback={`Les visuels de ${item.name.toLowerCase()} seront bientôt disponibles.`}
                  />

                  <div className="p-7">
                    <StatusBadge status={item.status} />

                    <h3 className="mt-4 font-serif text-3xl">
                      {item.name}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-black/60">
                      {item.description}
                    </p>

                    {item.status === "disponible" && (
                      <p className="mt-5 text-sm font-medium text-ink">
                        Production actuelle
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORCS */}
      <section className="bg-bgAlt">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Développement
            </p>

            <h2 className="mt-3 font-serif text-4xl">
              Élevage porcin
            </h2>

            <p className="mt-4 text-base leading-8 text-black/60">
              Notre projet d’élevage porcin s’inscrit dans une logique de
              diversification progressive de la ferme.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {porcs.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden border border-black/10 bg-white"
              >
                <MediaBlock
                  media={porcMedia}
                  fallback="Les visuels de cette production seront bientôt disponibles."
                />

                <div className="p-7">
                  <StatusBadge status={item.status} />

                  <h3 className="mt-4 font-serif text-3xl">
                    {item.name}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-black/60">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* POULETS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Aviculture
            </p>

            <h2 className="mt-3 font-serif text-4xl">
              Poulets
            </h2>

            <p className="mt-4 text-base leading-8 text-black/60">
              Une future activité avicole qui regroupera progressivement
              poules pondeuses et poulets de chair.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {poulets.map((item) => (
              <article
                key={item.name}
                className="overflow-hidden border border-black/10 bg-white"
              >
                <MediaBlock
                  media={pouletMedia}
                  fallback="Les visuels de cette production seront bientôt disponibles."
                />

                <div className="p-7">
                  <StatusBadge status={item.status} />

                  <h3 className="mt-4 font-serif text-3xl">
                    {item.name}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-black/60">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-[#18352B] text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Notre vision
          </p>

          <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Construire une ferme capable de nourrir,
            <br className="hidden sm:block" />
            de créer et de transmettre.
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/70">
            Agrofarms237 avance étape par étape, avec l’ambition de
            développer une agriculture locale structurée, productive et
            durable.
          </p>
        </div>
      </section>
    </main>
  );
}
