import Link from "next/link";
import { getContent } from "@/lib/content";

const ITEMS = [
  "Commandes en volume, à partir de 30 kg",
  "Tarif préférentiel : 2 400 FCFA/kg",
  "Régularité d'approvisionnement",
  "Livraison organisée à Yaoundé",
  "Possibilité de commandes récurrentes",
  "Contact direct avec la ferme",
];

export const revalidate = 60;

export default async function ProfessionnelsPage() {
  const intro = await getContent("professionnels_intro");
  return (
    <section className="bg-bgAlt px-5 py-[72px]">
      <div className="mx-auto grid max-w-[1180px] gap-11 md:grid-cols-2">
        <div>
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Vous êtes professionnel ?</span>
          <h1 className="font-serif text-[clamp(26px,4vw,36px)] font-semibold">
            Restaurants et poissonneries, approvisionnez-vous directement à la ferme.
          </h1>
          <p className="mt-2 max-w-[56ch] text-inkSoft">{intro}</p>
          <Link href="/commander" className="btn btn-ink mt-5">Devenir client professionnel</Link>
        </div>
        <ul className="list-none p-0">
          {ITEMS.map((item) => (
            <li key={item} className="flex gap-3 border-b border-ink/10 py-2.5 text-[15px] text-inkSoft">
              <span className="text-water">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
