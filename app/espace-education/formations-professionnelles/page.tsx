import Link from "next/link";

const modules = [
  {
    number: "01",
    title: "Construire son projet agricole",
    description:
      "Passer d'une idée à un projet structuré et cohérent.",
    items: [
      "Choisir une activité adaptée à son contexte",
      "Identifier son marché et ses clients",
      "Définir ses objectifs de production",
      "Évaluer les ressources nécessaires",
      "Identifier les principaux risques du projet",
      "Construire une première vision économique de son activité",
    ],
  },
  {
    number: "02",
    title: "Préparer et mettre en place son exploitation",
    description:
      "Comprendre les éléments indispensables avant de démarrer la production.",
    items: [
      "Choix et organisation du site",
      "Infrastructures et équipements",
      "Organisation de l'espace de travail",
      "Approvisionnement et gestion des ressources",
      "Organisation du travail",
      "Préparation du démarrage de l'activité",
    ],
  },
  {
    number: "03",
    title: "Maîtriser la production",
    description:
      "Comprendre les principes essentiels pour produire dans de bonnes conditions.",
    items: [
      "Comprendre le cycle de production",
      "Mettre en place une organisation régulière",
      "Suivre les performances de production",
      "Réduire les pertes évitables",
      "Mettre en place des pratiques d'hygiène adaptées",
      "Identifier les principaux problèmes rencontrés en production",
    ],
  },
  {
    number: "04",
    title: "Gérer et suivre son exploitation",
    description:
      "Apprendre à piloter son activité avec des données concrètes.",
    items: [
      "Tenir un cahier de production",
      "Suivre les dépenses",
      "Gérer les stocks",
      "Calculer les principaux coûts",
      "Suivre les indicateurs de performance",
      "Organiser le suivi quotidien de l'exploitation",
    ],
  },
  {
    number: "05",
    title: "Calculer sa rentabilité",
    description:
      "Savoir combien coûte réellement son activité et ce qu'elle peut rapporter.",
    items: [
      "Calculer son coût de revient",
      "Déterminer son prix de vente",
      "Calculer sa marge",
      "Comprendre le seuil de rentabilité",
      "Construire un prévisionnel simple",
      "Identifier les leviers d'amélioration de la rentabilité",
    ],
  },
  {
    number: "06",
    title: "Commercialiser sa production",
    description:
      "Ne pas seulement produire : apprendre à vendre correctement.",
    items: [
      "Identifier ses débouchés",
      "Comprendre les attentes des clients",
      "Construire son offre",
      "Fixer son prix",
      "Développer la vente directe",
      "Utiliser la communication digitale pour trouver des clients",
    ],
  },
  {
    number: "07",
    title: "Passer du projet à l'entreprise",
    description:
      "Structurer son activité et préparer son développement.",
    items: [
      "Organiser son activité comme une véritable entreprise",
      "Définir ses priorités",
      "Construire son plan d'action",
      "Anticiper les besoins futurs",
      "Développer son réseau",
      "Éviter les erreurs fréquentes des débuts",
    ],
  },
  {
    number: "08",
    title: "Atelier pratique : construire son propre projet",
    description:
      "Mettre immédiatement en pratique les connaissances acquises.",
    items: [
      "Définir son activité",
      "Construire son modèle économique",
      "Lister ses investissements",
      "Estimer ses charges",
      "Calculer ses coûts",
      "Définir son prix de vente",
      "Identifier ses clients",
      "Élaborer son plan d'action",
    ],
  },
];

const dayProgram = [
  {
    day: "Jour 01",
    title: "De l'idée au projet",
    text:
      "Comprendre son marché, choisir son activité, définir son modèle et préparer les bases de son exploitation.",
    points: [
      "Projet et opportunité agricole",
      "Choix de l'activité",
      "Marché et clientèle",
      "Site, équipements et ressources",
      "Construction du projet",
    ],
  },
  {
    day: "Jour 02",
    title: "Produire et gérer",
    text:
      "Comprendre l'organisation de la production et apprendre à suivre efficacement son exploitation.",
    points: [
      "Organisation de la production",
      "Suivi technique",
      "Hygiène et prévention des pertes",
      "Gestion des stocks",
      "Suivi des dépenses et performances",
    ],
  },
  {
    day: "Jour 03",
    title: "Rentabiliser et développer",
    text:
      "Transformer son activité en véritable projet économique et construire son plan d'action.",
    points: [
      "Coût de revient",
      "Prix et marge",
      "Rentabilité",
      "Commercialisation",
      "Plan d'action personnel",
    ],
  },
];

const takeaways = [
  "Un projet agricole structuré",
  "Une méthode de calcul des coûts et de la rentabilité",
  "Des outils simples de suivi et de gestion",
  "Une meilleure compréhension du marché",
  "Une stratégie de commercialisation",
  "Un plan d'action personnel",
  "Des bases solides pour démarrer ou améliorer son activité",
];

export default function ProfessionalTrainingPage() {
  return (
    <main className="bg-paper text-ink">
      {/* HERO */}
      <section className="relative min-h-[720px] overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <img
            src="/images/education/modules/gestion-exploitation.jpg"
            alt="Formation professionnelle AgroFarms237"
            className="h-full w-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        </div>

        <div className="relative mx-auto flex min-h-[720px] max-w-[1200px] items-center px-5 py-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              AgroFarms237 · Formation professionnelle
            </p>

            <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
              Vous souhaitez vous lancer
              <span className="block text-[#D8C69A]">
                en professionnel ?
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              Apprenez à transformer votre projet agricole
              en une activité structurée, maîtrisée et pensée
              pour la rentabilité.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                3 jours
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                Présentiel
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                60 000 FCFA
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                Places limitées
              </span>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#programme"
                className="inline-flex items-center justify-center rounded-xl bg-[#D8C69A] px-6 py-3.5 text-sm font-semibold text-ink transition hover:translate-y-[-1px]"
              >
                Découvrir le programme
              </a>

              <a
                href="#prochaine-session"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Voir la prochaine session
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-[1050px] px-5 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-inkSoft">
              Pourquoi cette formation ?
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Produire ne suffit pas.
              <span className="block">
                Il faut savoir gérer.
              </span>
            </h2>
          </div>

          <div className="text-[17px] leading-8 text-inkSoft">
            <p>
              Beaucoup de projets agricoles commencent avec une
              bonne idée, mais sans véritable préparation
              économique, technique ou commerciale.
            </p>

            <p className="mt-5">
              Cette formation a été pensée pour donner aux
              futurs entrepreneurs agricoles une vision plus
              complète de leur activité : comprendre ce qu'il
              faut produire, comment l'organiser, combien cela
              coûte, comment vendre et surtout comment construire
              une activité capable de se développer.
            </p>

            <p className="mt-5 font-medium text-ink">
              Pendant trois jours, vous passez de la réflexion
              à la construction concrète de votre projet.
            </p>
          </div>
        </div>
      </section>

      {/* CHIFFRES */}
      <section className="border-y border-ink/10 bg-bgAlt">
        <div className="mx-auto grid max-w-[1050px] grid-cols-2 md:grid-cols-4">
          {[
            ["03", "jours de formation"],
            ["08", "blocs de travail"],
            ["15", "participants par session"],
            ["60K", "FCFA la formation"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="border-r border-ink/10 px-5 py-8 last:border-r-0 md:px-8 md:py-10"
            >
              <p className="font-serif text-3xl font-semibold md:text-4xl">
                {value}
              </p>

              <p className="mt-2 text-sm text-inkSoft">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMME */}
      <section
        id="programme"
        className="mx-auto max-w-[1050px] scroll-mt-20 px-5 py-20 md:py-28"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-inkSoft">
            Le programme
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Tout ce que vous allez apprendre.
          </h2>

          <p className="mt-5 text-lg leading-8 text-inkSoft">
            Chaque module répond à une étape concrète de la
            construction et du développement d'une activité
            agricole.
          </p>
        </div>

        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {modules.map((module) => (
            <details
              key={module.number}
              className="group"
            >
              <summary className="flex cursor-pointer list-none items-center gap-5 py-6 md:py-7">
                <span className="font-serif text-sm font-semibold text-inkSoft">
                  {module.number}
                </span>

                <div className="flex-1">
                  <h3 className="font-serif text-xl font-semibold md:text-2xl">
                    {module.title}
                  </h3>

                  <p className="mt-1 text-sm text-inkSoft">
                    {module.description}
                  </p>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-xl transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="pb-7 pl-10 md:pl-[4.5rem]">
                <ul className="grid gap-3 md:grid-cols-2">
                  {module.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-6 text-inkSoft"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 3 JOURS */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-[1050px] px-5 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/50">
              Une progression sur 3 jours
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Du projet à l'action.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/65">
              La formation est organisée pour avancer
              progressivement : comprendre, construire, puis
              mettre en place son plan d'action.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {dayProgram.map((day) => (
              <article
                key={day.day}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D8C69A]">
                  {day.day}
                </p>

                <h3 className="mt-4 font-serif text-2xl font-semibold">
                  {day.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  {day.text}
                </p>

                <ul className="mt-6 space-y-3">
                  {day.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-6 text-white/75"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D8C69A]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER */}
      <section className="mx-auto max-w-[1050px] px-5 py-20 md:py-28">
        <div className="overflow-hidden rounded-3xl border border-ink/10 bg-bgAlt">
          <div className="grid md:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[#D8C69A] p-8 md:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
                Atelier final
              </p>

              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight">
                Construisez votre propre projet.
              </h2>

              <p className="mt-5 leading-7 text-ink/70">
                La formation ne s'arrête pas à la théorie.
                Vous appliquez les notions étudiées à votre
                propre projet agricole.
              </p>
            </div>

            <div className="p-8 md:p-12">
              <p className="text-sm leading-7 text-inkSoft">
                À partir de votre idée ou de votre activité
                existante, vous travaillez sur les principaux
                éléments de votre modèle économique.
              </p>

              <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  "Votre activité",
                  "Vos besoins",
                  "Vos investissements",
                  "Vos charges",
                  "Vos coûts de production",
                  "Votre prix de vente",
                  "Vos clients",
                  "Votre plan d'action",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-white">
                      ✓
                    </span>

                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ACQUIS */}
      <section className="border-y border-ink/10 bg-bgAlt">
        <div className="mx-auto max-w-[1050px] px-5 py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-inkSoft">
                À la fin de la formation
              </p>

              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight">
                Vous repartez avec plus qu'un cours.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {takeaways.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-ink/10 bg-paper p-5"
                >
                  <div className="flex gap-3">
                    <span className="mt-1 text-sm font-semibold text-ink">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-inkSoft">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POUR QUI */}
      <section className="mx-auto max-w-[1050px] px-5 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-inkSoft">
            Pour qui ?
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Cette formation est faite pour vous si…
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            "Vous souhaitez vous lancer dans une activité agricole.",
            "Vous avez déjà une exploitation et souhaitez mieux la structurer.",
            "Vous êtes porteur d'un projet agricole.",
            "Vous souhaitez développer une activité de pisciculture, d'élevage ou d'aviculture.",
            "Vous voulez comprendre la rentabilité avant d'investir.",
            "Vous souhaitez transformer une activité informelle en véritable projet d'entreprise.",
          ].map((item, index) => (
            <div
              key={item}
              className="flex gap-5 rounded-2xl border border-ink/10 p-6"
            >
              <span className="font-serif text-lg font-semibold text-inkSoft">
                0{index + 1}
              </span>

              <p className="text-[15px] leading-7 text-inkSoft">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCHAINE SESSION */}
      <section
        id="prochaine-session"
        className="scroll-mt-20 bg-ink text-white"
      >
        <div className="mx-auto max-w-[1050px] px-5 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#D8C69A]">
                Prochaine session
              </p>

              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
                Prêt à passer de l'idée au projet ?
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                Les sessions sont volontairement limitées en
                nombre de participants afin de favoriser les
                échanges et le travail pratique.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-7 md:min-w-[290px]">
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/40">
                    Tarif
                  </p>

                  <p className="mt-1 font-serif text-3xl font-semibold">
                    60 000 FCFA
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/40">
                    Durée
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    3 jours · Présentiel
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/40">
                    Capacité
                  </p>

                  <p className="mt-1 text-sm text-white/75">
                    15 participants maximum
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-sm text-white/50">
              La date de la prochaine session sera annoncée
              prochainement.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-[#D8C69A] px-7 py-4 text-sm font-semibold text-ink transition hover:translate-y-[-1px]"
              >
                Je souhaite m'inscrire
              </Link>

              <a
                href="#programme"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Revoir le programme
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1050px] px-5 py-20 text-center md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-inkSoft">
          AgroFarms237
        </p>

        <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
          La qualité commence à la ferme.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-inkSoft">
          Et une activité agricole durable commence par de
          bonnes bases.
        </p>

        <a
          href="#prochaine-session"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-ink px-7 py-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Rejoindre la prochaine session →
        </a>
      </section>
    </main>
  );
}
