import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import ProductEditor from "@/components/ProductEditor";

export default function AdminProduitsPage() {
  if (!isAdminAuthed()) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">Produits</h1>
        <p className="mb-6 text-[14.5px] text-inkSoft">
          Ces valeurs sont utilisées en direct sur l&apos;accueil et la page Produits du site.
        </p>
        <ProductEditor />
      </div>
    </>
  );
}
