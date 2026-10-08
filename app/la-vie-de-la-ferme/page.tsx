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

function SiteMediaCard({ media }: { media: SiteMedia }) {
  return (
    <article className="group overflow-hidden bg-[#F3EFE5]">
      <div className="aspect-[4/3] overflow-hidden">
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
            alt="AgroFarms237 — la vie de la ferme"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        )}
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

  const farmLifeMedia = siteMedia.filter(
    (media) => media.site_location === "vie_ferme"
  );

  const newsMedia = siteMedia.filter(
    (media) => media.site_location === "actualites"
  );

  const heroMedia = farmLifeMedia[0] ?? null;
  const secondaryMedia = farmLifeMedia.slice(1, 3);

  return (
    <main className="bg-white text-[#18352B]">

      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative min-h-[78vh] overflow-hidden bg-[#18352B]">
        {heroMedia ? (
          <div className="absolute inset-0">
            {heroMedia.kind === "video" ? (
              <video
                src={heroMedia.url}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={heroMedia.url}
                alt="La ferme AgroFarms237"
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-[#18352B]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10271F] via-[#18352B]/25 to-[#18352B]/20" />
          </div>
        ) : (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#18352B] via-[#1E4739] to-[#10271F]" />
            <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full border border-white/10" />
            <div className="absolute -bottom-60 -left-40 h-[650px] w-[650px] rounded-full border border-gold/10" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-end px-6 pb-16 pt-32 lg:px-8 lg:pb-24">
          <div className="max-w-5xl">

            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#D3A84C] sm:text-sm">
              À propos d’AgroFarms237
            </p>

            <h1 className="font-serif text-5xl leading-[0.98] text-white sm:text-6xl lg:text-8xl">
              Construire une agriculture
              <span className="block text-white/65">
                locale, structurée et durable.
              </span>
            </h1>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                AgroFarms237 développe progressivement une exploitation
                agricole autour de plusieurs filières, avec une ambition
                simple : produire localement, structurer nos activités et
                créer de la valeur durablement.
              </p>

              <Link
                href="#qui-sommes-nous"
                className="inline-flex min-h-12 w-fit items-center justify-center border border-white/35 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
              >
                Découvrir notre histoire
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* INTRO / QUI SOMMES-NOUS                                */}
      {/* ===================================================== */}

      <section id="qui-sommes-nous" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
                Qui sommes-nous ?
              </p>

              <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
                Une ferme en construction,
                une vision à long terme.
              </h2>
            </div>

            <div className="max-w-3xl text-base leading-8 text-black/60 sm:text-lg">

              <p>
                AgroFarms237 est une entreprise agricole camerounaise qui
                développe progressivement ses activités autour de la
                pisciculture, de l’élevage porcin et de l’aviculture.
              </p>

              <p className="mt-7">
                Notre développement commence avec la pisciculture et le
                silure comme première production structurée et commercialisée.
                Cette première activité constitue le point de départ d’un
                projet agricole plus large.
              </p>

              <p className="mt-7">
                À mesure que la ferme se développe, notre ambition est de
                construire plusieurs filières complémentaires, d’améliorer
                la valorisation des productions et de développer
                progressivement leur distribution.
              </p>

              <div className="mt-10 h-px w-16 bg-[#D3A84C]" />

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* IMAGE STRIP                                            */}
      {/* ===================================================== */}

      {secondaryMedia.length > 0 && (
        <section className="bg-[#F3EFE5]">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

            <div className="grid gap-5 md:grid-cols-2">
              {secondaryMedia.map((media) => (
                <SiteMediaCard key={media.id} media={media} />
              ))}
            </div>

          </div>
        </section>
      )}


      {/* ===================================================== */}
      {/* NOTRE APPROCHE                                         */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
              Notre approche
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Produire. Structurer.
              <br />
              Valoriser. Distribuer.
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-black/60 sm:text-lg">
              AgroFarms237 avance étape par étape. Chaque développement
              doit contribuer à construire une activité agricole mieux
              organisée et capable d’évoluer dans le temps.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden bg-black/10 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                title: "Produire",
                text: "Développer des productions agricoles locales avec une attention portée à la qualité et à l’organisation de la ferme.",
              },
              {
                number: "02",
                title: "Structurer",
                text: "Mettre progressivement en place les infrastructures, les méthodes et les outils nécessaires au développement de l’exploitation.",
              },
              {
                number: "03",
                title: "Valoriser",
                text: "Développer de nouvelles formes de transformation, de conditionnement et de présentation de nos productions.",
              },
              {
                number: "04",
                title: "Distribuer",
                text: "Construire progressivement des circuits adaptés aux familles, aux professionnels et aux différents acteurs du marché.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="bg-white p-8 sm:p-10"
              >
                <span className="font-serif text-5xl text-black/10">
                  {item.number}
                </span>

                <h3 className="mt-12 font-serif text-2xl sm:text-3xl">
                  {item.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  {item.text}
                </p>
              </article>
            ))}

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* TRAJECTOIRE                                            */}
      {/* ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="grid gap-16 lg:grid-cols-[0.65fr_1.35fr]">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
                Notre trajectoire
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Une croissance pensée
                étape par étape.
              </h2>

              <p className="mt-6 max-w-md text-base leading-8 text-black/60">
                AgroFarms237 construit progressivement son modèle agricole
                en partant d’une première activité pour développer ensuite
                plusieurs filières et de nouvelles possibilités de
                valorisation.
              </p>
            </div>

            <div className="border-t border-black/10">

              {[
                {
                  number: "01",
                  title: "Le point de départ",
                  text: "La pisciculture constitue la première activité structurée et commercialisée par AgroFarms237, avec le silure comme première production développée.",
                },
                {
                  number: "02",
                  title: "La structuration",
                  text: "Développer progressivement les infrastructures, l’organisation de la production et les outils nécessaires à la croissance de la ferme.",
                },
                {
                  number: "03",
                  title: "La diversification",
                  text: "Développer progressivement l’élevage porcin et l’aviculture afin de construire une exploitation agricole plus diversifiée.",
                },
                {
                  number: "04",
                  title: "La valorisation",
                  text: "Développer de nouvelles possibilités de transformation, de conditionnement et de distribution pour mieux valoriser les productions.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="grid gap-6 border-b border-black/10 py-9 sm:grid-cols-[80px_0.8fr_1.2fr] sm:gap-10"
                >
                  <span className="font-serif text-4xl text-black/15">
                    {item.number}
                  </span>

                  <h3 className="font-serif text-2xl leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-7 text-black/60">
                    {item.text}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* ACTIVITÉS                                              */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D3A84C]">
                Nos activités
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Plusieurs filières,
                une même ambition.
              </h2>
            </div>

            <p className="max-w-md text-base leading-8 text-white/65">
              AgroFarms237 développe progressivement plusieurs activités
              agricoles complémentaires pour construire une ferme capable
              d’évoluer dans le temps.
            </p>

          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">

            {[
              {
                number: "01",
                title: "Pisciculture",
                text: "Notre première activité structurée, avec une production qui commence par le silure et pourra progressivement s’élargir.",
              },
              {
                number: "02",
                title: "Élevage porcin",
                text: "Une filière en développement qui s’inscrit dans notre volonté de diversifier progressivement l’exploitation.",
              },
              {
                number: "03",
                title: "Aviculture",
                text: "Un axe de développement autour des poules pondeuses et des poulets de chair.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="bg-[#18352B] p-8 sm:p-10 lg:min-h-[330px]"
              >
                <span className="font-serif text-5xl text-white/10">
                  {item.number}
                </span>

                <h3 className="mt-16 font-serif text-3xl">
                  {item.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/65">
                  {item.text}
                </p>
              </article>
            ))}

          </div>

          <div className="mt-10">
            <Link
              href="/notre-elevage"
              className="inline-flex min-h-12 items-center justify-center border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
            >
              Découvrir notre ferme
            </Link>
          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* VISION                                                 */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:px-8 lg:py-36">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
            Notre vision
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-7xl">
            Construire une ferme capable
            de nourrir, de créer et de transmettre.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-black/60 sm:text-lg">
            AgroFarms237 avance étape par étape, avec l’ambition de
            développer une agriculture locale structurée, productive
            et durable.
          </p>

        </div>
      </section>


      {/* ===================================================== */}
      {/* VALEURS                                                */}
      {/* ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
              Nos valeurs
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Ce qui guide notre développement.
            </h2>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

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
                className="border border-black/10 bg-[#F3EFE5] p-8 sm:p-9"
              >
                <div className="h-px w-12 bg-[#D3A84C]" />

                <h3 className="mt-9 font-serif text-2xl">
                  {item.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-black/60">
                  {item.text}
                </p>
              </article>
            ))}

          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* VIE DE LA FERME                                        */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
                La vie de la ferme
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Dans les coulisses
                d’AgroFarms237.
              </h2>

              <p className="mt-5 text-base leading-8 text-black/60">
                Découvrez les moments, les activités et les réalités qui
                accompagnent progressivement le développement de notre ferme.
              </p>
            </div>

            <Link
              href="/galerie"
              className="inline-flex min-h-12 w-fit items-center justify-center border border-[#18352B]/20 px-7 text-sm font-semibold text-[#18352B] transition hover:border-[#18352B] hover:bg-[#18352B] hover:text-white"
            >
              Voir la galerie
            </Link>

          </div>

          {farmLifeMedia.length === 0 ? (
            <div className="mt-14 border border-dashed border-black/15 bg-white p-12 text-center">
              <p className="text-sm leading-7 text-black/55">
                Les premières images de la vie de la ferme seront bientôt
                présentées ici.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {farmLifeMedia.map((media) => (
                <SiteMediaCard key={media.id} media={media} />
              ))}
            </div>
          )}

        </div>
      </section>


      {/* ===================================================== */}
      {/* ÉQUIPE                                                 */}
      {/* ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
              L’équipe AgroFarms237
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Les personnes derrière
              le développement de la ferme.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60">
              AgroFarms237 se construit avec des personnes engagées dans
              le développement quotidien de l’entreprise et de ses activités.
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
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#B58B32]">
                        {member.role}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-5 text-sm leading-7 text-black/60">
                        {member.bio}
                      </p>
                    )}

                    <div className="mt-7 h-px w-10 bg-[#D3A84C]" />

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
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B32]">
              La vie de la ferme
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Nos actualités
            </h2>

            <p className="mt-5 text-base leading-8 text-black/60">
              Suivez les évolutions, les nouveautés et les moments importants
              de la vie d’AgroFarms237.
            </p>
          </div>

          {newsMedia.length > 0 && (
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {newsMedia.map((media) => (
                <SiteMediaCard key={media.id} media={media} />
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
                Les premières actualités de la ferme seront bientôt publiées
                sur cet espace.
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

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B58B32]">
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

                    <div className="mt-7 h-px w-10 bg-[#D3A84C]" />

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
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">

          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

            <div className="max-w-4xl">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D3A84C]">
                AgroFarms237
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Une ferme qui se construit
                aujourd’hui pour demain.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Découvrez nos productions actuelles, notre ferme et les
                différentes étapes de développement d’AgroFarms237.
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
