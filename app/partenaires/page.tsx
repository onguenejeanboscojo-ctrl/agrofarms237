import Link from "next/link";
import { getContent } from "@/lib/content";
import PartenairesForm from "@/components/PartenairesForm";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

  // Récupère l’image publiée depuis Admin > Galerie > Espace partenaires.
  // Une image locale reste disponible si aucune image publiée n’est trouvée.
  let heroImage = "/images/education/modules/gestion-exploitation.jpg";

  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select("url")
      .eq("site_location", "partenaires_hero")
      .eq("published", true)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (data?.url) {
      heroImage = data.url;
    }
  } catch (error) {
    console.error("Erreur de récupération de l’image du hero Partenaires :", error);
  }

  return (
    <main className="bg-bgAlt">
      {/* HERO INVESTISSEURS */}
      <section className="relative isolate overflow-hidden bg-[#0b211b] text-paper">
        <div className="absolute inset-0 -z-20">
          <img
            src={heroImage}
            alt="AgroFarms237 — développement de filières agricoles"
            className="h-full min-h-[650px] w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071713]/95 via-[#0b211b]/85 to-[#0b211b]/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071713]/85 via-transparent to-[#071713]/20" />

        <div className="mx-auto grid min-h-[650px] max-w-[1280px] items-center gap-12 px-5 py-20 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div className="max-w-[760px]">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#d7b46a]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e7ca8b]">
                Partenaires · Investissement &amp; développement
              </span>
            </div>

            <h1 className="font-serif text-[clamp(42px,6vw,76px)] font-semibold leading-[0.99] tracking-[-0.035em] text-paper">
              Investir dans
              <br />
              <span className="italic text-[#dfc184]">l’agriculture</span>
              <br />
              c’est bâtir l’avenir.
            </h1>

            <p className="mt-7 max-w-[650px] text-base leading-8 text-white/80 md:text-lg">
              AgroFarms237 développe une vision agricole fondée sur la
              production, la valorisation et la commercialisation. Nous
              recherchons des partenaires qui souhaitent étudier avec nous
              des projets concrets et accompagner une ambition construite
              étape par étape.
            </p>

            {intro ? (
              <p className="mt-4 max-w-[620px] text-sm leading-7 text-white/65">
                {intro}
              </p>
            ) : null}

            <div className="mt-9 flex flex-wrap gap-3.5">
              <a
                href="#investir"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8b66f] px-7 py-3 text-sm font-bold text-[#10231c] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e8ca8b]"
              >
                Étudier une opportunité
                <span className="ml-3 text-lg">↗</span>
              </a>

              <Link
                href="/notre-elevage"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#10231c]"
              >
                Découvrir nos activités
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6 text-xs text-white/70">
              <span>Vision à long terme</span>
              <span>Développement progressif</span>
              <span>Échanges transparents</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-auto max-w-[360px] rounded-[28px] border border-white/15 bg-[#10251f]/80 p-7 shadow-2xl backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfc184]">
                Notre engagement
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-paper">
                Une ambition forte.
                <br />
                Des étapes claires.
                <br />
                Un dialogue sérieux.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                Chaque proposition de partenariat mérite d’être comprise,
                étudiée et encadrée. Parlons de vos objectifs, de vos attentes
                et des conditions possibles avant toute décision.
              </p>
              <a
                href="#investir"
                className="mt-7 flex items-center justify-between border-t border-white/15 pt-5 text-sm font-semibold text-[#e6c986] transition hover:text-white"
              >
                Présenter mon projet
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIANCE ET MÉTHODE */}
      <section className="bg-[#10251d] px-5 py-10 text-paper">
        <div className="mx-auto grid max-w-[1180px] gap-6 md:grid-cols-3">
          <div className="border-l-2 border-[#d8b66f] pl-5">
            <h2 className="font-serif text-xl font-semibold">Une vision lisible</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Des filières identifiées et une trajectoire de développement
              présentée par étapes.
            </p>
          </div>
          <div className="border-l-2 border-[#d8b66f] pl-5">
            <h2 className="font-serif text-xl font-semibold">Des échanges directs</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Chaque partenaire potentiel peut présenter ses attentes et
              poser ses questions avant d’envisager une collaboration.
            </p>
          </div>
          <div className="border-l-2 border-[#d8b66f] pl-5">
            <h2 className="font-serif text-xl font-semibold">Un cadre à définir</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Les objectifs, les responsabilités et les conditions doivent
              être discutés clairement avant tout engagement.
            </p>
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
