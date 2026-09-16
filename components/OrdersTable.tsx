"use client";
import { useEffect, useState } from "react";

const STATUSES = ["nouveau", "contacte", "confirme", "livre", "annule"];
const STATUS_LABEL: Record<string, string> = {
  nouveau: "Nouveau", contacte: "Contacté", confirme: "Confirmé", livre: "Livré", annule: "Annulé",
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (loading) return <p className="text-inkSoft">Chargement...</p>;
  if (orders.length === 0) return <p className="text-inkSoft">Aucune commande pour le moment.</p>;

  return (
    <div className="overflow-x-auto rounded-m border border-ink/10 bg-paper">
      <table className="w-full min-w-[820px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-ink/10 text-inkSoft">
            <th className="p-3.5">Date</th>
            <th className="p-3.5">Client</th>
            <th className="p-3.5">Type</th>
            <th className="p-3.5">Qté</th>
            <th className="p-3.5">Montant</th>
            <th className="p-3.5">Mode</th>
            <th className="p-3.5">Lieu</th>
            <th className="p-3.5">Téléphone</th>
            <th className="p-3.5">Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-ink/10 last:border-none">
              <td className="p-3.5">{new Date(o.created_at).toLocaleString("fr-FR")}</td>
              <td className="p-3.5 font-semibold">{o.client_name}</td>
              <td className="p-3.5">{o.client_type}</td>
              <td className="p-3.5">{o.quantity_kg} kg</td>
              <td className="p-3.5">{o.total_price.toLocaleString("fr-FR")} FCFA</td>
              <td className="p-3.5">{o.delivery_mode}</td>
              <td className="p-3.5">{o.delivery_location || "—"}</td>
              <td className="p-3.5">{o.phone}</td>
              <td className="p-3.5">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="rounded-s border border-ink/15 bg-bg px-2 py-1.5 text-[13.5px]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
