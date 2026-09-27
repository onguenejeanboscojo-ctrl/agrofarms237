import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import EducationHeroSlideshow from "@/components/EducationHeroSlideshow";

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
  module_id: string;
  title: string;
  slug: string;
  introduction: string | null;
  image_url: string | null;
  video_url: string | null;
  position: number;
  published: boolean;
};

async function getModule(
  slug: string
): Promise<Module | null> {
  const { data, error } = await supabaseAdmin()
    .from("education_modules")
    .select(
      "id,title,slug,description,image_url,published"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(
      "Erreur récupération module éducation :",
      error
    );

    return null;
  }

  return data as Module | null;
}

async function getLessons(
  moduleId: string
): Promise<Lesson[]> {
  const { data, error } = await supabaseAdmin()
    .from("education_lessons")
    .select(
      "id,module_id,title,slug,introduction,image_url,video_url,position,published"
    )
    .eq("module_id", moduleId)
    .eq("published", true)
    .order("position", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Erreur récupération cours éducation :",
      error
    );

    return [];
  }

  return (data || []) as Lesson[];
}

export default async function EducationModulePage({
  params,
}: {
  params: Promise<{
    moduleSlug: string;
  }>;
}) {
  const { moduleSlug } = await params;

  const module = await getModule(moduleSlug);

  if (!module) {
    notFound();
  }

  const lessons = await getLessons(module.id);

  /*
   * ============================================================
   * CONSTRUCTION DU DIAPORAMA
   * ============================================================
   *
   * Le diaporama utilise :
   *
   * 1. l'image principale du module
   * 2. les images des cours publiés
   *
   * Les doublons sont automatiquement supprimés.
   */

  const slides = [
    ...(module.image_url
      ? [
          {
            url: module.image_url,
            alt: module.title,
          },
        ]
      : []),

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
  ].filter(
    (slide, index, array) =>
      array.findIndex(
        (item) => item.url === slide.url
      ) === index
  );

  return (
    <main className="bg-bg">

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative isolate overflow-hidden px-5 py-8 text-paper md:py-12">

        {/* ==========================================================
            IMAGE DU MODULE EN ARRIÈRE-PLAN
        ========================================================== */}

        {module.image_url ? (
          <div className="absolute inset-0 -z-30 overflow-hidden">
            <img
              src={module.image_url}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-110 object-cover blur-[10px]"
            />
          </div>
        ) : (
          <div className="absolute inset-0 -z-30 bg-ink" />
        )}

        {/* ==========================================================
            VOILE SOMBRE
        ========================================================== */}

        <div className="absolute inset-0 -z-20 bg-[#061512]/80" />

        {/* ==========================================================
            AMBIANCE VERTE
        ========================================================== */}

        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_15%,rgba(42,94,86,0.75),transparent_42%),radial-gradient(circle_at_90%_85%,rgba(14,38,34,0.9),transparent_55%)]" />

        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#071814]/55 via-[#0E2622]/70 to-[#071814]/95" />

        {/* ==========================================================
            CONTENU DU HERO
        ========================================================== */}

        <div className="relative mx-auto max-w-[1180px]">

          {/* ========================================================
              FIL D'ARIANE
          ======================================================== */}

          <div className="mb-6 flex flex-wrap items-center gap-2 text-[12px] text-paper/60">

            <Link
              href="/espace-education"
              className="transition hover:text-gold"
            >
              Éducation
            </Link>

            <span>/</span>

            <span className="text-paper/90">
              {module.title}
            </span>

          </div>

          {/* ========================================================
              CARTE PRINCIPALE
          ======================================================== */}

          <div className="relative overflow-hidden rounded-[30px] border border-white/15 bg-[#0E2622]/55 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-[4px]">

            {/* Reflet très subtil */}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.07),transparent_35%,transparent_70%,rgba(255,255,255,0.025))]" />

            <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">

              {/* ====================================================
                  COLONNE TEXTE
              ==================================================== */}

              <div className="flex flex-col justify-center px-7 py-10 md:px-10 md:py-14 lg:px-12 lg:py-16">

                {/* Label */}

                <div className="mb-5">

                  <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">

                    <span className="h-px w-8 bg-gold" />

                    Formation AgroFarms237

                  </span>

                </div>

                {/* Titre */}

                <h1 className="max-w-[600px] font-serif text-[clamp(38px,5vw,62px)] font-semibold leading-[1.04] text-paper">
                  {module.title}
                </h1>

                {/* Description */}

                {module.description && (
                  <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-paper/75 md:text-[16px]">
                    {module.description}
                  </p>
                )}

                {/* ==================================================
                    INFORMATIONS
                ================================================== */}

                <div className="mt-8 flex flex-wrap items-center gap-3">

                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12px] font-semibold text-paper/90 backdrop-blur">
                    {lessons.length}{" "}
                    {lessons.length > 1
                      ? "cours"
                      : "cours"}
                  </span>

                  <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[12px] font-semibold text-gold backdrop-blur">
                    Formation gratuite
                  </span>

                </div>

                {/* ==================================================
                    SIGNATURE
                ================================================== */}

                <div className="mt-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-paper/45">

                  <span className="h-px w-10 bg-paper/25" />

                  Apprendre · Comprendre · Produire

                </div>

              </div>

              {/* ====================================================
                  COLONNE DIAPORAMA
              ==================================================== */}

              <div className="relative p-3 md:p-4 lg:p-5">

                <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/20 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">

                  <EducationHeroSlideshow
                    slides={slides}
                  />

                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SOMMAIRE DES COURS
      ============================================================ */}

      <section className="px-5 py-[72px]">

        <div className="mx-auto max-w-[1000px]">

          {/* Introduction */}

          <div className="mb-10 max-w-[720px]">

            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-goldDeep">
              Parcours pédagogique
            </span>

            <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold leading-tight">
              Les cours du module
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-inkSoft">
              Progressez étape par étape à travers les
              différents cours de cette filière.
            </p>

          </div>

          {/* ========================================================
              AUCUN COURS
          ======================================================== */}

          {lessons.length === 0 ? (

            <div className="rounded-[24px] border border-ink/10 bg-paper px-6 py-12 text-center">

              <p className="font-serif text-2xl font-semibold">
                Aucun cours disponible pour le moment.
              </p>

              <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-inkSoft">
                Les cours de cette filière seront ajoutés
                progressivement.
              </p>

            </div>

          ) : (

            /* ======================================================
               LISTE DES COURS
            ====================================================== */

            <div className="space-y-4">

              {lessons.map((lesson, index) => (

                <Link
                  key={lesson.id}
                  href={`/espace-education/${module.slug}/${lesson.slug}`}
                  className="group block rounded-[22px] border border-ink/10 bg-paper p-5 transition duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_50px_rgba(14,38,34,0.08)] md:p-6"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-center">

                    {/* Numéro */}

                    <div className="flex shrink-0 items-center gap-4 md:w-[70px]">

                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-serif text-lg font-semibold text-paper">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                    </div>

                    {/* Image */}

                    {lesson.image_url ? (

                      <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-[16px] bg-bgAlt md:h-[110px] md:w-[170px]">

                        <img
                          src={lesson.image_url}
                          alt={lesson.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      </div>

                    ) : (

                      <div className="flex h-[110px] w-[170px] shrink-0 items-center justify-center rounded-[16px] bg-bgAlt">

                        <span className="text-[11px] font-semibold uppercase tracking-wider text-inkSoft">
                          AgroFarms237
                        </span>

                      </div>

                    )}

                    {/* Texte */}

                    <div className="min-w-0 flex-1">

                      <div className="mb-2 flex items-center gap-2">

                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-goldDeep">
                          Cours {index + 1}
                        </span>

                      </div>

                      <h3 className="font-serif text-[22px] font-semibold leading-tight transition group-hover:text-goldDeep">
                        {lesson.title}
                      </h3>

                      {lesson.introduction && (
                        <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-inkSoft">
                          {lesson.introduction}
                        </p>
                      )}

                    </div>

                    {/* CTA */}

                    <div className="flex shrink-0 items-center justify-between border-t border-ink/10 pt-4 md:border-t-0 md:pt-0">

                      <span className="text-[12px] font-bold text-ink transition group-hover:text-goldDeep">
                        Lire le cours
                      </span>

                      <span className="ml-4 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-lg transition group-hover:translate-x-1 group-hover:border-gold/30 group-hover:bg-gold/10">
                        →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>
      </section>

      {/* ============================================================
          BLOC CONSEIL
      ============================================================ */}

      <section className="bg-bgAlt px-5 py-[72px]">

        <div className="mx-auto max-w-[1000px]">

          <div className="grid gap-8 rounded-[28px] bg-ink px-7 py-10 text-paper md:grid-cols-[1fr_auto] md:items-center md:px-10">

            <div>

              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                Conseil AgroFarms237
              </span>

              <h2 className="mt-3 max-w-[650px] font-serif text-[clamp(27px,4vw,38px)] font-semibold leading-tight">
                Apprenez la théorie, puis observez la
                pratique.
              </h2>

              <p className="mt-4 max-w-[650px] text-[14px] leading-7 text-paper/65">
                Une bonne compréhension des principes est
                une première étape. L'observation du terrain,
                la régularité du suivi et la capacité à
                mesurer les résultats sont tout aussi
                importantes.
              </p>

            </div>

            <Link
              href="/espace-education"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-[13px] font-semibold transition hover:border-gold hover:text-gold"
            >
              Voir les autres filières →
            </Link>

          </div>

        </div>

      </section>

      {/* ============================================================
          RETOUR À L'ÉDUCATION
      ============================================================ */}

      <section className="px-5 py-10">

        <div className="mx-auto max-w-[1000px]">

          <Link
            href="/espace-education"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-inkSoft transition hover:text-goldDeep"
          >
            ← Retour à l'Espace Éducation
          </Link>

        </div>

      </section>

    </main>
  );
}
