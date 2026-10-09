
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

function optionalNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

// GET : récupérer le catalogue
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
        "Vérifie le nom, la catégorie, le groupe et l'unité du produit.",
        400
      );
    }

    if (
      typeof stock_status !== "string" ||
      !STOCK_STATUSES.includes(
        stock_status as (typeof STOCK_STATUSES)[number]
      )
    ) {
      return jsonError("Statut de disponibilité invalide.", 400);
    }

    const standardPrice = optionalNumber(price_standard);
    const bulkPrice = optionalNumber(price_bulk);
    const minimumBulk = optionalNumber(bulk_min_kg);
    const quantity = optionalNumber(stock_quantity);
    const threshold = optionalNumber(stock_threshold);
    const order = optionalNumber(display_order);

    if (
      price_standard !== null &&
      price_standard !== undefined &&
      price_standard !== "" &&
      standardPrice === null
    ) {
      return jsonError("Le prix standard est invalide.", 400);
    }

    if (
      price_bulk !== null &&
      price_bulk !== undefined &&
      price_bulk !== "" &&
      bulkPrice === null
    ) {
      return jsonError("Le prix de gros est invalide.", 400);
    }

    for (const [field, value] of [
      ["stock_quantity", quantity],
      ["stock_threshold", threshold],
      ["display_order", order],
      ["bulk_min_kg", minimumBulk],
    ] as const) {
      if (value !== null && !isNonNegativeNumber(value)) {
        return jsonError(`Valeur invalide pour ${field}.`, 400);
      }
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
      price_standard: standardPrice,
      price_bulk: bulkPrice,

      // Cette colonne est NOT NULL dans Supabase.
      // 0 signifie qu'aucun minimum de gros n'est défini.
      bulk_min_kg: minimumBulk ?? 0,

      stock_status,
      next_availability:
        typeof next_availability === "string" && next_availability.trim()
          ? next_availability.trim()
          : null,
      stock_quantity: quantity ?? 0,
      stock_threshold: threshold ?? 0,
      display_order: order ?? 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin()
      .from("products")
      .insert(product)
      .select("*")
      .single();

    if (error) {
      console.error("[POST /api/products] Erreur Supabase :", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          error: "Impossible de créer le produit.",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, product: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/products] Erreur inattendue :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de la création du produit.",
        details: error instanceof Error ? error.message : String(error),
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
        return jsonError(`Valeur invalide pour ${key}.`, 400);
      }
    }

    // Évite aussi le même problème lors d'une modification.
    if (
      Object.prototype.hasOwnProperty.call(updates, "bulk_min_kg") &&
      (updates.bulk_min_kg === null || updates.bulk_min_kg === "")
    ) {
      updates.bulk_min_kg = 0;
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
    return jsonError(
      "Erreur serveur lors de la modification du produit.",
      500
    );
  }
}
