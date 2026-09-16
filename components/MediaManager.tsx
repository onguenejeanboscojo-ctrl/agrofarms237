"use client";
import { useEffect, useState } from "react";

export default function MediaManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [kind, setKind] = useState("photo");
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/media");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    form.append("category", category);
    form.append("caption", caption);
    const res = await fetch("/api/media", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error || "Échec de l'envoi."); return; }
    setCaption("");
    load();
    e.target.value = "";
  }

  async function toggle(id: string, published: boolean) {
    setItems((its) => its.map((it) => (it.id === id ? { ...it, published } : it)));
    await fetch(`/api/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement ce média ?")) return;
    setItems((its) => its.filter((it) => it.id !== id));
    await fetch(`/api/media/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="max-w-[560px] rounded-m border border-ink/10 bg-paper p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label>Type</label>
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="photo">Photo</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
          <div className="field">
            <label>Catégorie (optionnel)</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex : bassins, récolte" />
          </div>
          <div className="field sm:col-span-2">
            <label>Légende (optionnel)</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
        </div>
        <label className="btn btn-ink mt-5 cursor-pointer">
          {uploading ? "Envoi en cours..." : "Choisir un fichier à envoyer"}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        {error && <p className="mt-3 text-[14px] font-semibold text-alert">{error}</p>}
        <p className="mt-2 text-[13px] text-inkSoft">25 Mo maximum par fichier.</p>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-inkSoft">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-inkSoft">Aucun média envoyé pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((it) => (
              <div key={it.id} className="rounded-m border border-ink/10 bg-paper p-2.5">
                {it.kind === "photo" ? (
                  <img src={it.url} alt={it.caption || ""} className="aspect-square w-full rounded-s object-cover" />
                ) : (
                  <video src={it.url} className="aspect-square w-full rounded-s object-cover" muted />
                )}
                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[12.5px]">
                    <input type="checkbox" checked={it.published} onChange={(e) => toggle(it.id, e.target.checked)} />
                    Publié
                  </label>
                  <button onClick={() => remove(it.id)} className="text-[12.5px] font-semibold text-alert underline">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
