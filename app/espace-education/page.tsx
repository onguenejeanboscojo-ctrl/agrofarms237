import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 30;

type MediaItem = {
  id: string;
  url: string;
  kind: "photo" | "video";
  category?: string | null;
  caption?: string | null;
};

async function getMedia() {
  try {
    const { data } = await supabaseAdmin()
      .from("media")
      .select("*")
      .eq("published", true)
      .order("position")
      .order("created_at", { ascending: false });

    return (data || []) as MediaItem[];
  } catch {
    return [];
  }
}

const EDUCATION_SECTIONS = [
  {
    category: "education_pisciculture",
    number: "01",
    title: "Pisciculture",
    subtitle: "Bien démarrer son élevage de poissons",
    description:
      "Découvrez les bases essentielles pour démarrer une activité piscicole : choix du bassin, qualité de l’eau, choix des alevins, alimentation et suivi de la croissance.",
    lessons: [
      "Choisir et préparer son bassin",
      "Bien choisir ses alevins",
      "Comprendre l’alimentation du silure",
      "Surveiller la qualité de l’eau",
      "Suivre la croissance des poissons",
    ],
  },
  {
    category: "education_porcs",
    number: "02",
    title: "Élevage porcin",
    subtitle: "Les bases pour commencer",
    description:
      "Apprenez les fondamentaux de l’élevage porcin : installation, alimentation, hygiène, reproduction et suivi quotidien des animaux.",
    lessons: [
      "Préparer le bâtiment d’élevage",
      "Organiser l’alimentation",
      "Maintenir une bonne hygiène",
      "Comprendre la reproduction",
      "Suivre les porcelets",
    ],
  },
  {
    category: "education_aviculture",
    number: "03",
    title: "Aviculture",
    subtitle: "Pondeuses et poulets de chair",
    description:
      "Les notions essentielles pour démarrer un élevage avicole et assurer de bonnes conditions de croissance aux volailles.",
    lessons: [
      "Préparer le poulailler",
      "Choisir ses poussins",
      "Organiser l’alimentation",
      "Maintenir l’hygiène",
      "Suivre la croissance et la production",
    ],
  },
  {
    category: "education_agriculture",
    number: "04",
    title: "Agriculture",
    subtitle: "De la préparation du sol à la récolte",
    description:
      "Les fondamentaux pour mieux comprendre les principales étapes d’une production agricole et organiser son activité.",
    lessons: [
      "Préparer correctement le sol",
      "Choisir les semences",
      "Organiser les semis",
      "Entretenir les cultures",
      "Préparer la récolte",
    ],
  },
];

function EducationMedia({
  images,
  videos,
  title,
}: {
  images: string[];
  videos: string[];
  title: string;
}) {
  if (images.length > 0) {
    return (
      <div className="overflow-hidden rounded-l border border-ink/10 bg-bgAlt">
        <div
          className="aspect-[16/10] bg-cover bg-center"
          style={{
            backgroundImage: `url("${images[0]}")`,
          }}
        />

        {videos.length > 0 && (
          <div className="border-t border-ink/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[12px] text-paper">
                ▶
              </span>

              <span className="text-[13px] font-bold text-ink">
                Vidéo pédagogique
              </span>
            </div>

            <video
              controls
              preload="metadata"
              className="w-full rounded-m"
              src={videos[0]}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-l border border-ink/10 bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
      <div className="flex aspect-[16/10] items-center justify-center px-6 text-center">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-gold">
            Agrofarms237
          </span>

          <p className="mt-2 font-serif text-[24px] font-semibold text-paper">
            {title}
          </p>

          <p className="mt-2 text-[13px] text-paper/60">
            Photo pédagogique à venir
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function EspaceEducationPage() {
  const media = await getMedia();

  const getImages = (category: string) =>
    media
      .filter(
        (item) =>
          item.category === category &&
          item.kind === "photo"
      )
      .map((item) => item.url);

  const getVideos = (category: string) =>
    media
      .filter(
        (item) =>
          item.category === category &&
          item.kind === "video"
      )
      .map((item) => item.url);

  return (
    <main>
      {/* ===================================================== */}
      {/* HERO                                                   */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-ink px-5 py-[100px] text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)]" />

        <div className="relative mx-auto max-w-[1180px]">
          <span className="mb-3 inline-block text-[13px] font-bold text-gold">
            Espace Éducation
          </span>

          <h1 className="max-w-[850px] font-serif text-[clamp(40px,7vw,68px)] font-semibold leading-[1.05]">
            Apprendre.
            <br />
            Comprendre.
            <br />
            Produire.
          </h1>

          <p className="mt-6 max-w-[680px] text-[17px] leading-7 text-paper/75">
            Un espace pensé pour celles et ceux qui souhaitent découvrir
            l’agriculture et l’élevage, comprendre les bases et progresser
            étape par étape.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INTRODUCTION                                          */}
      {/* ===================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[13px] font-bold text-goldDeep">
            Pour commencer
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            L’agriculture s’apprend aussi sur le terrain.
          </h2>

          <p className="mx-auto mt-5 max-w-[700px] text-[16px] leading-7 text-inkSoft">
            Que vous soyez débutant ou que vous souhaitiez approfondir vos
            connaissances, Agrofarms237 partage ici des notions pratiques
            pour mieux comprendre les différentes étapes d’une production
            agricole ou d’un élevage.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FORMATIONS / THÈMES                                   */}
      {/* ===================================================== */}

      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12">
            <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
              Nos ressources
            </span>

            <h2 className="font-serif text-[clamp(30px,5vw,44px)] font-semibold">
              Apprendre par filière
            </h2>

            <p className="mt-2 max-w-[680px] text-[15px] leading-7 text-inkSoft">
              Chaque rubrique rassemble des conseils simples et pratiques
              pour vous aider à mieux comprendre votre activité.
            </p>
          </div>

          <div className="grid gap-10">
            {EDUCATION_SECTIONS.map((section) => {
              const images = getImages(section.category);
              const videos = getVideos(section.category);

              return (
                <article
                  key={section.category}
                  className="overflow-hidden rounded-l border border-ink/10 bg-paper"
                >
                  <div className="grid md:grid-cols-[1fr_1.05fr]">
                    {/* MÉDIA */}
                    <EducationMedia
                      images={images}
                      videos={videos}
                      title={section.title}
                    />

                    {/* CONTENU */}
                    <div className="p-7 md:p-10">
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] font-bold text-goldDeep">
                          {section.number}
                        </span>

                        <span className="h-px flex-1 bg-ink/10" />
                      </div>

                      <span className="mt-7 block text-[12px] font-bold uppercase tracking-[0.12em] text-goldDeep">
                        {section.title}
                      </span>

                      <h3 className="mt-2 font-serif text-[30px] font-semibold">
                        {section.subtitle}
                      </h3>

                      <p className="mt-4 text-[15px] leading-7 text-inkSoft">
                        {section.description}
                      </p>

                      <div className="mt-7">
                        <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink">
                          Au programme
                        </h4>

                        <ul className="mt-4 space-y-3">
                          {section.lessons.map((lesson) => (
                            <li
                              key={lesson}
                              className="flex items-start gap-3 text-[14px] leading-6 text-inkSoft"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONSEIL DU DÉBUTANT                                   */}
      {/* ===================================================== */}

      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1000px]">
          <div className="grid overflow-hidden rounded-l bg-ink text-paper md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex items-center justify-center bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)] p-10">
              <div className="text-center">
                <span className="text-[13px] font-bold text-gold">
                  Conseil du débutant
                </span>

                <div className="mt-4 font-serif text-[52px] font-semibold">
                  01
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="font-serif text-[30px] font-semibold">
                Commencer petit, mais commencer correctement.
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-paper/70">
                Une bonne production commence par une bonne préparation.
                Avant d’investir davantage, prenez le temps de comprendre
                votre environnement, vos besoins, vos coûts, votre marché
                et les exigences de l’activité choisie.
              </p>

              <p className="mt-4 text-[15px] leading-7 text-paper/70">
                L’objectif n’est pas seulement de produire, mais de
                construire une activité que vous pouvez suivre, mesurer et
                améliorer progressivement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FORMATION INTENSIVE                                  */}
      {/* ===================================================== */}

      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[1000px] text-center">
          <span className="text-[13px] font-bold text-goldDeep">
            Pour aller plus loin
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Formation intensive
          </h2>

          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-7 text-inkSoft">
            Pour celles et ceux qui souhaitent aller au-delà des conseils
            gratuits, Agrofarms237 proposera des formations intensives
            consacrées à la pratique et au développement d’une activité
            agricole ou d’élevage.
          </p>

          <div className="mt-7">
            <a
              href="/contact"
              className="btn btn-ink"
            >
              Découvrir les formations
            </a>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA                                                    */}
      {/* ===================================================== */}

      <section className="bg-ink px-5 py-[72px] text-paper">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[13px] font-bold text-gold">
            Agrofarms237
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Produire mieux commence par mieux comprendre.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-paper/70">
            Nous continuerons à enrichir cet espace avec de nouveaux
            contenus, photos et vidéos pédagogiques au fur et à mesure du
            développement de la ferme.
          </p>
        </div>
      </section>
    </main>
  );
}
