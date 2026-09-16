import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import ContentEditor from "@/components/ContentEditor";

export default function AdminContenuPage() {
  if (!isAdminAuthed()) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">Textes du site</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">
          Ces textes apparaissent en direct sur les pages publiques du site.
        </p>
        <ContentEditor />
      </div>
    </>
  );
}
