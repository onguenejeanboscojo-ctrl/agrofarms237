import HomeProductsSection from "@/components/HomeProductsSection";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

export default async function Home() {
  const heroImage = await getHeroImage();

  const heroBackgroundImage =
    heroImage ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90";

  return (
    <main className="min-h-screen bg-[#F6F3EB] text-[#173D2D]">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section
        id="accueil"
        className="px-4 pb-5 pt-4 sm:px-6 lg:px-8"
      >
        <div
          className="relative mx-auto flex min-h-[620px] max-w-[1440px] items-end overflow-hidden rounded-[30px] bg-[#173D2D] bg-cover bg-center sm:min-h-[700px] lg:min-h-[760px]"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(12,38,27,0.94) 0%,
                rgba(12,38,27,0.78) 35%,
                rgba(12,38,27,0.42) 65%,
                rgba(12,38,27,0.08) 100%
              ),
              url("${heroBackgroundImage}")
            `,
          }}
        >
          {/* HERO CONTENT */}
          <div className="relative z-10 w-full px-7 pb-12 pt-24 sm:px-12 sm:pb-16 lg:px-20 lg:pb-20">
            <div className="max-w-[760px]">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#E8C98A] sm:text-xs">
                Agrofarms237
              </p>

              <h1 className="max-w-[800px] text-[clamp(3rem,7vw,6.7rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-white">
                Nourrir aujourd’hui.
                <br />
                <span className="font-light italic text-[#E8C98A]">
                  Construire demain.
                </span>
              </h1>

              <p className="mt-7 max-w-[600px] text-[15px] leading-7 text-white/78 sm:text-lg sm:leading-8">
                Agrofarms237 développe des activités d’élevage et de
                production agricole au Cameroun, avec une ambition :
                proposer des produits de qualité et bâtir une agriculture
                durable.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#produits"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8C98A] px-7 text-sm font-bold text-[#173D2D] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#E8C98A] focus:ring-offset-2 focus:ring-offset-[#173D2D]"
                >
                  Découvrir nos produits
                </a>

                <a
                  href="#ferme"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/35 bg-white/[0.04] px-7 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Découvrir notre ferme
                </a>
              </div>
            </div>

            {/* HERO BOTTOM INFO */}
            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6 text-xs font-medium uppercase tracking-[0.16em] text-white/65 sm:text-sm">
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-7 bg-[#D5B16D]" />
                Pisciculture
              </span>

              <span className="inline-flex items-center gap-3">
                <span className="h-px w-7 bg-[#D5B16D]" />
                Élevage
              </span>

              <span className="inline-flex items-center gap-3">
                <span className="h-px w-7 bg-[#D5B16D]" />
                Agriculture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================== */}
      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#B7863D]">
              Bienvenue chez Agrofarms237
            </p>

            <h2 className="max-w-[650px] text-[clamp(2.3rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#173D2D]">
              De la ferme à vos besoins,
              <span className="font-light italic">
                {" "}
                avec une vision claire.
              </span>
            </h2>
          </div>

          <div className="max-w-[620px] lg:pb-1">
            <p className="text-base leading-8 text-[#627166] sm:text-lg">
              Nous construisons une entreprise agricole qui associe
              production, proximité et transmission du savoir. Notre
              démarche s’inscrit dans une volonté de développer des
              activités responsables et de créer de la valeur localement.
            </p>

            <a
              href="/la-vie-de-la-ferme"
              className="mt-7 inline-flex items-center border-b border-[#173D2D]/30 pb-1.5 text-sm font-semibold text-[#173D2D] transition hover:border-[#B7863D] hover:text-[#B7863D]"
            >
              Découvrir notre histoire
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUITS
      ========================================================== */}
      <section id="produits" className="scroll-mt-20">
        <HomeProductsSection />
      </section>

      {/* =========================================================
          NOTRE FERME / ENGAGEMENT
      ========================================================== */}
      <section
        id="ferme"
        className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {/* LEFT */}
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#B7863D]">
              Notre engagement
            </p>

            <h2 className="max-w-[500px] text-[clamp(2.3rem,5vw,4.3rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#173D2D]">
              Une ferme pensée
              <span className="font-light italic">
                {" "}
                pour l’avenir.
              </span>
            </h2>

            <p className="mt-6 max-w-[500px] text-base leading-8 text-[#627166]">
              Au-delà de la production, Agrofarms237 porte une vision
              entrepreneuriale de l’agriculture : apprendre, structurer,
              produire et grandir durablement.
            </p>

            <a
              href="/notre-elevage"
              className="mt-8 inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#173D2D]/20 bg-transparent px-6 text-sm font-semibold text-[#173D2D] transition duration-300 hover:-translate-y-0.5 hover:bg-[#173D2D] hover:text-white"
            >
              Découvrir notre ferme
            </a>
          </div>

          {/* RIGHT */}
          <div className="border-t border-[#173D2D]/10">
            {commitments.map((item) => (
              <div
                key={item.number}
                className="grid gap-5 border-b border-[#173D2D]/10 py-8 sm:grid-cols-[70px_1fr] sm:py-9"
              >
                <span className="text-sm font-bold tracking-[0.15em] text-[#B7863D]">
                  {item.number}
                </span>

                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-[#173D2D] sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[600px] text-sm leading-7 text-[#718074] sm:text-base">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT / CTA
      ========================================================== */}
      <section className="px-4 pb-5 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-[1440px] overflow-hidden rounded-[30px] bg-cover bg-center px-7 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(16,53,37,0.97),
                rgba(16,53,37,0.82)
              ),
              url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85")
            `,
          }}
        >
          <div className="max-w-[760px]">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-[#E8C98A]">
              Travaillons ensemble
            </p>

            <h2 className="text-[clamp(2.4rem,5vw,4.8rem)] font-semibold leading-[1] tracking-[-0.035em] text-white">
              Un projet, un besoin
              <span className="font-light italic text-[#E8C98A]">
                {" "}
                ou un partenariat ?
              </span>
            </h2>

            <p className="mt-6 max-w-[600px] text-base leading-8 text-white/72 sm:text-lg">
              Échangeons autour de vos besoins, de vos commandes ou de vos
              projets dans le secteur agricole.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8C98A] px-7 text-sm font-bold text-[#173D2D] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                Nous contacter
              </a>

              <a
                href="https://wa.me/237697983119"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/35 bg-white/[0.04] px-7 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer
        id="contact"
        className="mt-16 bg-[#123426] px-5 py-14 text-white sm:px-8 lg:px-10 lg:py-20"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-20">
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E8C98A]/70 text-xl font-bold text-[#E8C98A]">
                  A
                </div>

                <div>
                  <p className="text-xl font-bold tracking-tight">
                    AGROFARMS
                    <span className="text-[#E8C98A]">237</span>
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-white/50">
                    L’agriculture de demain
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-[420px] text-sm leading-7 text-white/65">
                Des produits frais et sains, issus de notre ferme, pour une
                alimentation de qualité au Cameroun.
              </p>

              <p className="mt-5 text-sm text-white/45">
                Agrofarms237 — Produire aujourd’hui, nourrir demain.
              </p>
            </div>

            {/* LINKS */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
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
                  href="#produits"
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

            {/* CONTACT */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Nous contacter
              </h3>

              <div className="mt-6 space-y-6">
                <div className="border-b border-white/10 pb-5">
                  <p className="text-sm font-medium text-white">
                    Yaoundé, Mimboman OPEP
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Cameroun
                  </p>
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

          {/* COPYRIGHT */}
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

      {/* =========================================================
          WHATSAPP FLOATING ACTION
      ========================================================== */}
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
