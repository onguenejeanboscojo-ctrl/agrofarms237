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
    console.error(
      "Erreur inattendue récupération équipe :",
      error
    );

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
      console.error(
        "Erreur récupération actualités :",
        error
      );

      return [];
    }

    return (data || []) as NewsPost[];
  } catch (error) {
    console.error(
      "Erreur inattendue récupération actualités :",
      error
    );

    return [];
  }
}

async function getSiteMedia(): Promise<SiteMedia[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select(
        "id,url,kind,site_location,position,created_at"
      )
      .eq("published", true)
      .in("site_location", [
        "apropos_hero",
        "histoire",
        "apropos_pisciculture",
        "apropos_porcin",
        "apropos_aviculture",
        "apropos_vision",
        "apropos_etape_01",
        "apropos_etape_02",
        "apropos_etape_03",
        "apropos_etape_04",
        "equipe",
        "vie_ferme",
        "actualites",
        "elevage_silure",
        "elevage_porcs",
        "elevage_chair",
      ])
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Erreur récupération médias À propos :",
        error
      );

      return [];
    }

    return (data || []) as SiteMedia[];
  } catch (error) {
    console.error(
      "Erreur inattendue récupération médias À propos :",
      error
    );

    return [];
  }
}

function getMediaByLocation(
  media: SiteMedia[],
  location: string
) {
  return media.find(
    (item) =>
      item.site_location === location &&
      item.kind === "photo"
  );
}

function getAllMediaByLocation(
  media: SiteMedia[],
  location: string
) {
  return media.filter(
    (item) => item.site_location === location
  );
}

function MediaImage({
  media,
  alt,
  className = "",
}: {
  media?: SiteMedia;
  alt: string;
  className?: string;
}) {
  if (!media) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-[#E8EDE5] ${className}`}
      >
        <div className="px-6 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#18352B]/40">
            AgroFarms237
          </span>

          <p className="mt-2 font-serif text-lg text-[#18352B]/35">
            Image à venir
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={media.url}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function SiteMediaCard({
  media,
}: {
  media: SiteMedia;
}) {
  return (
    <article className="group overflow-hidden border border-black/10 bg-white">
      <div className="aspect-[16/10] overflow-hidden bg-[#F3EFE5]">
        {media.kind === "video" ? (
          <video
            src={media.url}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={media.url}
            alt="AgroFarms237"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        )}
      </div>
    </article>
  );
}

const activities = [
  {
    number: "01",
    title: "Pisciculture",
    description:
      "Notre activité piscicole constitue l’une des premières filières structurées d’AgroFarms237, avec le silure comme production développée et commercialisée.",
    location: "apropos_pisciculture",
    fallbackLocation: "elevage_silure",
  },
  {
    number: "02",
    title: "Élevage porcin",
    description:
      "Une filière engagée dans le développement de la ferme et appelée à contribuer progressivement à sa diversification.",
    location: "apropos_porcin",
    fallbackLocation: "elevage_porcs",
  },
  {
    number: "03",
    title: "Aviculture",
    description:
      "Une filière autour de l’aviculture, notamment avec le développement des poulets de chair et des poules pondeuses.",
    location: "apropos_aviculture",
    fallbackLocation: "elevage_chair",
  },
];

const stages = [
  {
    number: "01",
    eyebrow: "PRODUCTIONS",
    title: "Les premières productions",
    text:
      "Pisciculture, aviculture et élevage porcin constituent les premières filières engagées dans le développement d’AgroFarms237.",
    location: "apropos_etape_01",
  },
  {
    number: "02",
    eyebrow: "INFRASTRUCTURES",
    title: "La structuration",
    text:
      "Développer progressivement les infrastructures, l’organisation de la production et les outils nécessaires à la croissance de la ferme.",
    location: "apropos_etape_02",
  },
  {
    number: "03",
    eyebrow: "DIVERSIFICATION",
    title: "La diversification",
    text:
      "Renforcer les différentes filières et développer progressivement une exploitation agricole plus diversifiée.",
    location: "apropos_etape_03",
  },
  {
    number: "04",
    eyebrow: "TRANSFORMATION & VALORISATION",
    title: "La valorisation",
    text:
      "Développer de nouvelles possibilités de transformation, de conditionnement et de distribution pour mieux valoriser les productions.",
    location: "apropos_etape_04",
  },
];

export default async function LaVieDeLaFermePage() {
  const [team, posts, siteMedia] = await Promise.all([
    getTeamMembers(),
    getNewsPosts(),
    getSiteMedia(),
  ]);

  const heroMedia = getMediaByLocation(
    siteMedia,
    "apropos_hero"
  );

  const historyMedia =
    getMediaByLocation(siteMedia, "histoire");

  const visionMedia = getMediaByLocation(
    siteMedia,
    "apropos_vision"
  );

  const farmLifeMedia = getAllMediaByLocation(
    siteMedia,
    "vie_ferme"
  );

  const newsMedia = getAllMediaByLocation(
    siteMedia,
    "actualites"
  );

  return (
    <main className="bg-white text-[#18352B]">

      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative min-h-[720px] overflow-hidden bg-[#18352B] text-white lg:min-h-[780px]">

        {heroMedia ? (
          <>
            <img
              src={heroMedia.url}
              alt="AgroFarms237 — ferme et activités agricoles"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#0A241C]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071D18]/90 via-[#0B2B22]/65 to-[#0B2B22]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/70 via-transparent to-[#071D18]/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,#2D695B_0%,#18352B_48%,#0B211C_100%)]">
            <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full border border-white/10" />
            <div className="absolute right-20 top-24 h-[300px] w-[300px] rounded-full border border-gold/20" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-end px-6 pb-20 pt-36 lg:min-h-[780px] lg:px-8 lg:pb-28">

          <div className="max-w-5xl">

            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#D5A62A] sm:text-sm">
              À propos d’AgroFarms237
            </p>

            <h1 className="font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-[84px]">
              Construire une agriculture
              <span className="block text-white/75">
                locale, structurée et durable.
              </span>
            </h1>

            <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-end">

              <p className="max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                AgroFarms237 développe une exploitation
                agricole camerounaise autour de plusieurs
                filières, avec une ambition simple :
                produire localement, structurer nos activités
                et créer de la valeur durablement.
              </p>

              <Link
                href="#histoire"
                className="inline-flex min-h-12 shrink-0 items-center justify-center border border-white/40 px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[#D5A62A] hover:bg-[#D5A62A] hover:text-[#18352B]"
              >
                Découvrir notre histoire
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* 4 PILIERS                                               */}
      {/* ===================================================== */}

      <section className="relative z-10 -mt-8 px-5 lg:-mt-14">
        <div className="mx-auto grid max-w-7xl overflow-hidden border border-black/10 bg-white shadow-xl shadow-black/10 md:grid-cols-2 lg:grid-cols-4">

          {[
            {
              title: "Pisciculture",
              location: "apropos_pisciculture",
            },
            {
              title: "Élevage porcin",
              location: "apropos_porcin",
            },
            {
              title: "Aviculture",
              location: "apropos_aviculture",
            },
            {
              title: "Une vision",
              location: "apropos_vision",
            },
          ].map((item, index) => {
            const image = getMediaByLocation(
              siteMedia,
              item.location
            );

            return (
              <div
                key={item.title}
                className="group relative min-h-[230px] overflow-hidden border-b border-black/10 last:border-b-0 md:border-r md:last:border-r-0 lg:border-b-0"
              >

                <div className="absolute inset-0">
                  <MediaImage
                    media={image}
                    alt={`AgroFarms237 — ${item.title}`}
                    className="transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/85 via-[#071D18]/30 to-transparent" />
                </div>

                <div className="relative flex h-full min-h-[230px] flex-col justify-end p-7 text-white">

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D5A62A]">
                    0{index + 1}
                  </span>

                  <h2 className="mt-2 font-serif text-2xl">
                    {item.title}
                  </h2>

                </div>

              </div>
            );
          })}

        </div>
      </section>


      {/* ===================================================== */}
      {/* QUI SOMMES-NOUS                                        */}
      {/* ===================================================== */}

      <section
        id="histoire"
        className="bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">

          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
                Qui sommes-nous ?
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Une ferme camerounaise
                <span className="block text-[#A67D1A]">
                  qui grandit filière après filière.
                </span>
              </h2>

            </div>

            <div>

              <p className="text-base leading-8 text-black/60 sm:text-lg">
                AgroFarms237 est une entreprise agricole
                camerounaise qui développe progressivement
                ses activités autour de la pisciculture,
                de l’élevage porcin et de l’aviculture.
              </p>

              <p className="mt-6 text-base leading-8 text-black/60 sm:text-lg">
                Notre développement repose sur une volonté
                claire : construire une exploitation capable
                de réunir plusieurs productions complémentaires,
                tout en avançant progressivement dans la
                structuration, la valorisation et la distribution.
              </p>

              <p className="mt-6 text-base leading-8 text-black/60 sm:text-lg">
                La ferme évolue étape par étape. Chaque filière
                apporte sa contribution à une vision plus large :
                développer une agriculture locale structurée,
                durable et capable de créer de la valeur dans
                le temps.
              </p>

            </div>

          </div>


          <div className="mt-20 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

            <div className="relative min-h-[440px] overflow-hidden bg-[#E8EDE5]">

              <MediaImage
                media={historyMedia}
                alt="AgroFarms237 — histoire et développement de la ferme"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071D18]/80 to-transparent p-8">
                <p className="max-w-lg font-serif text-2xl text-white sm:text-3xl">
                  Des productions locales,
                  au service d’une agriculture
                  qui se construit dans le temps.
                </p>
              </div>

            </div>

            <div className="flex flex-col justify-between bg-[#18352B] p-9 text-white sm:p-12">

              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D5A62A]">
                  Notre démarche
                </span>

                <h3 className="mt-6 font-serif text-3xl leading-tight sm:text-4xl">
                  Produire localement.
                  Progresser durablement.
                </h3>
              </div>

              <p className="mt-12 text-sm leading-7 text-white/65">
                Nous construisons progressivement les
                infrastructures, les méthodes et les filières
                nécessaires au développement de la ferme.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* CROISSANCE                                               */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">

          <div className="max-w-4xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D5A62A]">
              Notre trajectoire
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Une croissance pensée
              étape par étape.
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Chaque étape de notre développement contribue
              à construire une exploitation agricole mieux
              structurée, mieux organisée et capable d’évoluer
              dans le temps.
            </p>

          </div>


          <div className="mt-20 divide-y divide-white/10 border-y border-white/10">

            {stages.map((stage) => {
              const image = getMediaByLocation(
                siteMedia,
                stage.location
              );

              return (
                <article
                  key={stage.number}
                  className="grid gap-8 py-10 lg:grid-cols-[100px_0.75fr_1fr] lg:items-center lg:gap-12"
                >

                  <span className="font-serif text-5xl text-[#D5A62A]">
                    {stage.number}
                  </span>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D5A62A]">
                      {stage.eyebrow}
                    </p>

                    <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                      {stage.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-sm leading-7 text-white/60">
                      {stage.text}
                    </p>

                  </div>

                  <div className="h-[190px] overflow-hidden bg-[#24463D] lg:h-[220px]">
                    <MediaImage
                      media={image}
                      alt={`AgroFarms237 — ${stage.title}`}
                      className="transition duration-700 hover:scale-105"
                    />
                  </div>

                </article>
              );
            })}

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* NOS ACTIVITÉS                                           */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
                Nos activités
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Trois filières,
                <span className="block text-[#A67D1A]">
                  une même ambition.
                </span>
              </h2>

            </div>

            <p className="max-w-2xl text-base leading-8 text-black/60 sm:text-lg">
              Des activités complémentaires pour construire
              progressivement une ferme agricole capable de
              répondre aux besoins locaux et de créer de
              nouvelles opportunités.
            </p>

          </div>


          <div className="mt-16 grid gap-6 lg:grid-cols-3">

            {activities.map((activity) => {
              const primaryImage = getMediaByLocation(
                siteMedia,
                activity.location
              );

              const fallbackImage =
                getMediaByLocation(
                  siteMedia,
                  activity.fallbackLocation
                );

              const image =
                primaryImage || fallbackImage;

              return (
                <article
                  key={activity.title}
                  className="group overflow-hidden bg-white"
                >

                  <div className="relative aspect-[4/3] overflow-hidden bg-[#DCE5DC]">

                    <MediaImage
                      media={image}
                      alt={`AgroFarms237 — ${activity.title}`}
                      className="transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center bg-[#18352B] text-xs font-bold text-[#D5A62A]">
                      {activity.number}
                    </div>

                  </div>

                  <div className="p-8 sm:p-9">

                    <h3 className="font-serif text-3xl">
                      {activity.title}
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-black/60">
                      {activity.description}
                    </p>

                    <div className="mt-7 h-px w-10 bg-[#D5A62A]" />

                  </div>

                </article>
              );
            })}

          </div>


          <div className="mt-10">
            <Link
              href="/notre-elevage"
              className="inline-flex min-h-12 items-center justify-center border border-[#18352B]/25 px-7 text-xs font-semibold uppercase tracking-[0.14em] text-[#18352B] transition hover:bg-[#18352B] hover:text-white"
            >
              Découvrir notre ferme
            </Link>
          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* NOTRE VISION                                            */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">

          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
                Notre vision
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Construire une ferme
                agricole camerounaise
                <span className="block text-[#A67D1A]">
                  diversifiée et durable.
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-base leading-8 text-black/60 sm:text-lg">
                Notre ambition est de développer
                progressivement plusieurs filières de
                production, d’améliorer leur valorisation
                et de construire une organisation capable
                de grandir avec la ferme.
              </p>

              <p className="mt-6 max-w-xl text-base leading-8 text-black/60 sm:text-lg">
                La vision ne se limite donc pas à une seule
                production. Elle repose sur la complémentarité
                entre nos activités et sur une progression
                maîtrisée dans le temps.
              </p>

            </div>


            <div className="relative min-h-[500px] overflow-hidden bg-[#18352B]">

              <MediaImage
                media={visionMedia}
                alt="AgroFarms237 — notre vision agricole"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 max-w-md p-8 sm:p-10">

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D5A62A]">
                  AgroFarms237
                </span>

                <p className="mt-4 font-serif text-2xl leading-tight text-white sm:text-3xl">
                  La qualité commence
                  à la ferme.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* NOS VALEURS                                              */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
              Nos valeurs
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Ce qui guide notre développement.
            </h2>

          </div>


          <div className="mt-16 grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                title: "Qualité",
                text:
                  "Porter une attention constante à la qualité de nos productions et à l’expérience proposée à nos clients.",
              },
              {
                number: "02",
                title: "Rigueur",
                text:
                  "Structurer progressivement nos méthodes et nos activités pour construire une exploitation solide.",
              },
              {
                number: "03",
                title: "Développement local",
                text:
                  "Participer au développement d’une agriculture camerounaise capable de créer de la valeur localement.",
              },
              {
                number: "04",
                title: "Durabilité",
                text:
                  "Construire progressivement un modèle agricole pensé pour durer et évoluer dans le temps.",
              },
            ].map((value) => (
              <article
                key={value.number}
                className="bg-white p-8 sm:p-10"
              >

                <span className="font-serif text-4xl text-black/10">
                  {value.number}
                </span>

                <h3 className="mt-10 font-serif text-2xl">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-black/60">
                  {value.text}
                </p>

                <div className="mt-8 h-px w-10 bg-[#D5A62A]" />

              </article>
            ))}

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* NOTRE ÉQUIPE                                             */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
              Notre équipe
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Les personnes derrière
              le développement de la ferme.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60">
              AgroFarms237 se construit avec des personnes
              engagées dans le développement quotidien de
              l’entreprise et de ses activités.
            </p>

          </div>


          {team.length === 0 ? (
            <div className="mt-14 border border-dashed border-black/15 bg-[#F3EFE5] p-12 text-center">
              <p className="text-sm text-black/55">
                Notre équipe sera bientôt présentée ici.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {team.map((member) => (
                <article
                  key={member.id}
                  className="group overflow-hidden border border-black/10 bg-white"
                >

                  <div className="aspect-[4/3] overflow-hidden bg-[#F3EFE5]">

                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={
                          member.name ||
                          "Membre de l'équipe AgroFarms237"
                        }
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                          Photo indisponible
                        </span>
                      </div>
                    )}

                  </div>


                  <div className="p-7 sm:p-8">

                    <h3 className="font-serif text-2xl leading-tight">
                      {member.name}
                    </h3>

                    {member.role && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A67D1A]">
                        {member.role}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-5 text-sm leading-7 text-black/60">
                        {member.bio}
                      </p>
                    )}

                    <div className="mt-7 h-px w-10 bg-[#D5A62A]" />

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>
      </section>


      {/* ===================================================== */}
      {/* LA VIE DE LA FERME                                      */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D5A62A]">
              La vie de la ferme
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Dans les coulisses
              d’AgroFarms237.
            </h2>

            <p className="mt-6 text-base leading-8 text-white/65">
              Découvrez les moments, les activités et les réalités
              qui accompagnent progressivement le développement
              de notre ferme.
            </p>

          </div>


          {farmLifeMedia.length === 0 ? (
            <div className="mt-14 border border-dashed border-white/15 bg-white/5 p-12 text-center">
              <p className="text-sm leading-7 text-white/50">
                Les premières images de la vie de la ferme
                seront bientôt présentées ici.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {farmLifeMedia.map((media) => (
                <SiteMediaCard
                  key={media.id}
                  media={media}
                />
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ===================================================== */}
      {/* ACTUALITÉS                                               */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
              La vie de la ferme
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Nos actualités.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60">
              Suivez les évolutions, les nouveautés et les
              moments importants de la vie d’AgroFarms237.
            </p>

          </div>


          {newsMedia.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsMedia.map((media) => (
                <SiteMediaCard
                  key={media.id}
                  media={media}
                />
              ))}
            </div>
          )}


          {posts.length === 0 ? (
            <div
              className={
                newsMedia.length > 0
                  ? "mt-8 border border-dashed border-black/15 bg-white p-12 text-center"
                  : "mt-14 border border-dashed border-black/15 bg-white p-12 text-center"
              }
            >
              <p className="mx-auto max-w-md text-sm leading-7 text-black/55">
                Les premières actualités de la ferme
                seront bientôt publiées sur cet espace.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-3">

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden border border-black/10 bg-white"
                >

                  <div className="flex aspect-[16/9] items-center justify-center bg-[#18352B]">
                    <span className="font-serif text-2xl text-white/20">
                      AgroFarms237
                    </span>
                  </div>

                  <div className="p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A67D1A]">
                      Actualité
                    </p>

                    <h3 className="mt-4 font-serif text-2xl leading-tight">
                      {post.title}
                    </h3>

                    {post.body && (
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/60">
                        {post.body}
                      </p>
                    )}

                    <div className="mt-7 h-px w-10 bg-[#D5A62A]" />

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>
      </section>


      {/* ===================================================== */}
      {/* CTA FINAL                                                */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

            <div className="max-w-4xl">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D5A62A]">
                AgroFarms237
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Une ferme.
                Plusieurs productions.
                <span className="block text-white/60">
                  Une vision commune.
                </span>
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">
                Découvrez notre ferme, nos productions et
                la manière dont AgroFarms237 construit
                progressivement son développement.
              </p>

            </div>


            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

              <Link
                href="/notre-elevage"
                className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-xs font-semibold uppercase tracking-[0.14em] text-[#18352B] transition hover:bg-[#D5A62A]"
              >
                Découvrir notre ferme
              </Link>

              <Link
                href="/produits"
                className="inline-flex min-h-12 items-center justify-center border border-white/25 px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white"
              >
                Découvrir nos produits
              </Link>

              <Link
                href="/partenaires"
                className="inline-flex min-h-12 items-center justify-center border border-white/15 px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-[#D5A62A] hover:text-white"
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
