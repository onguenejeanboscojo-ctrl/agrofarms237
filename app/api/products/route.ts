
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

const CATEGORIES = [
  "Pisciculture",
  "Élevage porcin",
  "Aviculture",
] as const;

const STOCK_STATUSES = [
  "disponible",
  "indisponible",
  "bientôt disponible",
] as const;

const UNITS = ["piece", "kg", "alvéole"] as const;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isNonNegativeNumber(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

// GET : récupérer les produits du catalogue
export async function GET() {
  try {
    if (!(await isAdminAuthed())) {
      return jsonError("Non autorisé.", 401);
    }

    const { data, error } = await supabaseAdmin()
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[GET /api/products]", error);
      return jsonError("Impossible de récupérer les produits.", 500);
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    console.error("[GET /api/products] Erreur inattendue :", error);
    return jsonError("Erreur serveur lors du chargement des produits.", 500);
  }
}

// POST : créer un produit
export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthed())) {
      return jsonError("Non autorisé.", 401);
    }

    const body = await req.json();

    const {
      name,
      category,
      product_group,
      variant,
      unit,
      price_standard,
      price_bulk,
      bulk_min_kg,
      stock_status,
      next_availability,
      stock_quantity,
      stock_threshold,
      display_order,
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof category !== "string" ||
      !CATEGORIES.includes(category as (typeof CATEGORIES)[number]) ||
      typeof product_group !== "string" ||
      !product_group.trim() ||
      typeof unit !== "string" ||
      !UNITS.includes(unit as (typeof UNITS)[number])
    ) {
      return jsonError(
        "Informations invalides : vérifie le nom, la catégorie, le groupe et l'unité.",
        400
      );
    }

    if (
      !STOCK_STATUSES.includes(
        stock_status as (typeof STOCK_STATUSES)[number]
      )
    ) {
      return jsonError("Statut de disponibilité invalide.", 400);
    }

    if (
      price_standard !== null &&
      price_standard !== undefined &&
      !isNonNegativeNumber(price_standard)
    ) {
      return jsonError("Le prix standard doit être un nombre positif ou nul.", 400);
    }

    if (
      price_bulk !== null &&
      price_bulk !== undefined &&
      !isNonNegativeNumber(price_bulk)
    ) {
      return jsonError("Le prix de gros est invalide.", 400);
    }

    if (
      stock_quantity !== null &&
      stock_quantity !== undefined &&
      !isNonNegativeNumber(stock_quantity)
    ) {
      return jsonError("La quantité en stock est invalide.", 400);
    }

    if (
      stock_threshold !== null &&
      stock_threshold !== undefined &&
      !isNonNegativeNumber(stock_threshold)
    ) {
      return jsonError("Le seuil de stock est invalide.", 400);
    }

    if (
      display_order !== null &&
      display_order !== undefined &&
      !isNonNegativeNumber(display_order)
    ) {
      return jsonError("L'ordre d'affichage est invalide.", 400);
    }

    if (
      bulk_min_kg !== null &&
      bulk_min_kg !== undefined &&
      !isNonNegativeNumber(bulk_min_kg)
    ) {
      return jsonError("Le minimum de commande en gros est invalide.", 400);
    }

    const product = {
      name: name.trim(),
      category,
      product_group: product_group.trim().toLowerCase(),
      variant:
        typeof variant === "string" && variant.trim()
          ? variant.trim()
          : null,
      unit,
      price_standard:
        price_standard === "" || price_standard === undefined
          ? null
          : price_standard,
      price_bulk:
        price_bulk === "" || price_bulk === undefined
          ? null
          : price_bulk,
      bulk_min_kg:
        bulk_min_kg === "" || bulk_min_kg === undefined
          ? null
          : bulk_min_kg,
      stock_status,
      next_availability:
        typeof next_availability === "string" && next_availability.trim()
          ? next_availability.trim()
          : null,
      stock_quantity:
        stock_quantity === "" || stock_quantity === undefined
          ? 0
          : stock_quantity,
      stock_threshold:
        stock_threshold === "" || stock_threshold === undefined
          ? 0
          : stock_threshold,
      display_order:
        display_order === "" || display_order === undefined
          ? 0
          : display_order,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin()
      .from("products")
      .insert(product)
      .select("*")
      .single();

    if (error) {
      // Le détail apparaît dans les journaux du serveur, pas dans la réponse publique.
      console.error("[POST /api/products] Erreur Supabase :", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      // Réponse temporaire de diagnostic pour identifier la cause.
      return NextResponse.json(
        {
          error: "Impossible de créer le produit.",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, product: data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products] Erreur inattendue :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de la création du produit.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH : modifier un produit existant
export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAdminAuthed())) {
      return jsonError("Non autorisé.", 401);
    }

    const body = await req.json();
    const { id, ...fields } = body;

    if (typeof id !== "string" || !id.trim()) {
      return jsonError("Identifiant du produit manquant.", 400);
    }

    const allowedFields = [
      "name",
      "price_standard",
      "price_bulk",
      "bulk_min_kg",
      "stock_status",
      "next_availability",
      "stock_quantity",
      "stock_threshold",
      "category",
      "product_group",
      "variant",
      "unit",
      "display_order",
    ] as const;

    const updates: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        updates[key] = fields[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return jsonError("Aucune modification valide reçue.", 400);
    }

    if (
      updates.category !== undefined &&
      (typeof updates.category !== "string" ||
        !CATEGORIES.includes(
          updates.category as (typeof CATEGORIES)[number]
        ))
    ) {
      return jsonError("Catégorie invalide.", 400);
    }

    if (
      updates.stock_status !== undefined &&
      (typeof updates.stock_status !== "string" ||
        !STOCK_STATUSES.includes(
          updates.stock_status as (typeof STOCK_STATUSES)[number]
        ))
    ) {
      return jsonError("Statut de disponibilité invalide.", 400);
    }

    if (
      updates.unit !== undefined &&
      (typeof updates.unit !== "string" ||
        !UNITS.includes(updates.unit as (typeof UNITS)[number]))
    ) {
      return jsonError("Unité de vente invalide.", 400);
    }

    for (const key of [
      "price_standard",
      "price_bulk",
      "bulk_min_kg",
      "stock_quantity",
      "stock_threshold",
      "display_order",
    ]) {
      const value = updates[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !isNonNegativeNumber(value)
      ) {
        return jsonError(`Valeur invalide pour le champ ${key}.`, 400);
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin()
      .from("products")
      .update(updates)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[PATCH /api/products] Erreur Supabase :", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return jsonError("Impossible de modifier le produit.", 500);
    }

    if (!data) {
      return jsonError("Produit introuvable.", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PATCH /api/products] Erreur inattendue :", error);
    return jsonError("Erreur serveur lors de la modification du produit.", 500);
  }
}
