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

const ELEVAGE = [
  {
    category: "elevage_silure",
    title: "Silure",
    group: "Poissons",
    status: "disponible",
    statusLabel: "Disponible",
    description:
      "Notre élevage de silures constitue aujourd’hui le cœur de la production Agrofarms237. Les poissons sont élevés localement et commercialisés frais, directement depuis la ferme.",
  },
  {
    category: "elevage_carpe",
    title: "Carpe",
    group: "Poissons",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "La carpe fait partie des prochaines espèces que nous souhaitons intégrer progressivement à notre production afin de diversifier notre offre piscicole.",
  },
  {
    category: "elevage_porcs",
    title: "Porcs",
    group: "Élevage porcin",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Agrofarms237 prépare progressivement le développement d’un élevage porcin, avec la même volonté de privilégier une production suivie et de qualité.",
  },
  {
    category: "elevage_pondeuses",
    title: "Poules pondeuses",
    group: "Aviculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "Le développement de poules pondeuses viendra compléter notre activité agricole et permettre à Agrofarms237 de proposer progressivement de nouveaux produits issus de la ferme.",
  },
  {
    category: "elevage_chair",
    title: "Poulets de chair",
    group: "Aviculture",
    status: "avenir",
    statusLabel: "Bientôt disponible",
    description:
      "L’élevage de poulets de chair est prévu dans notre développement. Cette activité sera lancée progressivement afin de maintenir nos exigences de suivi et de qualité.",
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

function MediaBlock({ images }: { images: string[] }) {
  if (images.length > 0) {
    return <ProductCarousel images={images} />;
  }

  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-m bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
      <div className="text-center">
        <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-gold">
          Agrofarms237
        </span>

        <p className="mt-2 font-serif text-[22px] font-semibold text-paper">
          Photos à venir
        </p>
      </div>
    </div>
  );
}

export default async function NotreElevagePage() {
  const media = await getMedia();

  const getImages = (category: string) =>
    media
      .filter((item) => item.category === category)
      .map((item) => item.url);

  /*
   * Photos utilisées pour le diaporama du grand bandeau.
   *
   * On récupère les images de la ferme et de l'élevage.
   * Les catégories seront alimentées directement depuis l'administration.
   */
  const heroCategories = [
    "ferme",
    "bassins",
    "silures",
    "elevage_silure",
    "elevage_carpe",
    "elevage_porcs",
    "elevage_pondeuses",
    "elevage_chair",
  ];

  const heroImages = media
    .filter(
      (item) =>
        item.category &&
        heroCategories.includes(item.category)
    )
    .map((item) => item.url)
    .filter(Boolean)
    .slice(0, 6);

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
    <main>
      {/* ===================================================== */}
      {/* HERO / DIAPORAMA                                      */}
      {/* ===================================================== */}

      <section className="relative min-h-[620px] overflow-hidden bg-ink text-paper md:min-h-[680px]">
        {/* Fond du diaporama */}
        {heroImages.length > 0 ? (
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="hero-slide absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${image}")`,
                  animationDelay: `${index * 5}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)]" />
        )}

        {/* Voile sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-[#071916]/65" />

        {/* Dégradé supplémentaire en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071916]/85 via-transparent to-[#071916]/20" />

        {/* Contenu */}
        <div className="relative mx-auto flex min-h-[620px] max-w-[1180px] items-center px-5 py-[100px] md:min-h-[680px]">
          <div className="max-w-[850px]">
            <span className="mb-4 inline-block text-[13px] font-bold text-gold">
              Notre élevage
            </span>

            <h1 className="font-serif text-[clamp(42px,7vw,72px)] font-semibold leading-[1.02]">
              Une ferme qui grandit,
              <br />
              élevage après élevage.
            </h1>

            <p className="mt-6 max-w-[650px] text-[17px] leading-7 text-paper/85">
              Le silure constitue aujourd’hui notre activité principale.
              Agrofarms237 développe progressivement de nouvelles filières
              d’élevage pour construire une ferme diversifiée et durable.
            </p>
          </div>
        </div>

        {/* Petite indication visuelle */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-7 left-5 right-5">
            <div className="mx-auto flex max-w-[1180px] items-center gap-2">
              {heroImages.map((_, index) => (
                <span
                  key={index}
                  className="h-1 w-8 rounded-full bg-paper/35"
                />
              ))}
            </div>
          </div>
        )}

        {/* Animation du diaporama */}
        <style>{`
          .hero-slide {
            opacity: 0;
            transform: scale(1.04);
            animation: agrofarmsHero 30s infinite;
          }

          @keyframes agrofarmsHero {
            0% {
              opacity: 0;
              transform: scale(1.04);
            }

            4% {
              opacity: 1;
            }

            22% {
              opacity: 1;
              transform: scale(1);
            }

            28% {
              opacity: 0;
              transform: scale(1);
            }

            100% {
              opacity: 0;
              transform: scale(1.04);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .hero-slide {
              animation: none;
              opacity: 0;
            }

            .hero-slide:first-child {
              opacity: 1;
            }
          }
        `}</style>
      </section>

      {/* ===================================================== */}
      {/* POISSONS                                              */}
      {/* ===================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              01 — Pisciculture
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Poissons
            </h2>

            <p className="mt-2 max-w-[650px] text-[15px] text-inkSoft">
              Une production piscicole qui commence avec le silure et qui
              s’ouvrira progressivement à d’autres espèces.
            </p>
          </div>

          <div className="grid gap-8">
            {poissons.map((item) => {
              const images = getImages(item.category);

              return (
                <article
                  key={item.category}
                  className="grid overflow-hidden rounded-l border border-ink/10 bg-bgAlt md:grid-cols-2"
                >
                  <MediaBlock images={images} />

                  <div className="flex flex-col justify-center p-7 md:p-10">
                    <div className="mb-5">
                      <StatusBadge
                        status={item.status}
                        label={item.statusLabel}
                      />
                    </div>

                    <h3 className="font-serif text-[30px] font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-[55ch] text-[15px] leading-7 text-inkSoft">
                      {item.description}
                    </p>

                    {item.status === "disponible" && (
                      <div className="mt-6">
                        <span className="text-[13px] font-bold text-goldDeep">
                          Production actuelle
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PORCS                                                 */}
      {/* ===================================================== */}

      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              02 — Élevage porcin
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Porcs
            </h2>

            <p className="mt-2 max-w-[650px] text-[15px] text-inkSoft">
              Une nouvelle filière en préparation dans le développement
              progressif de la ferme.
            </p>
          </div>

          {porcs.map((item) => {
            const images = getImages(item.category);

            return (
              <article
                key={item.category}
                className="grid overflow-hidden rounded-l border border-ink/10 bg-paper md:grid-cols-2"
              >
                <MediaBlock images={images} />

                <div className="flex flex-col justify-center p-7 md:p-10">
                  <StatusBadge
                    status={item.status}
                    label={item.statusLabel}
                  />

                  <h3 className="mt-5 font-serif text-[30px] font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[55ch] text-[15px] leading-7 text-inkSoft">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===================================================== */}
      {/* POULETS                                               */}
      {/* ===================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              03 — Aviculture
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Poulets
            </h2>

            <p className="mt-2 max-w-[650px] text-[15px] text-inkSoft">
              L’aviculture constitue une prochaine étape de diversification
              pour Agrofarms237.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {poulets.map((item) => {
              const images = getImages(item.category);

              return (
                <article
                  key={item.category}
                  className="overflow-hidden rounded-l border border-ink/10 bg-paper"
                >
                  <MediaBlock images={images} />

                  <div className="p-7">
                    <StatusBadge
                      status={item.status}
                      label={item.statusLabel}
                    />

                    <h3 className="mt-5 font-serif text-[26px] font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-7 text-inkSoft">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* VISION                                                */}
      {/* ===================================================== */}

      <section className="bg-ink px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[13px] font-bold text-gold">
            Notre vision
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Construire progressivement une ferme complète.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-paper/70">
            Chaque nouvelle activité sera développée étape par étape, avec
            une attention particulière portée à la qualité de l’élevage, au
            suivi de la production et à la satisfaction de nos clients.
          </p>
        </div>
      </section>
    </main>
  );
}
