"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/histoire", label: "À propos" },
  { href: "/produits", label: "Produits" },
  { href: "/notre-elevage", label: "Notre élevage" },
  { href: "/galerie", label: "Galerie" },
  { href: "/espace-education", label: "Éducation" },
  { href: "/professionnels", label: "Professionnels" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-ink/10 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] max-w-[1280px] items-center justify-between px-5">
        
        {/* LOGO */}
        <Link
          href="/"
          className="shrink-0 font-serif text-xl font-bold text-ink"
        >
          Agrofarms<span className="text-goldDeep">237</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden items-center md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ml-5 whitespace-nowrap text-[14px] font-semibold text-inkSoft transition hover:text-ink lg:ml-6"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/commander"
            className="btn btn-gold ml-6 shrink-0 whitespace-nowrap"
          >
            Commander
          </Link>
        </nav>

        {/* BOUTON MENU MOBILE */}
        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-s border border-ink/15 bg-paper md:hidden"
        >
          <span
            className={`absolute h-[2px] w-[18px] bg-ink transition-transform duration-200 ${
              open ? "rotate-45" : "-translate-y-[6px]"
            }`}
          />

          <span
            className={`absolute h-[2px] w-[18px] bg-ink transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />

          <span
            className={`absolute h-[2px] w-[18px] bg-ink transition-transform duration-200 ${
              open ? "-rotate-45" : "translate-y-[6px]"
            }`}
          />
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="border-t border-ink/10 bg-paper px-5 pb-6 md:hidden">
          <nav className="flex flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="whitespace-nowrap border-b border-ink/10 py-4 text-lg font-semibold text-ink"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/commander"
              onClick={() => setOpen(false)}
              className="btn btn-gold mt-5 w-full justify-center"
            >
              Commander
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
