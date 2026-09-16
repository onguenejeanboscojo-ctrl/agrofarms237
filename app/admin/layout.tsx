import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Le layout couvre aussi /admin/login : on ne bloque pas cette page.
  // (Next.js n'exclut pas facilement une sous-route d'un layout parent,
  // donc la page /admin/login gère elle-même son propre affichage sans nav admin.)
  return <div className="min-h-screen bg-bg">{children}</div>;
}
