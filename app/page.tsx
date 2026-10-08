import Link from "next/link";
import HomeProductsSection from "@/components/HomeProductsSection";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90";

const sectors = [
  {
    number: "01",
    title: "Pisciculture",
    label: "Production aquacole",
    text: "Une activité déjà engagée, intégrée à la trajectoire de développement de la ferme.",
    accent: "Pisciculture",
  },
  {
    number: "02",
    title: "Élevage porcin",
    label: "Développement",
    text: "Une nouvelle filière appelée à rejoindre progressivement les productions de la ferme.",
    accent: "Élevage porcin",
  },
  {
    number: "03",
    title: "Aviculture",
    label: "Poulets de chair et autres productions",
    text: "Une filière développée progressivement pour élargir l’offre agricole d’Agrofarms237.",
    accent: "Aviculture",
  },
  {
    number: "04",
    title: "Agriculture",
    label: "Terres cultivables",
    text: "Des espaces cultivables qui participent à la vision globale de développement de la ferme.",
    accent: "Agriculture",
  },
];

const commitments = [
  {
    number: "01",
    title: "Produire localement",
    text: "Développer une activité agricole ancrée au Cameroun et proche de ses clients.",
  },
  {
    number: "02",
    title: "Avancer progressivement",
    text: "Construire chaque filière étape par étape, avec une vision de développement sur le long terme.",
  },
  {
    number: "03",
    title: "Créer de la valeur",
    text: "Transformer progressivement la production agricole en une offre utile aux particuliers comme aux professionnels.",
  },
];

export default async function Home() {
  const [heroImage, farmImage] = await Promise.all([
    getHeroImage(),
    getFarmImage(),
  ]);

  const heroBackgroundImage = heroImage || fallbackImage;
  const farmBackgroundImage = farmImage || fallbackImage;

  return (
    <main className="min-h-screen bg-[#F5F2E9] text-[#173D2D]">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="px-3 pb-3 pt-3 sm:px-5 lg:px-7">
        <div
          id="accueil"
          className="relative mx-auto min-h-[680px] max-w-[1500px] overflow-hidden rounded-[30px] bg-[#173D2D] bg-cover bg-center sm:min-h-[750px] lg:min-h-[820px]"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(7,31,22,0.92) 0%,
                rgba(7,31,22,0.76) 35%,
                rgba(7,31,22,0.35) 68%,
                rgba(7,31,22,0.12) 100%
              ),
              url("${heroBackgroundImage}")
            `,
          }}
        >
          {/* ligne supérieure */}

          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />

          <div className="relative z-10 flex min-h-[680px] flex-col justify-between p-7 sm:min-h-[750px] sm:p-10 lg:min-h-[820px] lg:p-16">

            {/* petit label */}

            <div className="flex items-center justify-between gap-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#E8C98A] sm:text-xs">
                Agrofarms237
              </p>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-white/60 sm:block">
                La qualité commence à la ferme.
              </p>
            </div>

            {/* contenu principal */}

            <div className="max-w-[900px] pb-5 pt-24 lg:pb-8">

              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#E8C98A] sm:text-xs">
                Ferme agricole camerounaise
              </p>

              <h1 className="max-w-[900px] text-[clamp(3.3rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-white">
                Une ferme.
                <br />

                <span className="font-light italic text-[#E8C98A]">
                  Plusieurs productions.
                </span>
              </h1>

              <p className="mt-7 max-w-[650px] text-[15px] leading-7 text-white/80 sm:text-lg sm:leading-8">
                Agrofarms237 développe progressivement une activité agricole
                camerounaise autour de la pisciculture, de l’élevage, de
                l’aviculture et de l’agriculture.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  href="/produits"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#E8C98A] px-8 text-sm font-bold text-[#173D2D] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  Découvrir nos produits
                </Link>

                <Link
                  href="/notre-elevage"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/40 bg-white/[0.04] px-8 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Découvrir notre ferme
                </Link>

              </div>
            </div>

            {/* bandeau bas */}

            <div className="grid gap-4 border-t border-white/20 pt-5 sm:grid-cols-4 sm:gap-0">

              {[
                ["01", "Pisciculture"],
                ["02", "Élevage porcin"],
                ["03", "Aviculture"],
                ["04", "Agriculture"],
              ].map(([number, label], index) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 ${
                    index !== 0
                      ? "sm:border-l sm:border-white/15 sm:pl-6"
                      : ""
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#E8C98A]">
                    {number}
                  </span>

                  <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-white/75">
                    {label}
                  </span>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>


      {/* ============================================================
          CARTE INTRO / NOTRE FERME
      ============================================================ */}

      <section className="relative z-10 mx-auto -mt-4 max-w-[1120px] px-5 sm:-mt-8 lg:-mt-12">

        <div className="grid overflow-hidden rounded-[24px] bg-white shadow-[0_25px_70px_rgba(20,50,35,0.12)] md:grid-cols-[0.95fr_1.05fr]">

          <div className="relative min-h-[330px] overflow-hidden bg-[#173D2D] sm:min-h-[390px]">

            <img
              src={farmBackgroundImage}
              alt="Notre ferme Agrofarms237"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#09251A]/90 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8C98A]">
                Notre ferme
              </p>

              <p className="mt-2 max-w-[430px] text-xl font-semibold leading-tight text-white sm:text-2xl">
                Une exploitation agricole construite progressivement autour
                de plusieurs filières.
              </p>

            </div>
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">

            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B7863D]">
              Une ferme en développement
            </p>

            <h2 className="mt-4 max-w-[620px] text-[clamp(2.3rem,4.5vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[#173D2D]">
              Produire aujourd’hui.
              <br />

              <span className="font-light italic">
                Construire demain.
              </span>
            </h2>

            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-[#66756B]">
              Agrofarms237 est une ferme réelle qui évolue progressivement.
              La pisciculture constitue un point de départ, tandis que
              l’aviculture, l’élevage porcin et l’agriculture s’intègrent à
              notre trajectoire de développement.
            </p>

            <Link
              href="/notre-elevage"
              className="mt-7 inline-flex w-fit min-h-[48px] items-center justify-center rounded-full border border-[#173D2D]/20 px-6 text-sm font-semibold text-[#173D2D] transition duration-300 hover:bg-[#173D2D] hover:text-white"
            >
              Découvrir notre ferme
            </Link>

          </div>
        </div>
      </section>


      {/* ============================================================
          FILIERES
      ============================================================ */}

      <section className="mx-auto max-w-[1320px] px-5 pb-20 pt-24 sm:px-8 lg:px-10 lg:pb-28 lg:pt-32">

        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B7863D]">
              Nos filières
            </p>

            <h2 className="mt-4 max-w-[500px] text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              Une vision
              <span className="font-light italic">
                {" "}
                diversifiée.
              </span>
            </h2>

          </div>

          <p className="max-w-[620px] text-[15px] leading-7 text-[#66756B] lg:justify-self-end">
            Agrofarms237 ne se limite pas à une seule production. Notre
            objectif est de construire progressivement une ferme capable de
            développer plusieurs activités agricoles complémentaires.
          </p>

        </div>


        <div className="mt-12 grid border-t border-[#173D2D]/10 sm:grid-cols-2 lg:grid-cols-4">

          {sectors.map((sector) => (
            <div
              key={sector.number}
              className="group border-b border-[#173D2D]/10 px-1 py-8 sm:border-r sm:px-7 lg:min-h-[310px] lg:py-9"
            >

              <div className="flex items-start justify-between">

                <span className="text-[10px] font-bold tracking-[0.2em] text-[#B7863D]">
                  {sector.number}
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#89958D]">
                  {sector.label}
                </span>

              </div>

              <h3 className="mt-12 text-2xl font-semibold tracking-[-0.025em] text-[#173D2D]">
                {sector.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#718078]">
                {sector.text}
              </p>

              <div className="mt-8 h-px w-0 bg-[#B7863D] transition-all duration-500 group-hover:w-16" />

            </div>
          ))}

        </div>

      </section>


      {/* ============================================================
          PRODUITS
      ============================================================ */}

      <section
        id="produits"
        className="scroll-mt-10 bg-[#173D2D] py-5 text-white"
      >

        <div className="mx-auto max-w-[1320px] px-5 pb-3 pt-8 sm:px-8 lg:px-10">

          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8C98A]">
                Nos productions
              </p>

              <h2 className="mt-4 max-w-[560px] text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
                De la ferme
                <span className="font-light italic text-[#E8C98A]">
                  {" "}
                  à votre table.
                </span>
              </h2>

            </div>

            <p className="max-w-[620px] text-[15px] leading-7 text-white/60 lg:justify-self-end">
              Découvrez les productions actuellement proposées par
              Agrofarms237 ainsi que celles qui rejoindront progressivement
              notre catalogue.
            </p>

          </div>

        </div>

        <HomeProductsSection />

      </section>


      {/* ============================================================
          VISION
      ============================================================ */}

      <section className="bg-[#EEEAE0]">

        <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-24">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B7863D]">
                Notre vision
              </p>

              <h2 className="mt-4 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#173D2D]">
                Grandir avec
                <br />

                <span className="font-light italic">
                  la ferme.
                </span>
              </h2>

              <p className="mt-7 max-w-[560px] text-[15px] leading-8 text-[#66756B]">
                Notre ambition est de développer Agrofarms237 sur plusieurs
                cycles de production, en renforçant progressivement nos
                infrastructures, nos compétences et nos filières.
              </p>

              <p className="mt-5 max-w-[560px] text-[15px] leading-8 text-[#66756B]">
                Chaque nouvelle activité doit pouvoir s’intégrer à une ferme
                cohérente, capable de répondre progressivement aux besoins des
                consommateurs camerounais.
              </p>

              <Link
                href="/la-vie-de-la-ferme"
                className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#173D2D] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#245541]"
              >
                Découvrir notre histoire
              </Link>

            </div>


            <div className="grid gap-4 sm:grid-cols-3">

              {commitments.map((item) => (
                <div
                  key={item.number}
                  className="min-h-[260px] border-t border-[#173D2D]/15 pt-5"
                >

                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#B7863D]">
                    {item.number}
                  </span>

                  <h3 className="mt-10 text-xl font-semibold leading-tight text-[#173D2D]">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#718078]">
                    {item.text}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* ============================================================
          PROFESSIONNELS / PARTENAIRES
      ============================================================ */}

      <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

        <div className="max-w-[760px]">

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B7863D]">
            Collaborer avec Agrofarms237
          </p>

          <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.7rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
            Une ferme ouverte
            <span className="font-light italic">
              {" "}
              aux opportunités.
            </span>
          </h2>

          <p className="mt-6 max-w-[650px] text-[15px] leading-8 text-[#66756B]">
            Notre développement passe aussi par des collaborations avec les
            professionnels de l’alimentation et avec des partenaires qui
            souhaitent participer à la construction de projets agricoles.
          </p>

        </div>


        <div className="mt-12 grid gap-5 md:grid-cols-2">

          <Link
            href="/professionnels"
            className="group relative min-h-[350px] overflow-hidden rounded-[26px] bg-[#173D2D] p-8 text-white sm:p-10"
          >

            <div className="absolute right-8 top-8 h-20 w-20 rounded-full border border-[#E8C98A]/20 transition duration-500 group-hover:scale-125" />

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#E8C98A]">
                  Professionnels
                </p>

                <h3 className="mt-6 max-w-[500px] text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                  Approvisionner votre activité avec une ferme locale.
                </h3>

                <p className="mt-5 max-w-[500px] text-sm leading-7 text-white/60">
                  Restaurants, commerces, distributeurs et autres acteurs de
                  l’alimentation peuvent échanger directement avec
                  Agrofarms237.
                </p>

              </div>

              <span className="mt-8 text-sm font-semibold text-[#E8C98A]">
                Espace professionnel
              </span>

            </div>

          </Link>


          <Link
            href="/partenaires"
            className="group relative min-h-[350px] overflow-hidden rounded-[26px] bg-[#E9E4D8] p-8 text-[#173D2D] sm:p-10"
          >

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-[#173D2D]/10 transition duration-500 group-hover:scale-125" />

            <div className="relative z-10 flex h-full flex-col justify-between">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B7863D]">
                  Partenaires
                </p>

                <h3 className="mt-6 max-w-[500px] text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                  Construire l’agriculture de demain ensemble.
                </h3>

                <p className="mt-5 max-w-[500px] text-sm leading-7 text-[#66756B]">
                  Découvrez notre trajectoire de développement et les
                  différentes manières de contribuer à la croissance de la
                  ferme.
                </p>

              </div>

              <span className="mt-8 text-sm font-semibold text-[#173D2D]">
                Espace partenaires
              </span>

            </div>

          </Link>

        </div>

      </section>


      {/* ============================================================
          CTA FINAL
      ============================================================ */}

      <section className="px-3 pb-3 sm:px-5 lg:px-7">

        <div
          className="mx-auto max-w-[1500px] overflow-hidden rounded-[30px] bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(8,31,22,0.95),
                rgba(8,31,22,0.72)
              ),
              url("${farmBackgroundImage}")
            `,
          }}
        >

          <div className="px-7 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">

            <div className="max-w-[850px]">

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8C98A]">
                Agrofarms237
              </p>

              <h2 className="mt-5 text-[clamp(2.7rem,6vw,6rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
                La qualité
                <br />

                <span className="font-light italic text-[#E8C98A]">
                  commence à la ferme.
                </span>
              </h2>

              <p className="mt-7 max-w-[620px] text-[15px] leading-8 text-white/65 sm:text-lg">
                Découvrez nos productions, notre ferme et les projets qui
                construisent progressivement Agrofarms237.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  href="/produits"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[#E8C98A] px-8 text-sm font-bold text-[#173D2D] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Découvrir nos produits
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/35 px-8 text-sm font-semibold text-white transition hover:bg-white hover:text-[#173D2D]"
                >
                  Nous contacter
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer
        id="contact"
        className="mt-10 bg-[#102F24] px-5 py-14 text-white sm:px-8 lg:px-10 lg:py-20"
      >

        <div className="mx-auto max-w-[1320px]">

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.9fr] lg:gap-20">

            {/* identité */}

            <div>

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E8C98A] text-xl font-bold text-[#E8C98A]">
                  A
                </div>

                <div>

                  <p className="text-xl font-bold tracking-tight">
                    AGROFARMS
                    <span className="text-[#E8C98A]">
                      237
                    </span>
                  </p>

                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/45">
                    La qualité commence à la ferme.
                  </p>

                </div>

              </div>

              <p className="mt-6 max-w-[430px] text-sm leading-7 text-white/55">
                Une ferme agricole camerounaise qui développe
                progressivement plusieurs filières de production.
              </p>

            </div>


            {/* navigation */}

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8C98A]">
                Navigation
              </p>

              <nav className="mt-6 flex flex-col gap-3 text-sm text-white/55">

                <Link
                  href="/"
                  className="transition hover:text-[#E8C98A]"
                >
                  Accueil
                </Link>

                <Link
                  href="/produits"
                  className="transition hover:text-[#E8C98A]"
                >
                  Produits
                </Link>

                <Link
                  href="/notre-elevage"
                  className="transition hover:text-[#E8C98A]"
                >
                  Notre ferme
                </Link>

                <Link
                  href="/professionnels"
                  className="transition hover:text-[#E8C98A]"
                >
                  Professionnels
                </Link>

                <Link
                  href="/partenaires"
                  className="transition hover:text-[#E8C98A]"
                >
                  Partenaires
                </Link>

                <Link
                  href="/contact"
                  className="transition hover:text-[#E8C98A]"
                >
                  Contact
                </Link>

              </nav>

            </div>


            {/* contact */}

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8C98A]">
                Contact
              </p>

              <div className="mt-6 space-y-5">

                <div className="border-b border-white/10 pb-5">

                  <p className="text-sm font-medium text-white">
                    Yaoundé, Cameroun
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Mimboman OPEP
                  </p>

                </div>

                <a
                  href="tel:+237659505823"
                  className="block border-b border-white/10 pb-5"
                >

                  <p className="text-sm font-medium text-white transition hover:text-[#E8C98A]">
                    +237 6 59 50 58 23
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Téléphone
                  </p>

                </a>

                <a
                  href="https://wa.me/237697983119"
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >

                  <p className="text-sm font-medium text-white transition hover:text-[#E8C98A]">
                    +237 6 97 98 31 19
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    WhatsApp
                  </p>

                </a>

              </div>

            </div>

          </div>


          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} Agrofarms237. Tous droits réservés.
            </p>

            <p className="font-semibold uppercase tracking-[0.18em] text-[#E8C98A]/70">
              Produire aujourd’hui, construire demain.
            </p>

          </div>

        </div>

      </footer>


      {/* ============================================================
          WHATSAPP
      ============================================================ */}

      <a
        href="https://wa.me/237697983119?text=Bonjour%20Agrofarms237%2C%20je%20souhaite%20avoir%20des%20informations."
        target="_blank"
        rel="noreferrer"
        aria-label="Contacter Agrofarms237 sur WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#D5B16D]/40 bg-[#173D2D] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E8C98A] shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#102F24] sm:bottom-6 sm:right-6"
      >
        WhatsApp
      </a>

    </main>
  );
}
