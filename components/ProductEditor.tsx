"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price_standard: number | null;
  price_bulk: number | null;
  bulk_min_kg: number | null;
  stock_status: "disponible" | "stock_limite" | "indisponible" | string;
  next_availability: string | null;
  updated_at: string | null;
  stock_quantity: number | null;
  stock_threshold: number | null;
  category: string | null;
  product_group: string | null;
  variant: string | null;
  unit: string | null;
  display_order: number | null;
};

const CATEGORY_ORDER = [
  "Pisciculture",
  "Élevage porcin",
  "Aviculture",
];

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-ink/30 focus:ring-2 focus:ring-ink/10";

function formatFCFA(value: number | null) {
  if (typeof value !== "number") return "Prix à définir";
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

function normalizeNumber(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function categoryLabel(category: string | null) {
  return category || "Autre";
}

function unitLabel(unit: string | null) {
  if (unit === "kg") return "kg";
  if (unit === "piece") return "pièce";
  if (unit === "alvéole") return "alvéole";
  return unit || "unité";
}

export default function ProductEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger les produits.");
      }

      const rows = Array.isArray(data?.products) ? data.products : [];

      rows.sort(
        (a: Product, b: Product) =>
          (a.display_order ?? 999) - (b.display_order ?? 999)
      );

      setProducts(rows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les produits."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateProduct(
    id: string,
    field: keyof Product,
    value: string | number | null
  ) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              [field]: value,
            }
          : product
      )
    );
  }

  async function saveProduct(product: Product) {
    try {
      setSavingId(product.id);
      setError("");

      const payload = {
        id: product.id,
        price_standard: product.price_standard,
        price_bulk: product.price_bulk,
        bulk_min_kg: product.bulk_min_kg,
        stock_status: product.stock_status,
        next_availability:
          product.next_availability?.trim() || null,
        stock_quantity: product.stock_quantity,
        stock_threshold: product.stock_threshold,
        category: product.category,
        product_group: product.product_group,
        variant: product.variant,
        unit: product.unit,
        display_order: product.display_order,
      };

      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Impossible d'enregistrer le produit."
        );
      }

      setSavedId(product.id);

      setTimeout(() => {
        setSavedId((current) => (current === product.id ? null : current));
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le produit."
      );
    } finally {
      setSavingId(null);
    }
  }

  function toggleAvailability(product: Product) {
    const nextStatus =
      product.stock_status === "disponible"
        ? "indisponible"
        : "disponible";

    updateProduct(product.id, "stock_status", nextStatus);
  }

  const groupedProducts = useMemo(() => {
    const groups = new Map<string, Product[]>();

    for (const product of products) {
      const key = categoryLabel(product.category);

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)!.push(product);
    }

    return [...groups.entries()].sort(([a], [b]) => {
      const aIndex = CATEGORY_ORDER.indexOf(a);
      const bIndex = CATEGORY_ORDER.indexOf(b);

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  }, [products]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper p-8 text-sm text-inkSoft">
        Chargement du catalogue…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-ink/10 bg-paper px-5 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">
              Catalogue AgroFarms237
            </p>
            <p className="mt-1 text-xs text-inkSoft">
              {products.length} produits · modifiez les prix et la disponibilité
              directement ici.
            </p>
          </div>

          <button
            type="button"
            onClick={loadProducts}
            className="self-start rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink/20"
          >
            Actualiser
          </button>
        </div>
      </div>

      {groupedProducts.map(([category, categoryProducts]) => (
        <section key={category} className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-inkSoft">
              {category}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
              {category}
            </h2>
          </div>

          <div className="grid gap-4">
            {categoryProducts.map((product) => {
              const isAvailable = product.stock_status === "disponible";
              const hasBulkPrice =
                typeof product.price_bulk === "number";

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-ink/10 bg-paper"
                >
                  <div className="border-b border-ink/10 px-5 py-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-xl font-semibold text-ink">
                            {product.name}
                          </h3>

                          {product.variant ? (
                            <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-inkSoft">
                              {product.variant}
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 text-sm text-inkSoft">
                          {product.product_group || category} ·{" "}
                          {unitLabel(product.unit)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleAvailability(product)}
                        className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-semibold transition lg:self-auto ${
                          isAvailable
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            : "border-ink/10 bg-white text-inkSoft hover:border-ink/20"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isAvailable ? "bg-emerald-600" : "bg-ink/30"
                          }`}
                        />
                        {isAvailable ? "Disponible" : "Indisponible"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-inkSoft">
                        Prix standard · {unitLabel(product.unit)}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={product.price_standard ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "price_standard",
                            normalizeNumber(event.target.value)
                          )
                        }
                        placeholder="Ex. 2500"
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-[11px] text-inkSoft">
                        {formatFCFA(product.price_standard)}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-inkSoft">
                        Prix volume · {unitLabel(product.unit)}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={product.price_bulk ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "price_bulk",
                            normalizeNumber(event.target.value)
                          )
                        }
                        placeholder={product.unit === "kg" ? "Ex. 2400" : "Optionnel"}
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-[11px] text-inkSoft">
                        {hasBulkPrice
                          ? `Tarif volume : ${formatFCFA(product.price_bulk)}`
                          : "Aucun tarif volume"}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-inkSoft">
                        Seuil volume
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={product.bulk_min_kg ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "bulk_min_kg",
                            normalizeNumber(event.target.value)
                          )
                        }
                        placeholder={product.unit === "kg" ? "Ex. 30" : "Optionnel"}
                        className={inputClass}
                      />
                      <p className="mt-1.5 text-[11px] text-inkSoft">
                        {product.bulk_min_kg
                          ? `À partir de ${product.bulk_min_kg} ${unitLabel(product.unit)}`
                          : "Pas de seuil défini"}
                      </p>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => saveProduct(product)}
                        disabled={savingId === product.id}
                        className="w-full rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60 lg:w-auto"
                      >
                        {savingId === product.id
                          ? "Enregistrement…"
                          : savedId === product.id
                            ? "Enregistré"
                            : "Enregistrer"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 border-t border-ink/10 bg-ink/[0.025] p-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-inkSoft">
                        Prochaine disponibilité
                      </label>
                      <input
                        type="text"
                        value={product.next_availability ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "next_availability",
                            event.target.value
                          )
                        }
                        placeholder="Ex. À partir du 15 octobre"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-inkSoft">
                        Stock indicatif
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={product.stock_quantity ?? ""}
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "stock_quantity",
                            normalizeNumber(event.target.value)
                          )
                        }
                        placeholder="Quantité disponible"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-paper p-10 text-center">
          <p className="font-serif text-xl font-semibold text-ink">
            Aucun produit dans le catalogue
          </p>
          <p className="mt-2 text-sm text-inkSoft">
            Les produits créés dans Supabase apparaîtront ici.
          </p>
        </div>
      ) : null}
    </div>
  );
}
