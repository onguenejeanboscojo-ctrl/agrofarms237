"use client";
import { useEffect, useState } from "react";

export default function ProductEditor() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => {
      setProducts(d.products || []);
      setLoading(false);
    });
  }, []);

  function update(id: string, field: string, value: any) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function save(p: any) {
    await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    setSavedId(p.id);
    setTimeout(() => setSavedId(null), 1800);
  }

  if (loading) return <p className="text-inkSoft">Chargement...</p>;

  return (
    <div className="grid gap-6">
      {products.map((p) => (
        <div key={p.id} className="max-w-[560px] rounded-m border border-ink/10 bg-paper p-7">
          <h3 className="mb-4 font-serif text-lg font-semibold">{p.name}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label>Prix standard (FCFA/kg)</label>
              <input type="number" value={p.price_standard} onChange={(e) => update(p.id, "price_standard", Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Prix volume (FCFA/kg)</label>
              <input type="number" value={p.price_bulk} onChange={(e) => update(p.id, "price_bulk", Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Seuil volume (kg)</label>
              <input type="number" value={p.bulk_min_kg} onChange={(e) => update(p.id, "bulk_min_kg", Number(e.target.value))} />
            </div>
            <div className="field">
              <label>Statut de stock</label>
              <select value={p.stock_status} onChange={(e) => update(p.id, "stock_status", e.target.value)}>
                <option value="disponible">Disponible</option>
                <option value="stock_limite">Stock limité</option>
                <option value="indisponible">Temporairement indisponible</option>
              </select>
            </div>
            <div className="field sm:col-span-2">
              <label>Prochaine disponibilité (texte libre)</label>
              <input value={p.next_availability || ""} onChange={(e) => update(p.id, "next_availability", e.target.value)} placeholder="Ex : à partir du 20 octobre" />
            </div>
          </div>
          <button onClick={() => save(p)} className="btn btn-ink mt-5">
            {savedId === p.id ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </div>
      ))}
    </div>
  );
}
