"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Commandes" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/partenaires", label: "Partenaires" },
  { href: "/admin/actus", label: "Actualités" },
  { href: "/admin/contenu", label: "Textes du site" },
  { href: "/admin/galerie", label: "Galerie" },
  { href: "/admin/avis", label: "Avis" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-s px-3.5 py-2 text-[14.5px] font-semibold ${
                pathname === l.href ? "bg-ink text-paper" : "text-inkSoft hover:bg-bgAlt"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button onClick={logout} className="text-[13.5px] font-semibold text-inkSoft underline">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
