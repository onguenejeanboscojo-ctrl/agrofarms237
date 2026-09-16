import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 30;

export default async function NewsPage() {
  let posts: any[] = [];
  try {
    const { data } = await supabaseAdmin()
      .from("news_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    posts = data || [];
  } catch {}

  return (
    <section className="px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">La vie de la ferme</span>
        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">Nos actualités.</h1>

        {posts.length === 0 ? (
          <div className="mt-9 rounded-m border border-dashed border-ink/15 p-10 text-center">
            <p className="mx-auto max-w-[52ch] text-inkSoft">
              Les premiers articles — récoltes, évolution des bassins, nouveautés — arrivent bientôt sur cet espace.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-4.5 md:grid-cols-3">
            {posts.map((p) => (
              <article key={p.id} className="rounded-m border border-ink/10 bg-paper p-6">
                <div className="mb-4 aspect-[16/10] rounded-s bg-bgAlt" />
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-[14.5px] text-inkSoft">{p.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
