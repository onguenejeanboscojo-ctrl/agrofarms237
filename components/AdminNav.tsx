
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  House,
  Info,
  Package,
  Sprout,
  Images,
  GraduationCap,
  BookOpen,
  BriefcaseBusiness,
  Handshake,
  Mail,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  Leaf,
  ExternalLink,
} from "lucide-react";

const navigation = [
  {
    label: "Accueil",
    href: "/admin/accueil",
    publicHref: "/",
    icon: House,
  },
  {
    label: "À propos",
    href: "/admin/contenu",
    publicHref: "/la-vie-de-la-ferme",
    icon: Info,
  },
  {
    label: "Produits",
    href: "/admin/produits",
    publicHref: "/produits",
    icon: Package,
  },
  {
    label: "Notre ferme",
    href: "/admin/notre-elevage",
    publicHref: "/notre-elevage",
    icon: Sprout,
  },
  {
    label: "Galerie",
    href: "/admin/galerie",
    publicHref: "/galerie",
    icon: Images,
  },
  {
    label: "Éducation",
    href: "/admin/education",
    publicHref: "/espace-education",
    icon: GraduationCap,
  },
  {
    label: "Formation pro",
    href: "/admin/formations",
    publicHref: "/formations",
    icon: BookOpen,
  },
  {
    label: "Professionnels",
    href: "/admin/contenu",
    publicHref: "/professionnels",
    icon: BriefcaseBusiness,
  },
  {
    label: "Partenaires",
    href: "/admin/partenaires",
    publicHref: "/partenaires",
    icon: Handshake,
  },
  {
    label: "Contact",
    href: "/admin/contenu",
    publicHref: "/contact",
    icon: Mail,
  },
  {
    label: "Commander",
    href: "/admin/commandes",
    publicHref: "/commander",
    icon: ShoppingCart,
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return (
      pathname === href ||
      (href !== "/admin/contenu" && pathname.startsWith(`${href}/`))
    );
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#123D2B] text-white">
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D5B56D] text-[#123D2B]">
          <Leaf size={23} strokeWidth={2.2} />
        </div>

        <div className="min-w-0">
          <p className="font-serif text-base font-semibold tracking-wide">
            AgroFarms237
          </p>
          <p className="text-xs text-white/60">Administration</p>
        </div>
      </div>

      <div className="shrink-0 px-3 pt-4">
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
            pathname === "/admin"
              ? "bg-[#D5B56D] font-semibold text-[#123D2B]"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Tableau de bord</span>
          <ChevronRight size={15} className="ml-auto opacity-60" />
        </Link>
      </div>

      <div className="shrink-0 px-4 pb-2 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
          Pages du site
        </p>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-2 pb-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <div
              key={item.label}
              className={`flex min-w-0 items-center rounded-xl transition ${
                active
                  ? "bg-[#D5B56D] font-semibold text-[#123D2B]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3 text-sm"
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${
                    active ? "" : "text-white/65"
                  }`}
                  strokeWidth={active ? 2.3 : 1.8}
                />

                <span className="min-w-0 flex-1 truncate">
                  {item.label}
                </span>

                {active && (
                  <ChevronRight size={15} className="shrink-0 opacity-70" />
                )}
              </Link>

              <a
                href={item.publicHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ouvrir la page publique : ${item.label}`}
                title={`Voir ${item.label} sur le site`}
                className="mr-1.5 shrink-0 rounded-lg p-2 opacity-70 transition hover:bg-black/10 hover:opacity-100"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-4 py-3">
        <p className="text-[11px] text-white/50">
          AgroFarms237 · Administration
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Bouton d'ouverture du menu mobile */}
      <button
        type="button"
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        className="fixed left-3 top-3 z-[80] flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-[#123D2B] shadow-md lg:hidden"
      >
        {mobileOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* Fond de fermeture sur mobile */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
        />
      )}

      {/* Barre latérale */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-[240px] max-w-[85vw] transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {sidebar}
      </aside>
    </>
  );
}
