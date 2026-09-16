const STEPS = [
  ["Aujourd'hui", "Silure frais", "Production active à Yaoundé, Mimboman, vendue directement aux familles et professionnels."],
  ["Prochaine étape", "Produits fumés", "Une gamme de silure fumé, pensée pour la conservation et pour étendre la livraison au-delà de Yaoundé."],
  ["Développement", "Porcs, poulets de chair, poules pondeuses", "Une diversification progressive vers l'élevage porcin et avicole, dans la même logique de qualité et de transparence."],
];

export default function NotreElevagePage() {
  return (
    <section className="bg-bgAlt px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">Notre élevage</span>
        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">Une vision qui grandit avec la ferme.</h1>
        <p className="mt-2 max-w-[62ch] text-inkSoft">
          Le silure est le point de départ. Voici comment Agrofarms237 est pensée pour évoluer, étape après étape.
        </p>
        <div className="mt-11">
          {STEPS.map(([tag, title, text]) => (
            <div key={title} className="flex gap-5 border-b border-ink/10 py-6 last:border-none sm:gap-7">
              <div className="w-[110px] shrink-0 pt-1 text-[13px] font-bold text-goldDeep sm:w-[138px]">{tag}</div>
              <div>
                <h4 className="text-xl font-semibold">{title}</h4>
                <p className="text-[15px] text-inkSoft">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
