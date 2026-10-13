
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  House,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  GraduationCap,
  BookOpen,
  Fish,
  Handshake,
  Newspaper,
  FileText,
  Images,
  Users,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  Sprout,
} from "lucide-react";

const GROUPS = [
  {
    title: "Pilotage",
    links: [
      {
        href: "/admin",
        label: "Tableau de bord",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Activité commerciale",
    links: [
      {
        href: "/admin/commandes",
        label: "Commandes",
        icon: ShoppingCart,
      },
      {
        href: "/admin/produits",
        label: "Produits",
        icon: Package,
      },
      {
        href: "/admin/stocks",
        label: "Stocks",
        icon: Boxes,
      },
      {
        href: "/admin/livraisons",
        label: "Livraisons",
        icon: Truck,
      },
    ],
  },
  {
    title: "Contenus du site",
    links: [
      {
        href: "/admin/accueil",
        label: "Accueil",
        icon: House,
      },
      {
        href: "/admin/notre-elevage",
        label: "Notre élevage",
        icon: Fish,
      },
      {
        href: "/admin/actus",
        label: "Actualités",
        icon: Newspaper,
      },
      {
        href: "/admin/contenu",
        label: "Textes du site",
        icon: FileText,
      },
      {
        href: "/admin/galerie",
        label: "Galerie",
        icon: Images,
      },
      {
        href: "/admin/galerie-textes",
        label: "Textes galerie",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Relations",
    links: [
      {
        href: "/admin/equipe",
        label: "Équipe",
        icon: Users,
      },
      {
        href: "/admin/partenaires",
        label: "Partenaires",
        icon: Handshake,
      },
      {
        href: "/admin/avis",
        label: "Avis",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Formations",
    links: [
      {
        href: "/admin/education",
        label: "Éducation",
        icon: GraduationCap,
      },
      {
        href: "/admin/formations",
        label: "Formations professionnelles",
        icon: BookOpen,
      },
    ],
  },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Barre supérieure */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="flex h-[68px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173F2A] text-[#E8D8AC]">
              <Sprout size={22} strokeWidth={1.6} />
            </span>

            <span>
              <span className="block font-serif text-lg font-semibold text-ink">
                AgroFarms237
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-inkSoft">
                Administration
              </span>
            </span>
          </Link>

          <span className="hidden rounded-full border border-[#C8B783]/50 bg-[#F5F0E5] px-3 py-1.5 text-xs font-medium text-[#655737] sm:inline-flex">
            Espace de gestion
          </span>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 text-ink transition hover:bg-bgAlt lg:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {/* Navigation ordinateur */}
      <aside className="fixed bottom-0 left-0 top-[68px] z-30 hidden w-[250px] overflow-y-auto border-r border-ink/10 bg-paper px-3 py-5 lg:block xl:w-[270px]">
        <p className="mb-5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-inkSoft">
          Menu principal
        </p>

        <nav aria-label="Navigation administration" className="space-y-5">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-inkSoft/80">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const active = isLinkActive(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                        active
                          ? "bg-[#173F2A] text-white shadow-sm"
                          : "text-inkSoft hover:bg-bgAlt hover:text-ink"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.7}
                        className={
                          active
                            ? "shrink-0 text-[#E8D8AC]"
                            : "shrink-0 text-inkSoft group-hover:text-[#24583B]"
                        }
                      />

                      <span className="min-w-0 flex-1">
                        {link.label}
                      </span>

                      {active && (
                        <ChevronRight
                          size={15}
                          className="shrink-0 text-[#E8D8AC]"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mb-2 mt-7 rounded-xl border border-[#C8B783]/40 bg-[#F5F0E5] p-3">
          <p className="text-xs font-semibold text-[#173F2A]">
            AgroFarms237
          </p>
          <p className="mt-1 text-[11px] leading-5 text-[#756C59]">
            Gestion de votre exploitation et de vos contenus.
          </p>
        </div>
      </aside>

      {/* Navigation mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/40"
          />

          <aside className="absolute bottom-0 left-0 top-0 flex w-[min(88%,340px)] flex-col overflow-y-auto bg-paper p-4 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <p className="font-serif text-lg font-semibold text-ink">
                  Navigation
                </p>
                <p className="text-xs text-inkSoft">
                  Administration AgroFarms237
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
                className="rounded-lg p-2 text-ink hover:bg-bgAlt"
              >
                <X size={20} />
              </button>
            </div>

            <nav aria-label="Navigation mobile" className="space-y-5">
              {GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-inkSoft">
                    {group.title}
                  </p>

                  <div className="space-y-1">
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      const active = isLinkActive(pathname, link.href);

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                            active
                              ? "bg-[#173F2A] text-white"
                              : "text-inkSoft hover:bg-bgAlt hover:text-ink"
                          }`}
                        >
                          <Icon
                            size={19}
                            strokeWidth={1.7}
                            className={
                              active
                                ? "shrink-0 text-[#E8D8AC]"
                                : "shrink-0 text-inkSoft"
                            }
                          />

                          <span className="flex-1">{link.label}</span>

                          {active && (
                            <ChevronRight
                              size={16}
                              className="text-[#E8D8AC]"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
