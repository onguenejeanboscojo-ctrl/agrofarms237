import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductCarousel from "@/components/ProductCarousel";

export const revalidate = 30;

type FarmItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  status: "disponible" | "bientot";
  photo_url: string | null;
  position: number;
  published: boolean;
};

type MediaItem = {
  id: string;
  url: string;
  kind: "photo" | "video";
  caption: string | null;
  category: string | null;
};

async function getFarmItems(): Promise<FarmItem[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("farm_breeding")
      .select("*")
      .eq("published", true)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    return (data || []) as FarmItem[];
  } catch {
    return [];
  }
}

async function getMedia(): Promise<MediaItem[]> {
  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select("id,url,kind,caption,category")
      .eq("published", true)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    return (data || []) as MediaItem[];
  } catch {
    return [];
  }
}

function StatusBadge({
  status,
}: {
  status: "disponible" | "bientot";
}) {
  const available = status === "disponible";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold ${
        available
          ? "border-ink/20 bg-ink/10 text-ink"
          : "border-gold/25 bg-gold/10 text-goldDeep"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          available ? "bg-ink" : "bg-gold"
        }`}
      />

      {available ? "Disponible" : "Bientôt disponible"}
    </span>
  );
}

function MediaBlock({
  images,
}: {
  images: string[];
}) {
  if (images.length > 0) {
    return <ProductCarousel images={images} />;
  }

  return (
    <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#2A5E56_0%,#0E2622_60%,#081815_100%)]">
      <div className="text-center">
        <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-gold">
          Agrofarms237
        </span>

        <p className="mt-2 font-serif text-[22px] font-semibold text-paper">
          Photo à venir
        </p>
      </div>
    </div>
  );
}

export default async function NotreElevagePage() {
  const [farmItems, media] = await Promise.all([
    getFarmItems(),
    getMedia(),
  ]);

  const getImages = (categories: string[]) =>
    media
      .filter(
        (item) =>
          item.kind === "photo" &&
          item.category &&
          categories.includes(item.category)
      )
      .map((item) => item.url)
      .filter(Boolean)
      .slice(0, 6);

  const poissons = farmItems.filter((item) =>
    ["poisson", "poissons"].includes(
      item.category.toLowerCase()
    )
  );

  const porcs = farmItems.filter((item) =>
    ["porcs", "élevage porcin"].includes(
      item.category.toLowerCase()
    )
  );

  const poulets = farmItems.filter((item) =>
    ["poulets", "aviculture"].includes(
      item.category.toLowerCase()
    )
  );

  const heroImages = getImages([
    "ferme",
    "bassins",
    "silures",
    "elevage_silure",
    "elevage_carpe",
    "elevage_porcs",
    "elevage_pondeuses",
    "elevage_chair",
  ]);

  const renderFarmCard = (item: FarmItem) => {
    const mediaCategories: Record<string, string[]> = {
      Silure: ["elevage_silure", "silures"],
      Carpe: ["elevage_carpe"],
      Porcs: ["elevage_porcs"],
      "Poules pondeuses": ["elevage_pondeuses"],
      "Poulets de chair": ["elevage_chair"],
    };

    const images = item.photo_url
      ? [item.photo_url]
      : getImages(mediaCategories[item.name] || []);

    const canOrder =
      item.name.toLowerCase() === "silure" &&
      item.status === "disponible";

    return (
      <article
        key={item.id}
        className="grid overflow-hidden rounded-2xl border border-ink/10 bg-paper md:grid-cols-2"
      >
        <MediaBlock images={images} />

        <div className="flex flex-col justify-center p-7 md:p-10">
          <StatusBadge status={item.status} />

          <h3 className="mt-5 font-serif text-[30px] font-semibold">
            {item.name}
          </h3>

          {item.description && (
            <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-inkSoft">
              {item.description}
            </p>
          )}

          {canOrder && (
            <a
              href="/commander"
              className="mt-7 inline-flex w-fit items-center justify-center rounded-lg bg-ink px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Commander
            </a>
          )}
        </div>
      </article>
    );
  };

  return (
    <main>
      {/* HERO */}

      <section className="relative min-h-[620px] overflow-hidden bg-ink text-paper md:min-h-[680px]">
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#2A5E56_0%,#0E2622_60%,#081815_100%)]" />
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(20,68,64,.45),rgba(8,24,21,.88)_65%,rgba(7,25,22,.98))]" />

        <div className="absolute inset-0 bg-[#071916]/50" />

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#071916] via-[#071916]/75 to-transparent" />

        <div className="relative mx-auto flex min-h-[620px] max-w-[1180px] items-center px-5 py-24 md:min-h-[680px]">
          <div className="max-w-[800px]">
            <span className="mb-4 inline-block text-[13px] font-bold uppercase tracking-[0.12em] text-gold">
              Notre élevage
            </span>

            <h1 className="font-serif text-[clamp(42px,7vw,72px)] font-semibold leading-[1.02]">
              Une ferme qui grandit,
              <br />
              élevage après élevage.
            </h1>

            <p className="mt-7 max-w-[650px] text-[17px] leading-7 text-paper/85">
              Agrofarms237 développe progressivement plusieurs filières
              d’élevage pour construire une ferme diversifiée, durable et
              capable de proposer des produits issus directement de notre
              production.
            </p>
          </div>
        </div>

        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {heroImages.map((_, index) => (
              <span
                key={index}
                className="h-1.5 w-8 rounded-full bg-paper/40"
              />
            ))}
          </div>
        )}
      </section>

      {/* POISSONS */}

      {poissons.length > 0 && (
        <section className="px-5 py-20 md:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10">
              <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
                01 — Pisciculture
              </span>

              <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
                Poissons
              </h2>

              <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-inkSoft">
                Une production piscicole centrée aujourd’hui sur le
                silure, avec une diversification progressive de notre
                élevage.
              </p>
            </div>

            <div className="grid gap-7">
              {poissons.map(renderFarmCard)}
            </div>
          </div>
        </section>
      )}

      {/* PORCS */}

      {porcs.length > 0 && (
        <section className="bg-bgAlt px-5 py-20 md:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10">
              <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
                02 — Élevage porcin
              </span>

              <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
                Porcs
              </h2>

              <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-inkSoft">
                Une nouvelle filière en préparation dans le développement
                progressif de la ferme.
              </p>
            </div>

            <div className="grid gap-7">
              {porcs.map(renderFarmCard)}
            </div>
          </div>
        </section>
      )}

      {/* POULETS */}

      {poulets.length > 0 && (
        <section className="px-5 py-20 md:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10">
              <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
                03 — Aviculture
              </span>

              <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
                Poulets
              </h2>

              <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-inkSoft">
                Le développement de l’aviculture viendra compléter
                progressivement notre activité agricole.
              </p>
            </div>

            <div className="grid gap-7">
              {poulets.map(renderFarmCard)}
            </div>
          </div>
        </section>
      )}

      {/* AUCUN ÉLEVAGE */}

      {farmItems.length === 0 && (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-[760px] rounded-2xl border border-dashed border-ink/15 bg-paper p-10 text-center">
            <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-goldDeep">
              Agrofarms237
            </span>

            <h2 className="mt-3 font-serif text-3xl font-semibold">
              Notre élevage
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-inkSoft">
              Les informations sur nos différents élevages seront bientôt
              disponibles.
            </p>
          </div>
        </section>
      )}

      {/* VISION */}

      <section className="bg-paper px-5 py-20 text-center md:py-24">
        <div className="mx-auto max-w-[900px]">
          <span className="text-[13px] font-bold text-gold">
            Notre vision
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Construire progressivement une ferme complète.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-ink/70">
            Chaque nouvelle activité sera développée étape par étape,
            avec une attention particulière portée à la qualité de
            l’élevage, au suivi de la production et à la satisfaction
            de nos clients.
          </p>
        </div>
      </section>

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

        .hero-slide:first-child {
          opacity: 1;
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
    </main>
  );
}
