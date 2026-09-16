import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatFCFA } from "@/lib/whatsapp";
import { getContent } from "@/lib/content";

export const revalidate = 60; // re-lit les données produit/contenu toutes les 60s

const FALLBACK_PRODUCT = {
  name: "Silure frais",
  price_standard: 2500,
  price_bulk: 2400,
  bulk_min_kg: 30,
  stock_status: "disponible",
  next_availability: null as string | null,
};

async function getProduct() {
  try {
    const { data } = await supabaseAdmin().from("products").select("*").limit(1).single();
    return data ?? FALLBACK_PRODUCT;
  } catch {
    // Fallback si Supabase n'est pas encore configuré (démo locale)
    return FALLBACK_PRODUCT;
  }
}

async function getReviews() {
  try {
    const { data } = await supabaseAdmin()
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return data || [];
  } catch {
    return [];
  }
}

const STATUS_LABEL: Record<string, string> = {
  disponible: "Disponible",
  stock_limite: "Stock limité",
  indisponible: "Temporairement indisponible",
};

export default async function HomePage() {
  const [product, heroLead, histoireTexte, reviews] = await Promise.all([
    getProduct(),
    getContent("hero_lead"),
    getContent("histoire_texte"),
    getReviews(),
  ]);
  const histoireParagraphs = histoireTexte.split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(120%_140%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)] px-5 py-[150px] pb-24 text-paper">
        <div className="relative z-10 mx-auto max-w-[1180px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/10 px-3.5 py-1.5 text-[13.5px] font-semibold">
            <span className={`status-dot status-${product.stock_status}`} />
            {STATUS_LABEL[product.stock_status] ?? "Disponible"}
          </div>
          <h1 className="font-serif text-[clamp(40px,9vw,84px)] font-semibold leading-[1.05] text-paper">AGROFARMS237</h1>
          <p className="mt-3 font-serif text-[clamp(18px,3vw,24px)] italic text-gold">La qualité commence à la ferme.</p>
          <p className="mt-3 max-w-[52ch] text-[17px] text-paper/80">{heroLead}</p>
          <div className="mt-7 flex flex-wrap gap-3.5">
            <Link href="/commander" className="btn btn-gold">Commander du silure</Link>
            <Link href="#histoire" className="btn btn-outline">Découvrir Agrofarms237</Link>
          </div>
        </div>
      </section>

      {/* POURQUOI */}
      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Pourquoi Agrofarms237</span>
          <h2 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
            Une production pensée pour durer, pas pour paraître.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Production locale", "Des produits issus d'une production camerounaise, élevée et suivie à Yaoundé."],
              ["Fraîcheur", "Un suivi de la ferme jusqu'au client, sans intermédiaire inutile."],
              ["Transparence", "Nous montrons clairement notre manière de produire, bassin après bassin."],
              ["Proximité", "Une marque accessible aux familles comme aux restaurants et poissonneries."],
            ].map(([title, text]) => (
              <div key={title}>
                <h3 className="mb-1.5 text-[19px] font-semibold">{title}</h3>
                <p className="text-[15px] text-inkSoft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUIT */}
      <section className="bg-ink px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[1180px]">
          <span className="mb-2.5 inline-block text-[13px] font-bold text-gold">Notre production</span>
          <h2 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">Du bassin à votre table.</h2>
          <div className="mt-11 grid gap-8 rounded-l border border-paper/10 bg-waterDeep p-9 md:grid-cols-2 md:items-center md:p-11">
            <div className="aspect-[4/3] rounded-m bg-gradient-to-br from-[#2A5E56] to-[#0E2622]" />
            <div>
              <h3 className="font-serif text-[26px] font-semibold">{product.name}</h3>
              <div className="mt-3 flex items-center gap-2 text-[14px] font-bold text-ok">
                <span className={`status-dot status-${product.stock_status}`} />
                {STATUS_LABEL[product.stock_status] ?? "Disponible"}
              </div>
              <div className="mt-5 border-t border-paper/15">
                <div className="flex justify-between border-b border-paper/15 py-3.5 text-[15px]">
                  <span>1 à {product.bulk_min_kg - 1} kg</span>
                  <b className="font-serif text-[19px] text-gold">{formatFCFA(product.price_standard)}/kg</b>
                </div>
                <div className="flex justify-between border-b border-paper/15 py-3.5 text-[15px]">
                  <span>À partir de {product.bulk_min_kg} kg</span>
                  <b className="font-serif text-[19px] text-gold">{formatFCFA(product.price_bulk)}/kg</b>
                </div>
              </div>
              {product.next_availability && (
                <p className="mt-4 text-[14px] text-paper/65">Prochaine disponibilité : {product.next_availability}</p>
              )}
              <Link href="/commander" className="btn btn-gold mt-5">Commander</Link>
            </div>
          </div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section id="histoire" className="px-5 py-[72px]">
        <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-2 md:items-start">
          <div className="aspect-[5/4] rounded-l bg-gradient-to-br from-gold via-[#E7B368] to-bgAlt" />
          <div>
            <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Notre histoire</span>
            <h2 className="font-serif text-[clamp(26px,4vw,36px)] font-semibold">
              Une entreprise agricole camerounaise, construite pas à pas.
            </h2>
            {histoireParagraphs.map((p, i) => (
              <p key={i} className="mt-4 max-w-[62ch] text-inkSoft first:mt-4">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Ils nous font confiance</span>
          <h2 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">Avis clients.</h2>
          {reviews.length === 0 ? (
            <div className="mt-9 rounded-m border border-dashed border-ink/15 bg-paper p-10 text-center">
              <p className="mx-auto max-w-[52ch] text-inkSoft">
                Les avis de nos clients seront publiés ici au fur et à mesure des livraisons.
              </p>
            </div>
          ) : (
            <div className="mt-9 grid gap-4.5 md:grid-cols-3">
              {reviews.map((r: any) => (
                <div key={r.id} className="rounded-m border border-ink/10 bg-paper p-6">
                  <p className="text-[15px] text-inkSoft">« {r.content} »</p>
                  <p className="mt-3 text-[13.5px] font-semibold">
                    {r.author_name}{r.client_type && <span className="font-normal text-inkSoft"> — {r.client_type}</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
