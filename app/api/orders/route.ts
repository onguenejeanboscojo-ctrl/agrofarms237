import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { waLink, formatFCFA } from "@/lib/whatsapp";
import { isAdminAuthed } from "@/lib/adminAuth";

type OrderBody = {
  product_id?: string;
  product_name?: string;
  options?: Record<string, string>;

  quantity?: number;
  quantity_kg?: number | null;

  unit_price?: number | null;
  total_price?: number | null;

  client_type?: string;
  client_name?: string;

  delivery_mode?: string;
  delivery_location?: string | null;

  phone?: string;
};

function clean(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function safeNumber(value: unknown): number | null {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as OrderBody;

    const productName =
      clean(body.product_name) || "Produit Agrofarms237";

    const clientName = clean(body.client_name);
    const phone = clean(body.phone);

    const quantity =
      Math.max(
        1,
        Math.floor(
          safeNumber(body.quantity) ?? 1
        )
      );

    const quantityKg =
      body.quantity_kg !== null &&
      body.quantity_kg !== undefined
        ? safeNumber(body.quantity_kg)
        : null;

    const unitPrice = safeNumber(
      body.unit_price
    );

    const totalPrice =
      safeNumber(body.total_price) ??
      (unitPrice !== null
        ? unitPrice * quantity
        : null);

    if (!clientName || !phone) {
      return NextResponse.json(
        {
          error:
            "Nom et numéro de téléphone requis.",
        },
        { status: 400 }
      );
    }

    if (!body.product_id || !body.product_name) {
      return NextResponse.json(
        {
          error:
            "Merci de choisir un produit.",
        },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        {
          error:
            "La quantité doit être supérieure à 0.",
        },
        { status: 400 }
      );
    }

    const options =
      body.options &&
      typeof body.options === "object"
        ? body.options
        : {};

    const clientType =
      clean(body.client_type) ||
      "Particulier / Famille";

    const deliveryMode =
      clean(body.delivery_mode) ||
      "Livraison";

    const deliveryLocation =
      clean(body.delivery_location) ||
      null;

    const record = {
      product_name: productName,

      quantity_kg: quantityKg,

      unit_price: unitPrice,

      total_price: totalPrice,

      client_type: clientType,

      client_name: clientName,

      delivery_mode: deliveryMode,

      delivery_location:
        deliveryLocation,

      phone,

      status: "nouveau",

      /*
       * On conserve les options dans le champ
       * product_name pour rester compatible avec
       * la structure actuelle de la table orders.
       */
    };

    let finalProductName = productName;

    const optionEntries =
      Object.entries(options).filter(
        ([, value]) =>
          typeof value === "string" &&
          value.trim() !== ""
      );

    if (optionEntries.length > 0) {
      const optionText =
        optionEntries
          .map(
            ([label, value]) =>
              `${label} : ${value}`
          )
          .join(" | ");

      finalProductName =
        `${productName} — ${optionText}`;
    }

    record.product_name =
      finalProductName;

    const { data, error } =
      await supabaseAdmin()
        .from("orders")
        .insert(record)
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const lines: string[] = [];

    lines.push(
      `Bonjour Agrofarms237, je souhaite passer une commande.`
    );

    lines.push("");

    lines.push(
      `Produit : ${productName}`
    );

    if (optionEntries.length > 0) {
      lines.push("");
      lines.push("Options :");

      optionEntries.forEach(
        ([label, value]) => {
          lines.push(
            `- ${label} : ${value}`
          );
        }
      );
    }

    lines.push("");

    lines.push(
      `Quantité : ${quantity}`
    );

    if (quantityKg !== null) {
      lines.push(
        `Quantité en kg : ${quantityKg} kg`
      );
    }

    if (unitPrice !== null) {
      lines.push(
        `Prix unitaire : ${formatFCFA(
          unitPrice
        )}`
      );
    }

    if (totalPrice !== null) {
      lines.push(
        `Total estimatif : ${formatFCFA(
          totalPrice
        )}`
      );
    } else {
      lines.push(
        `Prix : à confirmer avec Agrofarms237`
      );
    }

    lines.push("");

    lines.push(
      `Nom : ${clientName}`
    );

    lines.push(
      `Type de client : ${clientType}`
    );

    lines.push(
      `Mode : ${deliveryMode}`
    );

    if (deliveryMode === "Livraison") {
      lines.push(
        `Lieu de livraison : ${
          deliveryLocation || "À préciser"
        }`
      );
    }

    lines.push(
      `Numéro à appeler : ${phone}`
    );

    const message =
      lines.join("\n");

    return NextResponse.json({
      order: data,
      whatsapp_url: waLink(message),
    });
  } catch (error) {
    console.error(
      "Erreur création commande :",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la création de la commande.",
      },
      { status: 500 }
    );
  }
}


// --------------------------------------------------
// ADMIN : LISTE DES COMMANDES
// --------------------------------------------------

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json(
      {
        error: "Non autorisé",
      },
      { status: 401 }
    );
  }

  const { data, error } =
    await supabaseAdmin()
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orders: data,
  });
}
