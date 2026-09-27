import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

async function getModules() {
  const { data, error } = await supabaseAdmin()
    .from("education_modules")
    .select("id,title,slug,description,image_url,published,position")
    .eq("published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Education modules error:", error);
    return [];
  }

  return (data || []) as EducationModule[];
}

export default async function EspaceEducationPage() {
  const modules = await getModules();

  return (
    <main className="bg-bg">
      <section className="relative overflow-hidden bg-ink px-5 py-[100px] text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_15%_0%,#1D4B44_0%,#0E2622_60%,#081815_100%)]" />
        <div className="relative mx-auto max-w-[1180px]">
          <span className="mb-4 inline-block text-[13px] font-bold uppercase tracking-[0.14em] text-gold">
            Espace Éducation
          </span>
          <h1 className="max-w-[900px] font-serif text-[clamp(42px,7vw,72px)] font-semibold leading-[1.02]">
            Apprendre.
            <br />
            Comprendre.
            <br />
            Produire.
          </h1>
          <p className="mt-7 max-w-[680px] text-[17px] leading-7 text-paper/75">
            Des cours pratiques pour comprendre les bases de la pisciculture,
            de l’élevage et de la gestion d’une exploitation agricole.
          </p>
        </div>
      </section>

      <section className="px-5 py-[76px]">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12 max-w-[760px]">
            <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-goldDeep">
              Formations gratuites
            </span>
            <h2 className="mt-3 font-serif text-[clamp(32px,5vw,48px)] font-semibold">
              Choisissez votre filière
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-inkSoft">
              Chaque filière ouvre un parcours pédagogique composé de cours
              accessibles étape par étape.
            </p>
          </div>

          {modules.length === 0 ? (
            <div className="rounded-l border border-ink/10 bg-paper p-10 text-center">
              <p className="font-serif text-2xl">Les cours arrivent bientôt.</p>
              <p className="mt-3 text-sm text-inkSoft">
                AgroFarms237 prépare actuellement ses ressources pédagogiques.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {modules.map((module, index) => (
                <Link
                  key={module.id}
                  href={`/espace-education/${module.slug}`}
                  className="group overflow-hidden rounded-l border border-ink/10 bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                    {module.image_url ? (
                      <Image
                        src={module.image_url}
                        alt={module.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
                        <span className="font-serif text-3xl text-paper">
                          {module.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute left-5 top-5 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-paper backdrop-blur">
                      0{index + 1}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink/80 to-transparent" />
                  </div>

                  <div className="p-7 md:p-8">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-goldDeep">
                        AgroFarms237
                      </span>
                      <span className="h-px flex-1 bg-ink/10" />
                      <span className="text-[12px] text-inkSoft">
                        Parcours
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-[30px] font-semibold">
                      {module.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-inkSoft">
                      {module.description}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-ink/10 pt-5">
                      <span className="text-[13px] font-semibold text-ink">
                        Découvrir les cours
                      </span>
                      <span className="text-lg transition-transform group-hover:translate-x-1">
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

      <section className="bg-bgAlt px-5 py-[72px]">
        <div className="mx-auto max-w-[850px] text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-goldDeep">
            AgroFarms237
          </span>
          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            Produire mieux commence par mieux comprendre.
          </h2>
          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-7 text-inkSoft">
            Les contenus sont enrichis progressivement avec de nouveaux cours,
            photos et ressources pédagogiques.
          </p>
        </div>
      </section>
    </main>
  );
}

