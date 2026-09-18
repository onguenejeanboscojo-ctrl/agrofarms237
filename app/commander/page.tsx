"use client";

import { useEffect, useMemo, useState } from "react";
import { formatFCFA } from "@/lib/whatsapp";

type OrderOption = {
  label: string;
  values?: string[];
  type?: string;
};

type HomeProduct = {
  id: string;
  name: string;
  description: string | null;
  status: "disponible" | "bientot" | "rupture";
  price: number | null;
  price_unit: string | null;
  price_1_label: string | null;
  price_1: number | null;
  price_2_label: string | null;
  price_2: number | null;
  order_enabled: boolean;
  order_options?: OrderOption[] | null;
  position: number;
  published: boolean;
};

const DEFAULT_OPTIONS: Record<string, OrderOption[]> = {
  silure: [
    {
      label: "État",
      values: ["Frais", "Fumé"],
    },
  ],

  porc: [
    {
      label: "Format",
      values: ["Entier", "Au kg"],
    },
    {
      label: "État",
      values: ["Frais", "Fumé"],
    },
  ],

  "poulet de chair": [
    {
      label: "Préparation",
      values: ["Nettoyé", "Non nettoyé"],
    },
    {
      label: "État",
      values: ["Frais", "Fumé"],
    },
  ],

  "œufs": [
    {
      label: "Conditionnement",
      values: ["1 alvéole", "2 alvéoles", "3 alvéoles"],
    },
  ],
};

function getDefaultOptions(name: string): OrderOption[] {
  const normalized = name.trim().toLowerCase();

  if (normalized.includes("silure")) {
    return DEFAULT_OPTIONS.silure;
  }

  if (normalized.includes("porc")) {
    return DEFAULT_OPTIONS.porc;
  }

  if (
    normalized.includes("poulet") &&
    normalized.includes("chair")
  ) {
    return DEFAULT_OPTIONS["poulet de chair"];
  }

  if (
    normalized.includes("œuf") ||
    normalized.includes("oeuf")
  ) {
    return DEFAULT_OPTIONS["œufs"];
  }

  return [];
}

function getOptionValues(option: OrderOption): string[] {
  if (Array.isArray(option.values)) {
    return option.values.filter(Boolean);
  }

  return [];
}

function getProductPrice(product: HomeProduct | null) {
  if (!product) return null;

  if (typeof product.price === "number") {
    return product.price;
  }

  if (typeof product.price_1 === "number") {
    return product.price_1;
  }

  if (typeof product.price_2 === "number") {
    return product.price_2;
  }

  return null;
}

export default function CommanderPage() {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [productId, setProductId] = useState("");
  const [options, setOptions] = useState<Record<string, string>>({});

  const [quantity, setQuantity] = useState(1);

  const [type, setType] = useState(
    "Particulier / Famille"
  );

  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");

  const [mode, setMode] = useState("Livraison");
  const [lieu, setLieu] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);

        const response = await fetch(
          "/api/home-products",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Impossible de charger les produits."
          );
        }

        const availableProducts = (
          Array.isArray(data) ? data : []
        ).filter(
          (product: HomeProduct) =>
            product.published !== false
        );

        setProducts(availableProducts);

        const firstAvailable =
          availableProducts.find(
            (product: HomeProduct) =>
              product.status === "disponible" &&
              product.order_enabled
          );

        if (firstAvailable) {
          setProductId(firstAvailable.id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger les produits."
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) => product.id === productId
      ) || null,
    [products, productId]
  );

  const selectedOptions = useMemo(
    () =>
      selectedProduct
        ? selectedProduct.order_options &&
          selectedProduct.order_options.length > 0
          ? selectedProduct.order_options
          : getDefaultOptions(
              selectedProduct.name
            )
        : [],
    [selectedProduct]
  );

  const unitPrice = getProductPrice(selectedProduct);

  const total =
    typeof unitPrice === "number"
      ? unitPrice * quantity
      : null;

  function selectProduct(product: HomeProduct) {
    if (
      product.status !== "disponible" ||
      !product.order_enabled
    ) {
      return;
    }

    setProductId(product.id);
    setOptions({});
    setError("");
    setStep(1);
  }

  function selectOption(
    label: string,
    value: string
  ) {
    setOptions((current) => ({
      ...current,
      [label]: value,
    }));
  }

  function validateOptions() {
    if (!selectedProduct) {
      return "Merci de choisir un produit.";
    }

    if (selectedOptions.length === 0) {
      return null;
    }

    for (const option of selectedOptions) {
      const values = getOptionValues(option);

      if (
        values.length > 0 &&
        !options[option.label]
      ) {
        return `Merci de choisir : ${option.label}.`;
      }
    }

    return null;
  }

  function goToStep2() {
    setError("");

    const validation = validateOptions();

    if (validation) {
      setError(validation);
      return;
    }

    setStep(2);
  }

  function goToStep3() {
    setError("");

    if (!nom.trim() || !tel.trim()) {
      setError(
        "Merci de renseigner ton nom et ton numéro de téléphone."
      );
      return;
    }

    if (
      mode === "Livraison" &&
      !lieu.trim()
    ) {
      setError(
        "Merci de renseigner le lieu de livraison."
      );
      return;
    }

    setStep(3);
  }

  async function handleSubmit() {
    setError("");

    if (!selectedProduct) {
      setError("Merci de choisir un produit.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,

          options,

          quantity,
          quantity_kg:
            selectedProduct.name
              .toLowerCase()
              .includes("silure") ||
            selectedProduct.name
              .toLowerCase()
              .includes("porc")
              ? quantity
              : null,

          unit_price: unitPrice,
          total_price: total,

          client_type: type,
          client_name: nom,
          delivery_mode: mode,
          delivery_location: lieu,
          phone: tel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            "Erreur lors de l'enregistrement."
        );
      }

      if (data?.whatsapp_url) {
        window.open(
          data.whatsapp_url,
          "_blank"
        );
      } else {
        throw new Error(
          "Le lien WhatsApp n'a pas été généré."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingProducts) {
    return (
      <section className="px-5 py-[72px]">
        <div className="mx-auto max-w-[1180px]">
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">
            Commande
          </span>

          <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
            Choisir, commander, confirmer sur WhatsApp.
          </h1>

          <div className="mt-10 rounded-2xl border border-ink/10 bg-paper p-8 text-sm text-inkSoft">
            Chargement des produits…
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">
          Commande
        </span>

        <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
          Choisir, commander, confirmer sur WhatsApp.
        </h1>

        <p className="mt-2 max-w-[700px] text-inkSoft">
          Choisis ton produit et ses options. La
          commande sera ensuite récapitulée avant
          confirmation sur WhatsApp.
        </p>

        {/* ÉTAPES */}

        <div className="mt-8 flex flex-wrap gap-2">
          {[
            ["1", "Produit"],
            ["2", "Informations"],
            ["3", "Récapitulatif"],
          ].map(([number, label]) => (
            <div
              key={number}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                step === Number(number)
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 bg-paper text-inkSoft"
              }`}
            >
              <span>{number}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* ÉTAPE 1 */}

        {step === 1 && (
          <div className="mt-10 max-w-[900px] rounded-2xl border border-ink/10 bg-paper p-6 md:p-9">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
                Étape 1
              </span>

              <h2 className="mt-2 font-serif text-2xl font-semibold">
                Choisir un produit
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="mt-7 rounded-xl border border-dashed border-ink/15 p-8 text-center text-sm text-inkSoft">
                Aucun produit n'est actuellement
                disponible.
              </div>
            ) : (
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {products.map((product) => {
                  const available =
                    product.status ===
                      "disponible" &&
                    product.order_enabled;

                  const selected =
                    product.id === productId;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={!available}
                      onClick={() =>
                        selectProduct(product)
                      }
                      className={`rounded-xl border p-5 text-left transition ${
                        selected
                          ? "border-ink bg-ink text-white"
                          : available
                          ? "border-ink/10 bg-bg hover:border-ink/30"
                          : "cursor-not-allowed border-ink/10 bg-bg opacity-55"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className={`text-xs font-bold uppercase tracking-[0.12em] ${
                              selected
                                ? "text-gold"
                                : "text-goldDeep"
                            }`}
                          >
                            Agrofarms237
                          </p>

                          <h3 className="mt-1 font-serif text-xl font-semibold">
                            {product.name}
                          </h3>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            available
                              ? selected
                                ? "bg-white/10 text-white"
                                : "bg-ink/10 text-ink"
                              : "bg-gold/10 text-goldDeep"
                          }`}
                        >
                          {available
                            ? "Disponible"
                            : product.status ===
                              "rupture"
                            ? "Rupture"
                            : "Bientôt disponible"}
                        </span>
                      </div>

                      {product.description && (
                        <p
                          className={`mt-4 text-sm leading-6 ${
                            selected
                              ? "text-white/75"
                              : "text-inkSoft"
                          }`}
                        >
                          {product.description}
                        </p>
                      )}

                      {unitPrice &&
                        selected && (
                          <p className="mt-4 text-sm font-semibold">
                            À partir de{" "}
                            {formatFCFA(
                              unitPrice
                            )}
                            {product.price_unit
                              ? ` / ${product.price_unit}`
                              : ""}
                          </p>
                        )}
                    </button>
                  );
                })}
              </div>
            )}

            {selectedProduct && (
              <>
                {/* OPTIONS */}

                {selectedOptions.length > 0 && (
                  <div className="mt-9 border-t border-ink/10 pt-8">
                    <h3 className="font-serif text-xl font-semibold">
                      Choisir les options
                    </h3>

                    <div className="mt-6 grid gap-6">
                      {selectedOptions.map(
                        (option) => {
                          const values =
                            getOptionValues(
                              option
                            );

                          if (
                            values.length === 0
                          ) {
                            return null;
                          }

                          return (
                            <div
                              key={option.label}
                            >
                              <label className="mb-3 block text-sm font-bold">
                                {option.label}
                              </label>

                              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                                {values.map(
                                  (value) => {
                                    const active =
                                      options[
                                        option
                                          .label
                                      ] ===
                                      value;

                                    return (
                                      <button
                                        type="button"
                                        key={
                                          value
                                        }
                                        onClick={() =>
                                          selectOption(
                                            option.label,
                                            value
                                          )
                                        }
                                        className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                                          active
                                            ? "border-ink bg-ink text-white"
                                            : "border-ink/15 bg-bg hover:border-ink/40"
                                        }`}
                                      >
                                        {value}
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* QUANTITÉ */}

                <div className="mt-9 border-t border-ink/10 pt-8">
                  <div className="max-w-[280px]">
                    <label className="mb-2 block text-sm font-bold">
                      Quantité
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Number(
                              e.target.value
                            )
                          )
                        )
                      }
                      className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 outline-none focus:border-goldDeep"
                    />
                  </div>
                </div>

                {unitPrice !== null && (
                  <div className="mt-8 rounded-xl bg-water p-5 text-paper">
                    <p className="text-sm text-paper/65">
                      Estimation
                    </p>

                    <p className="mt-1 font-serif text-3xl font-semibold">
                      {formatFCFA(total || 0)}
                    </p>

                    <p className="mt-1 text-xs text-paper/60">
                      {quantity} ×{" "}
                      {formatFCFA(unitPrice)}
                      {selectedProduct.price_unit
                        ? ` / ${selectedProduct.price_unit}`
                        : ""}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={goToStep2}
                  className="mt-8 rounded-lg bg-ink px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Continuer
                </button>
              </>
            )}
          </div>
        )}

        {/* ÉTAPE 2 */}

        {step === 2 && (
          <div className="mt-10 max-w-[900px] rounded-2xl border border-ink/10 bg-paper p-6 md:p-9">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
              Étape 2
            </span>

            <h2 className="mt-2 font-serif text-2xl font-semibold">
              Tes informations
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="field">
                <label>Nom</label>

                <input
                  value={nom}
                  onChange={(e) =>
                    setNom(e.target.value)
                  }
                  placeholder="Votre nom"
                />
              </div>

              <div className="field">
                <label>Numéro à appeler</label>

                <input
                  type="tel"
                  value={tel}
                  onChange={(e) =>
                    setTel(e.target.value)
                  }
                  placeholder="6XX XXX XXX"
                />
              </div>

              <div className="field">
                <label>Type de client</label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                >
                  <option>
                    Particulier / Famille
                  </option>
                  <option>Restaurant</option>
                  <option>Poissonnerie</option>
                </select>
              </div>

              <div className="field">
                <label>
                  Mode de récupération
                </label>

                <div className="flex gap-2.5">
                  {[
                    "Livraison",
                    "Retrait à la ferme",
                  ].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() =>
                        setMode(m)
                      }
                      className={`flex-1 rounded-lg border px-3 py-3 text-center text-sm font-bold ${
                        mode === m
                          ? "border-water bg-water text-white"
                          : "border-ink/15 bg-bg"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "Livraison" && (
                <div className="field sm:col-span-2">
                  <label>
                    Lieu de livraison
                  </label>

                  <input
                    value={lieu}
                    onChange={(e) =>
                      setLieu(e.target.value)
                    }
                    placeholder="Quartier, ville"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg border border-ink/15 px-6 py-3 text-sm font-bold"
              >
                Retour
              </button>

              <button
                type="button"
                onClick={goToStep3}
                className="rounded-lg bg-ink px-6 py-3 text-sm font-bold text-white"
              >
                Voir le récapitulatif
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}

        {step === 3 && selectedProduct && (
          <div className="mt-10 max-w-[900px] rounded-2xl border border-ink/10 bg-paper p-6 md:p-9">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
              Étape 3
            </span>

            <h2 className="mt-2 font-serif text-2xl font-semibold">
              Récapitulatif de la commande
            </h2>

            <div className="mt-7 divide-y divide-ink/10 rounded-xl border border-ink/10">
              <div className="flex justify-between gap-5 p-4">
                <span className="text-sm text-inkSoft">
                  Produit
                </span>

                <strong>
                  {selectedProduct.name}
                </strong>
              </div>

              {Object.entries(options).map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-5 p-4"
                  >
                    <span className="text-sm text-inkSoft">
                      {label}
                    </span>

                    <strong>{value}</strong>
                  </div>
                )
              )}

              <div className="flex justify-between gap-5 p-4">
                <span className="text-sm text-inkSoft">
                  Quantité
                </span>

                <strong>{quantity}</strong>
              </div>

              <div className="flex justify-between gap-5 p-4">
                <span className="text-sm text-inkSoft">
                  Client
                </span>

                <strong>{nom}</strong>
              </div>

              <div className="flex justify-between gap-5 p-4">
                <span className="text-sm text-inkSoft">
                  Téléphone
                </span>

                <strong>{tel}</strong>
              </div>

              <div className="flex justify-between gap-5 p-4">
                <span className="text-sm text-inkSoft">
                  Récupération
                </span>

                <strong>{mode}</strong>
              </div>

              {mode === "Livraison" && (
                <div className="flex justify-between gap-5 p-4">
                  <span className="text-sm text-inkSoft">
                    Livraison
                  </span>

                  <strong className="text-right">
                    {lieu}
                  </strong>
                </div>
              )}

              {total !== null && (
                <div className="flex justify-between gap-5 bg-water p-5 text-paper">
                  <span className="font-semibold">
                    Total estimatif
                  </span>

                  <strong className="font-serif text-2xl">
                    {formatFCFA(total)}
                  </strong>
                </div>
              )}
            </div>

            <p className="mt-6 text-sm leading-6 text-inkSoft">
              Aucun paiement en ligne. Après validation,
              tu seras redirigé vers WhatsApp pour
              confirmer directement ta commande avec
              Agrofarms237.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-lg border border-ink/15 px-6 py-3 text-sm font-bold"
              >
                Modifier
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-wa"
              >
                {loading
                  ? "Enregistrement..."
                  : "Confirmer sur WhatsApp"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 max-w-[900px] text-sm font-semibold text-alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
