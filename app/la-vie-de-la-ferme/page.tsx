import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 30;

export default async function NewsPage() {
  let posts: any[] = [];
  let team: any[] = [];

  try {
    const { data } = await supabaseAdmin()
      .from("news_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    posts = data || [];
  } catch {}

  try {
    const { data } = await supabaseAdmin()
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("position", { ascending: true });

    team = data || [];
  } catch {}

  return (
    <section className="px-5 py-12">
      <div className="mx-auto max-w-[1180px]">

        {/* INTRODUCTION */}
        <div className="mb-14">
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">
            À propos de nous
          </span>

          <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
            La vie de la ferme
          </h1>

          <div className="mt-6 max-w-[900px] text-[16px] leading-8 text-inkSoft">
            <p>
              Agrofarms237 est une entreprise agricole camerounaise engagée
              dans la production, l’élevage et la valorisation des produits
              issus de la ferme.
            </p>

            <p className="mt-4">
              Notre ambition est de contribuer à une agriculture plus
              accessible, moderne et durable, tout en proposant des produits
              de qualité aux familles, aux professionnels et aux différents
              acteurs du secteur.
            </p>
          </div>
        </div>

        {/* NOTRE ÉQUIPE */}
        <div className="mb-16">
          <div className="mb-8">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              L'équipe Agrofarms237
            </span>

            <h2 className="font-serif text-[clamp(26px,4vw,38px)] font-semibold">
              Notre équipe
            </h2>

            <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-inkSoft">
              Découvrez les personnes qui participent chaque jour au
              développement et à la réussite d'Agrofarms237.
            </p>
          </div>

          {team.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink/15 bg-paper p-8 text-center">
              <p className="text-[15px] text-inkSoft">
                Notre équipe sera bientôt présentée ici.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <article
                  key={member.id}
                  className="overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-sm"
                >
                  {/* PHOTO */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-bgAlt">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name || "Membre de l'équipe Agrofarms237"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-inkSoft">
                        Photo indisponible
                      </div>
                    )}
                  </div>

                  {/* INFORMATIONS */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold">
                      {member.name}
                    </h3>

                    {member.role && (
                      <p className="mt-1 text-sm font-semibold text-goldDeep">
                        {member.role}
                      </p>
                    )}

                    {member.bio && (
                      <p className="mt-4 text-[14px] leading-7 text-inkSoft">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* ACTUALITÉS */}
        <div>
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">
            La vie de la ferme
          </span>

          <h2 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
            Nos actualités
          </h2>

          {posts.length === 0 ? (
            <div className="mt-9 rounded-md border border-dashed border-ink/15 p-10 text-center">
              <p className="mx-auto max-w-md text-inkSoft">
                Les premiers articles – récoltes, évolution des bassins,
                nouveautés – arrivent bientôt sur cet espace.
              </p>
            </div>
          ) : (
            <div className="mt-9 grid gap-4.5 md:grid-cols-3">
              {posts.map((p) => (
                <article
                  key={p.id}
                  className="rounded-md border border-ink/10 bg-paper p-6"
                >
                  <div className="mb-4 aspect-[16/10] rounded-md bg-bgAlt" />

                  <h3 className="text-lg font-semibold">
                    {p.title}
                  </h3>

                  <p className="mt-1 text-[14.5px] text-inkSoft">
                    {p.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
