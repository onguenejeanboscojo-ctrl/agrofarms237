import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import TeamManager from "@/components/TeamManager";

export default function AdminEquipePage() {
  if (!isAdminAuthed()) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">Équipe</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">
          Ajoute les membres de l&apos;équipe avec leur photo, leur poste et un petit message. Un membre n&apos;apparaît
          sur le site que si tu coches « Publié ».
        </p>
        <TeamManager />
      </div>
    </>
  );
}
