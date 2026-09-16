import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatFCFA } from "@/lib/whatsapp";

export const revalidate = 60;

export default async function ProduitsPage() {
  let product = {
    name: "Silure frais", price_standard: 2500, price_bulk: 2400, bulk_min_kg: 30,
    stock_status: "disponible", next_availability: null as string | null,
  };
  try {
    const { data } = await supabaseAdmin().from("products").select("*").limit(1).single();
    if (data) product = data;
  } catch {
    // garde la valeur par défaut définie ci-dessus si Supabase n'est pas encore configuré
  }

  return (
    <section className="px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Nos produits</span>
        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">Du bassin à votre table.</h1>

        <div className="mt-10 max-w-[560px] rounded-l border border-ink/10 bg-paper p-8">
          <h2 className="font-serif text-2xl font-semibold">{product.name}</h2>
          <div className="mt-3 border-t border-ink/10">
            <div className="flex justify-between border-b border-ink/10 py-3.5">
              <span>1 à {product.bulk_min_kg - 1} kg</span>
              <b className="font-serif text-lg text-goldDeep">{formatFCFA(product.price_standard)}/kg</b>
            </div>
            <div className="flex justify-between border-b border-ink/10 py-3.5">
              <span>À partir de {product.bulk_min_kg} kg</span>
              <b className="font-serif text-lg text-goldDeep">{formatFCFA(product.price_bulk)}/kg</b>
            </div>
          </div>
          <Link href="/commander" className="btn btn-gold mt-6">Commander</Link>
        </div>

        <div className="mt-14 rounded-l border border-dashed border-ink/15 p-9 text-center">
          <p className="mx-auto max-w-[52ch] text-inkSoft">
            D&apos;autres produits arriveront ici au fil de l&apos;évolution de la ferme : silure fumé, puis produits
            porcins et avicoles. Voir <Link href="/notre-elevage" className="underline">notre vision</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
