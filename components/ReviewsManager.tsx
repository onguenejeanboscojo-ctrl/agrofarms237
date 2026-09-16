"use client";
import { useEffect, useState } from "react";

export default function ReviewsManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ author_name: "", client_type: "", content: "" });
  const [sending, setSending] = useState(false);

  async function load() {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.author_name || !form.content) return;
    setSending(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published: false }),
    });
    setForm({ author_name: "", client_type: "", content: "" });
    await load();
    setSending(false);
  }

  async function togglePublished(id: string, published: boolean) {
    setItems((its) => its.map((it) => (it.id === id ? { ...it, published } : it)));
    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet avis ?")) return;
    setItems((its) => its.filter((it) => it.id !== id));
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={add} className="h-fit rounded-m border border-ink/10 bg-paper p-7">
        <div className="field">
          <label>Nom du client</label>
          <input value={form.author_name} onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))} />
        </div>
        <div className="field mt-4">
          <label>Type de client (optionnel)</label>
          <input value={form.client_type} onChange={(e) => setForm((f) => ({ ...f, client_type: e.target.value }))} placeholder="Ex : Restaurant" />
        </div>
        <div className="field mt-4">
          <label>Avis</label>
          <textarea rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
        </div>
        <button type="submit" disabled={sending} className="btn btn-ink mt-5">
          {sending ? "Ajout..." : "Ajouter (non publié)"}
        </button>
      </form>

      <div className="grid gap-3">
        {loading ? (
          <p className="text-inkSoft">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-inkSoft">Aucun avis pour le moment.</p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="rounded-m border border-ink/10 bg-paper p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <b>{it.author_name}</b>{it.client_type && <span className="text-inkSoft"> — {it.client_type}</span>}
                  <p className="mt-1 text-[14.5px] text-inkSoft">{it.content}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-[13px] font-semibold">
                  <input type="checkbox" checked={it.published} onChange={(e) => togglePublished(it.id, e.target.checked)} />
                  Publié sur le site
                </label>
                <button onClick={() => remove(it.id)} className="text-[12.5px] font-semibold text-alert underline">
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
