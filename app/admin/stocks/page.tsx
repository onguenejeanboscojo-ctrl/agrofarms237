"use client";

import { useEffect, useState } from "react";

type Stock = {
  id: string;
  name: string;
  stock_quantity: number;
  stock_threshold: number;
  stock_status: string;
  next_availability: string | null;
};

export default function AdminStocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStocks() {
      try {
        const response = await fetch("/api/stocks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur de chargement");
        }

        setStocks(data.stocks || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les stocks."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStocks();
  }, []);

  function updateStock(
    id: string,
    field: "stock_quantity" | "stock_threshold",
    value: number
  ) {
    setStocks((current) =>
      current.map((stock) =>
        stock.id === id ? { ...stock, [field]: value } : stock
      )
    );
  }

  async function saveStock(stock: Stock) {
    setSavingId(stock.id);
    setError("");
    setSavedId(null);

    try {
      const response = await fetch("/api/stocks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: stock.id,
          stock_quantity: stock.stock_quantity,
          stock_threshold: stock.stock_threshold,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      setSavedId(stock.id);

      setTimeout(() => {
        setSavedId(null);
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le stock."
      );
    } finally {
      setSavingId(null);
    }
  }

  function getStockLabel(stock: Stock) {
    if (stock.stock_quantity <= 0) {
      return "Rupture";
    }

    if (stock.stock_threshold > 0 && stock.stock_quantity <= stock.stock_threshold) {
      return "Stock faible";
    }

    return "Disponible";
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1180px] px-5 py-9">
        <p className="text-inkSoft">Chargement des stocks...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-9">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-semibold">Stocks</h1>
        <p className="mt-1 text-[14.5px] text-inkSoft">
          Gérez les quantités disponibles et les seuils d&apos;alerte de vos
          produits.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {stocks.length === 0 ? (
        <div className="rounded-m border border-ink/10 bg-paper p-7">
          <p className="text-inkSoft">Aucun produit à gérer.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {stocks.map((stock) => {
            const statusLabel = getStockLabel(stock);

            return (
              <div
                key={stock.id}
                className="rounded-m border border-ink/10 bg-paper p-7"
              >
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-semibold">
                      {stock.name}
                    </h2>

                    <p className="mt-1 text-sm text-inkSoft">
                      Stock actuel : {stock.stock_quantity} kg
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-bgAlt px-3 py-1.5 text-xs font-semibold text-ink">
                    {statusLabel}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="field">
                    <label>Quantité disponible (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={stock.stock_quantity}
                      onChange={(e) =>
                        updateStock(
                          stock.id,
                          "stock_quantity",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>Seuil d&apos;alerte (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={stock.stock_threshold}
                      onChange={(e) =>
                        updateStock(
                          stock.id,
                          "stock_threshold",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => saveStock(stock)}
                  disabled={savingId === stock.id}
                  className="btn btn-ink mt-5"
                >
                  {savingId === stock.id
                    ? "Enregistrement..."
                    : savedId === stock.id
                    ? "Enregistré ✓"
                    : "Enregistrer"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
