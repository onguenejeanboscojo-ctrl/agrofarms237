"use client";
import { useEffect, useState } from "react";

const STATUSES = ["nouveau", "contacte", "en_discussion", "dossier_envoye", "conclu", "non_retenu"];
const LABEL: Record<string, string> = {
  nouveau: "Nouveau", contacte: "Contacté", en_discussion: "En discussion",
  dossier_envoye: "Dossier envoyé", conclu: "Partenariat conclu", non_retenu: "Non retenu",
};

export default function PartnersTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners").then((r) => r.json()).then((d) => {
      setRows(d.requests || []);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id: string, status: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/partners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (loading) return <p className="text-inkSoft">Chargement...</p>;
  if (rows.length === 0) return <p className="text-inkSoft">Aucune demande pour le moment.</p>;

  return (
    <div className="overflow-x-auto rounded-m border border-ink/10 bg-paper">
      <table className="w-full min-w-[860px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-ink/10 text-inkSoft">
            <th className="p-3.5">Date</th>
            <th className="p-3.5">Nom</th>
            <th className="p-3.5">Entreprise</th>
            <th className="p-3.5">Type</th>
            <th className="p-3.5">Contact</th>
            <th className="p-3.5">Message</th>
            <th className="p-3.5">Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-ink/10 align-top last:border-none">
              <td className="p-3.5">{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
              <td className="p-3.5 font-semibold">{r.full_name}</td>
              <td className="p-3.5">{r.organization || "—"}</td>
              <td className="p-3.5">{r.partnership_type}</td>
              <td className="p-3.5">{r.phone}<br />{r.email}</td>
              <td className="p-3.5 max-w-[220px] truncate">{r.message || "—"}</td>
              <td className="p-3.5">
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="rounded-s border border-ink/15 bg-bg px-2 py-1.5 text-[13.5px]"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{LABEL[s]}</option>
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
