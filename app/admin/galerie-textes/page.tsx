import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import GalleryCategoryManager from "@/components/GalleryCategoryManager";

export default function AdminGalerieTextesPage() {
  if (!isAdminAuthed()) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">Textes de la Galerie</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">
          Écris un petit texte de présentation pour chaque catégorie. Il s&apos;affiche à côté des photos de cette
          catégorie sur la page Galerie publique.
        </p>
        <GalleryCategoryManager />
      </div>
    </>
  );
}
