
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
    publicHref: "/formation-pro",
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
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-[#123D2B] text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D5B56D] text-[#123D2B]">
          <Leaf size={25} strokeWidth={2.2} />
        </div>

        <div>
          <p className="font-serif text-lg font-semibold tracking-wide">
            AgroFarms237
          </p>
          <p className="text-xs text-white/60">Administration</p>
        </div>
      </div>

      <div className="px-4 pt-5">
        <Link
          href="/admin"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
            pathname === "/admin"
              ? "bg-[#D5B56D] font-semibold text-[#123D2B]"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <LayoutDashboard size={19} />
          <span>Tableau de bord</span>
          <ChevronRight size={16} className="ml-auto opacity-60" />
        </Link>
      </div>

      <div className="px-5 pb-2 pt-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Pages du site
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <div
              key={item.label}
              className={`flex items-center rounded-xl transition ${
                active
                  ? "bg-[#D5B56D] font-semibold text-[#123D2B]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-sm"
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={active ? "" : "text-white/65"}
                />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight size={16} className="ml-auto opacity-70" />
                )}
              </Link>

              <a
                href={item.publicHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir la page publique : ${item.label}`}
                title={`Voir la page publique : ${item.label}`}
                className="mr-2 rounded-lg p-2 opacity-70 transition hover:bg-black/10 hover:opacity-100"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-xs text-white/50">
          AgroFarms237 · Gestion du site
        </p>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-[70] flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white text-[#123D2B] shadow-md lg:hidden"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[50] bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-[260px] transform transition-transform duration-200 lg:top-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>
    </>
  );
}
