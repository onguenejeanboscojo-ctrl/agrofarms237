import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 30;

type TeamMember = {
  id: string;
  name: string | null;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  position: number;
  published: boolean;
};

type NewsPost = {
  id: string;
  title: string | null;
  body: string | null;
  created_at: string;
  published: boolean;
};

type SiteMedia = {
  id: string;
  url: string;
  kind: "photo" | "video";
  site_location: string | null;
  position: number;
  created_at: string;
};

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("position", { ascending: true });

    if (error) {
      console.error("Erreur récupération équipe :", error);
      return [];
    }

    return (data || []) as TeamMember[];
  } catch (error) {
    console.error("Erreur inattendue récupération équipe :", error);
    return [];
  }
}

async function getNewsPosts(): Promise<NewsPost[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("news_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération actualités :", error);
      return [];
    }

    return (data || []) as NewsPost[];
  } catch (error) {
    console.error("Erreur inattendue récupération actualités :", error);
    return [];
  }
}

async function getSiteMedia(): Promise<SiteMedia[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select("id,url,kind,site_location,position,created_at")
      .eq("published", true)
      .in("site_location", ["vie_ferme", "actualites"])
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erreur récupération médias À propos :", error);
      return [];
    }

    return (data || []) as SiteMedia[];
  } catch (error) {
    console.error("Erreur inattendue récupération médias :", error);
    return [];
  }
}

function MediaVisual({
  media,
  className = "",
}: {
  media: SiteMedia;
  className?: string;
}) {
  if (media.kind === "video") {
    return (
      <video
        src={media.url}
        muted
        loop
        playsInline
        controls
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <img
      src={media.url}
      alt="AgroFarms237"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="ml-3 inline-block text-[#B88A2C] transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export default async function LaVieDeLaFermePage() {
  const [team, posts, siteMedia] = await Promise.all([
    getTeamMembers(),
    getNewsPosts(),
    getSiteMedia(),
  ]);

  const farmLifeMedia = siteMedia.filter(
    (media) => media.site_location === "vie_ferme"
  );

  const newsMedia = siteMedia.filter(
    (media) => media.site_location === "actualites"
  );

  const heroMedia = farmLifeMedia[0] ?? null;
  const storyMedia = farmLifeMedia.slice(1, 3);
  const galleryMedia = farmLifeMedia.slice(0, 5);

  return (
    <main className="overflow-hidden bg-[#F8F5ED] text-[#18352B]">

      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative min-h-[760px] overflow-hidden bg-[#18352B] lg:min-h-[820px]">

        {heroMedia ? (
          <div className="absolute inset-0">
            <MediaVisual media={heroMedia} />

            <div className="absolute inset-0 bg-[#10281F]/55" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#10281F]/85 via-[#18352B]/45 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#10281F]/90 via-transparent to-[#10281F]/10" />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#17382D] via-[#1F4A39] to-[#10281F]" />

            <div className="absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full border border-white/10" />

            <div className="absolute -right-10 top-24 h-[420px] w-[420px] rounded-full border border-[#D3A84C]/20" />

            <div className="absolute -bottom-72 -left-44 h-[720px] w-[720px] rounded-full border border-white/5" />
          </>
        )}

        <div className="relative mx-auto flex min-h-[760px] max-w-[1500px] items-end px-6 pb-36 pt-36 lg:min-h-[820px] lg:px-12 lg:pb-40">

          <div className="max-w-4xl">

            <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#D3A84C] sm:text-xs">
              À propos d’AgroFarms237
            </p>

            <h1 className="font-serif text-[3.6rem] leading-[0.91] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl lg:text-[6.8rem]">
              Construire une
              <br />
              agriculture locale,
              <br />
              structurée et{" "}
              <span className="text-[#D3A84C]">durable.</span>
            </h1>

            <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-center">

              <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Une ferme camerounaise qui développe progressivement
                plusieurs filières agricoles pour produire localement,
                créer de la valeur et construire une activité durable.
              </p>

            </div>

            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                href="#histoire"
                className="group inline-flex min-h-12 items-center bg-[#D3A84C] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#18352B] transition hover:bg-white"
              >
                Découvrir notre histoire
                <Arrow />
              </Link>

              <Link
                href="/notre-elevage"
                className="group inline-flex min-h-12 items-center border border-white/35 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
              >
                Voir la ferme
                <Arrow />
              </Link>

            </div>

          </div>
        </div>

        {/* HERO FLOATING STRIP */}

        <div className="absolute bottom-0 left-1/2 z-10 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 translate-y-1/2 px-0 lg:w-[calc(100%-6rem)]">

          <div className="grid overflow-hidden border border-black/10 bg-[#F8F5ED] shadow-[0_25px_70px_rgba(0,0,0,0.16)] sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                title: "Pisciculture",
                subtitle: "Notre point de départ",
                icon: "◈",
              },
              {
                title: "Élevage porcin",
                subtitle: "En développement",
                icon: "◉",
              },
              {
                title: "Aviculture",
                subtitle: "En développement",
                icon: "◇",
              },
              {
                title: "Une vision",
                subtitle: "À long terme",
                icon: "✦",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`flex min-h-[105px] items-center gap-4 px-6 py-5 ${
                  index !== 3 ? "border-b border-black/10 lg:border-b-0 lg:border-r" : ""
                }`}
              >
                <span className="font-serif text-2xl text-[#B88A2C]">
                  {item.icon}
                </span>

                <div>
                  <p className="font-serif text-lg leading-tight text-[#18352B]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* HISTOIRE                                               */}
      {/* ===================================================== */}

      <section id="histoire" className="bg-[#F8F5ED]">
        <div className="mx-auto max-w-[1500px] px-6 pb-24 pt-40 lg:px-12 lg:pb-32 lg:pt-48">

          <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">

            <div className="relative z-10">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B88A2C]">
                Qui sommes-nous ?
              </p>

              <h2 className="mt-6 max-w-2xl font-serif text-5xl leading-[0.98] tracking-[-0.025em] text-[#18352B] sm:text-6xl">
                Une ferme camerounaise
                <span className="block text-[#B88A2C]">
                  qui grandit filière après filière.
                </span>
              </h2>

              <div className="mt-8 max-w-xl space-y-5 text-sm leading-7 text-black/60 sm:text-base">

                <p>
                  AgroFarms237 est une entreprise agricole camerounaise qui
                  développe progressivement ses activités autour de la
                  pisciculture, de l’élevage porcin et de l’aviculture.
                </p>

                <p>
                  Notre développement commence avec la pisciculture et le
                  silure comme première production structurée et commercialisée.
                  Cette première activité constitue le point de départ d’un
                  projet agricole plus large.
                </p>

                <p>
                  À mesure que la ferme se développe, notre ambition est de
                  construire plusieurs filières complémentaires, d’améliorer
                  la valorisation des productions et de développer
                  progressivement leur distribution.
                </p>

              </div>

              <Link
                href="#trajectoire"
                className="group mt-9 inline-flex min-h-12 items-center border border-[#18352B]/20 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#18352B] transition hover:border-[#18352B] hover:bg-[#18352B] hover:text-white"
              >
                Notre démarche
                <Arrow />
              </Link>

            </div>


            {/* IMAGE COMPOSITION */}

            <div className="relative min-h-[500px] lg:min-h-[610px]">

              {storyMedia[0] ? (
                <div className="absolute right-0 top-0 h-[70%] w-[82%] overflow-hidden">
                  <MediaVisual media={storyMedia[0]} />
                </div>
              ) : (
                <div className="absolute right-0 top-0 h-[70%] w-[82%] bg-[#DDE3D8]" />
              )}

              <div className="absolute right-[17%] top-[12%] h-20 w-20 border-[14px] border-[#D3A84C] lg:h-28 lg:w-28 lg:border-[18px]" />

              {storyMedia[1] ? (
                <div className="absolute bottom-0 left-0 z-10 h-[48%] w-[54%] overflow-hidden border-[10px] border-[#F8F5ED] shadow-[0_25px_60px_rgba(0,0,0,0.18)] lg:border-[14px]">
                  <MediaVisual media={storyMedia[1]} />
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 z-10 h-[48%] w-[54%] bg-[#D9E0D6] lg:border-[14px]" />
              )}

              <div className="absolute bottom-10 right-0 z-20 max-w-[250px] bg-[#18352B] px-7 py-6 text-white shadow-xl">
                <p className="font-serif text-xl leading-tight">
                  Des productions locales,
                  au service d’une agriculture
                  qui se construit dans le temps.
                </p>

                <div className="mt-5 h-px w-10 bg-[#D3A84C]" />
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* TRAJECTOIRE                                             */}
      {/* ===================================================== */}

      <section id="trajectoire" className="relative overflow-hidden bg-[#123127] text-white">

        <div className="absolute -bottom-60 left-[-160px] h-[650px] w-[650px] rounded-full border border-white/5" />

        <div className="absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full border border-[#D3A84C]/10" />

        <div className="relative mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">

          <div className="grid gap-16 lg:grid-cols-[0.55fr_1.45fr]">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D3A84C]">
                Notre trajectoire
              </p>

              <h2 className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl">
                Une croissance pensée
                <span className="block text-white/45">
                  étape par étape.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/60 sm:text-base">
                Chaque étape de notre développement contribue à construire
                une exploitation agricole mieux organisée et capable
                d’évoluer dans le temps.
              </p>

              <Link
                href="/notre-elevage"
                className="group mt-9 inline-flex min-h-12 items-center border border-[#D3A84C]/60 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#D3A84C] transition hover:bg-[#D3A84C] hover:text-[#123127]"
              >
                En savoir plus sur notre ferme
                <Arrow />
              </Link>

            </div>


            <div className="relative">

              <div className="absolute bottom-0 left-[54px] top-0 hidden w-px bg-white/15 sm:block" />

              {[
                {
                  number: "01",
                  title: "Le point de départ",
                  category: "Pisciculture",
                  text: "La pisciculture constitue la première activité structurée et commercialisée par AgroFarms237, avec le silure comme première production développée.",
                  image: farmLifeMedia[0],
                },
                {
                  number: "02",
                  title: "La structuration",
                  category: "Infrastructures",
                  text: "Développer progressivement les infrastructures, l’organisation de la production et les outils nécessaires à la croissance de la ferme.",
                  image: farmLifeMedia[1],
                },
                {
                  number: "03",
                  title: "La diversification",
                  category: "Élevage porcin & aviculture",
                  text: "Développer progressivement l’élevage porcin et l’aviculture afin de construire une exploitation agricole plus diversifiée.",
                  image: farmLifeMedia[2],
                },
                {
                  number: "04",
                  title: "La valorisation",
                  category: "Transformation & distribution",
                  text: "Développer de nouvelles possibilités de transformation, de conditionnement et de distribution pour mieux valoriser les productions.",
                  image: farmLifeMedia[3],
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="relative grid gap-6 border-b border-white/10 py-8 sm:grid-cols-[90px_1fr_150px] sm:gap-8 sm:pl-0"
                >

                  <div className="relative z-10 flex items-start">
                    <span className="font-serif text-5xl text-[#D3A84C]">
                      {item.number}
                    </span>
                  </div>

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D3A84C]">
                      {item.category}
                    </p>

                    <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
                      {item.text}
                    </p>

                  </div>

                  <div className="hidden h-24 overflow-hidden sm:block">
                    {item.image ? (
                      <MediaVisual media={item.image} />
                    ) : (
                      <div className="h-full w-full bg-white/5" />
                    )}
                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* ACTIVITÉS                                              */}
      {/* ===================================================== */}

      <section className="bg-[#F8F5ED]">
        <div className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B88A2C]">
                Nos activités
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl">
                Trois filières,
                <span className="block text-[#B88A2C]">
                  une même ambition.
                </span>
              </h2>

            </div>

            <p className="max-w-md text-sm leading-7 text-black/55 sm:text-base">
              Des activités complémentaires pour construire une ferme
              capable de répondre progressivement aux besoins locaux et
              de créer davantage d’opportunités.
            </p>

          </div>


          <div className="mt-14 grid gap-5 lg:grid-cols-3">

            {[
              {
                number: "01",
                title: "Pisciculture",
                text: "Notre première activité, avec le silure comme production principale.",
                image: farmLifeMedia[0],
              },
              {
                number: "02",
                title: "Élevage porcin",
                text: "Une filière en développement pour diversifier progressivement notre production.",
                image: farmLifeMedia[2],
              },
              {
                number: "03",
                title: "Aviculture",
                text: "Un axe de développement autour des poules pondeuses et des poulets de chair.",
                image: farmLifeMedia[3],
              },
            ].map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden border border-black/10 bg-white"
              >

                <div className="relative aspect-[16/10] overflow-hidden bg-[#DCE3D9]">

                  {item.image ? (
                    <MediaVisual
                      media={item.image}
                      className="transition duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D9E1D8] to-[#AABCAA]" />
                  )}

                  <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center bg-[#18352B] font-serif text-lg text-[#D3A84C]">
                    {item.number}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#10281F]/75 to-transparent px-6 pb-5 pt-14">
                    <h3 className="font-serif text-3xl text-white">
                      {item.title}
                    </h3>
                  </div>

                </div>

                <div className="flex min-h-[125px] items-center justify-between gap-5 p-6">

                  <p className="text-sm leading-6 text-black/60">
                    {item.text}
                  </p>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D3A84C] text-[#B88A2C] transition group-hover:bg-[#D3A84C] group-hover:text-[#18352B]">
                    →
                  </span>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* VISION                                                 */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#DDE4D8]">

        {farmLifeMedia[4] && (
          <div className="absolute inset-0">
            <MediaVisual media={farmLifeMedia[4]} />

            <div className="absolute inset-0 bg-[#18352B]/55" />
          </div>
        )}

        <div className="relative mx-auto max-w-[1500px] px-6 py-28 lg:px-12 lg:py-36">

          <div className="max-w-5xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D3A84C]">
              Notre vision
            </p>

            <h2 className="mt-6 font-serif text-5xl leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl lg:text-[5.8rem]">
              Nous ne construisons
              <br />
              pas seulement une ferme.
              <br />
              Nous construisons
              <br />
              <span className="text-[#D3A84C]">
                progressivement un modèle agricole.
              </span>
            </h2>

            <div className="mt-9 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

              <p className="max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                AgroFarms237 avance étape par étape, avec l’ambition de
                développer une agriculture locale structurée, productive
                et durable.
              </p>

              <Link
                href="/notre-elevage"
                className="group inline-flex min-h-12 w-fit items-center bg-[#D3A84C] px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#18352B] transition hover:bg-white"
              >
                Découvrir notre vision
                <Arrow />
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* VALEURS                                                */}
      {/* ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">

          <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr]">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B88A2C]">
                Nos valeurs
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-[0.98] sm:text-6xl">
                Ce qui guide
                <span className="block text-[#B88A2C]">
                  notre développement.
                </span>
              </h2>

            </div>

            <div className="grid gap-0 border-t border-black/10 sm:grid-cols-2">

              {[
                {
                  title: "Qualité",
                  text: "Porter une attention constante à la qualité de nos productions et à l’expérience proposée à nos clients.",
                },
                {
                  title: "Rigueur",
                  text: "Structurer progressivement nos méthodes et nos activités pour construire une exploitation solide.",
                },
                {
                  title: "Développement local",
                  text: "Participer au développement d’une agriculture camerounaise capable de créer de la valeur localement.",
                },
                {
                  title: "Durabilité",
                  text: "Construire progressivement un modèle agricole pensé pour durer et évoluer dans le temps.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="border-b border-black/10 p-7 sm:p-9"
                >
                  <div className="h-px w-10 bg-[#D3A84C]" />

                  <h3 className="mt-7 font-serif text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-black/55">
                    {item.text}
                  </p>
                </article>
              ))}

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* VIE DE LA FERME                                        */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">
        <div className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B88A2C]">
                La vie de la ferme
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-[0.98] sm:text-6xl">
                Dans les coulisses
                <span className="block text-[#B88A2C]">
                  d’AgroFarms237.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-7 text-black/55 sm:text-base">
                Découvrez les images et les moments qui illustrent
                progressivement la réalité de notre ferme.
              </p>

            </div>

            <Link
              href="/galerie"
              className="group inline-flex min-h-12 w-fit items-center border border-[#18352B]/20 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#18352B] transition hover:border-[#18352B] hover:bg-[#18352B] hover:text-white"
            >
              Voir la galerie complète
              <Arrow />
            </Link>

          </div>


          {galleryMedia.length > 0 ? (
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {galleryMedia.map((media, index) => (
                <div
                  key={media.id}
                  className={`overflow-hidden bg-[#D9E0D6] ${
                    index === 0
                      ? "sm:col-span-2 sm:row-span-2"
                      : ""
                  }`}
                >
                  <div
                    className={
                      index === 0
                        ? "aspect-square h-full"
                        : "aspect-square"
                    }
                  >
                    <MediaVisual
                      media={media}
                      className="transition duration-700 hover:scale-[1.03]"
                    />
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="mt-14 border border-dashed border-black/15 bg-white p-14 text-center">
              <p className="text-sm leading-7 text-black/50">
                Les premières images de la vie de la ferme seront bientôt
                présentées ici.
              </p>
            </div>
          )}

        </div>
      </section>


      {/* ===================================================== */}
      {/* ÉQUIPE                                                 */}
      {/* ===================================================== */}

      {team.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">

            <div className="max-w-3xl">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B88A2C]">
                L’équipe AgroFarms237
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-[0.98] sm:text-6xl">
                Les personnes derrière
                <span className="block text-[#B88A2C]">
                  le développement de la ferme.
                </span>
              </h2>

            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {team.map((member) => (
                <article
                  key={member.id}
                  className="group overflow-hidden border border-black/10 bg-[#F3EFE5]"
                >

                  <div className="aspect-[4/3] overflow-hidden bg-[#D9E0D6]">

                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={
                          member.name ||
                          "Membre de l'équipe AgroFarms237"
                        }
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
                          Photo indisponible
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="p-7">

                    <h3 className="font-serif text-2xl">
                      {member.name}
                    </h3>

                    {member.role && (
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B88A2C]">
                        {member.role}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-5 text-sm leading-7 text-black/55">
                        {member.bio}
                      </p>
                    )}

                  </div>

                </article>
              ))}

            </div>

          </div>
        </section>
      )}


      {/* ===================================================== */}
      {/* ACTUALITÉS                                             */}
      {/* ===================================================== */}

      {(posts.length > 0 || newsMedia.length > 0) && (
        <section className="bg-[#F8F5ED]">
          <div className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">

            <div className="max-w-3xl">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B88A2C]">
                La vie de la ferme
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-[0.98] sm:text-6xl">
                Nos actualités.
              </h2>

            </div>

            {newsMedia.length > 0 && (
              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {newsMedia.map((media) => (
                  <div
                    key={media.id}
                    className="aspect-[4/3] overflow-hidden bg-[#D9E0D6]"
                  >
                    <MediaVisual media={media} />
                  </div>
                ))}
              </div>
            )}

            {posts.length > 0 && (
              <div className="mt-8 grid gap-5 md:grid-cols-3">

                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="border border-black/10 bg-white p-7"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B88A2C]">
                      Actualité
                    </p>

                    <h3 className="mt-4 font-serif text-2xl leading-tight">
                      {post.title}
                    </h3>

                    {post.body && (
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/55">
                        {post.body}
                      </p>
                    )}

                    <div className="mt-7 h-px w-10 bg-[#D3A84C]" />
                  </article>
                ))}

              </div>
            )}

          </div>
        </section>
      )}


      {/* ===================================================== */}
      {/* FINAL CTA                                              */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">

          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

            <div className="max-w-4xl">

              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D3A84C]">
                AgroFarms237
              </p>

              <h2 className="mt-5 font-serif text-5xl leading-[0.98] tracking-[-0.025em] sm:text-6xl lg:text-7xl">
                Une ferme qui se construit
                <span className="block text-white/45">
                  aujourd’hui pour demain.
                </span>
              </h2>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Découvrez nos productions actuelles, notre ferme et les
                différentes étapes de développement d’AgroFarms237.
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

              <Link
                href="/notre-elevage"
                className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-xs font-semibold uppercase tracking-[0.12em] text-[#18352B] transition hover:bg-[#D3A84C]"
              >
                Découvrir notre ferme
              </Link>

              <Link
                href="/produits"
                className="inline-flex min-h-12 items-center justify-center border border-white/25 px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
              >
                Découvrir nos produits
              </Link>

              <Link
                href="/partenaires"
                className="inline-flex min-h-12 items-center justify-center border border-white/15 px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white/80 transition hover:border-white hover:text-white"
              >
                Devenir partenaire
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
