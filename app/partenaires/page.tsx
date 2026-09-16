import Link from "next/link";
import { getContent } from "@/lib/content";
import PartenairesForm from "@/components/PartenairesForm";

export const revalidate = 60;

export default async function PartenairesPage() {
  const intro = await getContent("partenaires_intro");
  return (
    <section className="bg-ink px-5 py-[72px] text-paper">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-gold">Partenaires &amp; investisseurs</span>
        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">Construisons l&apos;agriculture de demain.</h1>
        <p className="mt-2 max-w-[62ch] text-paper/70">{intro}</p>
        <div className="mt-7 flex flex-wrap gap-3.5">
          <Link href="/notre-elevage" className="btn btn-outline">Découvrir notre vision</Link>
        </div>
        <PartenairesForm />
      </div>
    </section>
  );
}
