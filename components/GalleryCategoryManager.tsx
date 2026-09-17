"use client";
import { useEffect, useState } from "react";
import { GALLERY_CATEGORIES } from "@/lib/mediaCategories";

export default function GalleryCategoryManager() {
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingCat, setSavingCat] = useState<string | null>(null);
  const [savedCat, setSavedCat] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/gallery-categories");
      const data = await res.json();
      const map: Record<string, string> = {};
      (data.items || []).forEach((it: any) => {
        map[it.category] = it.description || "";
      });
      setDescriptions(map);
      setLoading(false);
    })();
  }, []);

  function setText(category: string, value: string) {
    setDescriptions((d) => ({ ...d, [category]: value }));
    setSavedCat(null);
  }

  async function save(category: string) {
    setError("");
    setSavingCat(category);
    const res = await fetch(`/api/gallery-categories/${category}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: descriptions[category] || "" }),
    });
    setSavingCat(null);
    if (!res.ok) {
      setError("Échec de l'enregistrement.");
      return;
    }
    setSavedCat(category);
  }

  if (loading) return <p className="text-inkSoft">Chargement...</p>;

  return (
    <div className="flex flex-col gap-6">
      {GALLERY_CATEGORIES.map((cat) => (
        <div key={cat.value} className="rounded-m border border-ink/10 bg-paper p-6">
          <label className="mb-2 block font-serif text-[17px] font-semibold">{cat.label}</label>
          <textarea
            rows={3}
            value={descriptions[cat.value] || ""}
            onChange={(e) => setText(cat.value, e.target.value)}
            placeholder="Texte affiché à côté des photos de cette catégorie sur la page Galerie..."
          />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => save(cat.value)} disabled={savingCat === cat.value} className="btn btn-ink">
              {savingCat === cat.value ? "Enregistrement..." : "Enregistrer"}
            </button>
            {savedCat === cat.value && <span className="text-[13px] font-semibold text-goldDeep">Enregistré ✓</span>}
          </div>
        </div>
      ))}
      {error && <p className="text-[14px] font-semibold text-alert">{error}</p>}
    </div>
  );
}
