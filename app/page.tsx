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
    <main className="min-h-screen bg-[#F7F5EF] text-[#173D2D]">
      {/* HERO */}
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
                  Notre vision
                </a>
              </div>
            </div>

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

      {/* INTRODUCTION */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-end lg:px-10 lg:py-24">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
            Bienvenue chez Agrofarms237
          </p>

          <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            De la ferme à vos besoins, avec une vision claire.
          </h2>
        </div>

        <p className="max-w-2xl text-base leading-8 text-[#627166]">
          Nous construisons une entreprise agricole qui associe
          production, proximité et transmission du savoir. Notre
          démarche s’inscrit dans une volonté de développer des
          activités responsables et de créer de la valeur localement.
        </p>
      </section>

      {/* PRODUITS DYNAMIQUES — DONNÉES SUPABASE */}
      <section id="produits">
        <HomeProductsSection />
      </section>

      {/* ENGAGEMENTS */}
      <section
        id="ferme"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
              Notre engagement
            </p>

            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Une ferme pensée pour l’avenir.
            </h2>

            <p className="mt-5 max-w-md leading-8 text-[#627166]">
              Au-delà de la production, Agrofarms237 porte une vision
              entrepreneuriale de l’agriculture : apprendre, structurer,
              produire et grandir durablement.
            </p>

            <a
              href="#contact"
              className="mt-7 inline-flex rounded-full border border-[#173D2D]/20 px-6 py-3.5 text-sm font-semibold transition hover:bg-[#173D2D] hover:text-white"
            >
              En savoir plus
            </a>
          </div>

          <div className="divide-y divide-[#173D2D]/12">
            {commitments.map((item) => (
              <div
                key={item.number}
                className="grid gap-3 py-6 sm:grid-cols-[60px_1fr]"
              >
                <span className="text-sm font-bold text-[#B7863D]">
                  {item.number}
                </span>

                <div>
                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-7 text-[#718074]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="px-4 pb-5 sm:px-6 lg:px-10">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-[26px] bg-cover bg-center px-7 py-14 sm:px-12 sm:py-16"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(16,53,37,0.96), rgba(16,53,37,0.80)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80')",
          }}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#E8C98A]">
              Travaillons ensemble
            </p>

            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Un projet, un besoin ou un partenariat ?
            </h2>

            <p className="mt-5 leading-7 text-white/75">
              Échangeons autour de vos besoins, de vos commandes ou de
              vos projets dans le secteur agricole.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+237659505823"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Appeler Agrofarms237
              </a>

              <a
                href="https://wa.me/237697983119"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#E8C98A] px-7 py-4 text-sm font-bold text-[#173D2D] transition hover:bg-white"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="mt-12 bg-[#123426] px-5 py-12 text-white sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-14">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#E8C98A] text-2xl font-bold text-[#E8C98A]">
                  A
                </div>

                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    AGROFARMS<span className="text-[#E8C98A]">237</span>
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/65">
                    L’agriculture de demain
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
                Des produits frais et sains, issus de notre ferme, pour
                une alimentation de qualité au Cameroun.
              </p>

              <p className="mt-5 text-sm text-white/65">
                Agrofarms237 — Produire aujourd’hui, nourrir demain.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Liens rapides</h3>
              <div className="mt-4 h-1 w-14 rounded-full bg-[#E8C98A]" />

              <nav className="mt-5 flex flex-col items-start gap-3 text-sm text-white/75">
                <a href="#accueil" className="transition hover:text-[#E8C98A]">
                  Accueil
                </a>

                <a href="#produits" className="transition hover:text-[#E8C98A]">
                  Nos produits
                </a>

                <a href="#ferme" className="transition hover:text-[#E8C98A]">
                  Notre ferme
                </a>

                <a href="#contact" className="transition hover:text-[#E8C98A]">
                  Contact
                </a>
              </nav>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Nos coordonnées</h3>
              <div className="mt-4 h-1 w-14 rounded-full bg-[#E8C98A]" />

              <div className="mt-6 max-w-sm space-y-6">
                <div className="border-b border-white/10 pb-5">
                  <p className="text-sm font-medium leading-6 text-white">
                    Yaoundé, Mimboman OPEP
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    Cameroun
                  </p>
                </div>

                <a
                  href="tel:+237659505823"
                  className="group block border-b border-white/10 pb-5"
                >
                  <span className="block text-sm font-medium leading-6 text-white transition group-hover:text-[#E8C98A]">
                    +237 6 59 50 58 23
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-white/55">
                    Appeler Agrofarms237
                  </span>
                </a>

                <a
                  href="https://wa.me/237697983119"
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <span className="block text-sm font-medium leading-6 text-white transition group-hover:text-[#E8C98A]">
                    +237 6 97 98 31 19
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-white/55">
                    WhatsApp — commandes et informations
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Agrofarms237. Tous droits
              réservés.
            </p>

            <p className="font-semibold uppercase tracking-[0.2em] text-[#E8C98A]">
              Produire aujourd’hui, nourrir demain
            </p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/237697983119?text=Bonjour%20Agrofarms237%2C%20je%20souhaite%20avoir%20des%20informations."
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter Agrofarms237 sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 rounded-full border border-[#D5B16D]/40 bg-[#173D2D] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#E8C98A] shadow-xl transition duration-300 hover:-translate-y-0.5 hover:bg-[#123426]"
      >
        WhatsApp
      </a>
    </main>
  );
}
