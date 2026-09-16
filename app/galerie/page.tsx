import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 30;

async function getMedia() {
  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select("*")
      .eq("published", true)
      .order("position")
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function GaleriePage() {
  const items = await getMedia();

  return (
    <section className="px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Galerie</span>
        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">La ferme en photos et vidéos.</h1>
        <p className="mt-2 max-w-[62ch] text-inkSoft">
          Bassins, alimentation, récoltes, préparation des commandes — les visuels sont ajoutés progressivement par
          l&apos;équipe Agrofarms237.
        </p>

        {items.length === 0 ? (
          <div className="mt-11 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex aspect-square items-center justify-center rounded-m border border-ink/10 bg-bgAlt p-4 text-center">
                <span className="text-[12.5px] font-bold text-inkSoft">Photo à venir</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-11 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {items.map((it: any) => (
              <figure key={it.id} className="overflow-hidden rounded-m border border-ink/10 bg-bgAlt">
                {it.kind === "photo" ? (
                  <img src={it.url} alt={it.caption || ""} className="aspect-square w-full object-cover" />
                ) : (
                  <video src={it.url} controls className="aspect-square w-full object-cover" />
                )}
                {it.caption && <figcaption className="p-2.5 text-[12.5px] text-inkSoft">{it.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
