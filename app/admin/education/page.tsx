import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";

const EDUCATION_MODULES = [
  {
    title: "Domaines",
    description:
      "Gérer les différents domaines et catégories proposés dans l’espace Éducation.",
  },
  {
    title: "Modules",
    description:
      "Créer et organiser les modules ou thèmes pédagogiques disponibles.",
  },
  {
    title: "Articles",
    description:
      "Créer, modifier et publier les contenus éducatifs destinés aux visiteurs.",
  },
  {
    title: "Médias",
    description:
      "Gérer les images et autres médias associés aux contenus éducatifs.",
  },
];

export default function AdminEducationPage() {
  if (!isAdminAuthed()) redirect("/admin/login");

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-5 py-9">
        {/* En-tête */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-inkSoft">
            AgroFarms237
          </p>

          <h1 className="font-serif text-3xl font-semibold">
            Éducation
          </h1>

          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-inkSoft">
            Gérez les contenus éducatifs, les domaines, les modules et les
            médias qui seront présentés dans l’espace Éducation du site.
          </p>
        </div>

        {/* Modules */}
        <section>
          <div className="mb-4">
            <h2 className="font-serif text-xl font-semibold">
              Gestion de l&apos;éducation
            </h2>

            <p className="mt-1 text-sm text-inkSoft">
              Chaque élément sera géré indépendamment depuis son propre
              espace.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {EDUCATION_MODULES.map((module) => (
              <div
                key={module.title}
                className="rounded-m border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-sm"
              >
                <h3 className="font-serif text-lg font-semibold">
                  {module.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-inkSoft">
                  {module.description}
                </p>

                <div className="mt-5">
                  <span className="inline-flex rounded-lg bg-bgAlt px-4 py-2 text-sm font-semibold text-inkSoft">
                    Module à configurer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Information */}
        <section className="mt-8 rounded-m border border-ink/10 bg-paper p-6">
          <h2 className="font-serif text-lg font-semibold">
            Organisation prévue
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-inkSoft">
            Les différents éléments de l&apos;espace Éducation seront
            administrables séparément. Les contenus pourront ensuite être
            publiés, masqués et organisés selon leur ordre d&apos;affichage.
          </p>
        </section>
      </main>
    </>
  );
}
