"use client";

import { useMemo, useState } from "react";
import { DELIVERY_ZONES, getDeliveryFee, isOtherNeighborhood } from "@/lib/delivery";
import { formatFCFA } from "@/lib/whatsapp";

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
  type?: string;
  required?: boolean;
};

export type HomeOrderProduct = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  price: number | null;
  price_unit: string | null;
  price_1_label: string | null;
  price_1: number | null;
  price_2_label: string | null;
  price_2: number | null;
  order_enabled: boolean;
  order_options?: OrderOption[] | null;
};

type Props = {
  product: HomeOrderProduct;
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
    { label: "Format", values: ["Entier", "Au kg"] },
    { label: "État", values: ["Frais", "Fumé"] },
  ],
  "poulet de chair": [
    { label: "Préparation", values: ["Nettoyé", "Non nettoyé"] },
    { label: "État", values: ["Frais", "Fumé"] },
  ],
  "œufs": [
    { label: "Conditionnement", values: ["1 alvéole", "2 alvéoles", "3 alvéoles"] },
  ],
};

function defaultOptions(name: string): OrderOption[] {
  const normalized = name.trim().toLowerCase();
  if (normalized.includes("silure")) return DEFAULT_OPTIONS.silure;
  if (normalized.includes("porc")) return DEFAULT_OPTIONS.porc;
  if (normalized.includes("poulet") && normalized.includes("chair")) {
    return DEFAULT_OPTIONS["poulet de chair"];
  }
  if (normalized.includes("œuf") || normalized.includes("oeuf")) {
    return DEFAULT_OPTIONS["œufs"];
  }
  return [];
}

function normalizeValue(value: OrderOptionValue | string): OrderOptionValue {
  if (typeof value === "string") return { label: value, available: true };
  return {
    ...value,
    label: typeof value.label === "string" ? value.label : "",
    available: value.available !== false,
    children: Array.isArray(value.children) ? value.children : [],
  };
}

function optionKey(option: OrderOption) {
  return option.id || option.label;
}

function valuesOf(option: OrderOption): OrderOptionValue[] {
  return Array.isArray(option.values)
    ? option.values.map(normalizeValue).filter((v) => v.label.trim())
    : [];
}

function getTierThreshold(label?: string | null) {
  if (!label) return null;
  const match = label.match(/(?:à\s*partir\s*de|dès)\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function findSelectedPricedValue(
  options: OrderOption[],
  selections: Record<string, string>
): OrderOptionValue | null {
  for (const option of options) {
    const chosen = valuesOf(option).find(
      (value) => value.label === selections[optionKey(option)]
    );

    if (!chosen) continue;

    if (chosen.children?.length) {
      const nested = findSelectedPricedValue(chosen.children, selections);
      if (nested) return nested;
    }

    if (
      typeof chosen.price_1 === "number" ||
      typeof chosen.price_2 === "number"
    ) {
      return chosen;
    }
  }

  return null;
}

function getUnitPrice(
  product: HomeOrderProduct,
  options: OrderOption[],
  selections: Record<string, string>,
  quantity: number
) {
  const selected = findSelectedPricedValue(options, selections);

  if (selected) {
    const threshold = getTierThreshold(selected.price_2_label);

    if (
      threshold !== null &&
      quantity >= threshold &&
      typeof selected.price_2 === "number"
    ) {
      return selected.price_2;
    }

    if (typeof selected.price_1 === "number") return selected.price_1;
    if (typeof selected.price_2 === "number") return selected.price_2;
  }

  const threshold = getTierThreshold(product.price_2_label);

  if (
    threshold !== null &&
    quantity >= threshold &&
    typeof product.price_2 === "number"
  ) {
    return product.price_2;
  }

  if (typeof product.price_1 === "number") return product.price_1;
  if (typeof product.price === "number") return product.price;
  if (typeof product.price_2 === "number") return product.price_2;

  return null;
}

function optionText(
  options: OrderOption[],
  selections: Record<string, string>
) {
  return Object.entries(selections).map(([key, value]) => {
    const findLabel = (items: OrderOption[]): string | null => {
      for (const item of items) {
        if (optionKey(item) === key) return item.label;
        for (const child of valuesOf(item)) {
          if (child.children?.length) {
            const nested = findLabel(child.children);
            if (nested) return nested;
          }
        }
      }
      return null;
    };

    return `${findLabel(options) || key} : ${value}`;
  });
}

export default function HomeProductOrderModal({ product }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"order" | "customer" | "summary">("order");
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [clientType, setClientType] = useState("Particulier / Famille");
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<"Livraison" | "Retrait à la ferme">("Livraison");
  const [neighborhood, setNeighborhood] = useState("");
  const [otherNeighborhood, setOtherNeighborhood] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const options = useMemo(
    () =>
      Array.isArray(product.order_options) && product.order_options.length > 0
        ? product.order_options
        : defaultOptions(product.name),
    [product.order_options, product.name]
  );

  const unitPrice = useMemo(
    () => getUnitPrice(product, options, selections, quantity),
    [product, options, selections, quantity]
  );

  const productTotal =
    unitPrice === null ? null : unitPrice * Math.max(1, quantity);

  const deliveryFee =
    deliveryMode === "Livraison" ? getDeliveryFee(neighborhood) : 0;

  const estimatedTotal =
    productTotal === null || (deliveryMode === "Livraison" && deliveryFee === null)
      ? null
      : productTotal + deliveryFee;

  const deliveryLocation =
    neighborhood && isOtherNeighborhood(neighborhood)
      ? otherNeighborhood.trim()
      : neighborhood;

  function reset() {
    setStep("order");
    setQuantity(1);
    setSelections({});
    setClientType("Particulier / Famille");
    setClientName("");
    setPhone("");
    setDeliveryMode("Livraison");
    setNeighborhood("");
    setOtherNeighborhood("");
    setError("");
    setSubmitting(false);
  }

  function close() {
    if (!submitting) {
      setOpen(false);
      reset();
    }
  }

  function validateOptions() {
    for (const option of options) {
      const key = optionKey(option);
      const values = valuesOf(option);
      const selected = selections[key];

      if (option.required !== false && values.length > 0 && !selected) {
        return `Merci de choisir : ${option.label}.`;
      }

      if (selected) {
        const chosen = values.find((value) => value.label === selected);
        if (!chosen) return `Option invalide pour : ${option.label}.`;
        if (chosen.available === false) {
          return `${chosen.label} : pas encore disponible.`;
        }
      }
    }

    return "";
  }

  function goToCustomer() {
    setError("");

    if (quantity < 1 || !Number.isInteger(quantity)) {
      setError("La quantité doit être un nombre entier supérieur ou égal à 1.");
      return;
    }

    const optionError = validateOptions();
    if (optionError) {
      setError(optionError);
      return;
    }

    setStep("customer");
  }

  function goToSummary() {
    setError("");

    if (!clientName.trim() || !phone.trim()) {
      setError("Merci de renseigner votre nom et votre numéro.");
      return;
    }

    if (deliveryMode === "Livraison") {
      if (!neighborhood) {
        setError("Merci de préciser votre quartier.");
        return;
      }

      if (isOtherNeighborhood(neighborhood) && !otherNeighborhood.trim()) {
        setError("Merci de préciser votre quartier.");
        return;
      }
    }

    setStep("summary");
  }

  async function submitOrder() {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          options: selections,
          quantity,
          client_type: clientType,
          client_name: clientName.trim(),
          delivery_mode: deliveryMode,
          delivery_location: deliveryMode === "Livraison" ? deliveryLocation : null,
          phone: phone.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Impossible d'enregistrer la commande.");
      }

      if (!data?.whatsapp_url) {
        throw new Error("Le lien WhatsApp n'a pas été généré.");
      }

      window.location.href = data.whatsapp_url;
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue."
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 flex w-full items-center justify-center rounded-full bg-[#173D2D] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#28563F]"
      >
        Commander
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10291f]/55 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Commander ${product.name}`}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-[#FBFAF6] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#173D2D]/10 bg-[#FBFAF6]/95 px-6 py-5 backdrop-blur">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B7863D]">
                  Commander
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-[#173D2D]">
                  {product.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={close}
                disabled={submitting}
                className="rounded-full border border-[#173D2D]/10 px-3 py-2 text-sm text-[#52645A] hover:bg-[#EDE9DE]"
                aria-label="Fermer"
              >
                Fermer
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {step === "order" && (
                <div className="space-y-6">
                  {options.length > 0 && (
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm font-semibold text-[#173D2D]">
                          Choisir les options
                        </p>
                        <p className="mt-1 text-xs text-[#718074]">
                          Sélectionnez les caractéristiques souhaitées.
                        </p>
                      </div>

                      {options.map((option) => {
                        const key = optionKey(option);
                        const values = valuesOf(option);

                        return (
                          <div key={key}>
                            <label className="mb-2 block text-sm font-medium text-[#40594A]">
                              {option.label}
                            </label>

                            <select
                              value={selections[key] || ""}
                              onChange={(event) =>
                                setSelections((current) => ({
                                  ...current,
                                  [key]: event.target.value,
                                }))
                              }
                              className="w-full rounded-xl border border-[#173D2D]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173D2D]"
                            >
                              <option value="">Sélectionner</option>
                              {values.map((value) => (
                                <option
                                  key={value.label}
                                  value={value.label}
                                  disabled={value.available === false}
                                >
                                  {value.label}
                                  {value.available === false ? " — Pas encore disponible" : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#40594A]">
                      Quantité{product.price_unit ? ` (${product.price_unit})` : ""}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(event) => {
                        const value = event.target.value;
                        setQuantity(value === "" ? 0 : Number(value));
                      }}
                      onBlur={() => {
                        if (!Number.isInteger(quantity) || quantity < 1) {
                          setQuantity(1);
                        }
                      }}
                      className="w-full rounded-xl border border-[#173D2D]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173D2D]"
                    />
                  </div>

                  {productTotal !== null && (
                    <div className="rounded-2xl bg-[#EDE9DE] p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#718074]">
                        Estimation produits
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-[#173D2D]">
                        {formatFCFA(productTotal)}
                      </p>
                    </div>
                  )}

                  {error && (
                    <p className="rounded-xl bg-[#F8E8E4] px-4 py-3 text-sm text-[#8B3E32]">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={goToCustomer}
                    className="w-full rounded-full bg-[#173D2D] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#28563F]"
                  >
                    Continuer
                  </button>
                </div>
              )}

              {step === "customer" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-[#173D2D]">
                      Vos informations
                    </p>
                    <p className="mt-1 text-xs text-[#718074]">
                      Ces informations servent à vous contacter pour confirmer la commande.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#40594A]">
                        Nom
                      </label>
                      <input
                        value={clientName}
                        onChange={(event) => setClientName(event.target.value)}
                        placeholder="Votre nom"
                        className="w-full rounded-xl border border-[#173D2D]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173D2D]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#40594A]">
                        Numéro à appeler
                      </label>
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="6XX XXX XXX"
                        inputMode="tel"
                        className="w-full rounded-xl border border-[#173D2D]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173D2D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#40594A]">
                      Type de client
                    </label>
                    <select
                      value={clientType}
                      onChange={(event) => setClientType(event.target.value)}
                      className="w-full rounded-xl border border-[#173D2D]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173D2D]"
                    >
                      <option>Particulier / Famille</option>
                      <option>Restaurant</option>
                      <option>Poissonnerie</option>
                    </select>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-[#40594A]">
                      Mode de récupération
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryMode("Livraison");
                          setNeighborhood("");
                          setOtherNeighborhood("");
                        }}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                          deliveryMode === "Livraison"
                            ? "border-[#173D2D] bg-[#173D2D] text-white"
                            : "border-[#173D2D]/12 bg-white text-[#40594A]"
                        }`}
                      >
                        Livraison
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryMode("Retrait à la ferme");
                          setNeighborhood("");
                          setOtherNeighborhood("");
                        }}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                          deliveryMode === "Retrait à la ferme"
                            ? "border-[#173D2D] bg-[#173D2D] text-white"
                            : "border-[#173D2D]/12 bg-white text-[#40594A]"
                        }`}
                      >
                        Retrait à la ferme
                      </button>
                    </div>
                  </div>

                  {deliveryMode === "Livraison" && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#40594A]">
                        Précisez votre quartier
                      </label>

                      <select
                        value={neighborhood}
                        onChange={(event) => {
                          setNeighborhood(event.target.value);
                          if (!isOtherNeighborhood(event.target.value)) {
                            setOtherNeighborhood("");
                          }
                        }}
                        className="w-full rounded-xl border border-[#173D2D]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173D2D]"
                      >
                        <option value="">Sélectionner votre quartier</option>
                        {DELIVERY_ZONES.map((zone) => (
                          <optgroup key={zone.name} label={`${zone.name} — ${formatFCFA(zone.fee)}`}>
                            {zone.neighborhoods.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                        <option value="__OTHER__">Autre quartier</option>
                      </select>

                      {neighborhood && !isOtherNeighborhood(neighborhood) && (
                        <p className="mt-2 text-xs font-medium text-[#52645A]">
                          Frais de livraison : {formatFCFA(deliveryFee || 0)}
                        </p>
                      )}

                      {isOtherNeighborhood(neighborhood) && (
                        <div className="mt-3">
                          <input
                            value={otherNeighborhood}
                            onChange={(event) => setOtherNeighborhood(event.target.value)}
                            placeholder="Précisez votre quartier"
                            className="w-full rounded-xl border border-[#173D2D]/12 bg-white px-4 py-3 text-sm outline-none focus:border-[#173D2D]"
                          />
                          <p className="mt-2 text-xs leading-5 text-[#718074]">
                            Les frais de livraison de ce quartier seront évalués et confirmés avec vous.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <p className="rounded-xl bg-[#F8E8E4] px-4 py-3 text-sm text-[#8B3E32]">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("order")}
                      className="flex-1 rounded-full border border-[#173D2D]/15 px-5 py-3.5 text-sm font-semibold text-[#40594A]"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={goToSummary}
                      className="flex-1 rounded-full bg-[#173D2D] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#28563F]"
                    >
                      Voir le récapitulatif
                    </button>
                  </div>
                </div>
              )}

              {step === "summary" && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-[#173D2D]">
                      Récapitulatif
                    </p>
                    <p className="mt-1 text-xs text-[#718074]">
                      Vérifiez votre commande avant de continuer vers WhatsApp.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-[#173D2D]/10 bg-white p-5 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-[#718074]">Produit</span>
                      <span className="text-right font-semibold text-[#173D2D]">
                        {product.name}
                      </span>
                    </div>

                    {optionText(options, selections).map((item) => (
                      <div key={item} className="flex justify-between gap-4">
                        <span className="text-[#718074]">{item.split(" : ")[0]}</span>
                        <span className="text-right font-semibold text-[#173D2D]">
                          {item.split(" : ").slice(1).join(" : ")}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between gap-4">
                      <span className="text-[#718074]">Quantité</span>
                      <span className="font-semibold text-[#173D2D]">
                        {quantity} {product.price_unit || ""}
                      </span>
                    </div>

                    <div className="border-t border-[#173D2D]/10 pt-3">
                      <div className="flex justify-between gap-4">
                        <span className="text-[#718074]">Produits</span>
                        <span className="font-semibold text-[#173D2D]">
                          {productTotal !== null ? formatFCFA(productTotal) : "À confirmer"}
                        </span>
                      </div>

                      <div className="mt-2 flex justify-between gap-4">
                        <span className="text-[#718074]">Livraison</span>
                        <span className="font-semibold text-[#173D2D]">
                          {deliveryMode === "Retrait à la ferme"
                            ? "Retrait à la ferme"
                            : deliveryFee !== null
                              ? formatFCFA(deliveryFee)
                              : "À confirmer"}
                        </span>
                      </div>

                      {deliveryMode === "Livraison" && deliveryLocation && (
                        <div className="mt-2 flex justify-between gap-4">
                          <span className="text-[#718074]">Quartier</span>
                          <span className="text-right font-semibold text-[#173D2D]">
                            {deliveryLocation}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between gap-4 border-t border-[#173D2D]/10 pt-4 text-base">
                      <span className="font-semibold text-[#40594A]">
                        Total estimatif
                      </span>
                      <span className="font-bold text-[#173D2D]">
                        {estimatedTotal !== null
                          ? formatFCFA(estimatedTotal)
                          : "À confirmer"}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl bg-[#F8E8E4] px-4 py-3 text-sm text-[#8B3E32]">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("customer")}
                      disabled={submitting}
                      className="flex-1 rounded-full border border-[#173D2D]/15 px-5 py-3.5 text-sm font-semibold text-[#40594A]"
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      onClick={submitOrder}
                      disabled={submitting}
                      className="flex-1 rounded-full bg-[#173D2D] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#28563F] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Préparation..." : "Commander sur WhatsApp"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
