import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import NewsEditor from "@/components/NewsEditor";

export default function AdminActusPage() {
  if (!isAdminAuthed()) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">La vie de la ferme</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">Publie une actualité — elle apparaît immédiatement sur le site public.</p>
        <NewsEditor />
      </div>
    </>
  );
}
