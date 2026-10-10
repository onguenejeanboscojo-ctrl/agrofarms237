"use client";

import { useEffect, useMemo, useState } from "react";
import { formatFCFA } from "@/lib/whatsapp";
import { DELIVERY_ZONES, getDeliveryFee, isOtherNeighborhood } from "@/lib/delivery";

type OrderOptionValue = {
  id?: string;
  label: string;
  available?: boolean;
  price_unit?: string;
  price_1_label?: string;
  price_1?: number | null;
  price_2_label?: string;
  price_2?: number | null;
  children?: OrderOption[];
};

type OrderOption = {
  id?: string;
  label: string;
  values?: Array<OrderOptionValue | string>;
  type?: "single" | "select" | "number" | string;
  required?: boolean;
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
      values: [
        { label: "Frais", available: true },
        { label: "Fumé", available: false },
      ],
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

  // Un porcelet est vendu exclusivement à la pièce :
  // ne pas lui afficher les options du porc (entier, au kg, frais, fumé).
  if (normalized.includes("porcelet")) {
    return [];
  }

  if (normalized.includes("silure")) {
    return DEFAULT_OPTIONS.silure;
  }

  // Ces options restent réservées aux produits porcins autres que le porcelet.
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

function normalizeOptionValue(value: OrderOptionValue | string): OrderOptionValue {
  if (typeof value === "string") {
    return { label: value, available: true };
  }
  return {
    ...value,
    label: typeof value?.label === "string" ? value.label : "",
    available: value?.available !== false,
    children: Array.isArray(value?.children) ? value.children : [],
  };
}

function getOptionValues(option: OrderOption): OrderOptionValue[] {
  if (!Array.isArray(option.values)) return [];
  return option.values
    .map(normalizeOptionValue)
    .filter((value) => value.label.trim().length > 0);
}

function getVisibleOptions(
  roots: OrderOption[],
  selected: Record<string, string>
): OrderOption[] {
  const visible: OrderOption[] = [];
  for (const option of roots) {
    visible.push(option);
    const chosen = getOptionValues(option).find(
      (value) => value.label === selected[option.id || option.label]
    );
    if (chosen?.children?.length) {
      visible.push(...getVisibleOptions(chosen.children, selected));
    }
  }
  return visible;
}

function getSelectedPricedValue(
  roots: OrderOption[],
  selected: Record<string, string>
): OrderOptionValue | null {
  for (const option of roots) {
    const chosen = getOptionValues(option).find(
      (value) => value.label === selected[option.id || option.label]
    );
    if (chosen) {
      const nested = chosen.children?.length
        ? getSelectedPricedValue(chosen.children, selected)
        : null;
      if (nested && (typeof nested.price_1 === "number" || typeof nested.price_2 === "number")) return nested;
      if (typeof chosen.price_1 === "number" || typeof chosen.price_2 === "number") return chosen;
    }
  }
  return null;
}

function getTierThreshold(label?: string | null): number | null {
  if (!label) return null;
  const match = label.match(/(?:à\s*partir\s*de|dès)\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function getProductPrice(
  product: HomeProduct | null,
  quantity: number
) {
  if (!product) return null;

  // Applique le tarif de volume lorsqu'un seuil est défini
  // dans le libellé du deuxième prix (ex. : « À partir de 30 kg »).
  const threshold = getTierThreshold(product.price_2_label);

  if (
    threshold !== null &&
    quantity >= threshold &&
    typeof product.price_2 === "number"
  ) {
    return product.price_2;
  }

  if (typeof product.price_1 === "number") {
    return product.price_1;
  }

  if (typeof product.price === "number") {
    return product.price;
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
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);

        const response = await fetch(
          "/api/catalog-products",
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

        const catalogProducts = Array.isArray(data?.products)
          ? data.products
          : [];

        const availableProducts: HomeProduct[] =
          catalogProducts.map((product: any) => {
            const priceStandard =
              typeof product.price_standard === "number"
                ? product.price_standard
                : Number(product.price_standard);

            const priceBulk =
              product.price_bulk === null ||
              product.price_bulk === undefined ||
              product.price_bulk === ""
                ? null
                : Number(product.price_bulk);

            const bulkMinKg =
              product.bulk_min_kg === null ||
              product.bulk_min_kg === undefined ||
              product.bulk_min_kg === ""
                ? null
                : Number(product.bulk_min_kg);

            const stockStatus =
              String(product.stock_status) as HomeProduct["status"];

            return {
              id: String(product.id),
              name: String(product.name || ""),
              description:
                typeof product.description === "string"
                  ? product.description
                  : null,

              status: stockStatus,

              price:
                Number.isFinite(priceStandard)
                  ? priceStandard
                  : null,

              price_unit:
                typeof product.unit === "string"
                  ? product.unit
                  : null,

              price_1_label: null,

              price_1:
                Number.isFinite(priceStandard)
                  ? priceStandard
                  : null,

              price_2_label:
                priceBulk !== null &&
                Number.isFinite(priceBulk) &&
                bulkMinKg !== null &&
                Number.isFinite(bulkMinKg)
                  ? `À partir de ${bulkMinKg} kg`
                  : null,

              price_2:
                priceBulk !== null &&
                Number.isFinite(priceBulk)
                  ? priceBulk
                  : null,

              order_enabled:
                stockStatus === "disponible" &&
                Number.isFinite(priceStandard),

              order_options: [],

              position: 0,

              published: true,
            };
          });

        setProducts(availableProducts);

        const firstAvailable =
          availableProducts.find(
            (product) =>
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

  const visibleOptions = useMemo(
    () => getVisibleOptions(selectedOptions, options),
    [selectedOptions, options]
  );

  const selectedPricedValue = getSelectedPricedValue(selectedOptions, options);
  const tierThreshold = getTierThreshold(selectedPricedValue?.price_2_label);
  const optionPrice = selectedPricedValue
    ? (tierThreshold !== null && quantity >= tierThreshold && typeof selectedPricedValue.price_2 === "number"
        ? selectedPricedValue.price_2
        : typeof selectedPricedValue.price_1 === "number"
        ? selectedPricedValue.price_1
        : typeof selectedPricedValue.price_2 === "number"
        ? selectedPricedValue.price_2
        : null)
    : null;
  const unitPrice = optionPrice ?? getProductPrice(selectedProduct, quantity);

  const productTotal =
    typeof unitPrice === "number"
      ? unitPrice * quantity
      : null;

  const deliveryFee =
    mode === "Livraison"
      ? getDeliveryFee(deliveryNeighborhood)
      : 0;

  const estimatedTotal =
    productTotal !== null && deliveryFee !== null
      ? productTotal + deliveryFee
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
    option: OrderOption,
    value: string
  ) {
    const key = option.id || option.label;
    setOptions((current) => {
      const next = { ...current, [key]: value };
      // Clear dependent choices when their parent selection changes.
      const clearChildren = (items: OrderOption[]) => {
        for (const item of items) {
          delete next[item.id || item.label];
          for (const itemValue of getOptionValues(item)) {
            if (itemValue.children?.length) clearChildren(itemValue.children);
          }
        }
      };
      const chosenValue = getOptionValues(option).find((item) => item.label === value);
      for (const itemValue of getOptionValues(option)) {
        if (itemValue.children?.length && itemValue.label !== value) clearChildren(itemValue.children);
      }
      if (chosenValue?.children?.length) {
        // Keep the selected branch; unrelated nested selections are cleared above.
      }
      return next;
    });
  }

  function validateOptions() {
    if (!selectedProduct) {
      return "Merci de choisir un produit.";
    }

    if (selectedOptions.length === 0) {
      return null;
    }

    for (const option of visibleOptions) {
      const values = getOptionValues(option);
      if (option.type === "number") {
        if (option.required !== false && !options[option.id || option.label]) {
          return `Merci de renseigner : ${option.label}.`;
        }
        continue;
      }
      if (values.length > 0 && option.required !== false && !options[option.id || option.label]) {
        return `Merci de choisir : ${option.label}.`;
      }
      const selectedValue = values.find((value) => value.label === options[option.id || option.label]);
      if (selectedValue && !selectedValue.available) {
        return `${selectedValue.label} : pas encore disponible.`;
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

    if (!Number.isFinite(quantity) || quantity < 1) {
      setError("Merci de renseigner une quantité valide.");
      return;
    }

    if (mode === "Livraison" && !deliveryNeighborhood) {
      setError("Merci de préciser votre quartier.");
      return;
    }

    if (
      mode === "Livraison" &&
      isOtherNeighborhood(deliveryNeighborhood) &&
      !lieu.trim()
    ) {
      setError("Merci de saisir votre quartier.");
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
            !selectedProduct.name.toLowerCase().includes("porcelet") &&
            (
              selectedProduct.name.toLowerCase().includes("silure") ||
              selectedProduct.name.toLowerCase().includes("porc")
            )
              ? quantity
              : null,

          unit_price: unitPrice,
          total_price: estimatedTotal ?? productTotal,

          client_type: type,
          client_name: nom,
          delivery_mode: mode,
          delivery_location:
            mode === "Livraison"
              ? isOtherNeighborhood(deliveryNeighborhood)
                ? lieu.trim()
                : deliveryNeighborhood
              : null,
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
        window.location.href = data.whatsapp_url;
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
      <section className="min-h-screen bg-[#f6f3e9] px-5 py-10 md:py-16">
        <div className="mx-auto max-w-[1280px]">
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">
            Commande
          </span>

          <h1 className="font-serif text-[clamp(28px,4.5vw,42px)] font-semibold">
            Choisir, commander, confirmer sur WhatsApp.
          </h1>

          <div className="mt-10 rounded-3xl border border-[#e4dfd1] bg-white p-8 text-sm text-inkSoft shadow-sm">
            Chargement des produits…
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f3e9] px-4 py-6 text-[#183c2c] sm:px-6 md:py-12">
      <div className="mx-auto max-w-[1280px]">
        {/* HERO */}
        <div className="relative isolate overflow-hidden rounded-[28px] bg-[#153d2d] px-6 py-9 text-white shadow-[0_24px_70px_rgba(18,54,39,0.18)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96" />
          <div className="pointer-events-none absolute -right-4 -top-12 h-56 w-56 rounded-full border border-[#d7bd79]/20 sm:h-72 sm:w-72" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d7bd79]/40 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e5cf91]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd79]" />
              AgroFarms237 · Commandes
            </span>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(34px,5vw,58px)] font-semibold leading-[1.05] tracking-[-0.035em]">
              Du meilleur de la ferme <span className="text-[#dfc681]">à votre table.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Choisissez vos produits, précisez votre commande et confirmez directement avec notre équipe sur WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-white/85 sm:text-sm">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5">Produits de la ferme</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5">Livraison ou retrait</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5">Confirmation sur WhatsApp</span>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 sm:mt-12">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8a7139]">
            Votre commande en quelques étapes
          </span>
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple, clair et sans paiement en ligne
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[#637166]">
            Sélectionnez vos produits. Vous pourrez vérifier les détails et le montant estimatif avant de confirmer sur WhatsApp.
          </p>
        </div>

        {/* ÉTAPES */}

        <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            ["1", "Produit"],
            ["2", "Informations"],
            ["3", "Récapitulatif"],
          ].map(([number, label]) => (
            <div
              key={number}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-xs font-bold transition sm:justify-start sm:px-5 sm:py-4 sm:text-sm ${
                step === Number(number)
                  ? "border-[#153d2d] bg-[#153d2d] text-white shadow-lg shadow-[#153d2d]/10"
                  : "border-[#e2ddcf] bg-white/80 text-[#718074]"
              }`}
            >
              <span>{number}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* ÉTAPE 1 */}

        {step === 1 && (
          <div className="mt-6 rounded-[26px] border border-[#e5dfd1] bg-white p-5 shadow-[0_12px_40px_rgba(36,53,39,0.05)] sm:mt-8 sm:p-8 lg:p-10">
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
              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                      className={`group relative min-h-[190px] overflow-hidden rounded-2xl border p-5 text-left transition duration-200 ${
                        selected
                          ? "border-[#153d2d] bg-[#153d2d] text-white shadow-xl shadow-[#153d2d]/15 ring-2 ring-[#d7bd79]/70"
                          : available
                          ? "border-[#e7e2d7] bg-[#fcfbf7] text-[#183c2c] hover:-translate-y-0.5 hover:border-[#b7a36d] hover:shadow-lg hover:shadow-[#263d2e]/5"
                          : "cursor-not-allowed border-[#e7e2d7] bg-[#f1efe8] opacity-65"
                      }` }
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
                                : "bg-[#e7efe7] text-[#315b42]"
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
                  <div className="mt-9 border-t border-[#e9e4d9] pt-8">
                    <h3 className="font-serif text-xl font-semibold">Choisir les options</h3>
                    <div className="mt-6 grid gap-6 rounded-2xl bg-[#f8f6ef] p-4 sm:p-6">
                      {visibleOptions.map((option) => {
                        const optionKey = option.id || option.label;
                        const values = getOptionValues(option);
                        if (option.type === "number") {
                          return (
                            <div key={optionKey}>
                              <label className="mb-3 block text-sm font-bold">{option.label}</label>
                              <input
                                type="number"
                                min={1}
                                value={options[optionKey] || ""}
                                onChange={(e) => setOptions((current) => ({ ...current, [optionKey]: e.target.value }))}
                                className="w-full max-w-[280px] rounded-lg border border-ink/15 bg-bg px-4 py-3"
                              />
                            </div>
                          );
                        }
                        if (values.length === 0) return null;
                        return (
                          <div key={optionKey}>
                            <label className="mb-3 block text-sm font-bold">{option.label}</label>
                            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                              {values.map((value) => {
                                const active = options[optionKey] === value.label;
                                const unavailable = !value.available;
                                return (
                                  <button
                                    type="button"
                                    key={value.id || value.label}
                                    disabled={unavailable}
                                    onClick={() => selectOption(option, value.label)}
                                    className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                                      active ? "border-[#153d2d] bg-[#153d2d] text-white shadow-md" : "border-[#e0dbcf] bg-white text-[#183c2c] hover:border-[#b7a36d]"
                                    } ${unavailable ? "cursor-not-allowed opacity-50" : ""}`}
                                  >
                                    <span className="block">{value.label}</span>
                                    {unavailable && <span className="mt-1 block text-xs font-medium">Pas encore disponible</span>}
                                    {(typeof value.price_1 === "number" || typeof value.price_2 === "number") && (
                                      <span className="mt-1 block text-xs font-medium">
                                        {value.price_1_label ? `${value.price_1_label} : ` : ""}
                                        {typeof value.price_1 === "number" ? formatFCFA(value.price_1) : ""}
                                        {typeof value.price_2 === "number" ? ` · ${value.price_2_label ? `${value.price_2_label} : ` : ""}${formatFCFA(value.price_2)}` : ""}
                                        {value.price_unit ? ` / ${value.price_unit}` : ""}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
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
                      value={quantity === 0 ? "" : quantity}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          setQuantity(0);
                          return;
                        }
                        const next = Number(raw);
                        if (Number.isFinite(next)) setQuantity(next);
                      }}
                      onBlur={() => {
                        if (!quantity || quantity < 1) setQuantity(1);
                      }}
                      className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 outline-none focus:border-goldDeep"
                    />
                  </div>
                </div>

                {unitPrice !== null && (
                  <div className="mt-8 rounded-2xl bg-[#153d2d] p-6 text-white shadow-lg shadow-[#153d2d]/10 sm:p-7">
                    <p className="text-sm text-paper/65">
                      Estimation
                    </p>

                    <p className="mt-1 font-serif text-3xl font-semibold">
                      {formatFCFA(productTotal || 0)}
                    </p>

                    <p className="mt-1 text-xs text-paper/60">
                      {quantity} ×{" "}
                      {formatFCFA(unitPrice)}
                      {(selectedPricedValue?.price_unit || selectedProduct.price_unit)
                        ? ` / ${selectedPricedValue?.price_unit || selectedProduct.price_unit}`
                        : ""}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={goToStep2}
                  className="mt-8 rounded-xl bg-[#d7bd79] px-7 py-3.5 text-sm font-extrabold text-[#183c2c] transition hover:bg-[#e5cf91] focus:outline-none focus:ring-2 focus:ring-[#153d2d] focus:ring-offset-2"
                >
                  Continuer
                </button>
              </>
            )}
          </div>
        )}

        {/* ÉTAPE 2 */}

        {step === 2 && (
          <div className="mt-6 rounded-[26px] border border-[#e5dfd1] bg-white p-5 shadow-[0_12px_40px_rgba(36,53,39,0.05)] sm:mt-8 sm:p-8 lg:p-10">
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
                      onClick={() => {
                        setMode(m);
                        if (m === "Retrait à la ferme") {
                          setDeliveryNeighborhood("");
                          setLieu("");
                        }
                      }}
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
                    Précisez votre quartier
                  </label>

                  <select
                    value={deliveryNeighborhood}
                    onChange={(e) => {
                      setDeliveryNeighborhood(e.target.value);
                      if (!isOtherNeighborhood(e.target.value)) setLieu("");
                    }}
                  >
                    <option value="">Sélectionnez votre quartier</option>
                    {DELIVERY_ZONES.flatMap((zone) =>
                      zone.neighborhoods.map((neighborhood) => (
                        <option key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </option>
                      ))
                    )}
                    <option value="__OTHER__">Autre quartier</option>
                  </select>

                  {deliveryNeighborhood && !isOtherNeighborhood(deliveryNeighborhood) && (
                    <p className="mt-2 text-sm font-semibold text-inkSoft">
                      Frais de livraison : {formatFCFA(getDeliveryFee(deliveryNeighborhood) || 0)}
                    </p>
                  )}

                  {isOtherNeighborhood(deliveryNeighborhood) && (
                    <div className="mt-3">
                      <input
                        value={lieu}
                        onChange={(e) => setLieu(e.target.value)}
                        placeholder="Saisissez votre quartier"
                      />
                      <p className="mt-2 text-sm leading-5 text-inkSoft">
                        Les frais de livraison pour ce quartier seront évalués par notre équipe et confirmés directement sur WhatsApp.
                      </p>
                    </div>
                  )}
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
                className="rounded-xl bg-[#153d2d] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#24563e]"
              >
                Voir le récapitulatif
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 */}

        {step === 3 && selectedProduct && (
          <div className="mt-6 rounded-[26px] border border-[#e5dfd1] bg-white p-5 shadow-[0_12px_40px_rgba(36,53,39,0.05)] sm:mt-8 sm:p-8 lg:p-10">
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

              {Object.entries(options).map(([key, value]) => {
                const findLabel = (items: OrderOption[]): string | null => {
                  for (const item of items) {
                    if ((item.id || item.label) === key) return item.label;
                    for (const itemValue of getOptionValues(item)) {
                      const nested = itemValue.children?.length ? findLabel(itemValue.children) : null;
                      if (nested) return nested;
                    }
                  }
                  return null;
                };
                const optionLabel = findLabel(selectedOptions) || key;
                return (
                  <div key={key} className="flex justify-between gap-5 p-4">
                    <span className="text-sm text-inkSoft">{optionLabel}</span>
                    <strong>{String(value)}</strong>
                  </div>
                );
              })}

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
                <>
                  <div className="flex justify-between gap-5 p-4">
                    <span className="text-sm text-inkSoft">Quartier</span>
                    <strong className="text-right">
                      {isOtherNeighborhood(deliveryNeighborhood) ? lieu : deliveryNeighborhood}
                    </strong>
                  </div>
                  <div className="flex justify-between gap-5 p-4">
                    <span className="text-sm text-inkSoft">Livraison</span>
                    <strong className="text-right">
                      {deliveryFee !== null ? formatFCFA(deliveryFee) : "À confirmer"}
                    </strong>
                  </div>
                  {isOtherNeighborhood(deliveryNeighborhood) && (
                    <div className="border-t border-ink/10 px-4 py-3 text-sm leading-5 text-inkSoft">
                      Les frais de livraison pour ce quartier seront évalués par notre équipe et confirmés directement sur WhatsApp.
                    </div>
                  )}
                </>
              )}

              {productTotal !== null && (
                <div className="flex justify-between gap-5 p-4">
                  <span className="text-sm text-inkSoft">Produits</span>
                  <strong>{formatFCFA(productTotal)}</strong>
                </div>
              )}

              <div className="flex justify-between gap-5 bg-[#153d2d] p-5 text-white">
                <span className="font-semibold">Total estimatif</span>
                <strong className="font-serif text-2xl">
                  {estimatedTotal !== null ? formatFCFA(estimatedTotal) : "À confirmer"}
                </strong>
              </div>
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
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
