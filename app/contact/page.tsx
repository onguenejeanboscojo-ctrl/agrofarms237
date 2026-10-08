export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section className="px-4 pb-6 pt-5 sm:px-6 lg:px-10">
        <div
          className="relative mx-auto min-h-[430px] max-w-[1280px] overflow-hidden rounded-[28px] bg-ink bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(16,53,37,0.94) 0%, rgba(16,53,37,0.78) 48%, rgba(16,53,37,0.28) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90')",
          }}
        >
          <div className="relative z-10 flex min-h-[430px] items-center px-7 py-16 sm:px-12 lg:px-16">
            <div className="max-w-2xl">
              <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.24em] text-gold">
                Contact
              </p>

              <h1 className="font-serif text-[clamp(42px,6vw,72px)] font-semibold leading-[1.03] tracking-tight text-paper">
                Parlons de votre
                <br />
                <span className="italic text-gold">
                  projet.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-[16px] leading-8 text-paper/75 sm:text-[18px]">
                Une question, une commande, un projet professionnel
                ou un partenariat ? Notre équipe est à votre écoute.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="tel:+237659505823"
                  className="btn btn-gold"
                >
                  Appeler AgroFarms237
                </a>

                <a
                  href="https://wa.me/237697983119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline border-paper/40 text-paper hover:bg-paper hover:text-ink"
                >
                  Écrire sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CONTACT PRINCIPAL                                                */}
      {/* ================================================================ */}
      <section className="px-5 py-[72px] sm:px-8 lg:px-10 lg:py-[96px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            {/* COORDONNÉES */}
            <div>
              <span className="mb-3 inline-block text-[12px] font-bold uppercase tracking-[0.22em] text-goldDeep">
                Nos coordonnées
              </span>

              <h2 className="max-w-md font-serif text-[clamp(32px,4vw,46px)] font-semibold leading-tight">
                Un échange simple,
                <br />
                <span className="text-water">
                  directement avec nous.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-[15px] leading-8 text-inkSoft">
                Pour une commande, une demande d’information ou
                un projet, choisissez le moyen de contact qui vous
                convient le mieux.
              </p>

              <div className="mt-9 divide-y divide-ink/10 border-y border-ink/10">
                {/* TÉLÉPHONE */}
                <a
                  href="tel:+237659505823"
                  className="group block py-5 transition"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                    Téléphone
                  </p>

                  <p className="mt-2 text-[17px] font-semibold text-ink transition group-hover:text-goldDeep">
                    +237 6 59 50 58 23
                  </p>

                  <p className="mt-1 text-sm text-inkSoft">
                    Appelez-nous directement
                  </p>
                </a>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/237697983119"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-5 transition"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                    WhatsApp
                  </p>

                  <p className="mt-2 text-[17px] font-semibold text-ink transition group-hover:text-goldDeep">
                    +237 6 97 98 31 19
                  </p>

                  <p className="mt-1 text-sm text-inkSoft">
                    Commandes et informations
                  </p>
                </a>

                {/* LOCALISATION */}
                <div className="py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                    Localisation
                  </p>

                  <p className="mt-2 text-[17px] font-semibold text-ink">
                    Mimboman OPEP, Yaoundé
                  </p>

                  <p className="mt-1 text-sm text-inkSoft">
                    Cameroun
                  </p>
                </div>

                {/* HORAIRES */}
                <div className="py-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                    Horaires
                  </p>

                  <p className="mt-2 text-[15px] font-semibold text-ink">
                    Tous les jours
                  </p>

                  <p className="mt-1 text-sm leading-6 text-inkSoft">
                    Commandes prises via WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* CARTE */}
            <div>
              <div className="overflow-hidden rounded-[24px] border border-ink/10 bg-paper shadow-[0_18px_50px_rgba(23,61,45,0.08)]">
                <div className="flex items-end justify-between gap-5 border-b border-ink/10 px-6 py-5 sm:px-7">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                      Notre localisation
                    </p>

                    <h3 className="mt-1 font-serif text-2xl font-semibold">
                      Mimboman OPEP, Yaoundé
                    </h3>
                  </div>

                  <span className="hidden text-xs text-inkSoft sm:block">
                    Cameroun
                  </span>
                </div>

                <div className="aspect-[4/3] overflow-hidden">
                  <iframe
                    title="Localisation approximative — Mimboman OPEP, Yaoundé"
                    loading="lazy"
                    className="h-full w-full border-0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=11.5245%2C3.8695%2C11.5645%2C3.9095&layer=mapnik&marker=3.8895%2C11.5445"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ÉCHANGE DIRECT                                                   */}
      {/* ================================================================ */}
      <section className="px-4 pb-6 sm:px-6 lg:px-10">
        <div
          className="mx-auto max-w-[1280px] overflow-hidden rounded-[26px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(18,52,38,0.97), rgba(18,52,38,0.82)), url('https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=2000&q=85')",
          }}
        >
          <div className="flex flex-col gap-8 px-7 py-12 sm:px-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:px-16">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                Échange direct
              </p>

              <h2 className="mt-3 font-serif text-[clamp(30px,4vw,46px)] font-semibold leading-tight text-paper">
                Vous préférez nous parler directement ?
              </h2>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-paper/70">
                Écrivez-nous sur WhatsApp pour une réponse rapide
                concernant vos commandes, nos produits ou votre projet.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="https://wa.me/237697983119?text=Bonjour%20AgroFarms237%2C%20je%20souhaite%20avoir%20des%20informations."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#25D366] px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#20bd5a]"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA FINAL                                                        */}
      {/* ================================================================ */}
      <section className="px-5 py-[82px] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.22em] text-goldDeep">
            AgroFarms237
          </span>

          <h2 className="mt-4 font-serif text-[clamp(34px,5vw,52px)] font-semibold leading-tight">
            La qualité commence
            <br />
            à la ferme.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-inkSoft">
            Découvrez notre ferme, nos produits et notre manière
            de construire progressivement une agriculture locale
            et durable.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/produits"
              className="btn btn-gold"
            >
              Découvrir nos produits
            </a>

            <a
              href="/notre-elevage"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-ink hover:text-paper"
            >
              Découvrir notre ferme
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
