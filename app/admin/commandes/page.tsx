import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/adminAuth";
import AdminNav from "@/components/AdminNav";
import OrdersTable from "@/components/OrdersTable";

export default function AdminOrdersPage() {
  if (!isAdminAuthed()) redirect("/admin/login");

  return (
    <>
      <AdminNav />

      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <h1 className="mb-1 font-serif text-2xl font-semibold">
          Commandes
        </h1>

        <p className="mb-6 text-[14.5px] text-inkSoft">
          Chaque commande est enregistrée automatiquement. La confirmation
          finale se fait sur WhatsApp.
        </p>

        <OrdersTable />
      </div>
    </>
  );
}
