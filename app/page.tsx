import HomeProductsSection from "@/components/HomeProductsSection";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const commitments = [
  {
    number: "01",
    title: "Une production maîtrisée",
    text: "Nous développons nos activités d’élevage avec une attention particulière portée aux pratiques de production.",
  },
  {
    number: "02",
    title: "La proximité avant tout",
    text: "Une relation directe avec nos clients, des échanges simples et un accompagnement adapté à leurs besoins.",
  },
  {
    number: "03",
    title: "Une vision durable",
    text: "Construire une entreprise agricole ambitieuse, ancrée au Cameroun et tournée vers l’avenir.",
  },
];

async function getHeroImage(): Promise<string | null> {
  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select("url")
      .eq("published", true)
      .eq("kind", "photo")
      .eq("site_location", "hero")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data?.url || null;
  } catch {
    return null;
  }
}

async function getFarmImage(): Promise<string | null> {
  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select("url")
      .eq("published", true)
      .eq("kind", "photo")
      .eq("site_location", "ferme_accueil")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data?.url || null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const heroImage = await getHeroImage();
  const farmImage = await getFarmImage();

  const heroBackgroundImage =
    heroImage ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90";

  const farmBackgroundImage =
    farmImage ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=90";

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#173D2D]">
      {/* HERO */}
      <section id="accueil" className="px-3 pb-3 pt-3 sm:px-5 lg:px-7">
        <div
          className="relative mx-auto flex min-h-[650px] max-w-[1500px] items-end overflow-hidden rounded-[30px] bg-[#173D2D] bg-cover bg-center sm:min-h-[720px] lg:min-h-[780px]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(8,29,20,0.96) 0%, rgba(8,29,20,0.91) 28%, rgba(8,29,20,0.70) 48%, rgba(8,29,20,0.28) 72%, rgba(8,29,20,0.08) 100%), url("${heroBackgroundImage}")`,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />

          <div className="relative z-10 w-full px-7 pb-10 pt-28 sm:px-12 sm:pb-14 lg:px-20 lg:pb-16">
            <div className="max-w-[800px]">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.32em] text-[#E8C98A] sm:text-xs">
                Agrofarms237
              </p>

              <h1 className="max-w-[850px] text-[clamp(3.2rem,7.5vw,7.2rem)] font-semibold leading-[0.91] tracking-[-0.055em] text-white">
                Nourrir aujourd’hui.
                <br />
                <span className="font-light italic text-[#E8C98A]">
                  Construire demain.
                </span>
              </h1>

              <div className="mt-7 max-w-[650px] border-l border-[#E8C98A]/60 pl-5">
                <p className="text-[15px] leading-7 text-white/90 sm:text-lg sm:leading-8">
                  Agrofarms237 développe des activités d’élevage et de
                  production agricole au Cameroun, avec une ambition :
                  proposer des produits de qualité et bâtir une agriculture
                  durable.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="/produits"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#E8C98A] px-8 text-sm font-bold text-[#173D2D] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  Découvrir nos produits
                </a>

                <a
                  href="/notre-elevage"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/45 bg-white/[0.05] px-8 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Découvrir notre ferme
                </a>
              </div>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                Une ferme camerounaise
              </span>

              <span className="h-px w-8 bg-[#D5B16D]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Pisciculture
              </span>

              <span className="text-xs text-white/30">/</span>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Élevage
              </span>

              <span className="text-xs text-white/30">/</span>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Agriculture
              </span>
            </div>
          </div>

          <a
            href="#intro"
            aria-label="Découvrir la suite"
            className="absolute bottom-7 right-7 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 transition hover:text-white lg:flex"
          >
            Découvrir
            <span className="h-px w-10 bg-white/40" />
          </a>
        </div>
      </section>

      {/* INTRO */}
      <section
        id="intro"
        className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20"
      >
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#B7863D]">
              Agrofarms237 en un regard
            </p>

            <h2 className="max-w-[720px] text-[clamp(2.4rem,5vw,4.7rem)] font-semibold leading-[1.01] tracking-[-0.04em]">
              Une ferme qui se construit,
              <span className="font-light italic">
                {" "}
                production après production.
              </span>
            </h2>
          </div>

          <div>
            <p className="max-w-[580px] text-base leading-8 text-[#627166] sm:text-lg">
              Agrofarms237 développe progressivement une activité agricole
              structurée autour de plusieurs filières, avec la pisciculture
              comme point de départ.
            </p>

            <a
              href="/notre-elevage"
              className="mt-6 inline-flex items-center border-b border-[#173D2D]/30 pb-1.5 text-sm font-semibold text-[#173D2D] transition hover:border-[#B7863D] hover:text-[#B7863D]"
            >
              Comprendre notre démarche
            </a>
          </div>
        </div>

        <div className="mt-14 grid border-y border-[#173D2D]/10 sm:grid-cols-3">
          <div className="border-b border-[#173D2D]/10 px-1 py-7 sm:border-b-0 sm:border-r sm:px-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B7863D]">
              01
            </p>

            <h3 className="mt-3 text-lg font-semibold">Pisciculture</h3>

            <p className="mt-2 text-sm leading-6 text-[#718074]">
              Une activité déjà développée autour de la production de silure.
            </p>
          </div>

          <div className="border-b border-[#173D2D]/10 px-1 py-7 sm:border-b-0 sm:border-r sm:px-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B7863D]">
              02
            </p>

            <h3 className="mt-3 text-lg font-semibold">Élevage</h3>

            <p className="mt-2 text-sm leading-6 text-[#718074]">
              Une diversification progressive vers plusieurs productions
              animales.
            </p>
          </div>

          <div className="px-1 py-7 sm:px-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B7863D]">
              03
            </p>

            <h3 className="mt-3 text-lg font-semibold">Agriculture</h3>

            <p className="mt-2 text-sm leading-6 text-[#718074]">
              Des espaces cultivables intégrés à la vision de développement de
              la ferme.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUITS */}
      <section id="produits" className="scroll-mt-10 bg-[#EEEAE0] py-4">
        <HomeProductsSection />
      </section>

      {/* NOTRE FERME */}
      <section
        id="ferme"
        className="mx-auto max-w-[1320px] scroll-mt-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div className="relative min-h-[480px] overflow-hidden rounded-[28px] bg-[#173D2D] sm:min-h-[600px]">
            <img
              src={farmBackgroundImage}
              alt="Illustration d’une ferme agricole intégrant pisciculture et élevage"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0C281C]/90 via-[#0C281C]/20 to-transparent" />

            <div className="absolute bottom-7 left-7 right-7 sm:bottom-9 sm:left-9">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8C98A]">
                Notre ferme
              </p>

              <p className="mt-3 max-w-[500px] text-xl font-semibold leading-tight text-white sm:text-2xl">
                Une exploitation réelle, développée progressivement autour de
                plusieurs activités agricoles.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#B7863D]">
              Une ferme en développement
            </p>

            <h2 className="text-[clamp(2.5rem,5vw,4.8rem)] font-semibold leading-[1] tracking-[-0.04em]">
              Production après
              <span className="font-light italic"> production.</span>
            </h2>

            <p className="mt-7 max-w-[580px] text-base leading-8 text-[#627166] sm:text-lg">
              Agrofarms237 avance progressivement, avec une volonté claire :
              structurer une ferme agricole camerounaise capable de développer
              plusieurs filières dans le temps.
            </p>

            <p className="mt-5 max-w-[580px] text-base leading-8 text-[#627166]">
              La pisciculture constitue aujourd’hui le point de départ de cette
              aventure. L’élevage porcin, l’aviculture et l’agriculture font
              partie de la trajectoire de développement de la ferme.
            </p>

            <a
              href="/notre-elevage"
              className="mt-8 inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#173D2D]/20 bg-transparent px-7 text-sm font-semibold text-[#173D2D] transition duration-300 hover:-translate-y-0.5 hover:bg-[#173D2D] hover:text-white"
            >
              Découvrir notre ferme
            </a>
          </div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="bg-[#173D2D] text-white">
        <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#E8C98A]">
                Notre engagement
              </p>

              <h2 className="max-w-[520px] text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                Construire quelque chose qui
                <span className="font-light italic text-[#E8C98A]">
                  {" "}
                  dure.
                </span>
              </h2>

              <p className="mt-6 max-w-[500px] text-base leading-8 text-white/65">
                Au-delà de la production, Agrofarms237 porte une vision
                entrepreneuriale de l’agriculture : apprendre, structurer,
                produire et grandir durablement.
              </p>

              <a
                href="/notre-elevage"
                className="mt-8 inline-flex min-h-[50px] items-center justify-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition hover:bg-white hover:text-[#173D2D]"
              >
                Notre vision
              </a>
            </div>

            <div className="border-t border-white/15">
              {commitments.map((item) => (
                <div
                  key={item.number}
                  className="grid gap-5 border-b border-white/15 py-8 sm:grid-cols-[70px_1fr] sm:py-9"
                >
                  <span className="text-sm font-bold tracking-[0.16em] text-[#E8C98A]">
                    {item.number}
                  </span>

                  <div>
                    <h3 className="text-xl font-semibold sm:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 max-w-[600px] text-sm leading-7 text-white/60 sm:text-base">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONNELS / PARTENAIRES */}
      <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="max-w-[700px]">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#B7863D]">
            Agrofarms237, au-delà de la vente
          </p>

          <h2 className="text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Vous souhaitez
            <span className="font-light italic"> aller plus loin ?</span>
          </h2>

          <p className="mt-6 max-w-[620px] text-base leading-8 text-[#627166] sm:text-lg">
            Que vous soyez professionnel à la recherche d’un approvisionnement
            régulier ou partenaire intéressé par le développement de la ferme,
            Agrofarms237 ouvre la discussion.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <a
            href="/professionnels"
            className="group rounded-[26px] bg-[#173D2D] p-8 text-white transition duration-300 hover:-translate-y-1 sm:p-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8C98A]">
              Professionnels
            </p>

            <h3 className="mt-5 max-w-[500px] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Une offre adaptée à votre activité.
            </h3>

            <p className="mt-5 max-w-[500px] text-sm leading-7 text-white/65">
              Restaurants, commerces, distributeurs et autres acteurs de
              l’alimentation peuvent échanger directement avec la ferme.
            </p>

            <span className="mt-8 inline-flex text-sm font-semibold text-[#E8C98A]">
              Découvrir l’espace professionnel
            </span>
          </a>

          <a
            href="/partenaires"
            className="group rounded-[26px] border border-[#173D2D]/10 bg-[#EEEAE0] p-8 transition duration-300 hover:-translate-y-1 sm:p-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B7863D]">
              Partenaires
            </p>

            <h3 className="mt-5 max-w-[500px] text-3xl font-semibold leading-tight tracking-tight text-[#173D2D] sm:text-4xl">
              Construisons l’agriculture de demain.
            </h3>

            <p className="mt-5 max-w-[500px] text-sm leading-7 text-[#627166]">
              Découvrez la vision de développement d’Agrofarms237 et les
              différentes façons de contribuer à cette trajectoire.
            </p>

            <span className="mt-8 inline-flex text-sm font-semibold text-[#173D2D]">
              Découvrir notre vision
            </span>
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-3 pb-3 sm:px-5 lg:px-7">
        <div
          className="mx-auto max-w-[1500px] overflow-hidden rounded-[30px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(10,38,27,0.96), rgba(10,38,27,0.80)), url("${heroBackgroundImage}")`,
          }}
        >
          <div className="px-7 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div className="max-w-[850px]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#E8C98A]">
                Agrofarms237
              </p>

              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1] tracking-[-0.04em] text-white">
                De la production
                <span className="font-light italic text-[#E8C98A]">
                  {" "}
                  à la table.
                </span>
              </h2>

              <p className="mt-6 max-w-[620px] text-base leading-8 text-white/70 sm:text-lg">
                Découvrez nos produits, notre ferme et la manière dont
                Agrofarms237 construit progressivement son activité agricole.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="/produits"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#E8C98A] px-8 text-sm font-bold text-[#173D2D] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Voir nos produits
                </a>

                <a
                  href="/contact"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/35 px-8 text-sm font-semibold text-white transition hover:bg-white hover:text-[#173D2D]"
                >
                  Nous contacter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="mt-12 bg-[#123426] px-5 py-14 text-white sm:px-8 lg:px-10 lg:py-18"
      >
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E8C98A] text-2xl font-bold text-[#E8C98A]">
                  A
                </div>

                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    AGROFARMS<span className="text-[#E8C98A]">237</span>
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/55">
                    L’agriculture de demain
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
                Des produits frais et sains, issus de notre ferme, pour une
                alimentation de qualité au Cameroun.
              </p>

              <p className="mt-5 text-sm text-white/45">
                Agrofarms237 — Produire aujourd’hui, nourrir demain.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
                Navigation
              </h3>

              <nav className="mt-6 flex flex-col items-start gap-3.5 text-sm text-white/60">
                <a
                  href="#accueil"
                  className="transition hover:text-[#E8C98A]"
                >
                  Accueil
                </a>

                <a
                  href="/produits"
                  className="transition hover:text-[#E8C98A]"
                >
                  Nos produits
                </a>

                <a
                  href="/notre-elevage"
                  className="transition hover:text-[#E8C98A]"
                >
                  Notre ferme
                </a>

                <a
                  href="/professionnels"
                  className="transition hover:text-[#E8C98A]"
                >
                  Professionnels
                </a>

                <a
                  href="/partenaires"
                  className="transition hover:text-[#E8C98A]"
                >
                  Partenaires
                </a>

                <a
                  href="/contact"
                  className="transition hover:text-[#E8C98A]"
                >
                  Contact
                </a>
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
                Nous contacter
              </h3>

              <div className="mt-6 space-y-6">
                <div className="border-b border-white/10 pb-5">
                  <p className="text-sm font-medium text-white">
                    Yaoundé, Mimboman OPEP
                  </p>

                  <p className="mt-1 text-xs text-white/45">Cameroun</p>
                </div>

                <a
                  href="tel:+237659505823"
                  className="group block border-b border-white/10 pb-5"
                >
                  <span className="block text-sm font-medium text-white transition group-hover:text-[#E8C98A]">
                    +237 6 59 50 58 23
                  </span>

                  <span className="mt-1 block text-xs text-white/45">
                    Appeler Agrofarms237
                  </span>
                </a>

                <a
                  href="https://wa.me/237697983119"
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <span className="block text-sm font-medium text-white transition group-hover:text-[#E8C98A]">
                    +237 6 97 98 31 19
                  </span>

                  <span className="mt-1 block text-xs text-white/45">
                    WhatsApp — commandes et informations
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Agrofarms237. Tous droits réservés.
            </p>

            <p className="font-semibold uppercase tracking-[0.18em] text-[#E8C98A]/80">
              Produire aujourd’hui, nourrir demain
            </p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/237697983119?text=Bonjour%20Agrofarms237%2C%20je%20souhaite%20avoir%20des%20informations."
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter Agrofarms237 sur WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#D5B16D]/40 bg-[#173D2D] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E8C98A] shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#123426] sm:bottom-6 sm:right-6"
      >
        WhatsApp
      </a>
    </main>
  );
}
