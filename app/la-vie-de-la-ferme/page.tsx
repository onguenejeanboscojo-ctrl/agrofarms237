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

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("position", { ascending: true });

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

export default async function LaVieDeLaFermePage() {
  const [team, posts] = await Promise.all([
    getTeamMembers(),
    getNewsPosts(),
  ]);

  return (
    <main className="bg-white text-ink">

      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#18352B] text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -right-10 top-10 h-[300px] w-[300px] rounded-full border border-gold/20" />
          <div className="absolute bottom-[-180px] left-[-100px] h-[420px] w-[420px] rounded-full border border-white/5" />
        </div>

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
      {/* QUI SOMMES-NOUS ?                                     */}
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

        </div>
      </section>


      {/* ===================================================== */}
      {/* NOTRE APPROCHE                                        */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Notre approche
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Produire. Structurer.
              Valoriser. Distribuer.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60">
              AgroFarms237 avance étape par étape. Chaque
              développement doit contribuer à construire une
              activité agricole mieux organisée et capable
              d’évoluer dans le temps.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <article className="border border-black/10 bg-white p-8">
              <span className="font-serif text-5xl text-black/10">
                01
              </span>

              <h3 className="mt-10 font-serif text-2xl">
                Produire
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Développer des productions agricoles locales
                avec une attention portée à la qualité et à
                l’organisation de la ferme.
              </p>
            </article>

            <article className="border border-black/10 bg-white p-8">
              <span className="font-serif text-5xl text-black/10">
                02
              </span>

              <h3 className="mt-10 font-serif text-2xl">
                Structurer
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Mettre progressivement en place les
                infrastructures, les méthodes et les outils
                nécessaires au développement de l’exploitation.
              </p>
            </article>

            <article className="border border-black/10 bg-white p-8">
              <span className="font-serif text-5xl text-black/10">
                03
              </span>

              <h3 className="mt-10 font-serif text-2xl">
                Valoriser
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Développer de nouvelles formes de transformation,
                de conditionnement et de présentation de nos
                productions.
              </p>
            </article>

            <article className="border border-black/10 bg-white p-8">
              <span className="font-serif text-5xl text-black/10">
                04
              </span>

              <h3 className="mt-10 font-serif text-2xl">
                Distribuer
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Construire progressivement des circuits adaptés
                aux familles, aux professionnels et aux différents
                acteurs du marché.
              </p>
            </article>

          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* NOTRE TRAJECTOIRE                                     */}
      {/* ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Notre trajectoire
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Une croissance pensée
              étape par étape.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60">
              AgroFarms237 construit progressivement son modèle
              agricole en partant d’une première activité pour
              développer ensuite plusieurs filières et de
              nouvelles possibilités de valorisation.
            </p>
          </div>

          <div className="mt-16 border-y border-black/10">

            <div className="grid gap-8 border-b border-black/10 py-10 md:grid-cols-[120px_0.7fr_1fr] md:items-start md:gap-12">
              <span className="font-serif text-5xl text-black/10">
                01
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl">
                Le point de départ
              </h3>

              <p className="text-sm leading-7 text-black/60">
                La pisciculture constitue la première activité
                structurée et commercialisée par AgroFarms237,
                avec le silure comme première production développée.
              </p>
            </div>

            <div className="grid gap-8 border-b border-black/10 py-10 md:grid-cols-[120px_0.7fr_1fr] md:items-start md:gap-12">
              <span className="font-serif text-5xl text-black/10">
                02
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl">
                La structuration
              </h3>

              <p className="text-sm leading-7 text-black/60">
                Développer progressivement les infrastructures,
                l’organisation de la production et les outils
                nécessaires à la croissance de la ferme.
              </p>
            </div>

            <div className="grid gap-8 border-b border-black/10 py-10 md:grid-cols-[120px_0.7fr_1fr] md:items-start md:gap-12">
              <span className="font-serif text-5xl text-black/10">
                03
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl">
                La diversification
              </h3>

              <p className="text-sm leading-7 text-black/60">
                Développer progressivement l’élevage porcin et
                l’aviculture afin de construire une exploitation
                agricole plus diversifiée.
              </p>
            </div>

            <div className="grid gap-8 py-10 md:grid-cols-[120px_0.7fr_1fr] md:items-start md:gap-12">
              <span className="font-serif text-5xl text-black/10">
                04
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl">
                La valorisation
              </h3>

              <p className="text-sm leading-7 text-black/60">
                Développer de nouvelles possibilités de
                transformation, de conditionnement et de
                distribution pour mieux valoriser les productions.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* NOS ACTIVITÉS                                         */}
      {/* ===================================================== */}

      <section className="bg-[#18352B] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Nos activités
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Plusieurs filières,
              une même ambition.
            </h2>

            <p className="mt-6 text-base leading-8 text-white/70">
              AgroFarms237 développe progressivement plusieurs
              activités agricoles complémentaires pour construire
              une ferme capable d’évoluer dans le temps.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">

            <div className="bg-[#18352B] p-8 sm:p-10">
              <span className="font-serif text-5xl text-white/10">
                01
              </span>

              <h3 className="mt-12 font-serif text-3xl">
                Pisciculture
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/65">
                Notre première activité structurée, avec une
                production qui commence par le silure et pourra
                progressivement s’élargir.
              </p>
            </div>

            <div className="bg-[#18352B] p-8 sm:p-10">
              <span className="font-serif text-5xl text-white/10">
                02
              </span>

              <h3 className="mt-12 font-serif text-3xl">
                Élevage porcin
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/65">
                Une filière en développement qui s’inscrit dans
                notre volonté de diversifier progressivement
                l’exploitation.
              </p>
            </div>

            <div className="bg-[#18352B] p-8 sm:p-10">
              <span className="font-serif text-5xl text-white/10">
                03
              </span>

              <h3 className="mt-12 font-serif text-3xl">
                Aviculture
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/65">
                Un axe de développement autour des poules
                pondeuses et des poulets de chair.
              </p>
            </div>

          </div>

          <div className="mt-10">
            <Link
              href="/notre-elevage"
              className="inline-flex min-h-12 items-center justify-center border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-[#18352B]"
            >
              Découvrir notre élevage
            </Link>
          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* NOTRE VISION                                          */}
      {/* ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8 lg:py-32">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Notre vision
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Construire une ferme capable
            de nourrir, de créer et de transmettre.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-black/60 sm:text-lg">
            AgroFarms237 avance étape par étape, avec
            l’ambition de développer une agriculture locale
            structurée, productive et durable.
          </p>

        </div>
      </section>


      {/* ===================================================== */}
      {/* NOS VALEURS                                           */}
      {/* ===================================================== */}

      <section className="bg-[#F3EFE5]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Nos valeurs
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Ce qui guide notre développement.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <article className="bg-white p-8">
              <div className="h-px w-12 bg-gold" />

              <h3 className="mt-8 font-serif text-2xl">
                Qualité
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Porter une attention constante à la qualité
                de nos productions et à l’expérience proposée
                à nos clients.
              </p>
            </article>

            <article className="bg-white p-8">
              <div className="h-px w-12 bg-gold" />

              <h3 className="mt-8 font-serif text-2xl">
                Rigueur
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Structurer progressivement nos méthodes et
                nos activités pour construire une exploitation
                solide.
              </p>
            </article>

            <article className="bg-white p-8">
              <div className="h-px w-12 bg-gold" />

              <h3 className="mt-8 font-serif text-2xl">
                Développement local
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Participer au développement d’une agriculture
                camerounaise capable de créer de la valeur
                localement.
              </p>
            </article>

            <article className="bg-white p-8">
              <div className="h-px w-12 bg-gold" />

              <h3 className="mt-8 font-serif text-2xl">
                Durabilité
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                Construire progressivement un modèle agricole
                pensé pour durer et évoluer dans le temps.
              </p>
            </article>

          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* NOTRE ÉQUIPE                                          */}
      {/* ===================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              L’équipe AgroFarms237
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
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

                  {/* PHOTO */}
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

                  {/* INFORMATIONS */}
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

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div className="max-w-3xl">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                La vie de la ferme
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Nos actualités
              </h2>

              <p className="mt-5 text-base leading-8 text-black/60">
                Suivez les évolutions, les nouveautés et les
                moments importants de la vie d’AgroFarms237.
              </p>

            </div>

          </div>

          {posts.length === 0 ? (
            <div className="mt-14 border border-dashed border-black/15 bg-white p-12 text-center">
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
