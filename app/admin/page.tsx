import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";

const ADMIN_MODULES = [
  {
    href: "/admin/commandes",
    title: "Commandes",
    description: "Consulter et suivre les commandes reçues.",
  },
  {
    href: "/admin/produits",
    title: "Produits",
    description: "Gérer les prix, disponibilités et options.",
  },
  {
    href: "/admin/stocks",
    title: "Stocks",
    description: "Gérer les quantités disponibles et les seuils.",
  },
  {
    href: "/admin/accueil",
    title: "Accueil",
    description: "Modifier les contenus et éléments de la page d'accueil.",
  },
  {
    href: "/admin/notre-elevage",
    title: "Notre élevage",
    description: "Gérer les informations relatives à l'élevage.",
  },
  {
    href: "/admin/partenaires",
    title: "Partenaires",
    description: "Gérer les partenaires présentés sur le site.",
  },
  {
    href: "/admin/actus",
    title: "Actualités",
    description: "Gérer les actualités et publications.",
  },
  {
    href: "/admin/galerie",
    title: "Galerie",
    description: "Gérer les images de la galerie.",
  },
  {
    href: "/admin/equipe",
    title: "Équipe",
    description: "Gérer les membres de l'équipe.",
  },
];

export default function AdminDashboardPage() {
  if (!isAdminAuthed()) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-5 py-9">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-inkSoft">
            AgroFarms237
          </p>

          <h1 className="font-serif text-3xl font-semibold">
            Tableau de bord
          </h1>

          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-inkSoft">
            Gérez les différents contenus et activités de votre plateforme
            AgroFarms237 depuis cet espace.
          </p>
        </div>

        <section>
          <div className="mb-4">
            <h2 className="font-serif text-xl font-semibold">
              Gestion rapide
            </h2>

            <p className="mt-1 text-sm text-inkSoft">
              Accédez directement aux principaux modules de l'administration.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ADMIN_MODULES.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-m border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-sm"
              >
                <h3 className="font-serif text-lg font-semibold">
                  {module.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-inkSoft">
                  {module.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-ink">
                  Ouvrir →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
