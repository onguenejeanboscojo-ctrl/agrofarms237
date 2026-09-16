"use client";
import { useEffect, useState } from "react";

const LABELS: Record<string, { label: string; help: string }> = {
  hero_lead: { label: "Accueil — texte sous le slogan", help: "Le court paragraphe affiché juste en dessous de « La qualité commence à la ferme. »" },
  histoire_texte: { label: "Notre histoire", help: "Un saut de ligne vide sépare les paragraphes." },
  professionnels_intro: { label: "Page Professionnels — texte d'intro", help: "Affiché sous le titre de la page." },
  partenaires_intro: { label: "Page Partenaires — texte d'intro", help: "Affiché sous le titre de la page." },
};

export default function ContentEditor() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((d) => {
      setItems(d.items || []);
      setLoading(false);
    });
  }, []);

  function update(key: string, value: string) {
    setItems((its) => its.map((it) => (it.key === key ? { ...it, value } : it)));
  }

  async function save(key: string, value: string) {
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSavedKey(key);
    setTimeout(() => setSavedKey(null), 1800);
  }

  if (loading) return <p className="text-inkSoft">Chargement...</p>;

  return (
    <div className="grid gap-6 max-w-[720px]">
      {items.map((it) => (
        <div key={it.key} className="rounded-m border border-ink/10 bg-paper p-7">
          <h3 className="font-semibold">{LABELS[it.key]?.label || it.key}</h3>
          {LABELS[it.key]?.help && <p className="mb-3 text-[13px] text-inkSoft">{LABELS[it.key].help}</p>}
          <textarea
            rows={it.key === "histoire_texte" ? 8 : 3}
            value={it.value}
            onChange={(e) => update(it.key, e.target.value)}
            className="w-full rounded-s border border-ink/15 bg-bg p-3 text-[15px]"
          />
          <button onClick={() => save(it.key, it.value)} className="btn btn-ink mt-4">
            {savedKey === it.key ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </div>
      ))}
    </div>
  );
}
