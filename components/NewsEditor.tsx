"use client";
import { useEffect, useState } from "react";

export default function NewsEditor() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  async function load() {
    const res = await fetch("/api/news");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !body) return;
    setSending(true);
    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    setTitle(""); setBody("");
    await load();
    setSending(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={publish} className="rounded-m border border-ink/10 bg-paper p-7 h-fit">
        <div className="field">
          <label>Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Nouvelle récolte cette semaine" />
        </div>
        <div className="field mt-4">
          <label>Contenu</label>
          <textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <button type="submit" disabled={sending} className="btn btn-ink mt-5">
          {sending ? "Publication..." : "Publier"}
        </button>
      </form>
      <div>
        {loading ? (
          <p className="text-inkSoft">Chargement...</p>
        ) : posts.length === 0 ? (
          <p className="text-inkSoft">Aucun article publié pour le moment.</p>
        ) : (
          <div className="grid gap-3">
            {posts.map((p) => (
              <div key={p.id} className="rounded-m border border-ink/10 bg-paper p-5">
                <div className="mb-1 text-[12.5px] text-inkSoft">{new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
                <h4 className="font-semibold">{p.title}</h4>
                <p className="mt-1 text-[14px] text-inkSoft">{p.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
