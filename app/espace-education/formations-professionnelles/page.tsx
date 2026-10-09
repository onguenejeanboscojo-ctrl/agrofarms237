import Link from "next/link";
import ProfessionalTrainingRegistrationTrigger from "@/components/ProfessionalTrainingRegistrationTrigger";

export const revalidate = 30;

const programme = [
  {
    number: "01",
    title: "Construire son projet agricole",
    items: [
      "Définir son activité et ses objectifs",
      "Choisir une filière adaptée à son contexte",
      "Identifier ses besoins en terrain, matériel et ressources",
      "Évaluer son capital de départ",
    ],
  },
  {
    number: "02",
    title: "Préparer et mettre en place son exploitation",
    items: [
      "Organisation de l’espace de production",
      "Équipements et installations nécessaires",
      "Préparation avant le démarrage",
      "Planification des premières étapes",
    ],
  },
  {
    number: "03",
    title: "Maîtriser la production",
    items: [
      "Principes techniques de la production",
      "Alimentation et suivi",
      "Hygiène et prévention des problèmes",
      "Suivi des performances de production",
    ],
  },
  {
    number: "04",
    title: "Gérer et suivre son exploitation",
    items: [
      "Organisation quotidienne",
      "Suivi des dépenses",
      "Gestion des stocks",
      "Suivi des entrées et sorties",
    ],
  },
  {
    number: "05",
    title: "Calculer sa rentabilité",
    items: [
      "Identifier ses coûts réels",
      "Calculer son coût de revient",
      "Fixer un prix cohérent",
      "Calculer sa marge et sa rentabilité",
    ],
  },
  {
    number: "06",
    title: "Commercialiser sa production",
    items: [
      "Identifier ses clients",
      "Construire une offre adaptée",
      "Fixer ses prix",
      "Organiser la vente et la relation client",
    ],
  },
  {
    number: "07",
    title: "Passer du projet à l'entreprise",
    items: [
      "Structurer son activité",
      "Définir ses priorités",
      "Anticiper les besoins de trésorerie",
      "Construire une stratégie de développement",
    ],
  },
  {
    number: "08",
    title: "Atelier pratique : construire son propre projet",
    items: [
      "Définition de son projet",
      "Établissement d'un budget prévisionnel",
      "Identification des coûts",
      "Projection des ventes",
      "Plan d'action pour démarrer",
    ],
  },
];

const jours = [
  {
    number: "01",
    title: "De l’idée au projet",
    text: "Comprendre son activité, définir ses objectifs, choisir sa filière et construire les premières bases économiques de son projet.",
  },
  {
    number: "02",
    title: "Produire et gérer",
    text: "Comprendre l'organisation de la production, le suivi technique, les dépenses, les stocks et les indicateurs essentiels.",
  },
  {
    number: "03",
    title: "Rentabiliser et développer",
    text: "Calculer ses coûts, fixer ses prix, vendre sa production et transformer son projet agricole en activité structurée.",
  },
];

const avantages = [
  "Une formation intensive de 3 jours",
  "Des notions techniques et économiques applicables",
  "Des méthodes pour structurer son projet",
  "Un travail pratique autour de son propre projet",
  "Une meilleure compréhension des coûts et de la rentabilité",
  "Un plan d'action pour passer à la mise en œuvre",
];

export default function FormationsProfessionnellesPage() {
  return (
    <main className="bg-paper text-ink">
      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative isolate min-h-[680px] overflow-hidden bg-[#081815] md:min-h-[760px]">
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/education/modules/gestion-exploitation.jpg"
            alt="Formation professionnelle en gestion d’exploitation agricole"
            className="h-full w-full scale-105 object-cover object-center blur-[2px]"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,20,16,0.97)_0%,rgba(5,20,16,0.88)_48%,rgba(5,20,16,0.34)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#081815]/70 via-transparent to-[#081815]/25" />
        <div className="mx-auto grid min-h-[680px] max-w-[1280px] items-center gap-12 px-5 py-20 md:min-h-[760px] md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-24">
          <div className="max-w-[760px] text-paper">
            <span className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              AgroFarms237 · Académie agricole
            </span>
            <h1 className="font-serif text-[clamp(44px,6.6vw,82px)] font-semibold leading-[0.98] tracking-[-0.045em]">
              Faites grandir
              <br />
              votre projet.
              <br />
              <span className="italic text-gold">Bâtissez une activité.</span>
            </h1>
            <p className="mt-7 max-w-[620px] text-[16px] leading-7 text-white/75 md:text-[18px] md:leading-8">
              Une formation intensive pour apprendre à structurer votre exploitation, maîtriser vos coûts et préparer une activité agricole pensée pour durer.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-white/90 backdrop-blur">3 jours en présentiel</span>
              <span className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-white/90 backdrop-blur">8 modules pratiques</span>
              <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold text-gold backdrop-blur">60 000 FCFA</span>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#prochaine-session" className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-4 text-[12px] font-extrabold text-[#10271f] shadow-[0_12px_35px_rgba(196,157,70,0.22)] transition duration-300 hover:-translate-y-1 hover:brightness-110">
                Réserver ma place <span className="ml-3 text-lg">↗</span>
              </a>
              <a href="#programme" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.06] px-7 py-4 text-[12px] font-bold text-white backdrop-blur-md transition duration-300 hover:border-white/50 hover:bg-white/10">
                Explorer le programme <span className="ml-3 text-lg">↓</span>
              </a>
            </div>
            <p className="mt-5 text-xs tracking-wide text-white/45">Une approche technique, économique et orientée vers l’action.</p>
          </div>

          <div className="hidden md:block">
            <div className="ml-auto max-w-[360px] rounded-[30px] border border-white/20 bg-[#10271f]/65 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:p-7">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">Le parcours</span>
                <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] font-semibold text-gold">Formation pro</span>
              </div>
              <div className="py-6">
                <p className="font-serif text-5xl font-semibold tracking-tight text-paper">3 <span className="text-xl font-normal text-white/60">jours</span></p>
                <p className="mt-2 text-sm leading-6 text-white/60">Pour passer des idées aux premières décisions concrètes.</p>
              </div>
              <div className="space-y-4">
                {[
                  ["01", "Construire", "Clarifier votre projet et vos moyens"],
                  ["02", "Organiser", "Préparer la production et la gestion"],
                  ["03", "Développer", "Calculer, vendre et planifier la suite"],
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <span className="font-serif text-xl text-gold">{number}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                <span className="text-xs text-white/55">Investissement formation</span>
                <span className="font-serif text-xl font-semibold text-gold">60 000 FCFA</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      </section>

      {/* ===================================================== */}
      {/* INTRODUCTION                                           */}
      {/* ===================================================== */}

      <section className="px-5 py-[80px] md:py-[105px]">
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-start">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
              Pourquoi cette formation ?
            </span>

            <div className="mt-5 font-serif text-[72px] font-semibold leading-none text-ink/10">
              01
            </div>
          </div>

          <div>
            <h2 className="font-serif text-[clamp(32px,5vw,50px)] font-semibold leading-tight">
              Produire ne suffit pas.
              <br />
              Il faut savoir gérer son activité.
            </h2>

            <p className="mt-6 text-[16px] leading-7 text-inkSoft">
              Une exploitation agricole peut produire et pourtant manquer de
              rentabilité si les coûts, les stocks, les prix de vente ou la
              trésorerie ne sont pas correctement suivis.
            </p>

            <p className="mt-4 text-[16px] leading-7 text-inkSoft">
              Cette formation a donc été pensée pour aller au-delà de la simple
              technique. L'objectif est de vous aider à construire une activité
              agricole structurée, mesurable et capable d'évoluer.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="border-l-2 border-gold pl-4">
                <p className="font-serif text-xl font-semibold">Comprendre</p>
                <p className="mt-1 text-sm leading-6 text-inkSoft">
                  Les bases techniques et économiques.
                </p>
              </div>

              <div className="border-l-2 border-gold pl-4">
                <p className="font-serif text-xl font-semibold">Structurer</p>
                <p className="mt-1 text-sm leading-6 text-inkSoft">
                  Votre projet et votre organisation.
                </p>
              </div>

              <div className="border-l-2 border-gold pl-4">
                <p className="font-serif text-xl font-semibold">Rentabiliser</p>
                <p className="mt-1 text-sm leading-6 text-inkSoft">
                  Vos efforts et vos investissements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROGRAMME                                               */}
      {/* ===================================================== */}

      <section
        id="programme"
        className="scroll-mt-20 bg-[#f2efe6] px-5 py-[88px] md:py-[112px]"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
              Le programme
            </span>

            <h2 className="mt-4 font-serif text-[clamp(34px,5vw,52px)] font-semibold leading-tight">
              Tout ce que vous allez travailler pendant les 3 jours.
            </h2>

            <p className="mt-5 text-[16px] leading-7 text-inkSoft">
              Un parcours progressif qui part de la construction du projet et
              va jusqu'à la rentabilité, la commercialisation et la mise en
              œuvre.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[30px] border border-ink/10 bg-paper shadow-[0_24px_70px_rgba(8,24,21,0.06)]">
            {programme.map((module, index) => (
              <details
                key={module.number}
                open={index === 0}
                className="group border-b border-ink/10 transition-colors last:border-b-0 hover:bg-[#f8f6ef]"
              >
                <summary className="flex cursor-pointer list-none items-center gap-5 px-5 py-6 md:px-7 md:py-7">
                  <span className="font-serif text-lg font-semibold text-goldDeep">
                    {module.number}
                  </span>

                  <span className="flex-1 font-serif text-[21px] font-semibold md:text-[24px]">
                    {module.title}
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-lg transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="px-5 pb-7 pl-[68px] md:px-7 md:pb-8 md:pl-[92px]">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {module.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-6 text-inkSoft"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-goldDeep" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* 3 JOURS                                                 */}
      {/* ===================================================== */}

      <section className="px-5 py-[80px] md:py-[105px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
              3 jours pour structurer votre projet
            </span>

            <h2 className="mt-4 font-serif text-[clamp(34px,5vw,52px)] font-semibold">
              Une progression pensée pour passer à l'action.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {jours.map((jour) => (
              <article
                key={jour.number}
                className="group rounded-[26px] border border-ink/10 bg-paper p-7 shadow-[0_8px_30px_rgba(8,24,21,0.025)] transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_22px_55px_rgba(8,24,21,0.09)]"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2efe6] font-serif text-3xl font-semibold text-goldDeep transition duration-300 group-hover:bg-ink group-hover:text-gold">
                  {jour.number}
                </span>

                <h3 className="mt-6 font-serif text-2xl font-semibold">
                  {jour.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-inkSoft">
                  {jour.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* ATELIER FINAL                                           */}
      {/* ===================================================== */}

      <section className="bg-ink px-5 py-[80px] text-paper md:py-[105px]">
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
              Atelier pratique
            </span>

            <div className="mt-5 font-serif text-[80px] font-semibold leading-none text-paper/10">
              08
            </div>
          </div>

          <div>
            <h2 className="font-serif text-[clamp(32px,5vw,50px)] font-semibold leading-tight">
              Vous ne repartez pas seulement avec des notions.
            </h2>

            <p className="mt-6 text-[16px] leading-7 text-paper/70">
              Une partie de la formation est consacrée à votre propre projet.
              Vous travaillez sur les éléments essentiels qui vous permettront
              de mieux visualiser sa mise en œuvre.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Votre projet agricole",
                "Votre budget prévisionnel",
                "Vos principaux coûts",
                "Votre stratégie de vente",
                "Votre projection de revenus",
                "Votre plan d'action",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="text-gold">✓</span>
                  <span className="text-sm text-paper/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CE QUE VOUS OBTENEZ                                     */}
      {/* ===================================================== */}

      <section className="px-5 py-[80px] md:py-[105px]">
        <div className="mx-auto max-w-[1000px]">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
              À la fin de la formation
            </span>

            <h2 className="mt-4 font-serif text-[clamp(34px,5vw,50px)] font-semibold">
              Ce que vous devez pouvoir faire.
            </h2>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {avantages.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 border-b border-ink/10 py-4"
              >
                <span className="font-serif text-lg font-semibold text-goldDeep">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="text-sm leading-6 text-inkSoft">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* POUR QUI ?                                               */}
      {/* ===================================================== */}

      <section className="bg-bgAlt px-5 py-[80px] md:py-[105px]">
        <div className="mx-auto max-w-[1000px]">
          <div className="grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                Cette formation est pour vous si...
              </span>

              <h2 className="mt-4 font-serif text-[clamp(32px,5vw,46px)] font-semibold leading-tight">
                Vous voulez passer du projet à l'action.
              </h2>
            </div>

            <div className="grid gap-3">
              {[
                "Vous souhaitez démarrer une activité agricole.",
                "Vous avez déjà une exploitation et souhaitez mieux la structurer.",
                "Vous voulez comprendre vos coûts avant d'investir davantage.",
                "Vous souhaitez améliorer la rentabilité de votre production.",
                "Vous voulez construire un projet agricole plus solide.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-ink/10 bg-paper p-5"
                >
                  <p className="text-sm leading-6 text-inkSoft">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROCHAINE SESSION                                        */}
      {/* ===================================================== */}

      <section
        id="prochaine-session"
        className="scroll-mt-20 px-5 py-[85px] md:py-[110px]"
      >
        <div className="mx-auto max-w-[1000px]">
          <div className="overflow-hidden rounded-[32px] bg-ink text-paper">
            <div className="p-7 md:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                    Prochaine session
                  </span>

                  <h2 className="mt-4 font-serif text-[clamp(34px,5vw,52px)] font-semibold leading-tight">
                    Réservez votre place.
                  </h2>

                  <p className="mt-4 max-w-[600px] text-sm leading-6 text-paper/65">
                    La prochaine session sera organisée en présentiel.
                    Les dates et le lieu seront confirmés par AgroFarms237.
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-paper/45">
                    Tarif
                  </p>

                  <p className="mt-1 font-serif text-3xl font-semibold text-gold">
                    60 000 FCFA
                  </p>
                </div>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    Durée
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    3 jours
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    Format
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Présentiel
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    Capacité
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    15 participants
                  </p>
                </div>
              </div>

              <div className="mt-9">
                <ProfessionalTrainingRegistrationTrigger />
              </div>

              <p className="mt-4 text-xs leading-5 text-paper/45">
                Après votre demande, notre équipe vous contactera pour
                confirmer la session et vous communiquer les modalités
                d'inscription et de règlement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA FINAL                                                */}
      {/* ===================================================== */}

      <section className="border-t border-ink/10 bg-bgAlt px-5 py-[80px] md:py-[100px]">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
            AgroFarms237
          </span>

          <h2 className="mt-4 font-serif text-[clamp(34px,5vw,50px)] font-semibold leading-tight">
            Votre projet mérite une vraie préparation.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-inkSoft">
            Découvrez le programme, préparez vos questions et faites le
            premier pas vers une activité agricole mieux structurée.
          </p>

          <div className="mt-8">
            <ProfessionalTrainingRegistrationTrigger />
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* RETOUR ÉDUCATION                                        */}
      {/* ===================================================== */}

      <div className="px-5 py-8 text-center">
        <Link
          href="/espace-education"
          className="text-xs font-semibold text-inkSoft transition hover:text-ink"
        >
          ← Retour à l'espace Éducation
        </Link>
      </div>
    </main>
  );
}
