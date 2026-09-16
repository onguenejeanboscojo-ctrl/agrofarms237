export default function ContactPage() {
  return (
    <section className="bg-bgAlt px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Contact</span>
        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
          Parlons de votre commande ou de votre projet.
        </h1>
        <div className="mt-10 grid gap-9 md:grid-cols-2">
          <div className="rounded-m border border-ink/10 bg-paper p-7">
            <div className="border-b border-ink/10 py-3">
              <b>Localisation</b>
              <p className="mt-1 text-inkSoft">Yaoundé — Mimboman, Open</p>
            </div>
            <div className="border-b border-ink/10 py-3">
              <b>Téléphone</b>
              <p className="mt-1"><a href="tel:+237659505823" className="text-water underline">659 505 823</a></p>
            </div>
            <div className="border-b border-ink/10 py-3">
              <b>WhatsApp</b>
              <p className="mt-1">
                <a href="https://wa.me/237697983119" target="_blank" rel="noopener" className="text-water underline">697 983 119</a>
              </p>
            </div>
            <div className="py-3">
              <b>Horaires</b>
              <p className="mt-1 text-inkSoft">Tous les jours — commandes prises via WhatsApp</p>
            </div>
            <div className="mt-3 flex gap-3">
              <a href="tel:+237659505823" className="btn btn-ink">Appeler</a>
              <a href="https://wa.me/237697983119" target="_blank" rel="noopener" className="btn btn-wa">WhatsApp</a>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-m border border-ink/10">
            <iframe
              title="Localisation approximative — Mimboman, Yaoundé"
              loading="lazy"
              className="h-full w-full border-0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=11.5245%2C3.8695%2C11.5645%2C3.9095&layer=mapnik&marker=3.8895%2C11.5445"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
