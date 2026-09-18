"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  {
    href: "/admin",
    label: "Tableau de bord",
  },
  {
    href: "/admin/accueil",
    label: "Accueil",
  },
  {
    href: "/admin/commandes",
    label: "Commandes",
  },
  {
    href: "/admin/produits",
    label: "Produits",
  },
  {
    href: "/admin/notre-elevage",
    label: "Notre élevage",
  },
  {
    href: "/admin/partenaires",
    label: "Partenaires",
  },
  {
    href: "/admin/actus",
    label: "Actualités",
  },
  {
    href: "/admin/contenu",
    label: "Textes du site",
  },
  {
    href: "/admin/galerie",
    label: "Galerie",
  },
  {
    href: "/admin/galerie-textes",
    label: "Textes galerie",
  },
  {
    href: "/admin/equipe",
    label: "Équipe",
  },
  {
    href: "/admin/avis",
    label: "Avis",
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-ink/10 bg-paper">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4">
        <div className="flex min-w-max items-center gap-1 py-3">
          {ADMIN_LINKS.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-ink text-white"
                    : "text-inkSoft hover:bg-bgAlt hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
