import Link from "next/link";
import { getContent } from "@/lib/content";
import ProfessionnelsForm from "@/components/ProfessionnelsForm";

const TARGETS = [
  {
    title: "Grandes surfaces",
    text: "Pour les structures recherchant un approvisionnement organisé en volume.",
  },
  {
    title: "Poissonneries",
    text: "Pour les professionnels qui souhaitent s'approvisionner directement auprès de la ferme.",
  },
  {
    title: "Restaurants & hôtels",
    text: "Pour les établissements ayant des besoins réguliers en produits agricoles.",
  },
  {
    title: "Traiteurs",
    text: "Pour les activités nécessitant des volumes adaptés à leurs prestations.",
  },
  {
    title: "Revendeurs & distributeurs",
    text: "Pour les professionnels qui souhaitent développer une relation d'approvisionnement avec AgroFarms237.",
  },
  {
    title: "Autres professionnels",
    text: "Vous avez un besoin spécifique ? Présentez-nous votre activité.",
  },
];

const APPROACH = [
  {
    number: "01",
    title: "Vous présentez votre besoin",
    text: "Vous nous indiquez votre activité, les produits recherchés et vos besoins en volume.",
  },
  {
    number: "02",
    title: "Nous étudions votre demande",
    text: "Notre équipe analyse votre besoin et les conditions d'approvisionnement envisageables.",
  },
  {
    number: "03",
    title: "Nous échangeons sur l'offre",
    text: "Nous discutons ensemble des volumes, de la fréquence et des conditions adaptées.",
  },
  {
    number: "04",
    title: "Nous construisons la collaboration",
    text: "Lorsque les conditions sont réunies, nous pouvons mettre en place une relation d'approvisionnement.",
  },
];

export const revalidate = 60;

export default async function ProfessionnelsPage() {
  const intro = await getContent("professionnels_intro");

  return (
    <main className="bg-bgAlt">
      {/* Hero */}
      <section className="px-5 py-[72px] md:py-[96px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[760px]">
            <span className="mb-3 inline-block text-[13px] font-bold text-goldDeep">
              Vous êtes professionnel ?
            </span>

            <h1 className="font-serif text-[clamp(32px,5vw,52px)] font-semibold leading-[1.08] text-ink">
              Construisons une offre adaptée à votre activité.
            </h1>

            <p className="mt-5 max-w-[64ch] text-[16px] leading-7 text-inkSoft">
              {intro}
            </p>

            <p className="mt-3 max-w-[64ch] text-[15px] leading-7 text-inkSoft">
              Restaurants, hôtels, poissonneries, grandes surfaces,
              traiteurs, revendeurs ou distributeurs : présentez-nous
              votre besoin et échangeons sur les possibilités
              d&apos;approvisionnement avec AgroFarms237.
            </p>

            <div className="mt-7 flex flex-wrap gap-3.5">
              <a href="#demande-professionnelle" className="btn btn-ink">
                Demander une offre professionnelle
              </a>

              <Link
                href="/commander"
                className="btn btn-outline"
              >
                Découvrir nos produits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section className="border-t border-ink/10 bg-paper px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[700px]">
            <span className="text-[13px] font-bold text-goldDeep">
              Pour qui ?
            </span>

            <h2 className="mt-2 font-serif text-[clamp(27px,4vw,38px)] font-semibold text-ink">
              Des solutions pour différents besoins professionnels.
            </h2>

            <p className="mt-3 text-inkSoft">
              Notre approche commence par la compréhension de votre
              activité et de vos besoins d&apos;approvisionnement.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TARGETS.map((target) => (
              <article
                key={target.title}
                className="border border-ink/10 bg-bgAlt p-6"
              >
                <h3 className="font-serif text-[21px] font-semibold text-ink">
                  {target.title}
                </h3>

                <p className="mt-2 text-[14px] leading-6 text-inkSoft">
                  {target.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Notre approche */}
      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[700px]">
            <span className="text-[13px] font-bold text-goldDeep">
              Notre approche
            </span>

            <h2 className="mt-2 font-serif text-[clamp(27px,4vw,38px)] font-semibold text-ink">
              Une relation construite autour de votre besoin.
            </h2>

            <p className="mt-3 text-inkSoft">
              Nous privilégions un échange direct afin de comprendre
              votre activité avant de définir les conditions d&apos;une
              éventuelle collaboration.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {APPROACH.map((step) => (
              <article
                key={step.number}
                className="border-t border-ink/15 pt-5"
              >
                <span className="text-[12px] font-bold tracking-[0.08em] text-goldDeep">
                  {step.number}
                </span>

                <h3 className="mt-2 font-serif text-[22px] font-semibold text-ink">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-[52ch] text-[14px] leading-6 text-inkSoft">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Filières */}
      <section className="bg-waterDeep px-5 py-[64px] text-paper">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[680px]">
            <span className="text-[13px] font-bold text-gold">
              Nos filières
            </span>

            <h2 className="mt-2 font-serif text-[clamp(27px,4vw,38px)] font-semibold">
              Plusieurs activités agricoles au sein d&apos;AgroFarms237.
            </h2>

            <p className="mt-3 max-w-[62ch] text-paper/65">
              Découvrez les produits actuellement proposés et
              présentez-nous les filières qui correspondent à votre
              activité.
            </p>
          </div>

          <Link
            href="/produits"
            className="btn btn-gold shrink-0"
          >
            Voir le catalogue
          </Link>
        </div>
      </section>

      {/* Formulaire */}
      <section
        id="demande-professionnelle"
        className="bg-ink px-5 py-[80px] text-paper"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[720px]">
            <span className="text-[13px] font-bold text-gold">
              Travaillons ensemble
            </span>

            <h2 className="mt-2 font-serif text-[clamp(28px,4vw,40px)] font-semibold">
              Présentez-nous votre projet.
            </h2>

            <p className="mt-3 max-w-[62ch] text-paper/65">
              Remplissez le formulaire ci-dessous. Votre demande sera
              enregistrée afin que nous puissions revenir vers vous
              pour échanger sur vos besoins.
            </p>
          </div>

          <ProfessionnelsForm />
        </div>
      </section>
    </main>
  );
}
