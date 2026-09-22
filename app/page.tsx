
const products = [
  {
    name: "Silure frais",
    description: "Issu de notre élevage, soigneusement sélectionné.",
    price: "2 500 FCFA/kg",
    note: "2 400 FCFA/kg dès 30 kg",
    available: true,
    image:
      "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Silure fumé",
    description: "Une préparation savoureuse, pensée pour vos repas.",
    price: "Bientôt disponible",
    note: "Préparation en cours",
    available: false,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Porc & volaille",
    description: "Des produits d’élevage pour vos besoins quotidiens.",
    price: "Bientôt disponible",
    note: "Restez informés",
    available: false,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85",
  },
];

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

function PhoneIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.56 3.58.56a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.19 2.46.56 3.58a1 1 0 01-.25 1.01l-2.19 2.2z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#25D366"
        d="M16 2.5A13.4 13.4 0 004.5 22.8L2.7 29.5l6.9-1.8A13.5 13.5 0 1016 2.5z"
      />
      <path
        fill="white"
        d="M16 5a10.8 10.8 0 00-9.2 16.5l.3.5-1.1 4 4.1-1.1.5.3A10.8 10.8 0 1016 5zm6.1 15.5c-.3.8-1.7 1.5-2.4 1.6-.6.1-1.4.2-2.3-.1-.5-.2-1.2-.4-2-.8-3.5-1.5-5.8-5.1-6-5.3-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.8c.3-.3.6-.4.8-.4h.6c.2 0 .5-.1.7.5.3.7 1 2.4 1.1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4.9 1.5 1.9 2.4 1.3 1.1 2.4 1.5 2.8 1.7.4.2.6.1.8-.1.2-.2.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.5.3.6.4.1.1.1.8-.2 1.5z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <span
      className="text-2xl leading-none"
      role="img"
      aria-label="Localisation"
    >
      📍
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#173D2D]">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-[#173D2D]/10 bg-[#F7F5EF]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <a href="#accueil" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173D2D] text-lg font-bold text-[#E8C98A]">
              A
            </div>
            <div>
              <p className="text-lg font-bold leading-tight tracking-tight">
                AGROFARMS<span className="text-[#B7863D]">237</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#647466]">
                L’agriculture de demain
              </p>
            </div>
          </a>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-[#40594A]">
            <a href="#accueil" className="transition hover:text-[#B7863D]">
              Accueil
            </a>
            <a href="#produits" className="transition hover:text-[#B7863D]">
              Nos produits
            </a>
            <a href="#ferme" className="transition hover:text-[#B7863D]">
              Notre ferme
            </a>
            <a href="#contact" className="transition hover:text-[#B7863D]">
              Contact
            </a>
          </nav>

          <a
            href="#produits"
            className="rounded-full bg-[#173D2D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28563F]"
          >
            Commander ↗
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="accueil" className="px-4 pb-8 pt-5 sm:px-6 lg:px-10">
        <div
          className="relative mx-auto flex min-h-[580px] max-w-7xl items-end overflow-hidden rounded-[28px] bg-[#173D2D] bg-cover bg-center sm:min-h-[650px]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(12,38,27,0.88) 0%, rgba(12,38,27,0.63) 48%, rgba(12,38,27,0.12) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90')",
          }}
        >
          <div className="relative z-10 max-w-3xl px-7 py-14 sm:px-12 sm:py-20 lg:px-16">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#F1D9A8] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#D5B16D]" />
              Une ferme camerounaise, une vision d’avenir
            </div>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Nourrir aujourd’hui.
              <br />
              <span className="font-light italic text-[#E8C98A]">
                Construire demain.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Agrofarms237 développe des activités d’élevage et de production
              agricole au Cameroun, avec une ambition : proposer des produits
              de qualité et bâtir une agriculture durable.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#produits"
                className="rounded-full bg-[#E8C98A] px-7 py-4 text-sm font-bold text-[#173D2D] transition hover:bg-white"
              >
                Découvrir nos produits ↗
              </a>
              <a
                href="#ferme"
                className="rounded-full border border-white/40 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Notre vision
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6 text-sm text-white/75">
              <span>● Pisciculture</span>
              <span>● Élevage</span>
              <span>● Agriculture durable</span>
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
          Nous construisons une entreprise agricole qui associe production,
          proximité et transmission du savoir. Notre démarche s’inscrit dans
          une volonté de développer des activités responsables et de créer de
          la valeur localement.
        </p>
      </section>

      {/* PRODUITS */}
      <section
        id="produits"
        className="bg-[#EDE9DE] px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
                Notre sélection
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Les produits de la ferme
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-[#627166]">
                Découvrez notre catalogue. Les produits indisponibles restent
                visibles et seront proposés au fur et à mesure de leur mise en
                vente.
              </p>
            </div>
            <span className="rounded-full border border-[#173D2D]/15 px-4 py-2 text-xs font-semibold text-[#40594A]">
              Catalogue Agrofarms237
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="group overflow-hidden rounded-[22px] border border-[#173D2D]/8 bg-[#FBFAF6]"
              >
                <div className="relative h-64 overflow-hidden bg-[#D8DCCF]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                      product.available ? "" : "grayscale-[35%]"
                    }`}
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-2 text-[11px] font-bold ${
                      product.available
                        ? "bg-[#E4F0DF] text-[#28563F]"
                        : "bg-white/90 text-[#69746A]"
                    }`}
                  >
                    {product.available
                      ? "● Disponible"
                      : "Pas encore disponible"}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#718074]">
                    {product.description}
                  </p>

                  <div className="mt-5 border-t border-[#173D2D]/10 pt-4">
                    <p className="text-lg font-bold text-[#173D2D]">
                      {product.price}
                    </p>
                    <p className="mt-1 text-xs text-[#718074]">
                      {product.note}
                    </p>
                  </div>

                  {product.available ? (
                    <a
                      href="https://wa.me/237697983119?text=Bonjour%20Agrofarms237%2C%20je%20souhaite%20commander%20du%20silure%20frais."
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#173D2D] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#28563F]"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      Commander sur WhatsApp ↗
                    </a>
                  ) : (
                    <div className="mt-5 flex w-full cursor-not-allowed items-center justify-center rounded-full bg-[#E8E7E0] px-5 py-3.5 text-sm font-semibold text-[#858B81]">
                      Bientôt disponible
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <p className="mt-7 text-xs leading-5 text-[#718074]">
            Les prix et disponibilités affichés sont à confirmer avant
            commande. Les autres produits et variantes ne sont pas encore
            disponibles à la vente.
          </p>
        </div>
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
              En savoir plus ↗
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
                  <h3 className="text-xl font-semibold">{item.title}</h3>
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
              Échangeons autour de vos besoins, de vos commandes ou de vos
              projets dans le secteur agricole.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="tel:+237659505823"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/40 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <PhoneIcon className="h-5 w-5" />
                Appeler Agrofarms237
              </a>

              <a
                href="https://wa.me/237697983119"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#E8C98A] px-7 py-4 text-sm font-bold text-[#173D2D] transition hover:bg-white"
              >
                <WhatsAppIcon className="h-6 w-6" />
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
            {/* BRAND */}
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
                Des produits frais et sains, issus de notre ferme, pour une
                alimentation de qualité au Cameroun.
              </p>

              <p className="mt-5 text-sm text-white/65">
                Agrofarms237 — Produire aujourd’hui, nourrir demain.
              </p>
            </div>

            {/* QUICK LINKS */}
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

            {/* CONTACT DETAILS */}
            <div>
              <h3 className="text-lg font-semibold">Nos coordonnées</h3>
              <div className="mt-4 h-1 w-14 rounded-full bg-[#E8C98A]" />

              <div className="mt-6 space-y-5">
                {/* LOCATION */}
                <div className="flex items-start gap-4">
                  <LocationIcon />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Yaoundé, Mimboman OPEP
                    </p>
                    <p className="mt-1 text-xs text-white/55">Cameroun</p>
                  </div>
                </div>

                {/* PHONE */}
                <a
                  href="tel:+237659505823"
                  className="group flex items-start gap-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] transition group-hover:bg-[#25D366]/25">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white transition group-hover:text-[#E8C98A]">
                      Appel : +237 6 59 50 58 23
                    </span>
                    <span className="mt-1 block text-xs text-white/55">
                      Appuyez pour nous appeler
                    </span>
                  </span>
                </a>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/237697983119"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 transition group-hover:bg-[#25D366]/25">
                    <WhatsAppIcon className="h-8 w-8" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white transition group-hover:text-[#E8C98A]">
                      WhatsApp : +237 6 97 98 31 19
                    </span>
                    <span className="mt-1 block text-xs text-white/55">
                      Commandes et informations
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="mt-10 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Agrofarms237. Tous droits réservés.
            </p>
            <p className="font-semibold uppercase tracking-[0.2em] text-[#E8C98A]">
              🌿 Produire aujourd’hui, nourrir demain
            </p>
          </div>
        </div>
      </footer>

      {/* BOUTON WHATSAPP FLOTTANT */}
      <a
        href="https://wa.me/237697983119?text=Bonjour%20Agrofarms237%2C%20je%20souhaite%20avoir%20des%20informations."
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter Agrofarms237 sur WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition duration-300 hover:scale-110 hover:bg-[#1EBE5D]"
      >
        <WhatsAppIcon className="h-10 w-10" />
      </a>
    </main>
  );
}
