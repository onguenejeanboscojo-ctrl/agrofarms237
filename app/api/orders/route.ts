import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { waLink, formatFCFA } from "@/lib/whatsapp";
import { isAdminAuthed } from "@/lib/adminAuth";

type OptionValue = {
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
  values?: Array<OptionValue | string>;
  type?: string;
  required?: boolean;
};

type HomeProduct = {
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
  published: boolean;
};

type OrderBody = {
  product_id?: string;
  options?: Record<string, string>;
  quantity?: number;
  client_type?: string;
  client_name?: string;
  delivery_mode?: string;
  delivery_location?: string | null;
  phone?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function finiteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeValue(value: OptionValue | string): OptionValue {
  if (typeof value === "string") return { label: value, available: true };
  return {
    ...value,
    label: typeof value?.label === "string" ? value.label : "",
    available: value?.available !== false,
    children: Array.isArray(value?.children) ? value.children : [],
  };
}

function defaultOptions(name: string): OrderOption[] {
  const n = name.trim().toLowerCase();
  if (n.includes("silure")) {
    return [{ label: "État", values: [
      { label: "Frais", available: true },
      { label: "Fumé", available: false },
    ] }];
  }
  if (n.includes("porc")) {
    return [
      { label: "Format", values: ["Entier", "Au kg"] },
      { label: "État", values: ["Frais", "Fumé"] },
    ];
  }
  if (n.includes("poulet") && n.includes("chair")) {
    return [
      { label: "Préparation", values: ["Nettoyé", "Non nettoyé"] },
      { label: "État", values: ["Frais", "Fumé"] },
    ];
  }
  if (n.includes("œuf") || n.includes("oeuf")) {
    return [{ label: "Conditionnement", values: ["1 alvéole", "2 alvéoles", "3 alvéoles"] }];
  }
  return [];
}

function optionKey(option: OrderOption): string {
  return option.id || option.label;
}

function valuesOf(option: OrderOption): OptionValue[] {
  return Array.isArray(option.values)
    ? option.values.map(normalizeValue).filter((v) => v.label.trim())
    : [];
}

function findSelectedPricedValue(
  options: OrderOption[],
  selections: Record<string, string>
): OptionValue | null {
  for (const option of options) {
    const chosen = valuesOf(option).find(
      (v) => v.label === selections[optionKey(option)]
    );
    if (!chosen) continue;
    if (chosen.children?.length) {
      const nested = findSelectedPricedValue(chosen.children, selections);
      if (nested && (typeof nested.price_1 === "number" || typeof nested.price_2 === "number")) {
        return nested;
      }
    }
    if (typeof chosen.price_1 === "number" || typeof chosen.price_2 === "number") {
      return chosen;
    }
  }
  return null;
}

function getTierThreshold(label?: string | null): number | null {
  if (!label) return null;
  const match = label.match(/(?:à\s*partir\s*de|dès)\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function priceFor(product: HomeProduct, options: OrderOption[], selections: Record<string, string>, quantity: number) {
  const selected = findSelectedPricedValue(options, selections);
  if (selected) {
    const threshold = getTierThreshold(selected.price_2_label);
    if (threshold !== null && quantity >= threshold && typeof selected.price_2 === "number") {
      return selected.price_2;
    }
    if (typeof selected.price_1 === "number") return selected.price_1;
    if (typeof selected.price_2 === "number") return selected.price_2;
  }

  const threshold = getTierThreshold(product.price_2_label);
  if (threshold !== null && quantity >= threshold && typeof product.price_2 === "number") {
    return product.price_2;
  }
  if (typeof product.price_1 === "number") return product.price_1;
  if (typeof product.price === "number") return product.price;
  if (typeof product.price_2 === "number") return product.price_2;
  return null;
}

/** Validate submitted selections against the product's configured options. */
function validateSelections(
  options: OrderOption[],
  selections: Record<string, string>
): string | null {
  const allowedKeys = new Set<string>();

  const walk = (items: OrderOption[]): string | null => {
    for (const option of items) {
      const key = optionKey(option);
      allowedKeys.add(key);
      const values = valuesOf(option);
      const raw = selections[key];

      if (option.type === "number") {
        if (option.required !== false && !raw) return `Merci de renseigner : ${option.label}.`;
        if (raw !== undefined && raw !== "") {
          const n = Number(raw);
          if (!Number.isFinite(n) || n < 1) return `Valeur invalide pour : ${option.label}.`;
        }
        continue;
      }

      if (option.required !== false && values.length > 0 && !raw) {
        return `Merci de choisir : ${option.label}.`;
      }
      if (!raw) continue;

      const chosen = values.find((v) => v.label === raw);
      if (!chosen) return `Option invalide pour : ${option.label}.`;
      if (chosen.available === false) return `${chosen.label} : pas encore disponible.`;

      // Only the selected branch's child options are valid/required.
      if (chosen.children?.length) {
        const nestedError = walk(chosen.children);
        if (nestedError) return nestedError;
      }
    }
    return null;
  };

  const error = walk(options);
  if (error) return error;

  for (const key of Object.keys(selections)) {
    if (!allowedKeys.has(key)) return "Une option envoyée est invalide.";
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;
    const productId = clean(body.product_id);
    const clientName = clean(body.client_name);
    const phone = clean(body.phone);

    if (!productId) {
      return NextResponse.json({ error: "Merci de choisir un produit." }, { status: 400 });
    }
    if (!clientName || !phone) {
      return NextResponse.json({ error: "Nom et numéro de téléphone requis." }, { status: 400 });
    }
    if (clientName.length > 120 || phone.length > 40) {
      return NextResponse.json({ error: "Nom ou numéro trop long." }, { status: 400 });
    }

    const rawQuantity = finiteNumber(body.quantity);
    if (rawQuantity === null || !Number.isInteger(rawQuantity) || rawQuantity < 1 || rawQuantity > 10000) {
      return NextResponse.json({ error: "La quantité doit être un nombre entier entre 1 et 10 000." }, { status: 400 });
    }
    const quantity = rawQuantity;

    const { data: productData, error: productError } = await supabaseAdmin()
      .from("home_products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Erreur lecture produit commande :", productError);
      return NextResponse.json({ error: "Impossible de vérifier le produit." }, { status: 500 });
    }
    if (!productData) {
      return NextResponse.json({ error: "Ce produit n'existe plus." }, { status: 404 });
    }

    const product = productData as HomeProduct;
    if (product.published === false || product.status !== "disponible" || product.order_enabled !== true) {
      return NextResponse.json({ error: "Ce produit n'est pas disponible à la commande." }, { status: 400 });
    }

    const configuredOptions =
      Array.isArray(product.order_options) && product.order_options.length > 0
        ? product.order_options
        : defaultOptions(product.name);

    const selections =
      body.options && typeof body.options === "object" && !Array.isArray(body.options)
        ? body.options
        : {};

    for (const value of Object.values(selections)) {
      if (typeof value !== "string" || value.length > 150) {
        return NextResponse.json({ error: "Options de commande invalides." }, { status: 400 });
      }
    }

    const optionError = validateSelections(configuredOptions, selections);
    if (optionError) {
      return NextResponse.json({ error: optionError }, { status: 400 });
    }

    const unitPrice = priceFor(product, configuredOptions, selections, quantity);
    const totalPrice = unitPrice === null ? null : unitPrice * quantity;

    if (unitPrice !== null && (!Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(totalPrice))) {
      return NextResponse.json({ error: "Le prix du produit est invalide. Contactez Agrofarms237." }, { status: 400 });
    }

    const clientType = clean(body.client_type) || "Particulier / Famille";
    const allowedClientTypes = ["Particulier / Famille", "Restaurant", "Poissonnerie"];
    if (!allowedClientTypes.includes(clientType)) {
      return NextResponse.json({ error: "Type de client invalide." }, { status: 400 });
    }

    const deliveryMode = clean(body.delivery_mode) || "Livraison";
    if (!["Livraison", "Retrait à la ferme"].includes(deliveryMode)) {
      return NextResponse.json({ error: "Mode de récupération invalide." }, { status: 400 });
    }
    const deliveryLocation = clean(body.delivery_location) || null;
    if (deliveryMode === "Livraison" && !deliveryLocation) {
      return NextResponse.json({ error: "Merci de renseigner le lieu de livraison." }, { status: 400 });
    }
    if (deliveryLocation && deliveryLocation.length > 250) {
      return NextResponse.json({ error: "Le lieu de livraison est trop long." }, { status: 400 });
    }

    const optionEntries = Object.entries(selections);
    const optionText = optionEntries.map(([key, value]) => {
      const findLabel = (items: OrderOption[]): string | null => {
        for (const item of items) {
          if (optionKey(item) === key) return item.label;
          for (const v of valuesOf(item)) {
            if (v.children?.length) {
              const nested = findLabel(v.children);
              if (nested) return nested;
            }
          }
        }
        return null;
      };
      return `${findLabel(configuredOptions) || key} : ${value}`;
    });

    const finalProductName = optionText.length
      ? `${product.name} — ${optionText.join(" | ")}`
      : product.name;

    const isKgProduct = /silure|porc/i.test(product.name);
    const quantityKg = isKgProduct ? quantity : null;

    const record = {
      product_name: finalProductName,
      quantity_kg: quantityKg,
      unit_price: unitPrice,
      total_price: totalPrice,
      client_type: clientType,
      client_name: clientName,
      delivery_mode: deliveryMode,
      delivery_location: deliveryLocation,
      phone,
      status: "nouveau",
    };

    const { data, error } = await supabaseAdmin()
      .from("orders")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Erreur enregistrement commande :", error);
      return NextResponse.json({ error: "Impossible d'enregistrer la commande." }, { status: 500 });
    }

    const lines = [
      "Bonjour Agrofarms237, je souhaite passer une commande.",
      "",
      `Produit : ${product.name}`,
    ];
    if (optionText.length) lines.push("", "Options :", ...optionText.map((text) => `- ${text}`));
    lines.push("", `Quantité : ${quantity}`);
    if (quantityKg !== null) lines.push(`Quantité en kg : ${quantityKg} kg`);
    if (unitPrice !== null) lines.push(`Prix unitaire : ${formatFCFA(unitPrice)}`);
    if (totalPrice !== null) lines.push(`Total estimatif : ${formatFCFA(totalPrice)}`);
    else lines.push("Prix : à confirmer avec Agrofarms237");
    lines.push("", `Nom : ${clientName}`, `Type de client : ${clientType}`, `Mode : ${deliveryMode}`);
    if (deliveryMode === "Livraison") lines.push(`Lieu de livraison : ${deliveryLocation}`);
    lines.push(`Numéro à appeler : ${phone}`);

    return NextResponse.json({ order: data, whatsapp_url: waLink(lines.join("\n")) });
  } catch (error) {
    console.error("Erreur création commande :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création de la commande." },
      { status: 500 }
    );
  }
}

// ADMIN : liste des commandes
export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
