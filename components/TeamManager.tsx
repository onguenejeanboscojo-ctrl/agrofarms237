"use client";
import { useEffect, useState } from "react";

export default function TeamManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", role: "", bio: "" });
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    const res = await fetch("/api/team");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.role) { setError("Le nom et le poste sont obligatoires."); return; }
    setSending(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("role", form.role);
    fd.append("bio", form.bio);
    if (file) fd.append("file", file);
    const res = await fetch("/api/team", { method: "POST", body: fd });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.error || "Échec de l'ajout."); return; }
    setForm({ name: "", role: "", bio: "" });
    setFile(null);
    await load();
  }

  async function toggle(id: string, published: boolean) {
    setItems((its) => its.map((it) => (it.id === id ? { ...it, published } : it)));
    await fetch(`/api/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce membre de l'équipe ?")) return;
    setItems((its) => its.filter((it) => it.id !== id));
    await fetch(`/api/team/${id}`, { method: "DELETE" });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={add} className="h-fit rounded-m border border-ink/10 bg-paper p-7">
        <div className="field">
          <label>Nom</label>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="field mt-4">
          <label>Poste</label>
          <input
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="Ex : Fondateur, Responsable des bassins..."
          />
        </div>
        <div className="field mt-4">
          <label>Message / biographie (optionnel)</label>
          <textarea rows={4} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
        </div>
        <div className="field mt-4">
          <label>Photo (optionnel)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        {error && <p className="mt-3 text-[14px] font-semibold text-alert">{error}</p>}
        <button type="submit" disabled={sending} className="btn btn-ink mt-5">
          {sending ? "Ajout en cours..." : "Ajouter ce membre"}
        </button>
      </form>

      <div>
        {loading ? (
          <p className="text-inkSoft">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-inkSoft">Aucun membre ajouté pour le moment.</p>
        ) : (
          <div className="flex flex-col gap-3.5">
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 rounded-m border border-ink/10 bg-paper p-4">
                {it.photo_url ? (
                  <img src={it.photo_url} alt={it.name} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-bgAlt" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{it.name}</p>
                  <p className="text-[13.5px] text-inkSoft">{it.role}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-[12.5px]">
                      <input type="checkbox" checked={it.published} onChange={(e) => toggle(it.id, e.target.checked)} />
                      Publié
                    </label>
                    <button onClick={() => remove(it.id)} className="text-[12.5px] font-semibold text-alert underline">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
