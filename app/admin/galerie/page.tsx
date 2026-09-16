import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import MediaManager from "@/components/MediaManager";

export default function AdminGaleriePage() {
  if (!isAdminAuthed()) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">Galerie</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">
          Ajoute des photos ou vidéos — elles remplacent les emplacements « à venir » sur le site public.
        </p>
        <MediaManager />
      </div>
    </>
  );
}
