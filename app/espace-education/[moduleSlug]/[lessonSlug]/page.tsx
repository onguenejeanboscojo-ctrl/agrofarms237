import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    lessonSlug: string;
  }>;
};

async function getLesson(
  moduleSlug: string,
  lessonSlug: string
) {
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

  const { data: lesson } = await supabase
    .from("education_lessons")
    .select(
      "id, module_id, title, slug, introduction, content, image_url, video_url, published, position"
    )
    .eq("module_id", module.id)
    .eq("slug", lessonSlug)
    .eq("published", true)
    .maybeSingle();

  if (!lesson) {
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
    lesson: lesson as EducationLesson,
    lessons: (lessons || []) as EducationLesson[],
  };
}

function formatContent(content: string | null) {
  if (!content) return [];

  return content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function EducationLessonPage({
  params,
}: PageProps) {
  const { moduleSlug, lessonSlug } = await params;

  const result = await getLesson(
    moduleSlug,
    lessonSlug
  );

  if (!result) {
    notFound();
  }

  const {
    module,
    lesson,
    lessons,
  } = result;

  const currentIndex = lessons.findIndex(
    (item) => item.id === lesson.id
  );

  const previousLesson =
    currentIndex > 0
      ? lessons[currentIndex - 1]
      : null;

  const nextLesson =
    currentIndex >= 0 &&
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const contentBlocks = formatContent(
    lesson.content
  );

  return (
    <main className="bg-paper">
      {/* ===================================================== */}
      {/* BREADCRUMB                                            */}
      {/* ===================================================== */}

      <section className="px-5 pb-5 pt-7">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-inkSoft">
            <Link
              href="/espace-education"
              className="transition hover:text-ink"
            >
              Éducation
            </Link>

            <span>/</span>

            <Link
              href={`/espace-education/${module.slug}`}
              className="transition hover:text-ink"
            >
              {module.title}
            </Link>

            <span>/</span>

            <span className="text-ink">
              {lesson.title}
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HEADER DU COURS                                       */}
      {/* ===================================================== */}

      <section className="px-5 pb-12 pt-4 md:pb-16">
        <div className="mx-auto max-w-[1080px]">
          <div className="overflow-hidden rounded-[28px] bg-ink">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              {/* TEXTE */}
              <div className="flex flex-col justify-center p-7 text-paper md:p-10 lg:p-12">
                <span className="inline-flex w-fit items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
                  <span className="h-px w-7 bg-gold" />
                  Cours {String(currentIndex + 1).padStart(2, "0")}
                </span>

                <h1 className="mt-4 font-serif text-[clamp(34px,5vw,54px)] font-semibold leading-[1.02]">
                  {lesson.title}
                </h1>

                {lesson.introduction && (
                  <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-paper/75">
                    {lesson.introduction}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-paper/15 bg-paper/10 px-4 py-2 text-[11px] font-semibold">
                    Formation gratuite
                  </span>

                  <span className="rounded-full border border-paper/15 bg-paper/10 px-4 py-2 text-[11px] font-semibold">
                    {module.title}
                  </span>
                </div>
              </div>

              {/* IMAGE */}
              <div className="relative min-h-[300px] bg-bgAlt md:min-h-[390px]">
                {lesson.image_url ? (
                  <Image
                    src={lesson.image_url}
                    alt={lesson.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                ) : module.image_url ? (
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTENU DU COURS                                     */}
      {/* ===================================================== */}

      <section className="px-5 pb-[70px]">
        <div className="mx-auto grid max-w-[1080px] gap-10 lg:grid-cols-[1fr_280px]">
          {/* ARTICLE */}
          <article className="min-w-0">
            <div className="rounded-[24px] border border-ink/10 bg-paper p-6 md:p-9 lg:p-11">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-goldDeep">
                Leçon
              </span>

              <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-ink md:text-[38px]">
                {lesson.title}
              </h2>

              {contentBlocks.length > 0 ? (
                <div className="mt-8 space-y-6">
                  {contentBlocks.map(
                    (paragraph, index) => (
                      <p
                        key={`${lesson.id}-${index}`}
                        className="text-[15px] leading-8 text-inkSoft md:text-[16px]"
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-8 rounded-[18px] bg-bgAlt p-6">
                  <p className="text-sm leading-7 text-inkSoft">
                    Le contenu détaillé de ce cours sera
                    prochainement disponible.
                  </p>
                </div>
              )}

              {/* VIDÉO */}
              {lesson.video_url && (
                <div className="mt-10 border-t border-ink/10 pt-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-goldDeep">
                    Vidéo du cours
                  </span>

                  <div className="mt-4 overflow-hidden rounded-[20px] border border-ink/10 bg-bgAlt">
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-[180px] items-center justify-center p-8 text-center transition hover:bg-ink hover:text-paper"
                    >
                      <div>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink">
                          ▶
                        </div>

                        <p className="mt-4 text-sm font-bold">
                          Regarder la vidéo
                        </p>

                        <p className="mt-1 text-xs opacity-60">
                          Ouvrir le contenu vidéo
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <div className="rounded-[22px] border border-ink/10 bg-bgAlt p-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-goldDeep">
                Dans ce module
              </span>

              <h3 className="mt-2 font-serif text-xl font-semibold text-ink">
                {module.title}
              </h3>

              <div className="mt-5 space-y-1">
                {lessons.map(
                  (item, index) => {
                    const isCurrent =
                      item.id === lesson.id;

                    return (
                      <Link
                        key={item.id}
                        href={`/espace-education/${module.slug}/${item.slug}`}
                        className={`flex gap-3 rounded-[14px] px-3 py-3 transition ${
                          isCurrent
                            ? "bg-ink text-paper"
                            : "text-ink hover:bg-paper"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold ${
                            isCurrent
                              ? "text-gold"
                              : "text-inkSoft"
                          }`}
                        >
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="text-[12px] font-semibold leading-5">
                          {item.title}
                        </span>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ===================================================== */}
      {/* NAVIGATION ENTRE COURS                                */}
      {/* ===================================================== */}

      <section className="border-t border-ink/10 px-5 py-[55px]">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
          {previousLesson ? (
            <Link
              href={`/espace-education/${module.slug}/${previousLesson.slug}`}
              className="group flex flex-1 flex-col rounded-[20px] border border-ink/10 p-5 transition hover:border-ink/25 hover:bg-bgAlt"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-inkSoft">
                ← Cours précédent
              </span>

              <span className="mt-2 font-serif text-xl font-semibold text-ink">
                {previousLesson.title}
              </span>
            </Link>
          ) : (
            <div className="hidden flex-1 md:block" />
          )}

          {nextLesson ? (
            <Link
              href={`/espace-education/${module.slug}/${nextLesson.slug}`}
              className="group flex flex-1 flex-col rounded-[20px] border border-ink/10 p-5 text-right transition hover:border-ink/25 hover:bg-bgAlt"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-inkSoft">
                Cours suivant →
              </span>

              <span className="mt-2 font-serif text-xl font-semibold text-ink">
                {nextLesson.title}
              </span>
            </Link>
          ) : (
            <div className="hidden flex-1 md:block" />
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* RETOUR AU MODULE                                     */}
      {/* ===================================================== */}

      <section className="px-5 pb-[70px]">
        <div className="mx-auto max-w-[1080px] text-center">
          <Link
            href={`/espace-education/${module.slug}`}
            className="inline-flex items-center rounded-full border border-ink/15 px-5 py-3 text-[12px] font-bold text-ink transition hover:bg-ink hover:text-paper"
          >
            ← Retour à {module.title}
          </Link>
        </div>
      </section>
    </main>
  );
}
