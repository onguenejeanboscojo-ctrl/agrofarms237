
import Link from "next/link";
import { getContent } from "@/lib/content";
import ProfessionnelsForm from "@/components/ProfessionnelsForm";

export const revalidate = 60;

const TARGETS = [
  {
    number: "01",
    title: "Restaurants & hôtels",
    text: "Présentez-nous vos besoins en produits, vos volumes et la fréquence de vos commandes pour étudier une solution adaptée à votre établissement.",
    tag: "Restauration",
  },
  {
    number: "02",
    title: "Poissonneries",
    text: "Développez votre activité en échangeant directement avec AgroFarms237 sur les produits recherchés et les possibilités d’approvisionnement.",
    tag: "Distribution",
  },
  {
    number: "03",
    title: "Supermarchés & grandes surfaces",
    text: "Étudions ensemble vos besoins en volume, les produits recherchés et les modalités d’une collaboration commerciale.",
    tag: "Grande distribution",
  },
  {
    number: "04",
    title: "Revendeurs & distributeurs",
    text: "Construisons une relation commerciale adaptée à votre marché, à vos clients et à vos objectifs de développement.",
    tag: "Revente",
  },
  {
    number: "05",
    title: "Traiteurs & événementiel",
    text: "Présentez vos besoins ponctuels ou récurrents afin d’étudier les volumes et les conditions possibles.",
    tag: "Commandes spécifiques",
  },
  {
    number: "06",
    title: "Autres professionnels",
    text: "Vous avez un projet particulier ou représentez une autre structure ? Décrivez-nous votre activité et vos attentes.",
    tag: "Sur mesure",
  },
];

const BENEFITS = [
  {
    number: "01",
    title: "Des échanges directs",
    text: "Vous présentez vos besoins à AgroFarms237 pour étudier les possibilités de collaboration.",
  },
  {
    number: "02",
    title: "Des volumes adaptés",
    text: "Nous échangeons sur les quantités recherchées et les conditions envisageables selon votre demande.",
  },
  {
    number: "03",
    title: "Une relation durable",
    text: "Nous pouvons étudier des commandes récurrentes selon les produits, les disponibilités et vos besoins.",
  },
  {
    number: "04",
    title: "Une offre étudiée ensemble",
    text: "Les conditions commerciales sont discutées selon votre activité et la nature de votre demande.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Présentez votre activité",
    text: "Indiquez votre entreprise, votre secteur et les produits qui vous intéressent.",
  },
  {
    number: "02",
    title: "Précisez vos besoins",
    text: "Décrivez les volumes recherchés, la fréquence des commandes et vos attentes.",
  },
  {
    number: "03",
    title: "Échangeons sur votre demande",
    text: "Notre équipe pourra étudier les possibilités et échanger avec vous sur les conditions envisageables.",
  },
  {
    number: "04",
    title: "Construisons la collaboration",
    text: "Si les conditions conviennent aux deux parties, nous pourrons définir les modalités de travail.",
  },
];

export default async function ProfessionnelsPage() {
  const intro = await getContent("professionnels_intro");

  return (
    <main className="overflow-hidden bg-paper text-ink">
      {/* HERO */}
      <section className="relative isolate min-h-[610px] overflow-hidden bg-[#0b211b] text-paper">
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/education/modules/gestion-exploitation.jpg"
            alt="Activités agricoles AgroFarms237"
            className="h-full w-full scale-[1.03] object-cover"
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071713]/95 via-[#0b211b]/85 to-[#0b211b]/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071713]/70 via-transparent to-transparent" />

        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 md:min-h-[610px] md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div className="max-w-[760px]">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#d7b46a]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e7ca8b]">
                Espace professionnel · AgroFarms237
              </span>
            </div>

            <h1 className="font-serif text-[clamp(42px,6vw,76px)] font-semibold leading-[0.99] tracking-[-0.035em]">
              Votre activité mérite
              <br />
              <span className="italic text-[#dfc184]">
                un partenaire
              </span>
              <br />
              à la hauteur.
            </h1>

            <p className="mt-7 max-w-[610px] text-base leading-7 text-white/75 md:text-lg md:leading-8">
              Restaurants, poissonneries, hôtels, supermarchés et
              distributeurs : parlons de vos besoins et construisons
              ensemble une solution d’approvisionnement adaptée à votre activité.
            </p>

            {intro && (
              <p className="mt-4 max-w-[600px] text-sm leading-6 text-white/60">
                {intro}
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#demande-professionnelle"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8b66f] px-7 py-3 text-sm font-bold text-[#10231c] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e8ca8b]"
              >
                Demander une offre
                <span className="ml-3 text-lg">↗</span>
              </a>

              <Link
                href="/produits"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#10231c]"
              >
                Découvrir nos produits
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/65">
              <span>Approvisionnement professionnel</span>
              <span>Commandes en volume</span>
              <span>Partenariats étudiés sur mesure</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-auto max-w-[350px] rounded-[28px] border border-white/15 bg-[#10251f]/75 p-7 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfc184]">
                Votre projet
              </span>

              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight">
                Une demande.
                <br />
                Un échange.
                <br />
                Une solution à étudier.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/65">
                Parlez-nous de votre entreprise, de vos produits et de vos
                besoins. Nous étudierons avec vous les possibilités de
                collaboration.
              </p>

              <a
                href="#demande-professionnelle"
                className="mt-7 flex items-center justify-between border-t border-white/15 pt-5 text-sm font-semibold text-[#e6c986] transition hover:text-white"
              >
                Présenter mon projet
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1120px] gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a17b36]">
              Bienvenue aux professionnels
            </span>

            <h2 className="mt-5 font-serif text-[clamp(32px,4vw,48px)] font-semibold leading-tight">
              Une collaboration commence par une bonne compréhension de vos besoins.
            </h2>
          </div>

          <div className="md:pt-8">
            <p className="text-base leading-8 text-inkSoft">
              Chez AgroFarms237, nous souhaitons développer des relations
              professionnelles fondées sur l’échange, la compréhension des
              besoins et la recherche de conditions adaptées à chaque activité.
            </p>

            <p className="mt-5 text-base leading-8 text-inkSoft">
              Que vous recherchiez des produits pour votre restaurant, votre
              poissonnerie, votre commerce ou votre réseau de distribution,
              présentez-nous votre projet. Nous pourrons examiner ensemble
              les possibilités d’approvisionnement et de partenariat.
            </p>

            <a
              href="#offres"
              className="mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#8a672b] transition hover:gap-5"
            >
              Découvrir nos solutions
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* TYPES DE CLIENTS */}
      <section id="offres" className="bg-[#f2eee4] px-5 py-20 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-[720px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a17b36]">
                À chaque activité ses besoins
              </span>

              <h2 className="mt-4 font-serif text-[clamp(34px,5vw,54px)] font-semibold leading-tight">
                Des solutions pensées pour votre métier.
              </h2>
            </div>

            <p className="max-w-[380px] text-sm leading-7 text-inkSoft">
              Sélectionnez votre profil et expliquez-nous ce que vous recherchez
              pour que nous puissions étudier votre demande.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TARGETS.map((target) => (
              <article
                key={target.number}
                className="group flex min-h-[275px] flex-col border border-[#14251e]/10 bg-paper p-7 transition duration-300 hover:-translate-y-1 hover:border-[#b18a43]/60 hover:shadow-[0_18px_50px_rgba(8,24,21,0.08)] md:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif text-3xl text-[#c7a35c]/70">
                    {target.number}
                  </span>

                  <span className="rounded-full border border-[#b18a43]/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#88672f]">
                    {target.tag}
                  </span>
                </div>

                <h3 className="mt-7 font-serif text-2xl font-semibold leading-tight">
                  {target.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-inkSoft">
                  {target.text}
                </p>

                <a
                  href="#demande-professionnelle"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#89672f] transition group-hover:gap-4"
                >
                  Étudier mon besoin
                  <span>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a17b36]">
              Pourquoi nous contacter ?
            </span>

            <h2 className="mt-5 font-serif text-[clamp(34px,4vw,48px)] font-semibold leading-tight">
              Construisons une relation commerciale qui a du sens.
            </h2>

            <p className="mt-5 text-sm leading-7 text-inkSoft">
              Chaque activité a ses contraintes. Notre démarche consiste à
              comprendre les vôtres avant d’étudier une proposition.
            </p>

            <a
              href="#demande-professionnelle"
              className="mt-7 inline-flex items-center justify-center rounded-full bg-[#10251d] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#234334]"
            >
              Échanger avec AgroFarms237
            </a>
          </div>

          <div className="divide-y divide-ink/10">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.number}
                className="grid gap-3 py-6 first:pt-0 sm:grid-cols-[65px_1fr]"
              >
                <span className="font-serif text-2xl text-[#b08b47]">
                  {benefit.number}
                </span>

                <div>
                  <h3 className="font-serif text-xl font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-inkSoft">
                    {benefit.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="bg-[#10251d] px-5 py-20 text-paper md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[700px]">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#dfc184]">
              Comment ça fonctionne ?
            </span>

            <h2 className="mt-4 font-serif text-[clamp(34px,5vw,52px)] font-semibold leading-tight">
              De votre première demande à une collaboration structurée.
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/65">
              Un parcours simple pour présenter votre activité et étudier
              ensemble les possibilités.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="border-t border-white/20 pt-6"
              >
                <span className="font-serif text-4xl text-[#dfc184]">
                  {step.number}
                </span>

                <h3 className="mt-5 font-serif text-xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/65">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FILIÈRES ET CATALOGUE */}
      <section className="px-5 py-20 md:py-24">
        <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[28px] border border-ink/10 bg-[#f2eee4] md:grid-cols-[1fr_auto] md:items-center">
          <div className="p-7 md:p-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a17b36]">
              Nos produits
            </span>

            <h2 className="mt-4 max-w-[650px] font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight">
              Parlons des produits qui correspondent à votre activité.
            </h2>

            <p className="mt-4 max-w-[620px] text-sm leading-7 text-inkSoft">
              Consultez notre catalogue pour découvrir les produits présentés
              par AgroFarms237, puis précisez dans votre demande ceux qui
              répondent à vos besoins.
            </p>
          </div>

          <div className="px-7 pb-8 md:px-10 md:py-10">
            <Link
              href="/produits"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#10251d] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#234334]"
            >
              Consulter le catalogue
              <span className="ml-3 text-lg">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section
        id="demande-professionnelle"
        className="scroll-mt-20 bg-[#0b1b16] px-5 py-20 text-paper md:py-28"
      >
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#dfc184]">
              Développons votre activité
            </span>

            <h2 className="mt-5 font-serif text-[clamp(36px,5vw,56px)] font-semibold leading-tight">
              Parlez-nous de votre projet.
            </h2>

            <p className="mt-5 text-base leading-8 text-white/65">
              Vous recherchez un fournisseur, souhaitez acheter en volume ou
              envisagez un partenariat ? Présentez-nous votre activité et
              vos besoins.
            </p>

            <p className="mt-5 text-sm leading-7 text-white/50">
              Plus votre demande est précise, plus il sera facile d’étudier
              les possibilités de collaboration adaptées à votre entreprise.
            </p>

            <div className="mt-9 border-t border-white/15 pt-6">
              <p className="font-serif text-xl text-[#dfc184]">
                AgroFarms237
              </p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Des échanges directs pour étudier des relations commerciales
                durables.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 sm:p-8">
            <h3 className="mb-2 font-serif text-2xl font-semibold">
              Votre demande professionnelle
            </h3>

            <p className="mb-7 text-sm leading-6 text-white/55">
              Complétez le formulaire pour nous présenter votre besoin.
            </p>

            <ProfessionnelsForm />
          </div>
        </div>
      </section>
    </main>
  );
}
