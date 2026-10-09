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
      .select(
        "id,url,kind,site_location,position,created_at"
      )
      .eq("published", true)
      .in("site_location", [
        "apropos_hero",
        "histoire",
        "apropos_qui_sommes_nous",
        "apropos_pisciculture",
        "apropos_porcin",
        "apropos_aviculture",
        "apropos_vision",
        "apropos_etape_01",
        "apropos_etape_02",
        "apropos_etape_03",
        "apropos_etape_04",
        "apropos_vie_ferme",
        "apropos_actualites",
        "equipe",
      ])
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erreur récupération médias À propos :", error);
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

function getPhoto(
  media: SiteMedia[],
  location: string
): SiteMedia | undefined {
  return media.find(
    (item) =>
      item.site_location === location &&
      item.kind === "photo"
  );
}

function getMedia(
  media: SiteMedia[],
  location: string
): SiteMedia[] {
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
        role="img"
        aria-label={`${alt} — photographie à ajouter`}
        className={`relative flex h-full w-full items-end overflow-hidden bg-[#E8EDE5] ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(213,166,42,0.18),transparent_36%),linear-gradient(135deg,#E8EDE5_0%,#D6E0D5_48%,#B9CDBF_100%)]" />
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
            <path d="M0 230 C100 190 170 245 270 205 S450 175 600 210 V300 H0Z" fill="#18352B" opacity=".22" />
            <path d="M0 260 C120 220 200 280 340 230 S480 220 600 245 V300 H0Z" fill="#18352B" opacity=".18" />
            <path d="M60 0 V300 M120 0 V300 M180 0 V300 M240 0 V300 M300 0 V300 M360 0 V300 M420 0 V300 M480 0 V300 M540 0 V300" stroke="#18352B" strokeWidth=".5" opacity=".12" />
          </svg>
        </div>
        <div className="relative m-4 border-l-2 border-[#D5A62A] pl-4 sm:m-6">
          <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#A67D1A] sm:text-[10px]">
            AgroFarms237 · Carnet de ferme
          </span>
          <span className="mt-2 block max-w-[22rem] font-serif text-xl leading-tight text-[#18352B]/75 sm:text-2xl">
            La prochaine image de notre histoire.
          </span>
          <span className="mt-2 block text-[10px] uppercase tracking-[0.12em] text-[#18352B]/50 sm:text-[11px]">
            Photographie à ajouter
          </span>
        </div>
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <video
        src={media.url}
        controls
        playsInline
        className={`h-full w-full object-cover ${className}`}
      />
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

function MediaCard({
  media,
  alt = "AgroFarms237",
}: {
  media: SiteMedia;
  alt?: string;
}) {
  return (
    <article className="group overflow-hidden border border-black/10 bg-white">
      <div className="aspect-[16/10] overflow-hidden bg-[#F3EFE5]">
        <MediaImage
          media={media}
          alt={alt}
          className="transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
    </article>
  );
}

const activities = [
  {
    number: "01",
    title: "Pisciculture",
    location: "apropos_pisciculture",
    description:
      "La pisciculture constitue l’une des premières bases du développement d’AgroFarms237. À travers cette activité, nous travaillons autour de la production de poissons et de la construction progressive d’un savoir-faire adapté à notre réalité. Mais la pisciculture représente pour nous plus qu’une production : elle constitue l’un des points de départ d’un projet agricole appelé à évoluer vers plusieurs filières complémentaires.",
  },
  {
    number: "02",
    title: "Élevage porcin",
    location: "apropos_porcin",
    description:
      "L’élevage porcin s’inscrit dans notre volonté de diversifier progressivement la ferme. Cette filière nous permet de développer une nouvelle activité d’élevage tout en renforçant notre vision d’une exploitation capable de réunir plusieurs productions au sein d’un même projet. Comme pour chacune de nos activités, nous avançons progressivement, avec l’objectif de construire des bases solides avant de passer à l’étape suivante.",
  },
  {
    number: "03",
    title: "Aviculture",
    location: "apropos_aviculture",
    description:
      "L’aviculture complète aujourd’hui notre vision d’une ferme diversifiée. Poulets de chair, poules pondeuses et développement progressif des capacités de production participent à cette volonté de répondre à différents besoins tout en construisant une activité agricole cohérente. Notre ambition est de faire évoluer cette filière progressivement, en développant à la fois la production et les possibilités de valorisation.",
  },
];

const stages = [
  {
    number: "01",
    eyebrow: "PREMIÈRES PRODUCTIONS",
    title: "Les premières productions",
    location: "apropos_etape_01",
    text:
      "Toute aventure agricole commence par une première production. Nos premières activités nous permettent de confronter nos idées à la réalité du terrain, de comprendre les exigences de chaque production et de poser les premières bases de la ferme. C’est le début d’une construction qui se fait progressivement, avec chaque expérience comme source d’apprentissage.",
  },
  {
    number: "02",
    eyebrow: "STRUCTURATION",
    title: "La structuration",
    location: "apropos_etape_02",
    text:
      "Produire ne suffit pas. Il faut pouvoir organiser, suivre, améliorer et répéter. Nous travaillons donc progressivement à structurer les infrastructures, les méthodes de travail et l’organisation nécessaires pour accompagner le développement de la ferme. L’objectif est simple : construire des bases suffisamment solides pour pouvoir grandir avec cohérence.",
  },
  {
    number: "03",
    eyebrow: "DIVERSIFICATION",
    title: "La diversification",
    location: "apropos_etape_03",
    text:
      "La diversification répond à une volonté : construire une exploitation agricole plus complète. Pisciculture, élevage porcin et aviculture apportent chacun leur rôle au projet. Leur développement progressif permet à AgroFarms237 de construire un modèle agricole plus diversifié tout en conservant une direction commune. Nous ne cherchons pas à multiplier les activités pour multiplier les activités. Nous cherchons à construire un ensemble cohérent.",
  },
  {
    number: "04",
    eyebrow: "VALORISATION",
    title: "La valorisation",
    location: "apropos_etape_04",
    text:
      "Produire est une première étape. Savoir mieux valoriser ce que l’on produit en est une autre. À mesure que la ferme grandit, notre ambition est de développer davantage la transformation, le conditionnement, la présentation et la distribution de nos productions. L’objectif est de rapprocher davantage le travail réalisé à la ferme de la valeur réellement proposée au client.",
  },
];

export default async function LaVieDeLaFermePage() {
  const [team, posts, siteMedia] = await Promise.all([
    getTeamMembers(),
    getNewsPosts(),
    getSiteMedia(),
  ]);

  const heroMedia = getPhoto(
    siteMedia,
    "apropos_hero"
  );

  const storyMedia = getPhoto(
    siteMedia,
    "histoire"
  );

  const whoWeAreMedia = getPhoto(
    siteMedia,
    "apropos_qui_sommes_nous"
  );

  const visionMedia = getPhoto(
    siteMedia,
    "apropos_vision"
  );

  const farmLifeMedia = getMedia(
    siteMedia,
    "apropos_vie_ferme"
  );

  const newsMedia = getMedia(
    siteMedia,
    "apropos_actualites"
  );

  const teamMedia = getMedia(
    siteMedia,
    "equipe"
  );

  return (
    <main className="bg-white text-[#18352B]">

      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative min-h-[700px] overflow-hidden bg-[#18352B] text-white sm:min-h-[760px] lg:min-h-[850px]">

        {heroMedia ? (
          <>
            <img
              src={heroMedia.url}
              alt="AgroFarms237 — notre ferme"
              className="absolute inset-0 h-full w-full scale-[1.03] object-cover"
            />

            {/* Image pleine largeur + profondeur */}
            <div className="absolute inset-0 bg-[#071D18]/35" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#071D18]/90 via-[#071D18]/50 to-[#071D18]/10" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/80 via-transparent to-[#071D18]/15" />

            {/* Léger voile pour donner l'effet profondeur */}
            <div className="absolute inset-0 backdrop-blur-[1px]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#315F50_0%,#18352B_50%,#081B16_100%)]" />
        )}

        <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-end px-5 pb-14 pt-32 sm:min-h-[760px] sm:px-8 sm:pb-20 lg:min-h-[850px] lg:px-8 lg:pb-28">

          <div className="max-w-5xl">

            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-10 bg-[#D5A62A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D5A62A] sm:text-xs sm:tracking-[0.3em]">
                À propos d’AgroFarms237
              </p>
            </div>

            <h1 className="max-w-5xl font-serif text-[2.8rem] leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-[86px]">
              La qualité commence
              <span className="mt-1 block text-white/65 sm:mt-2">bien avant la récolte.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:mt-8 sm:text-lg sm:leading-8">
              Derrière chaque production, il y a des gestes, de la patience et une histoire qui se construit jour après jour. Bienvenue dans notre univers : une ferme camerounaise qui grandit progressivement autour de la pisciculture, de l’élevage porcin et de l’aviculture.
            </p>
            <a href="#la-vie-de-la-ferme" className="mt-8 inline-flex min-h-12 items-center gap-4 border border-white/30 px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:border-[#D5A62A] hover:bg-[#D5A62A] hover:text-[#18352B] sm:px-6 sm:text-xs">
              Entrer dans notre univers
              <span aria-hidden="true" className="text-lg">↓</span>
            </a>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* CARTES SOUS HERO                                       */}
      {/* ===================================================== */}

      <section className="relative z-10 -mt-10 px-5 lg:-mt-16">

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
            const image = getPhoto(
              siteMedia,
              item.location
            );

            return (
              <article
                key={item.title}
                className="group relative min-h-[245px] overflow-hidden border-b border-black/10 last:border-b-0 md:min-h-[260px] md:border-r md:last:border-r-0 lg:min-h-[285px] lg:border-b-0"
              >

                <div className="absolute inset-0">

                  <MediaImage
                    media={image}
                    alt={`AgroFarms237 — ${item.title}`}
                    className="transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/90 via-[#071D18]/35 to-transparent" />

                </div>

                <div className="relative flex min-h-[245px] flex-col justify-end p-5 text-white sm:min-h-[260px] sm:p-7 lg:min-h-[285px]">

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D5A62A]">
                    0{index + 1}
                  </span>

                  <h2 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">
                    {item.title}
                  </h2>
                  <span className="mt-4 h-px w-9 bg-[#D5A62A] transition-all duration-500 group-hover:w-16" />

                </div>

              </article>
            );
          })}

        </div>
      </section>


      {/* ===================================================== */}
      {/* QUI SOMMES-NOUS                                       */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-36">

          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
                Qui sommes-nous ?
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Une ferme qui se construit.
                <span className="block text-[#A67D1A]">
                  Une vision qui grandit.
                </span>
              </h2>

            </div>

            <div className="max-w-3xl text-base leading-8 text-black/65 sm:text-lg">

              <p>
                AgroFarms237, c’est avant tout une volonté : construire quelque chose de durable dans l’agriculture camerounaise. Nous avons choisi de commencer progressivement, en développant nos premières productions et en apprenant à chaque étape ce qu’il faut pour faire grandir une véritable exploitation agricole.
              </p>

              <p className="mt-6">
                Aujourd’hui, notre projet s’articule autour de plusieurs filières : la pisciculture, l’élevage porcin et l’aviculture. Elles sont différentes dans leur fonctionnement, mais elles répondent à une même ambition : construire une ferme capable de produire localement, de valoriser ses productions et de créer de la valeur autour du travail agricole.
              </p>

              <p className="mt-6">
                Pour nous, une ferme ne se résume pas à ce qui sort de ses portes. Elle repose aussi sur les infrastructures, les méthodes, les personnes, l’organisation, la qualité du travail et la capacité à progresser dans le temps. C’est cette construction que nous voulons partager avec vous.
              </p>

              <p className="mt-6">
                AgroFarms237 avance donc avec une vision de long terme : commencer avec ce que nous avons, consolider ce qui fonctionne, développer progressivement de nouvelles capacités et faire grandir la ferme sans perdre ce qui fait son identité.
              </p>

            </div>

          </div>


          {/* PHOTO QUI SOMMES-NOUS */}
          <div className="mt-20 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

            <div className="relative min-h-[450px] overflow-hidden bg-[#E8EDE5]">

              <MediaImage
                media={whoWeAreMedia}
                alt="AgroFarms237 — Qui sommes-nous ?"
              />

              {whoWeAreMedia && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071D18]/80 to-transparent p-8">

                  <p className="max-w-xl font-serif text-2xl leading-tight text-white sm:text-3xl">
                    Des productions locales.
                    Un projet construit avec le temps.
                  </p>

                </div>
              )}

            </div>


            {/* NOTRE DÉMARCHE : FOND VERT CONSERVÉ */}
            <div className="flex min-h-[450px] flex-col justify-between bg-[#18352B] p-9 text-white sm:p-12">

              <div>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D5A62A]">
                  Notre démarche
                </span>

                <h3 className="mt-7 font-serif text-3xl leading-tight sm:text-4xl">
                  Commencer. Apprendre.
                  <br />
                  Structurer. Grandir.
                </h3>

              </div>

              <p className="max-w-md text-sm leading-7 text-white/65">
                Nous ne cherchons pas à construire une ferme en un jour. Nous croyons davantage à une croissance progressive : commencer par maîtriser nos premières productions, comprendre les réalités du terrain, renforcer nos infrastructures, améliorer nos méthodes et réinvestir dans les étapes suivantes. Chaque nouvelle production doit trouver sa place dans un ensemble cohérent.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* TRAJECTOIRE                                             */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-36">

          <div className="max-w-4xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
              Notre trajectoire
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Une ferme ne se construit
              pas en une seule étape.
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-black/60 sm:text-lg">
              Notre développement suit une logique progressive. Chaque étape prépare la suivante et nous permet de construire AgroFarms237 sur des bases de plus en plus solides.
            </p>

          </div>


          <div className="mt-20 divide-y divide-black/10 border-y border-black/10">

            {stages.map((stage) => {
              const image = getPhoto(
                siteMedia,
                stage.location
              );

              return (
                <article
                  key={stage.number}
                  className="grid gap-8 py-10 lg:grid-cols-[90px_0.75fr_1fr] lg:items-center lg:gap-12"
                >

                  <span className="font-serif text-5xl text-[#A67D1A]/35">
                    {stage.number}
                  </span>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A67D1A]">
                      {stage.eyebrow}
                    </p>

                    <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                      {stage.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-sm leading-7 text-black/60">
                      {stage.text}
                    </p>

                  </div>

                  <div className="h-[220px] overflow-hidden bg-[#DCE5DC]">

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
      {/* NOS ACTIVITÉS                                          */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-36">

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
              AgroFarms237 se construit autour de plusieurs productions qui répondent à une même volonté : participer à une agriculture camerounaise capable de produire localement et de créer davantage de valeur autour de ses productions.
            </p>

          </div>


          <div className="mt-16 grid gap-6 lg:grid-cols-3">

            {activities.map((activity) => {

              const image = getPhoto(
                siteMedia,
                activity.location
              );

              return (
                <article
                  key={activity.title}
                  className="group overflow-hidden border border-black/10 bg-white"
                >

                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E8EDE5]">

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
      {/* NOTRE VISION                                           */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-36">

          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D5A62A]">
                Notre vision
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Construire plus qu’une ferme.
                <span className="block text-white/60">
                  Construire une activité agricole qui peut durer.
                </span>
              </h2>

              <p className="mt-8 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                Nous voulons qu’AgroFarms237 devienne progressivement une exploitation agricole camerounaise diversifiée, structurée autour de plusieurs filières et capable de créer de la valeur à différents niveaux de la chaîne. Notre vision ne s’arrête donc pas à la production. Nous voulons pouvoir mieux produire, mieux transformer, mieux présenter et mieux distribuer nos produits, tout en développant progressivement les infrastructures et les compétences nécessaires à cette évolution. À plus long terme, l’ambition est de construire une ferme qui puisse grandir avec son environnement, créer des opportunités autour d’elle et montrer qu’un projet agricole peut être pensé comme une véritable entreprise : avec une vision, des méthodes, des exigences et une volonté constante de progresser. Nous sommes encore en construction. Et c’est précisément ce qui rend notre histoire intéressante : vous pouvez la découvrir au fur et à mesure qu’elle s’écrit.
              </p>

            </div>


            <div className="relative min-h-[480px] overflow-hidden bg-[#24463D]">

              <MediaImage
                media={visionMedia}
                alt="AgroFarms237 — notre vision"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/80 via-transparent to-transparent" />

              {visionMedia && (
                <div className="absolute bottom-0 left-0 p-8 sm:p-10">

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D5A62A]">
                    AgroFarms237
                  </span>

                  <p className="mt-4 font-serif text-2xl text-white sm:text-3xl">
                    La qualité commence à la ferme.
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* VALEURS                                                */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
              Nos valeurs
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Ce qui guide notre manière de construire.
            </h2>

          </div>


          <div className="mt-16 grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                title: "Qualité",
                text:
                  "La qualité commence bien avant que le produit arrive entre les mains du client. Elle se construit dans le choix des pratiques, l’attention portée à la production et le soin apporté à chaque étape. Nous voulons que cette exigence devienne une partie naturelle de notre manière de travailler.",
              },
              {
                title: "Rigueur",
                text:
                  "L’agriculture demande de la constance. Suivre, organiser, anticiper, corriger et recommencer font partie du travail quotidien. Nous voulons construire AgroFarms237 avec cette exigence : ne pas simplement avancer vite, mais avancer sur des bases solides.",
              },
              {
                title: "Développement local",
                text:
                  "Produire localement a du sens pour nous. C’est participer à une économie où davantage de valeur peut être créée autour de la production, du travail et des savoir-faire présents sur notre territoire. AgroFarms237 veut contribuer, à son échelle, à cette dynamique.",
              },
              {
                title: "Durabilité",
                text:
                  "Construire pour aujourd’hui ne suffit pas. Nous voulons développer une exploitation capable d’évoluer dans le temps, de s’adapter, de renforcer ses activités et de transmettre une vision de long terme. Notre ambition est donc de construire progressivement, plutôt que de chercher une croissance sans fondations.",
              },
            ].map((value, index) => (
              <article
                key={value.title}
                className="bg-white p-8 sm:p-10"
              >

                <span className="font-serif text-4xl text-black/10">
                  0{index + 1}
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
      {/* LA VIE DE LA FERME                                    */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">

          <div className="max-w-3xl">

            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-[#D5A62A]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A67D1A] sm:text-xs sm:tracking-[0.25em]">
                Le journal de la ferme
              </p>
            </div>

            <h2 className="mt-5 max-w-4xl font-serif text-3xl leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              Les coulisses d’une histoire qui grandit.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-black/60 sm:mt-6 sm:text-lg sm:leading-8">
              Les bassins, les animaux, les installations, les journées de travail et les petites victoires : cet espace est destiné à accueillir les images qui racontent notre quotidien. Certaines histoires sont déjà visibles, d’autres viendront au fil de la vie de la ferme.
            </p>

          </div>


          {farmLifeMedia.length === 0 ? (
            <div className="mt-14 border border-dashed border-black/15 bg-[#F3EFE5] p-12 text-center">

              <p className="text-sm leading-7 text-black/55">
                Les premières images de la vie de la ferme
                seront bientôt présentées ici.
              </p>

            </div>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {farmLifeMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  alt="La vie de la ferme AgroFarms237"
                />
              ))}

            </div>
          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOTRE ÉQUIPE                                          */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
              Notre équipe
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Derrière une ferme, il y a toujours des femmes et des hommes.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60 sm:text-lg">
              AgroFarms237 ne se construit pas uniquement avec des bâtiments, des équipements ou des productions. Le projet avance grâce aux personnes qui y consacrent leur temps, leur énergie, leurs compétences et leur volonté de faire progresser la ferme. Cette équipe évoluera avec le projet. Nous voulons prendre le temps de présenter celles et ceux qui participent réellement à cette aventure et qui contribuent, chacun à leur manière, à faire grandir AgroFarms237.
            </p>

          </div>


          {team.length > 0 ? (

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {team.map((member) => {

                const galleryPhoto = teamMedia[0];

                return (
                  <article
                    key={member.id}
                    className="group overflow-hidden border border-black/10 bg-white"
                  >

                    <div className="aspect-[4/3] overflow-hidden bg-[#E8EDE5]">

                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={
                            member.name ||
                            "Membre de l'équipe AgroFarms237"
                          }
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : galleryPhoto ? (
                        <img
                          src={galleryPhoto.url}
                          alt="Équipe AgroFarms237"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">

                          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
                            Photo à venir
                          </span>

                        </div>
                      )}

                    </div>


                    <div className="p-8">

                      <h3 className="font-serif text-2xl">
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
                );

              })}

            </div>

          ) : teamMedia.length > 0 ? (

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {teamMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  alt="Équipe AgroFarms237"
                />
              ))}

            </div>

          ) : (

            <div className="mt-14 border border-dashed border-black/15 bg-white p-12 text-center">

              <p className="text-sm leading-7 text-black/55">
                Les membres de notre équipe seront bientôt
                présentés ici.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* ACTUALITÉS                                             */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A67D1A]">
              Actualités
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              L’histoire continue de s’écrire.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60 sm:text-lg">
              AgroFarms237 est un projet en mouvement. Les productions évoluent, les activités se développent, de nouvelles étapes se préparent et chaque avancée participe à la construction de la ferme. À travers nos actualités, nous partageons cette évolution avec vous : les nouveautés, les étapes importantes, les projets et les moments qui marquent la vie d’AgroFarms237. Suivez notre évolution et découvrez la ferme au fur et à mesure qu’elle grandit.
            </p>

          </div>


          {newsMedia.length > 0 && (

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {newsMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  alt="Actualité AgroFarms237"
                />
              ))}

            </div>

          )}


          {posts.length > 0 && (

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-black/10 bg-[#F3EFE5]"
                >

                  <div className="p-8">

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


          {newsMedia.length === 0 && posts.length === 0 && (

            <div className="mt-14 border border-dashed border-black/15 bg-[#F3EFE5] p-12 text-center">

              <p className="text-sm leading-7 text-black/55">
                Les premières actualités de la ferme
                seront bientôt publiées ici.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* CTA FINAL                                              */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">

          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#D5A62A]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D5A62A] sm:text-xs">
                  AgroFarms237
                </p>
              </div>

              <h2 className="mt-5 font-serif text-3xl leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
                Une ferme. Plusieurs productions.
                <span className="mt-2 block text-white/60">Une histoire que vous pouvez suivre.</span>
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/60">
                AgroFarms237 se construit progressivement, avec une ambition simple : faire grandir une véritable activité agricole camerounaise autour de productions locales, d’un travail exigeant et d’une vision de long terme. Vous venez de découvrir notre histoire. La prochaine étape peut être de découvrir ce que nous produisons, de suivre notre évolution ou de construire quelque chose avec nous.
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
