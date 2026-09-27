import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const revalidate = 30;

type Module = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  published: boolean;
};

type Lesson = {
  id: string;
  title: string;
  slug: string;
  introduction: string | null;
  image_url: string | null;
  position: number;
  published: boolean;
};

async function getModule(slug: string) {
  const { data } = await supabaseAdmin()
    .from("education_modules")
    .select("id,title,slug,description,image_url,published")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return data as Module | null;
}

async function getLessons(moduleId: string) {
  const { data, error } = await supabaseAdmin()
    .from("education_lessons")
    .select(
      "id,title,slug,introduction,image_url,position,published"
    )
    .eq("module_id", moduleId)
    .eq("published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Education lessons error:", error);
    return [];
  }

  return (data || []) as Lesson[];
}

export default async function EducationModulePage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;

  const module = await getModule(moduleSlug);

  if (!module) {
    notFound();
  }

  const lessons = await getLessons(module.id);

  return (
    <main className="bg-bg">

      {/* RETOUR */}
      <section className="bg-ink px-5 py-5 text-paper">
        <div className="mx-auto max-w-[1180px]">
          <Link
            href="/espace-education"
            className="text-[13px] text-paper/60 transition hover:text-gold"
          >
            ← Retour à l’Éducation
          </Link>
        </div>
      </section>

      {/* HERO DU MODULE */}
      <section className="relative overflow-hidden bg-ink px-5 pb-[80px] text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(100%_130%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)]" />

        <div className="relative mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">

          <div>
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-gold">
              Parcours pédagogique
            </span>

            <h1 className="mt-4 font-serif text-[clamp(42px,6vw,68px)] font-semibold leading-[1.05]">
              {module.title}
            </h1>

            {module.description && (
              <p className="mt-5 max-w-[650px] text-[16px] leading-7 text-paper/72">
                {module.description}
              </p>
            )}
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-l border border-paper/10 bg-ink/40">

            {module.image_url ? (
              <Image
                src={module.image_url}
                alt={module.title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-serif text-3xl text-paper/80">
                  {module.title}
                </span>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* SOMMAIRE */}
      <section className="px-5 py-[76px]">
        <div className="mx-auto max-w-[980px]">

          <div className="mb-12">
            <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-goldDeep">
              Sommaire
            </span>

            <h2 className="mt-3 font-serif text-[clamp(32px,5vw,48px)] font-semibold">
              {lessons.length} cours pour progresser étape par étape
            </h2>

            <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-inkSoft">
              Commencez par le premier cours, puis avancez librement dans
              le parcours.
            </p>
          </div>

          {lessons.length === 0 ? (

            <div className="rounded-l border border-ink/10 bg-paper p-10">
              <p className="font-serif text-2xl">
                Cours en préparation.
              </p>

              <p className="mt-3 text-sm text-inkSoft">
                Les cours de ce parcours seront bientôt disponibles.
              </p>
            </div>

          ) : (

            <div className="overflow-hidden rounded-l border border-ink/10 bg-paper">

              {lessons.map((lesson, index) => (

                <Link
                  key={lesson.id}
                  href={`/espace-education/${module.slug}/${lesson.slug}`}
                  className="group flex gap-5 border-b border-ink/10 p-5 transition last:border-b-0 hover:bg-bgAlt md:gap-7 md:p-7"
                >

                  {/* NUMÉRO */}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bgAlt font-serif text-lg text-goldDeep">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* CONTENU */}
                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-goldDeep">
                        Cours {index + 1}
                      </span>

                      <span className="h-px flex-1 bg-ink/10" />
                    </div>

                    <h3 className="mt-2 font-serif text-[23px] font-semibold md:text-[26px]">
                      {lesson.title}
                    </h3>

                    {lesson.introduction && (
                      <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-inkSoft">
                        {lesson.introduction}
                      </p>
                    )}

                  </div>

                  {/* FLÈCHE */}
                  <span className="self-center text-xl text-inkSoft transition-transform group-hover:translate-x-1">
                    →
                  </span>

                </Link>

              ))}

            </div>

          )}

        </div>
      </section>

    </main>
  );
}
