import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import EducationModulesHeroSlideshow from "@/components/EducationModulesHeroSlideshow";

export const revalidate = 30;

type EducationModule = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
  position: number;
};

type EducationLesson = {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  published: boolean;
  position: number;
};

type EducationModuleWithCount = EducationModule & {
  lessonCount: number;
};

async function getEducationData(): Promise<EducationModuleWithCount[]> {
  try {
    const supabase = supabaseAdmin();

    const [{ data: modules }, { data: lessons }] = await Promise.all([
      supabase
        .from("education_modules")
        .select(
          "id, title, slug, description, image_url, published, position"
        )
        .eq("published", true)
        .order("position", { ascending: true }),

      supabase
        .from("education_lessons")
        .select("id, module_id, title, slug, published, position")
        .eq("published", true)
        .order("position", { ascending: true }),
    ]);

    const publishedModules = (modules || []) as EducationModule[];
    const publishedLessons = (lessons || []) as EducationLesson[];

    return publishedModules.map((module) => ({
      ...module,
      lessonCount: publishedLessons.filter(
        (lesson) => lesson.module_id === module.id
      ).length,
    }));
  } catch {
    return [];
  }
}

export default async function EspaceEducationPage() {
  const modules = await getEducationData();

  return (
    <main className="bg-paper">
      {/* ===================================================== */}
      {/* HERO PRINCIPAL                                        */}
      {/* ===================================================== */}

      <section className="px-5 pb-16 pt-8 md:pb-20 md:pt-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            {/* TEXTE À GAUCHE */}
            <div className="max-w-[520px]">
              <span className="mb-4 inline-flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-goldDeep">
                <span className="h-px w-8 bg-goldDeep" />
                Espace Éducation
              </span>

              <h1 className="font-serif text-[clamp(44px,6vw,72px)] font-semibold leading-[0.98] tracking-[-0.03em] text-ink">
                Apprendre.
                <br />
                Comprendre.
                <br />
                <span className="text-inkSoft">Produire.</span>
              </h1>

              <p className="mt-7 max-w-[500px] text-[16px] leading-7 text-inkSoft md:text-[17px]">
                Un espace pensé pour celles et ceux qui souhaitent découvrir
                l’agriculture et l’élevage, comprendre les bases et progresser
                étape par étape.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#formations"
                  className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-[12px] font-bold text-paper transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  Explorer les formations
                  <span className="ml-2 text-base">↓</span>
                </a>

                <span className="text-[12px] font-medium text-inkSoft">
                  Agriculture • Élevage • Gestion
                </span>
              </div>
            </div>

            {/* SLIDESHOW DES MODULES */}
            <div className="min-w-0">
              <EducationModulesHeroSlideshow modules={modules} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INTRODUCTION                                          */}
      {/* ===================================================== */}

      <section className="border-y border-ink/10 bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[13px] font-bold text-goldDeep">
            Pour commencer
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold leading-tight text-ink">
            L’agriculture s’apprend aussi sur le terrain.
          </h2>

          <p className="mx-auto mt-5 max-w-[720px] text-[16px] leading-7 text-inkSoft">
            Que vous soyez débutant ou que vous souhaitiez approfondir vos
            connaissances, AgroFarms237 partage ici des notions pratiques
            pour mieux comprendre les différentes étapes d’une production
            agricole ou d’un élevage.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* MODULES                                               */}
      {/* ===================================================== */}

      <section
        id="formations"
        className="px-5 py-[80px] md:py-[96px]"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-2 inline-block text-[13px] font-bold text-goldDeep">
                Nos formations
              </span>

              <h2 className="font-serif text-[clamp(32px,5vw,46px)] font-semibold leading-tight text-ink">
                Apprendre par filière
              </h2>

              <p className="mt-3 max-w-[680px] text-[15px] leading-7 text-inkSoft">
                Des cours structurés pour comprendre progressivement les
                bases techniques et les réalités d’une exploitation agricole.
              </p>
            </div>

            {modules.length > 0 && (
              <span className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-inkSoft">
                {modules.length} modules disponibles
              </span>
            )}
          </div>

          {modules.length === 0 ? (
            <div className="rounded-[24px] border border-ink/10 bg-bgAlt px-6 py-16 text-center">
              <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-goldDeep">
                AgroFarms237
              </span>

              <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
                Nos formations arrivent bientôt.
              </h3>

              <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-inkSoft">
                Les contenus pédagogiques seront progressivement ajoutés à
                cet espace.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {modules.map((module, index) => (
                <article
                  key={module.id}
                  className="group overflow-hidden rounded-[24px] border border-ink/10 bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(8,24,21,0.08)]"
                >
                  <Link href={`/espace-education/${module.slug}`}>
                    <div className="relative aspect-[16/9] overflow-hidden bg-bgAlt">
                      {module.image_url ? (
                        <img
                          src={module.image_url}
                          alt={module.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
                          <span className="font-serif text-2xl text-paper/80">
                            AgroFarms237
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

                      <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                        <h3 className="font-serif text-[28px] font-semibold leading-tight text-white">
                          {module.title}
                        </h3>

                        <span className="shrink-0 rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold text-ink">
                          {module.lessonCount} cours
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-7">
                      <p className="min-h-[48px] text-[14px] leading-6 text-inkSoft">
                        {module.description ||
                          "Découvrez les fondamentaux de cette filière à travers nos cours pédagogiques."}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
                        <span className="text-[12px] font-bold text-ink">
                          Découvrir les cours
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink transition group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONSEIL                                               */}
      {/* ===================================================== */}

      <section className="px-5 pb-[80px] md:pb-[96px]">
        <div className="mx-auto max-w-[1050px] overflow-hidden rounded-[28px] bg-ink text-paper">
          <div className="grid md:grid-cols-[0.7fr_1.3fr]">
            <div className="flex min-h-[260px] items-center justify-center bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)] p-10">
              <div className="text-center">
                <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-gold">
                  Conseil du débutant
                </span>

                <div className="mt-4 font-serif text-[64px] font-semibold leading-none">
                  01
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="font-serif text-[30px] font-semibold leading-tight md:text-[36px]">
                Commencer petit, mais commencer correctement.
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-paper/70">
                Une bonne production commence par une bonne préparation.
                Avant d’investir davantage, prenez le temps de comprendre
                votre environnement, vos besoins, vos coûts, votre marché et
                les exigences de l’activité choisie.
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

      <section className="bg-bgAlt px-5 py-[80px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[13px] font-bold text-goldDeep">
            Pour aller plus loin
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Formation intensive
          </h2>

          <p className="mx-auto mt-5 max-w-[680px] text-[16px] leading-7 text-inkSoft">
            Pour celles et ceux qui souhaitent aller au-delà des conseils
            gratuits, AgroFarms237 proposera des formations intensives
            consacrées à la pratique et au développement d’une activité
            agricole ou d’élevage.
          </p>

          <div className="mt-7">
            <Link href="/contact" className="btn btn-ink">
              Découvrir les formations
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA FINAL                                             */}
      {/* ===================================================== */}

      <section className="bg-ink px-5 py-[80px] text-paper">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[13px] font-bold text-gold">
            AgroFarms237
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold leading-tight">
            Produire mieux commence par mieux comprendre.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-paper/70">
            Nous continuerons à enrichir cet espace avec de nouveaux
            contenus pédagogiques au fur et à mesure du développement de la
            ferme.
          </p>
        </div>
      </section>
    </main>
  );
}
