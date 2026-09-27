import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import EducationHeroSlideshow from "@/components/EducationHeroSlideshow";

export const revalidate = 30;

type EducationModule = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
};

type EducationLesson = {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  introduction: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  published: boolean;
  position: number;
};

type PageProps = {
  params: Promise<{
    moduleSlug: string;
  }>;
};

async function getModule(moduleSlug: string) {
  const supabase = supabaseAdmin();

  const { data: module } = await supabase
    .from("education_modules")
    .select(
      "id, title, slug, description, image_url, published"
    )
    .eq("slug", moduleSlug)
    .eq("published", true)
    .maybeSingle();

  if (!module) {
    return null;
  }

  const { data: lessons } = await supabase
    .from("education_lessons")
    .select(
      "id, module_id, title, slug, introduction, content, image_url, video_url, published, position"
    )
    .eq("module_id", module.id)
    .eq("published", true)
    .order("position", { ascending: true });

  return {
    module: module as EducationModule,
    lessons: (lessons || []) as EducationLesson[],
  };
}

export default async function EducationModulePage({
  params,
}: PageProps) {
  const { moduleSlug } = await params;

  const result = await getModule(moduleSlug);

  if (!result) {
    notFound();
  }

  const { module, lessons } = result;

  /*
   * On construit le slideshow avec :
   * 1. l'image principale du module
   * 2. les images des cours lorsqu'elles existent
   *
   * Les doublons sont supprimés.
   */
  const rawSlides = [
    module.image_url
      ? {
          url: module.image_url,
          alt: module.title,
        }
      : null,

    ...lessons
      .filter(
        (lesson) =>
          lesson.image_url &&
          lesson.image_url.trim() !== ""
      )
      .map((lesson) => ({
        url: lesson.image_url as string,
        alt: lesson.title,
      })),
  ].filter(Boolean) as {
    url: string;
    alt: string;
  }[];

  const slides = rawSlides.filter(
    (slide, index, array) =>
      array.findIndex(
        (item) => item.url === slide.url
      ) === index
  );

  return (
    <main className="bg-paper">
      {/* ===================================================== */}
      {/* HERO MODULE                                          */}
      {/* ===================================================== */}

      <section className="px-4 pb-10 pt-5 md:px-6 md:pb-14 md:pt-7">
        <div className="mx-auto max-w-[1280px]">
          {/* Fil d'Ariane */}
          <div className="mb-5 flex items-center gap-2 px-1 text-[11px] font-medium text-inkSoft">
            <Link
              href="/espace-education"
              className="transition hover:text-ink"
            >
              Éducation
            </Link>

            <span>/</span>

            <span className="text-ink">
              {module.title}
            </span>
          </div>

          {/* HERO PHOTO */}
          <div className="relative min-h-[540px] overflow-hidden rounded-[30px] bg-ink md:min-h-[600px]">
            {/* Image principale */}
            {module.image_url ? (
              <Image
                src={module.image_url}
                alt={module.title}
                fill
                priority
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]" />
            )}

            {/* Voiles très légers */}
            <div className="absolute inset-0 bg-black/15" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

            {/* Contenu */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10 lg:p-12">
              <div className="max-w-[650px]">
                <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                  <span className="h-px w-8 bg-gold" />
                  Formation AgroFarms237
                </span>

                <h1 className="mt-4 max-w-[650px] font-serif text-[clamp(38px,6vw,68px)] font-semibold leading-[0.98] text-white">
                  {module.title}
                </h1>

                {module.description && (
                  <p className="mt-5 max-w-[590px] text-[14px] leading-6 text-white/85 md:text-[16px] md:leading-7">
                    {module.description}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md">
                    {lessons.length}{" "}
                    {lessons.length > 1 ? "cours" : "cours"}
                  </span>

                  <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md">
                    Formation gratuite
                  </span>
                </div>
              </div>
            </div>

            {/* Slideshow des cours */}
            {slides.length > 1 && (
              <div className="absolute bottom-5 right-5 z-20 w-[min(430px,calc(100%-40px))] md:bottom-8 md:right-8 md:w-[390px] lg:w-[430px]">
                <div className="overflow-hidden rounded-[22px] border border-white/20 bg-black/20 p-1.5 shadow-2xl backdrop-blur-sm">
                  <EducationHeroSlideshow slides={slides} />
                </div>
              </div>
            )}

            {/* Badge supérieur */}
            <div className="absolute left-5 top-5 z-20 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md md:left-7 md:top-7">
              AgroFarms237
            </div>

            {/* Nombre de cours */}
            <div className="absolute right-5 top-5 z-20 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-[11px] font-bold text-white backdrop-blur-md md:right-7 md:top-7">
              {lessons.length} cours
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INTRODUCTION                                          */}
      {/* ===================================================== */}

      <section className="px-5 py-[70px] md:py-[85px]">
        <div className="mx-auto max-w-[900px] text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-goldDeep">
            Parcours de formation
          </span>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold leading-tight text-ink">
            Apprendre étape par étape.
          </h2>

          <p className="mx-auto mt-5 max-w-[700px] text-[15px] leading-7 text-inkSoft md:text-[16px]">
            Parcourez les différents cours de ce module pour acquérir
            progressivement les connaissances essentielles et mieux
            comprendre les réalités de cette activité.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* COURS                                                 */}
      {/* ===================================================== */}

      <section className="bg-bgAlt px-5 py-[75px] md:py-[90px]">
        <div className="mx-auto max-w-[1050px]">
          <div className="mb-10">
            <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-goldDeep">
              {module.title}
            </span>

            <h2 className="mt-2 font-serif text-[clamp(30px,5vw,44px)] font-semibold leading-tight text-ink">
              Les cours
            </h2>

            <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-inkSoft">
              Découvrez les différents sujets proposés dans ce parcours.
            </p>
          </div>

          {lessons.length === 0 ? (
            <div className="rounded-[24px] border border-ink/10 bg-paper px-6 py-14 text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-goldDeep">
                AgroFarms237
              </span>

              <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
                Les cours arrivent bientôt.
              </h3>

              <p className="mx-auto mt-3 max-w-[500px] text-sm leading-6 text-inkSoft">
                Le contenu pédagogique de ce module sera progressivement
                enrichi.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/espace-education/${module.slug}/${lesson.slug}`}
                  className="group flex flex-col gap-5 rounded-[22px] border border-ink/10 bg-paper p-5 transition duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_15px_35px_rgba(8,24,21,0.07)] md:flex-row md:items-center md:p-6"
                >
                  {/* IMAGE */}
                  <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-[16px] bg-bgAlt md:h-[110px] md:w-[170px]">
                    {lesson.image_url ? (
                      <img
                        src={lesson.image_url}
                        alt={lesson.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
                        <span className="font-serif text-xl text-paper/80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* TEXTE */}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-goldDeep">
                      Cours {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="mt-1 font-serif text-[22px] font-semibold leading-tight text-ink transition group-hover:text-inkSoft md:text-[25px]">
                      {lesson.title}
                    </h3>

                    {lesson.introduction && (
                      <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-inkSoft">
                        {lesson.introduction}
                      </p>
                    )}
                  </div>

                  {/* ACTION */}
                  <div className="flex shrink-0 items-center justify-between gap-4 border-t border-ink/10 pt-4 md:border-t-0 md:pt-0">
                    <span className="text-[11px] font-bold text-ink">
                      Voir le cours
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink transition group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* RETOUR ÉDUCATION                                      */}
      {/* ===================================================== */}

      <section className="px-5 py-[70px]">
        <div className="mx-auto max-w-[900px] text-center">
          <Link
            href="/espace-education"
            className="inline-flex items-center rounded-full border border-ink/15 px-5 py-3 text-[12px] font-bold text-ink transition hover:bg-ink hover:text-paper"
          >
            ← Retour à l’Espace Éducation
          </Link>
        </div>
      </section>
    </main>
  );
}
