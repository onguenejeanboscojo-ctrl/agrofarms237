import Link from "next/link";
import { getContent } from "@/lib/content";
import PartenairesForm from "@/components/PartenairesForm";

export const revalidate = 60;

const PILLARS = [
  {
    number: "01",
    title: "Pisciculture",
    text: "Développer une production aquacole structurée et créer davantage de valeur autour des produits issus de la ferme.",
  },
  {
    number: "02",
    title: "Élevage porcin",
    text: "Construire progressivement une activité d'élevage organisée, pensée pour accompagner le développement de l'entreprise.",
  },
  {
    number: "03",
    title: "Aviculture",
    text: "Développer une filière avicole capable de s'intégrer dans une chaîne agricole plus large.",
  },
];

const TRAJECTORY = [
  {
    number: "01",
    title: "Produire",
    text: "Développer nos activités agricoles et renforcer progressivement nos capacités de production.",
  },
  {
    number: "02",
    title: "Structurer",
    text: "Mettre en place des méthodes, des équipements et une organisation adaptés au développement de l'entreprise.",
  },
  {
    number: "03",
    title: "Valoriser",
    text: "Aller au-delà de la production en développant progressivement la transformation et le conditionnement.",
  },
  {
    number: "04",
    title: "Distribuer",
    text: "Construire des circuits de commercialisation permettant de rapprocher les produits des différents marchés.",
  },
  {
    number: "05",
    title: "Changer d'échelle",
    text: "Accélérer progressivement le développement lorsque les fondations opérationnelles et commerciales sont réunies.",
  },
];

const PARTNER_TYPES = [
  {
    title: "Investisseurs",
    text: "Des personnes ou structures souhaitant accompagner le développement d'une entreprise agricole sur le long terme.",
  },
  {
    title: "Entrepreneurs",
    text: "Des entrepreneurs capables d'apporter leur expérience, leur réseau ou leur capacité à développer de nouvelles activités.",
  },
  {
    title: "Partenaires techniques",
    text: "Des acteurs disposant d'une expertise, de solutions ou d'équipements pouvant contribuer au développement de nos filières.",
  },
  {
    title: "Partenaires commerciaux",
    text: "Des entreprises souhaitant développer des débouchés, des circuits de distribution ou de nouvelles opportunités commerciales.",
  },
];

const OPPORTUNITIES = [
  "Production",
  "Transformation",
  "Conditionnement",
  "Distribution",
  "Marché",
];

const PROCESS = [
  {
    number: "01",
    title: "Premier contact",
    text: "Vous nous présentez votre profil, votre activité et la manière dont vous souhaitez envisager une collaboration.",
  },
  {
    number: "02",
    title: "Échange",
    text: "Nous prenons le temps de comprendre vos attentes, vos compétences et les possibilités de collaboration.",
  },
  {
    number: "03",
    title: "Étude",
    text: "Nous étudions ensemble les besoins, les opportunités et les conditions envisageables.",
  },
  {
    number: "04",
    title: "Définition du cadre",
    text: "Lorsque le projet est pertinent, les modalités de la collaboration sont discutées de manière claire.",
  },
  {
    number: "05",
    title: "Construction",
    text: "Les partenaires peuvent ensuite avancer ensemble sur les actions et projets retenus.",
  },
];

export default async function PartenairesPage() {
  const intro = await getContent("partenaires_intro");

  return (
    <main className="bg-bgAlt">
      {/* HERO */}
      <section className="bg-ink px-5 py-[88px] text-paper md:py-[112px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[820px]">
            <span className="mb-4 inline-block text-[13px] font-bold uppercase tracking-[0.08em] text-gold">
              Partenaires · Investissement &amp; développement
            </span>

            <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-semibold leading-[1.04] text-paper">
              Et si votre prochain investissement commençait à la ferme ?
            </h1>

            <p className="mt-6 max-w-[700px] text-[17px] leading-8 text-paper/70">
              AgroFarms237 construit une entreprise agricole autour de
              plusieurs filières : pisciculture, élevage porcin et
              aviculture. Notre ambition est de construire, étape par étape,
              une activité capable de créer davantage de valeur autour de la
              production agricole locale.
            </p>

            <p className="mt-4 max-w-[700px] text-[15px] leading-7 text-paper/55">
              {intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#investir" className="btn btn-gold">
                Parler d&apos;un investissement
              </a>

              <Link href="/notre-elevage" className="btn btn-outline">
                Découvrir notre vision
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="bg-paper px-5 py-[80px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[760px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-goldDeep">
              Notre vision
            </span>

            <h2 className="mt-2 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight text-ink">
              Nous ne construisons pas simplement une exploitation.
            </h2>

            <p className="mt-4 max-w-[680px] text-[16px] leading-7 text-inkSoft">
              Nous voulons construire progressivement une entreprise
              agricole structurée, capable de produire, valoriser et
              commercialiser ses propres produits.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.number}
                className="border border-ink/10 bg-bgAlt p-7"
              >
                <span className="text-[12px] font-bold tracking-[0.08em] text-goldDeep">
                  {pillar.number}
                </span>

                <h3 className="mt-3 font-serif text-[24px] font-semibold text-ink">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-[14px] leading-6 text-inkSoft">
                  {pillar.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRAJECTORY */}
      <section className="bg-bgAlt px-5 py-[80px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[720px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-goldDeep">
              Notre trajectoire
            </span>

            <h2 className="mt-2 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight text-ink">
              Une vision qui se construit par étapes.
            </h2>

            <p className="mt-4 text-[16px] leading-7 text-inkSoft">
              Le développement d&apos;AgroFarms237 s&apos;inscrit dans une
              logique progressive : consolider les fondamentaux avant
              d&apos;accélérer.
            </p>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {TRAJECTORY.map((step) => (
              <article
                key={step.number}
                className="border-t border-ink/15 pt-5"
              >
                <span className="text-[12px] font-bold tracking-[0.08em] text-goldDeep">
                  {step.number}
                </span>

                <h3 className="mt-2 font-serif text-[23px] font-semibold text-ink">
                  {step.title}
                </h3>

                <p className="mt-2 text-[14px] leading-6 text-inkSoft">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARTNERS */}
      <section className="bg-waterDeep px-5 py-[80px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[760px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gold">
              Pourquoi des partenaires ?
            </span>

            <h2
              className="mt-2 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight"
              style={{ color: "#F8F4EA", opacity: 1 }}
            >
              Certaines ambitions nécessitent plus qu&apos;une vision.
            </h2>

            <p
              className="mt-4 max-w-[680px] text-[16px] leading-7"
              style={{ color: "#D8D4C9", opacity: 1 }}
            >
              Le développement d&apos;une entreprise agricole peut nécessiter
              des ressources, des compétences et des connexions complémentaires.
              C&apos;est pourquoi nous souhaitons construire des relations avec
              des partenaires capables d&apos;apporter une contribution réelle
              au projet.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Infrastructures",
              "Équipements",
              "Capacité de production",
              "Transformation",
              "Conditionnement",
              "Logistique",
              "Développement commercial",
              "Accès à de nouveaux marchés",
            ].map((item) => (
              <div
                key={item}
                className="border p-5"
                style={{
                  borderColor: "rgba(248, 244, 234, 0.14)",
                  backgroundColor: "rgba(248, 244, 234, 0.05)",
                }}
              >
                <p
                  className="font-serif text-[18px] font-semibold"
                  style={{ color: "#F8F4EA", opacity: 1 }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="bg-paper px-5 py-[80px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[760px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-goldDeep">
              Les opportunités
            </span>

            <h2 className="mt-2 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight text-ink">
              L&apos;agriculture ne s&apos;arrête pas à la production.
            </h2>

            <p className="mt-4 max-w-[680px] text-[16px] leading-7 text-inkSoft">
              La création de valeur peut se construire tout au long de la
              chaîne, de la ferme jusqu&apos;au consommateur.
            </p>
          </div>

          <div className="mt-12 grid gap-0 md:grid-cols-5">
            {OPPORTUNITIES.map((item, index) => (
              <div
                key={item}
                className="border border-ink/10 bg-bgAlt p-6"
              >
                <span className="text-[12px] font-bold text-goldDeep">
                  0{index + 1}
                </span>

                <h3 className="mt-3 font-serif text-[20px] font-semibold text-ink">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER TYPES */}
      <section
        className="px-5 py-[80px]"
        style={{ backgroundColor: "#F3EFE5" }}
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[760px]">
            <span
              className="text-[13px] font-bold uppercase tracking-[0.08em]"
              style={{ color: "#8A6A25", opacity: 1 }}
            >
              Profils recherchés
            </span>

            <h2
              className="mt-2 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight"
              style={{ color: "#142018", opacity: 1 }}
            >
              Quel type de partenaire ?
            </h2>

            <p
              className="mt-4 text-[16px] leading-7"
              style={{ color: "#3F4A43", opacity: 1 }}
            >
              Nous sommes ouverts à différents profils lorsque leur
              contribution peut participer concrètement au développement
              d&apos;AgroFarms237.
            </p>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-2">
            {PARTNER_TYPES.map((partner) => (
              <article
                key={partner.title}
                className="border p-7"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#D9D6CD",
                  opacity: 1,
                }}
              >
                <h3
                  className="font-serif text-[23px] font-semibold"
                  style={{
                    color: "#142018",
                    opacity: 1,
                  }}
                >
                  {partner.title}
                </h3>

                <p
                  className="mt-3 text-[14px] leading-6"
                  style={{
                    color: "#3F4A43",
                    opacity: 1,
                  }}
                >
                  {partner.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-paper px-5 py-[80px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[720px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-goldDeep">
              Notre démarche
            </span>

            <h2 className="mt-2 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight text-ink">
              Une collaboration se construit.
            </h2>

            <p className="mt-4 text-[16px] leading-7 text-inkSoft">
              Nous privilégions une approche directe et progressive, afin
              que chaque projet soit étudié en fonction de sa réalité.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((step) => (
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

                <p className="mt-2 text-[14px] leading-6 text-inkSoft">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTMENT FORM */}
      <section
        id="investir"
        className="bg-ink px-5 py-[88px] text-paper"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[760px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gold">
              Investissement &amp; développement
            </span>

            <h2 className="mt-2 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-tight text-paper">
              Vous souhaitez investir dans AgroFarms237 ?
            </h2>

            <p className="mt-4 max-w-[680px] text-[16px] leading-7 text-paper/65">
              Présentez-nous votre profil, votre intérêt et la manière dont
              vous envisagez votre participation. Chaque projet est étudié
              individuellement afin d&apos;échanger sur les possibilités et
              les conditions envisageables.
            </p>

            <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-paper/45">
              Les modalités d&apos;une éventuelle collaboration ou d&apos;un
              investissement sont définies au cas par cas. Cette page ne
              constitue pas une promesse de rendement ou de résultat financier.
            </p>
          </div>

          <PartenairesForm />
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-waterDeep px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-gold">
            AgroFarms237
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,4vw,46px)] font-semibold leading-tight text-paper">
            Les grandes entreprises commencent par une vision.
          </h2>

          <p className="mx-auto mt-4 max-w-[680px] text-[15px] leading-7 text-paper/65">
            Aujourd&apos;hui, AgroFarms237 construit ses fondations.
            Demain, l&apos;ambition est de développer une entreprise agricole
            capable de créer davantage de valeur autour de ses filières.
          </p>

          <a href="#investir" className="btn btn-gold mt-7">
            Échanger avec AgroFarms237
          </a>
        </div>
      </section>
    </main>
  );
}
