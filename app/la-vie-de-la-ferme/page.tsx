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

function getMedia(
  media: SiteMedia[],
  location: string
): SiteMedia | null {
  return (
    media.find(
      (item) => item.site_location === location
    ) || null
  );
}

function getMediaList(
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
  media: SiteMedia | null;
  alt: string;
  className?: string;
}) {
  if (!media) {
    return null;
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

export default async function LaVieDeLaFermePage() {
  const [team, posts, siteMedia] = await Promise.all([
    getTeamMembers(),
    getNewsPosts(),
    getSiteMedia(),
  ]);

  const heroMedia = getMedia(
    siteMedia,
    "apropos_hero"
  );

  const storyMedia = getMedia(
    siteMedia,
    "histoire"
  );

  const piscicultureMedia = getMedia(
    siteMedia,
    "apropos_pisciculture"
  );

  const porcinMedia = getMedia(
    siteMedia,
    "apropos_porcin"
  );

  const avicultureMedia = getMedia(
    siteMedia,
    "apropos_aviculture"
  );

  const visionMedia = getMedia(
    siteMedia,
    "apropos_vision"
  );

  const step01Media = getMedia(
    siteMedia,
    "apropos_etape_01"
  );

  const step02Media = getMedia(
    siteMedia,
    "apropos_etape_02"
  );

  const step03Media = getMedia(
    siteMedia,
    "apropos_etape_03"
  );

  const step04Media = getMedia(
    siteMedia,
    "apropos_etape_04"
  );

  const farmLifeMedia = getMediaList(
    siteMedia,
    "apropos_vie_ferme"
  );

  const newsMedia = getMediaList(
    siteMedia,
    "apropos_actualites"
  );

  const teamMedia = getMedia(
    siteMedia,
    "equipe"
  );

  return (
    <main className="bg-white text-ink">

      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#18352B] text-white">

        {heroMedia && (
          <div className="absolute inset-0">
            <MediaImage
              media={heroMedia}
              alt="AgroFarms237 — À propos"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[#18352B]/75" />
          </div>
        )}

        {!heroMedia && (
          <div className="absolute inset-0">
            <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />
            <div className="absolute -right-10 top-10 h-[300px] w-[300px] rounded-full border border-gold/20" />
            <div className="absolute bottom-[-180px] left-[-100px] h-[420px] w-[420px] rounded-full border border-white/5" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">

          <div className="max-w-4xl">

            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
              À propos d’AgroFarms237
            </p>

            <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Construire une agriculture
              <span className="block text-white/65">
                locale, structurée et durable.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              AgroFarms237 développe progressivement une
              exploitation agricole autour de plusieurs filières,
              avec une ambition simple : produire localement,
              structurer nos activités et créer de la valeur
              durablement.
            </p>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* QUI SOMMES-NOUS / NOTRE HISTOIRE                       */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Qui sommes-nous ?
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Une ferme en construction,
                une vision à long terme.
              </h2>

            </div>

            <div className="max-w-3xl text-base leading-8 text-black/60">

              <p>
                AgroFarms237 est une entreprise agricole
                camerounaise qui développe progressivement
                ses activités autour de la pisciculture,
                de l’élevage porcin et de l’aviculture.
              </p>

              <p className="mt-6">
                Notre développement commence avec la
                pisciculture et le silure comme première
                production structurée et commercialisée.
                Cette première activité constitue le point
                de départ d’un projet agricole plus large.
              </p>

              <p className="mt-6">
                À mesure que la ferme se développe, notre
                ambition est de construire plusieurs filières
                complémentaires, d’améliorer la valorisation
                des productions et de développer progressivement
                leur distribution.
              </p>

            </div>

          </div>

          {storyMedia && (
            <div className="mt-16 overflow-hidden">
              <div className="aspect-[16/7]">
                <MediaImage
                  media={storyMedia}
                  alt="Notre histoire — AgroFarms237"
                />
              </div>
            </div>
          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOTRE DÉMARCHE                                        */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Notre démarche
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Produire localement.
              Progresser durablement.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              Nous construisons progressivement les infrastructures,
              les méthodes et les filières nécessaires au développement
              de la ferme.
            </p>

          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                title: "Produire",
                text: "Développer des productions agricoles locales avec une attention portée à la qualité.",
              },
              {
                number: "02",
                title: "Structurer",
                text: "Mettre progressivement en place les infrastructures et l’organisation nécessaires.",
              },
              {
                number: "03",
                title: "Valoriser",
                text: "Développer de nouvelles possibilités de transformation et de conditionnement.",
              },
              {
                number: "04",
                title: "Distribuer",
                text: "Construire progressivement des circuits adaptés aux différents clients.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="bg-[#18352B] p-8 sm:p-10"
              >
                <span className="font-serif text-5xl text-gold">
                  {item.number}
                </span>

                <h3 className="mt-10 font-serif text-2xl">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  {item.text}
                </p>
              </article>
            ))}

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOS ACTIVITÉS                                         */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Nos activités
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Trois filières,
                une même ambition.
              </h2>

            </div>

            <p className="max-w-xl text-base leading-8 text-black/60">
              Des activités complémentaires pour construire
              progressivement une ferme agricole capable de
              répondre aux besoins locaux et de créer de
              nouvelles opportunités.
            </p>

          </div>


          <div className="mt-16 grid gap-6 lg:grid-cols-3">

            {/* PISCICULTURE */}

            <article className="overflow-hidden border border-black/10 bg-white">

              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8EEE8]">

                {piscicultureMedia && (
                  <MediaImage
                    media={piscicultureMedia}
                    alt="Pisciculture AgroFarms237"
                    className="transition duration-700 hover:scale-[1.03]"
                  />
                )}

                <div className="absolute left-5 top-5 bg-[#18352B] px-3 py-2 text-xs font-semibold text-white">
                  01
                </div>

              </div>

              <div className="p-7 sm:p-8">

                <h3 className="font-serif text-3xl">
                  Pisciculture
                </h3>

                <p className="mt-4 text-sm leading-7 text-black/60">
                  Notre activité piscicole constitue l’une des
                  premières filières structurées d’AgroFarms237,
                  avec le silure comme production développée et
                  commercialisée.
                </p>

                <Link
                  href="/notre-elevage"
                  className="mt-7 inline-flex border-b border-gold pb-1 text-xs font-semibold uppercase tracking-[0.15em] text-goldDeep"
                >
                  Découvrir la filière
                </Link>

              </div>

            </article>


            {/* PORCIN */}

            <article className="overflow-hidden border border-black/10 bg-white">

              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8EEE8]">

                {porcinMedia && (
                  <MediaImage
                    media={porcinMedia}
                    alt="Élevage porcin AgroFarms237"
                    className="transition duration-700 hover:scale-[1.03]"
                  />
                )}

                <div className="absolute left-5 top-5 bg-[#18352B] px-3 py-2 text-xs font-semibold text-white">
                  02
                </div>

              </div>

              <div className="p-7 sm:p-8">

                <h3 className="font-serif text-3xl">
                  Élevage porcin
                </h3>

                <p className="mt-4 text-sm leading-7 text-black/60">
                  Une filière engagée dans le développement
                  de la ferme et appelée à contribuer
                  progressivement à sa diversification.
                </p>

                <Link
                  href="/notre-elevage"
                  className="mt-7 inline-flex border-b border-gold pb-1 text-xs font-semibold uppercase tracking-[0.15em] text-goldDeep"
                >
                  Découvrir la filière
                </Link>

              </div>

            </article>


            {/* AVICULTURE */}

            <article className="overflow-hidden border border-black/10 bg-white">

              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8EEE8]">

                {avicultureMedia && (
                  <MediaImage
                    media={avicultureMedia}
                    alt="Aviculture AgroFarms237"
                    className="transition duration-700 hover:scale-[1.03]"
                  />
                )}

                <div className="absolute left-5 top-5 bg-[#18352B] px-3 py-2 text-xs font-semibold text-white">
                  03
                </div>

              </div>

              <div className="p-7 sm:p-8">

                <h3 className="font-serif text-3xl">
                  Aviculture
                </h3>

                <p className="mt-4 text-sm leading-7 text-black/60">
                  Une filière autour de l’aviculture,
                  notamment avec le développement des poulets
                  de chair et des poules pondeuses.
                </p>

                <Link
                  href="/notre-elevage"
                  className="mt-7 inline-flex border-b border-gold pb-1 text-xs font-semibold uppercase tracking-[0.15em] text-goldDeep"
                >
                  Découvrir la filière
                </Link>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOTRE TRAJECTOIRE                                     */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Notre trajectoire
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Une croissance pensée
              étape par étape.
            </h2>

            <p className="mt-6 text-base leading-8 text-white/70">
              Chaque étape de notre développement contribue
              à construire une exploitation agricole mieux
              structurée et capable d’évoluer dans le temps.
            </p>

          </div>


          <div className="mt-16 space-y-0">

            {/* ÉTAPE 01 */}

            <article className="grid gap-8 border-t border-white/10 py-10 md:grid-cols-[100px_0.7fr_1fr] md:items-center md:gap-12">

              <span className="font-serif text-5xl text-gold">
                01
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  Productions
                </p>

                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                  Les premières productions
                </h3>
              </div>

              <div>

                {step01Media && (
                  <div className="mb-6 aspect-[16/9] overflow-hidden">
                    <MediaImage
                      media={step01Media}
                      alt="Étape 01 — Les premières productions"
                    />
                  </div>
                )}

                <p className="text-sm leading-7 text-white/65">
                  Pisciculture, aviculture et élevage porcin
                  constituent les premières filières engagées
                  dans le développement d’AgroFarms237.
                </p>

              </div>

            </article>


            {/* ÉTAPE 02 */}

            <article className="grid gap-8 border-t border-white/10 py-10 md:grid-cols-[100px_0.7fr_1fr] md:items-center md:gap-12">

              <span className="font-serif text-5xl text-gold">
                02
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  Infrastructures
                </p>

                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                  La structuration
                </h3>
              </div>

              <div>

                {step02Media && (
                  <div className="mb-6 aspect-[16/9] overflow-hidden">
                    <MediaImage
                      media={step02Media}
                      alt="Étape 02 — La structuration"
                    />
                  </div>
                )}

                <p className="text-sm leading-7 text-white/65">
                  Développer progressivement les infrastructures,
                  l’organisation de la production et les solutions
                  nécessaires à la croissance de la ferme.
                </p>

              </div>

            </article>


            {/* ÉTAPE 03 */}

            <article className="grid gap-8 border-t border-white/10 py-10 md:grid-cols-[100px_0.7fr_1fr] md:items-center md:gap-12">

              <span className="font-serif text-5xl text-gold">
                03
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  Filières
                </p>

                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                  La diversification
                </h3>
              </div>

              <div>

                {step03Media && (
                  <div className="mb-6 aspect-[16/9] overflow-hidden">
                    <MediaImage
                      media={step03Media}
                      alt="Étape 03 — La diversification"
                    />
                  </div>
                )}

                <p className="text-sm leading-7 text-white/65">
                  Renforcer les différentes filières et développer
                  progressivement une exploitation agricole
                  plus diversifiée.
                </p>

              </div>

            </article>


            {/* ÉTAPE 04 */}

            <article className="grid gap-8 border-y border-white/10 py-10 md:grid-cols-[100px_0.7fr_1fr] md:items-center md:gap-12">

              <span className="font-serif text-5xl text-gold">
                04
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                  Transformation & valorisation
                </p>

                <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                  La valorisation
                </h3>
              </div>

              <div>

                {step04Media && (
                  <div className="mb-6 aspect-[16/9] overflow-hidden">
                    <MediaImage
                      media={step04Media}
                      alt="Étape 04 — La valorisation"
                    />
                  </div>
                )}

                <p className="text-sm leading-7 text-white/65">
                  Développer de nouvelles possibilités de
                  transformation, de conditionnement et de
                  distribution pour mieux valoriser les productions.
                </p>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* UNE VISION                                            */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Notre vision
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Construire une ferme
              agricole camerounaise
              diversifiée et durable.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60">
              Notre ambition est de développer progressivement
              plusieurs filières de production, d’améliorer leur
              valorisation et de construire une organisation
              capable de grandir avec la ferme.
            </p>

          </div>

          {visionMedia && (
            <div className="overflow-hidden">
              <div className="aspect-[4/3]">
                <MediaImage
                  media={visionMedia}
                  alt="Notre vision — AgroFarms237"
                />
              </div>
            </div>
          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* LA VIE DE LA FERME                                    */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              La vie de la ferme
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Dans les coulisses d’AgroFarms237.
            </h2>

            <p className="mt-5 text-base leading-8 text-black/60">
              Découvrez les moments, les activités et les réalités
              qui accompagnent progressivement le développement
              de notre ferme.
            </p>

          </div>

          {farmLifeMedia.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {farmLifeMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  alt="La vie de la ferme — AgroFarms237"
                />
              ))}

            </div>
          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* NOTRE ÉQUIPE                                          */}
      {/* ===================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Notre équipe
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Les personnes derrière
                le développement de la ferme.
              </h2>

            </div>

            <p className="max-w-xl text-base leading-8 text-black/60">
              AgroFarms237 se construit avec des personnes
              engagées dans le développement quotidien de
              l’entreprise et de ses activités.
            </p>

          </div>


          {teamMedia && (
            <div className="mt-14 overflow-hidden">
              <div className="aspect-[16/6]">
                <MediaImage
                  media={teamMedia}
                  alt="Notre équipe — AgroFarms237"
                />
              </div>
            </div>
          )}


          {team.length > 0 && (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {team.map((member) => (
                <article
                  key={member.id}
                  className="group overflow-hidden border border-black/10 bg-white"
                >

                  <div className="aspect-[4/3] overflow-hidden bg-[#F3EFE5]">

                    {member.photo_url && (
                      <img
                        src={member.photo_url}
                        alt={
                          member.name ||
                          "Membre de l'équipe AgroFarms237"
                        }
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    )}

                  </div>

                  <div className="p-7 sm:p-8">

                    <h3 className="font-serif text-2xl leading-tight">
                      {member.name}
                    </h3>

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

                    <div className="mt-7 h-px w-10 bg-gold" />

                  </div>

                </article>
              ))}

            </div>
          )}

        </div>

      </section>


      {/* ===================================================== */}
      {/* ACTUALITÉS                                             */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Nos actualités
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Les dernières nouvelles
              de la ferme.
            </h2>

            <p className="mt-5 text-base leading-8 text-black/60">
              Suivez les évolutions, les nouveautés et les
              moments importants de la vie d’AgroFarms237.
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
            <div className="mt-14 grid gap-6 md:grid-cols-3">

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden border border-black/10 bg-white"
                >

                  <div className="p-7">

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-goldDeep">
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

                    <div className="mt-7 h-px w-10 bg-gold" />

                  </div>

                </article>
              ))}

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
                Découvrez la ferme,
                ses productions et son développement.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">
                Explorez nos productions actuelles,
                découvrez notre trajectoire et échangez
                avec AgroFarms237 pour construire la suite.
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

              <Link
                href="/notre-elevage"
                className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-sm font-semibold text-[#18352B] transition hover:opacity-90"
              >
                Découvrir notre élevage
              </Link>

              <Link
                href="/produits"
                className="inline-flex min-h-12 items-center justify-center border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
              >
                Découvrir nos produits
              </Link>

              <Link
                href="/partenaires"
                className="inline-flex min-h-12 items-center justify-center border border-white/20 px-7 text-sm font-semibold text-white transition hover:border-white"
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
