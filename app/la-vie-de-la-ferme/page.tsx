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
      .select(
        "id,name,role,bio,photo_url,position,published"
      )
      .eq("published", true)
      .order("position", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur récupération équipe :",
        error
      );

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
      .select(
        "id,title,body,created_at,published"
      )
      .eq("published", true)
      .order("created_at", {
        ascending: false,
      });

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

/**
 * Tous les médias utilisés par la page À propos.
 *
 * On utilise maintenant les nouveaux emplacements créés
 * dans lib/mediaCategories.ts.
 */
async function getSiteMedia(): Promise<SiteMedia[]> {
  try {
    const locations = [
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
      "apropos_vie_ferme",
      "apropos_actualites",
      "equipe",
    ];

    const { data, error } = await supabaseAdmin()
      .from("media")
      .select(
        "id,url,kind,site_location,position,created_at"
      )
      .eq("published", true)
      .in("site_location", locations)
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

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
        className={`flex h-full min-h-[280px] items-center justify-center bg-[#EEF1E9] ${className}`}
      >
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#18352B]/40">
            AgroFarms237
          </p>

          <p className="mt-2 font-serif text-lg text-[#18352B]/45">
            Image à venir
          </p>
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
  alt,
}: {
  media: SiteMedia;
  alt: string;
}) {
  return (
    <article className="group overflow-hidden border border-black/10 bg-white">
      <div className="aspect-[16/10] overflow-hidden bg-[#EEF1E9]">
        <MediaImage
          media={media}
          alt={alt}
          className="transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
    </article>
  );
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default async function LaVieDeLaFermePage() {
  const [team, posts, siteMedia] = await Promise.all([
    getTeamMembers(),
    getNewsPosts(),
    getSiteMedia(),
  ]);

  const mediaFor = (location: string) =>
    siteMedia.filter(
      (media) => media.site_location === location
    );

  const firstMedia = (location: string) =>
    mediaFor(location)[0];

  const heroMedia = firstMedia("apropos_hero");
  const storyMedia = firstMedia("histoire");

  const piscicultureMedia = firstMedia(
    "apropos_pisciculture"
  );

  const porcinMedia = firstMedia(
    "apropos_porcin"
  );

  const avicultureMedia = firstMedia(
    "apropos_aviculture"
  );

  const visionMedia = firstMedia(
    "apropos_vision"
  );

  const step01Media = firstMedia(
    "apropos_etape_01"
  );

  const step02Media = firstMedia(
    "apropos_etape_02"
  );

  const step03Media = firstMedia(
    "apropos_etape_03"
  );

  const step04Media = firstMedia(
    "apropos_etape_04"
  );

  const farmLifeMedia = mediaFor(
    "apropos_vie_ferme"
  );

  const newsMedia = mediaFor(
    "apropos_actualites"
  );

  const teamMedia = mediaFor("equipe");

  return (
    <main className="bg-white text-ink">

      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#18352B] text-white">

        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full border border-white/10" />

          <div className="absolute -right-10 top-20 h-[320px] w-[320px] rounded-full border border-gold/20" />

          <div className="absolute bottom-[-200px] left-[-120px] h-[480px] w-[480px] rounded-full border border-white/5" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">

            <div className="max-w-3xl">

              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
                À propos d’AgroFarms237
              </p>

              <h1 className="font-serif text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
                Construire une
                <span className="block text-white/65">
                  agriculture camerounaise
                </span>
                <span className="block">
                  qui grandit filière
                </span>
                <span className="block text-gold">
                  après filière.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                AgroFarms237 est une entreprise agricole
                camerounaise qui développe progressivement
                ses activités autour de plusieurs filières :
                pisciculture, élevage porcin et aviculture.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">

                <Link
                  href="#qui-sommes-nous"
                  className="inline-flex min-h-12 items-center justify-center bg-gold px-7 text-sm font-semibold text-[#18352B] transition hover:bg-white"
                >
                  Découvrir notre histoire
                </Link>

                <Link
                  href="/notre-elevage"
                  className="inline-flex min-h-12 items-center justify-center border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
                >
                  Voir la ferme
                </Link>

              </div>

            </div>

            <div className="relative">

              <div className="absolute -inset-3 border border-gold/20" />

              <div className="relative aspect-[4/3] overflow-hidden border border-white/15 bg-[#102A22]">

                <MediaImage
                  media={heroMedia}
                  alt="AgroFarms237 — présentation de la ferme"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071D18]/70 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    AgroFarms237
                  </p>

                  <p className="mt-2 max-w-md font-serif text-2xl leading-tight text-white">
                    La qualité commence à la ferme.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* QUI SOMMES-NOUS ?                                     */}
      {/* ===================================================== */}

      <section
        id="qui-sommes-nous"
        className="bg-white"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Qui sommes-nous ?
              </p>

              <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
                Une ferme camerounaise
                qui grandit filière
                après filière.
              </h2>

              <div className="mt-8 h-px w-16 bg-gold" />

            </div>

            <div className="max-w-3xl text-base leading-8 text-black/65 sm:text-lg">

              <p>
                AgroFarms237 est une entreprise agricole
                camerounaise qui développe progressivement
                ses activités autour de la pisciculture,
                de l’élevage porcin et de l’aviculture.
              </p>

              <p className="mt-7">
                Notre développement repose sur une volonté
                claire : construire une exploitation capable
                de réunir plusieurs productions complémentaires,
                tout en avançant progressivement dans la
                structuration, la valorisation et la distribution.
              </p>

              <p className="mt-7">
                La pisciculture constitue l’une des premières
                activités structurées de la ferme. Aujourd’hui,
                le développement se poursuit également autour
                de l’élevage porcin et de l’aviculture.
              </p>

              <p className="mt-7">
                Cette diversification n’est pas pensée comme
                une accumulation d’activités. Chaque filière
                doit trouver sa place dans une organisation
                agricole cohérente, capable de grandir avec
                le temps et de répondre progressivement aux
                besoins du marché local.
              </p>

              <p className="mt-7">
                AgroFarms237 construit ainsi une ferme réelle,
                progressive et évolutive : produire, mieux
                structurer, développer les filières, valoriser
                les productions et rapprocher progressivement
                la ferme de ses clients.
              </p>

            </div>

          </div>


          <div className="mt-20 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

            <div className="relative min-h-[420px] overflow-hidden bg-[#EEF1E9]">

              <MediaImage
                media={storyMedia}
                alt="AgroFarms237 — notre histoire"
              />

            </div>


            <div className="flex flex-col justify-between bg-[#F3EFE5] p-8 sm:p-12">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-goldDeep">
                  Notre histoire
                </p>

                <h3 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
                  Une première activité,
                  puis une ferme plus large.
                </h3>

              </div>

              <p className="mt-12 text-sm leading-7 text-black/60">
                Le projet avance progressivement. La première
                activité structurée a permis de poser les bases
                d’un développement agricole plus large, autour
                de plusieurs filières complémentaires.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOTRE DÉMARCHE                                        */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Notre démarche
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Produire localement.
                Progresser durablement.
              </h2>

            </div>

            <div className="max-w-2xl">

              <p className="text-base leading-8 text-white/70 sm:text-lg">
                Nous construisons progressivement les
                infrastructures, les méthodes et les filières
                nécessaires au développement de la ferme.
              </p>

              <p className="mt-6 text-base leading-8 text-white/70 sm:text-lg">
                Chaque étape doit permettre de mieux produire,
                mieux organiser les activités et préparer
                naturellement la suivante.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOS ACTIVITÉS                                         */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Nos activités
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Trois filières,
                une même ambition.
              </h2>

            </div>

            <div className="max-w-2xl text-base leading-8 text-black/60">
              Des activités complémentaires pour construire
              progressivement une exploitation agricole capable
              de répondre aux besoins locaux et de créer de
              nouvelles opportunités.
            </div>

          </div>


          <div className="mt-16 grid gap-6 lg:grid-cols-3">

            {/* PISCICULTURE */}

            <article className="group overflow-hidden border border-black/10 bg-white">

              <div className="aspect-[4/3] overflow-hidden bg-[#EEF1E9]">
                <MediaImage
                  media={piscicultureMedia}
                  alt="AgroFarms237 — Pisciculture"
                  className="transition duration-700 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-8">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                  01
                </p>

                <h3 className="mt-4 font-serif text-3xl">
                  Pisciculture
                </h3>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  Une première activité structurée autour de
                  la production piscicole, avec le silure comme
                  production développée et commercialisée.
                </p>

              </div>

            </article>


            {/* PORCIN */}

            <article className="group overflow-hidden border border-black/10 bg-white">

              <div className="aspect-[4/3] overflow-hidden bg-[#EEF1E9]">
                <MediaImage
                  media={porcinMedia}
                  alt="AgroFarms237 — Élevage porcin"
                  className="transition duration-700 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-8">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                  02
                </p>

                <h3 className="mt-4 font-serif text-3xl">
                  Élevage porcin
                </h3>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  Une filière développée dans la continuité
                  du projet agricole afin de diversifier
                  progressivement les productions de la ferme.
                </p>

              </div>

            </article>


            {/* AVICULTURE */}

            <article className="group overflow-hidden border border-black/10 bg-white">

              <div className="aspect-[4/3] overflow-hidden bg-[#EEF1E9]">
                <MediaImage
                  media={avicultureMedia}
                  alt="AgroFarms237 — Aviculture"
                  className="transition duration-700 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-8">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                  03
                </p>

                <h3 className="mt-4 font-serif text-3xl">
                  Aviculture
                </h3>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  Un axe de développement autour de l’aviculture,
                  notamment avec les poulets de chair et les
                  poules pondeuses.
                </p>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* UNE VISION                                             */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">

            <div className="relative min-h-[420px] overflow-hidden bg-[#DDE5DC]">

              <MediaImage
                media={visionMedia}
                alt="AgroFarms237 — Une vision"
              />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-goldDeep">
                Notre vision
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
                Construire une ferme
                agricole camerounaise
                diversifiée et durable.
              </h2>

              <p className="mt-8 max-w-2xl text-base leading-8 text-black/60 sm:text-lg">
                Notre ambition est de développer progressivement
                plusieurs filières de production, d’améliorer
                leur valorisation et de construire une organisation
                capable de grandir avec la ferme.
              </p>

              <p className="mt-6 max-w-2xl text-base leading-8 text-black/60 sm:text-lg">
                La vision ne se limite donc pas à une seule
                production. Elle repose sur la complémentarité
                entre nos activités et sur une progression
                maîtrisée dans le temps.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* CROISSANCE — ÉTAPES                                    */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Notre trajectoire
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Une croissance pensée
              étape par étape.
            </h2>

            <p className="mt-7 text-base leading-8 text-white/65 sm:text-lg">
              Le développement de la ferme s’organise autour
              de plusieurs étapes complémentaires. Chaque
              étape prépare la suivante et contribue à construire
              progressivement une exploitation agricole plus
              structurée.
            </p>

          </div>


          <div className="mt-20 space-y-px bg-white/10">

            {/* ÉTAPE 01 */}

            <article className="grid gap-10 bg-[#18352B] py-12 lg:grid-cols-[90px_0.85fr_1.15fr] lg:items-center">

              <span className="font-serif text-5xl text-gold">
                01
              </span>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  Productions
                </p>

                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                  Les premières productions
                </h3>

              </div>

              <div className="grid gap-7 sm:grid-cols-[1fr_180px] sm:items-center">

                <p className="text-sm leading-7 text-white/60">
                  Développer les premières productions de la
                  ferme et poser les bases opérationnelles
                  nécessaires à la suite du projet.
                </p>

                <div className="aspect-[4/3] overflow-hidden bg-[#102A22]">
                  <MediaImage
                    media={step01Media}
                    alt="AgroFarms237 — Étape 01 — Les premières productions"
                  />
                </div>

              </div>

            </article>


            {/* ÉTAPE 02 */}

            <article className="grid gap-10 bg-[#18352B] py-12 lg:grid-cols-[90px_0.85fr_1.15fr] lg:items-center">

              <span className="font-serif text-5xl text-gold">
                02
              </span>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  Infrastructures
                </p>

                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                  La structuration
                </h3>

              </div>

              <div className="grid gap-7 sm:grid-cols-[1fr_180px] sm:items-center">

                <p className="text-sm leading-7 text-white/60">
                  Développer progressivement les infrastructures,
                  l’organisation de la production et les outils
                  nécessaires à la croissance de la ferme.
                </p>

                <div className="aspect-[4/3] overflow-hidden bg-[#102A22]">
                  <MediaImage
                    media={step02Media}
                    alt="AgroFarms237 — Étape 02 — La structuration"
                  />
                </div>

              </div>

            </article>


            {/* ÉTAPE 03 */}

            <article className="grid gap-10 bg-[#18352B] py-12 lg:grid-cols-[90px_0.85fr_1.15fr] lg:items-center">

              <span className="font-serif text-5xl text-gold">
                03
              </span>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  Diversification
                </p>

                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                  La diversification
                </h3>

              </div>

              <div className="grid gap-7 sm:grid-cols-[1fr_180px] sm:items-center">

                <p className="text-sm leading-7 text-white/60">
                  Renforcer les différentes filières et
                  développer progressivement une exploitation
                  agricole plus diversifiée.
                </p>

                <div className="aspect-[4/3] overflow-hidden bg-[#102A22]">
                  <MediaImage
                    media={step03Media}
                    alt="AgroFarms237 — Étape 03 — La diversification"
                  />
                </div>

              </div>

            </article>


            {/* ÉTAPE 04 */}

            <article className="grid gap-10 bg-[#18352B] py-12 lg:grid-cols-[90px_0.85fr_1.15fr] lg:items-center">

              <span className="font-serif text-5xl text-gold">
                04
              </span>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  Transformation & valorisation
                </p>

                <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
                  La valorisation
                </h3>

              </div>

              <div className="grid gap-7 sm:grid-cols-[1fr_180px] sm:items-center">

                <p className="text-sm leading-7 text-white/60">
                  Développer de nouvelles possibilités de
                  transformation, de conditionnement et de
                  distribution pour mieux valoriser les productions.
                </p>

                <div className="aspect-[4/3] overflow-hidden bg-[#102A22]">
                  <MediaImage
                    media={step04Media}
                    alt="AgroFarms237 — Étape 04 — La valorisation"
                  />
                </div>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* LA VIE DE LA FERME                                    */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                La vie de la ferme
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Dans les coulisses
                d’AgroFarms237.
              </h2>

            </div>

            <p className="max-w-2xl text-base leading-8 text-black/60">
              Découvrez les moments, les activités et les
              réalités qui accompagnent progressivement
              le développement de notre ferme.
            </p>

          </div>


          {farmLifeMedia.length > 0 ? (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {farmLifeMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  alt="La vie de la ferme AgroFarms237"
                />
              ))}

            </div>
          ) : (
            <div className="mt-14 border border-dashed border-black/15 bg-[#F3EFE5] p-14 text-center">

              <p className="font-serif text-2xl text-black/55">
                Les premières images de la vie de la ferme
                seront bientôt présentées ici.
              </p>

            </div>
          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOTRE ÉQUIPE                                          */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-goldDeep">
                Notre équipe
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Les personnes derrière
                le développement de la ferme.
              </h2>

            </div>

            <div className="max-w-2xl">

              <p className="text-base leading-8 text-black/65 sm:text-lg">
                AgroFarms237 se construit avec des personnes
                engagées dans le développement quotidien de
                l’entreprise et de ses activités.
              </p>

              <p className="mt-6 text-base leading-8 text-black/65 sm:text-lg">
                Cette équipe évolue avec la ferme et accompagne
                progressivement son développement, ses productions
                et ses différents projets.
              </p>

            </div>

          </div>


          {/* PHOTOS DE L'ÉQUIPE GÉRÉES PAR LA GALERIE */}

          {teamMedia.length > 0 && (
            <div className="mt-16">

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {teamMedia.map((media) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                    alt="Équipe AgroFarms237"
                  />
                ))}

              </div>

            </div>
          )}


          {/* MEMBRES DE L'ÉQUIPE */}

          {team.length > 0 && (
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {team.map((member) => (
                <article
                  key={member.id}
                  className="overflow-hidden border border-black/10 bg-white"
                >

                  <div className="aspect-[4/3] overflow-hidden bg-[#EEF1E9]">

                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={
                          member.name ||
                          "Membre de l'équipe AgroFarms237"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">

                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">
                          Photo à venir
                        </p>

                      </div>
                    )}

                  </div>

                  <div className="p-7">

                    {member.name && (
                      <h3 className="font-serif text-2xl">
                        {member.name}
                      </h3>
                    )}

                    {member.role && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-goldDeep">
                        {member.role}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-5 text-sm leading-7 text-black/60">
                        {member.bio}
                      </p>
                    )}

                  </div>

                </article>
              ))}

            </div>
          )}


          {team.length === 0 &&
            teamMedia.length === 0 && (
              <div className="mt-14 border border-dashed border-black/15 bg-white p-14 text-center">

                <p className="font-serif text-2xl text-black/55">
                  Notre équipe sera bientôt présentée ici.
                </p>

              </div>
            )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* ACTUALITÉS                                             */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Actualités
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Ce qui évolue
                autour d’AgroFarms237.
              </h2>

            </div>

            <p className="max-w-2xl text-base leading-8 text-black/60">
              Suivez les évolutions, les nouveautés et les
              moments importants de la vie de l’entreprise
              et de la ferme.
            </p>

          </div>


          {newsMedia.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

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
            <div
              className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${
                newsMedia.length > 0
                  ? "mt-10"
                  : "mt-14"
              }`}
            >

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border border-black/10 bg-[#F3EFE5] p-7"
                >

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                    {formatDate(post.created_at)}
                  </p>

                  <h3 className="mt-4 font-serif text-2xl leading-tight">
                    {post.title}
                  </h3>

                  {post.body && (
                    <p className="mt-5 line-clamp-5 text-sm leading-7 text-black/60">
                      {post.body}
                    </p>
                  )}

                </article>
              ))}

            </div>
          )}


          {newsMedia.length === 0 &&
            posts.length === 0 && (
              <div className="mt-14 border border-dashed border-black/15 bg-[#F3EFE5] p-14 text-center">

                <p className="font-serif text-2xl text-black/55">
                  Les premières actualités d’AgroFarms237
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

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-3xl">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                AgroFarms237
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                La qualité commence
                à la ferme.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">
                Découvrez nos productions, notre ferme et
                les différentes étapes qui accompagnent
                son développement.
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

              <Link
                href="/notre-elevage"
                className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-sm font-semibold text-[#18352B] transition hover:opacity-90"
              >
                Découvrir notre ferme
              </Link>

              <Link
                href="/produits"
                className="inline-flex min-h-12 items-center justify-center border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
              >
                Voir nos produits
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
