import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import ReviewsManager from "@/components/ReviewsManager";

export default function AdminAvisPage() {
  if (!isAdminAuthed()) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">Avis clients</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">
          Retranscris ici un avis reçu par téléphone ou WhatsApp. Un avis n&apos;apparaît sur le site que si tu coches « Publié ».
        </p>
        <ReviewsManager />
      </div>
    </>
  );
}
