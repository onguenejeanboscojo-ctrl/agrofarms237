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
      <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-5">
        {/* LOGO */}
        <Link
          href="/"
          className="font-serif text-xl font-bold text-ink"
        >
          Agrofarms<span className="text-goldDeep">237</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="ml-7 text-[14.5px] font-semibold text-inkSoft transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/commander"
            className="btn btn-gold ml-7"
          >
            Commander
          </Link>
        </nav>

        {/* BOUTON MENU MOBILE */}
        <button
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-s border border-ink/15 bg-paper"
        >
          <span
            className="block h-[2px] w-[18px] bg-ink relative before:content-[''] before:absolute before:left-0 before:right-0 before:top-[-6px] before:h-[2px] before:bg-ink after:content-[''] after:absolute after:left-0 after:right-0 after:top-[6px] after:h-[2px] after:bg-ink"
          />
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-paper px-5 pb-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block border-b border-ink/10 py-4 text-lg font-semibold text-ink"
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
        </div>
      )}
    </header>
  );
}
