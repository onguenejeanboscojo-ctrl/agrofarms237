
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

const STOCK_STATUSES = [
  "disponible",
  "rupture",
  "indisponible",
] as const;

const CATEGORIES = [
  "Pisciculture",
  "Élevage porcin",
  "Aviculture",
] as const;

const UNITS = ["piece", "kg", "alvéole"] as const;

type StockStatus = (typeof STOCK_STATUSES)[number];
type ProductCategory = (typeof CATEGORIES)[number];
type ProductUnit = (typeof UNITS)[number];

type ProductPayload = {
  id?: string;
  name?: string;
  category?: ProductCategory;
  product_group?: string | null;
  variant?: string | null;
  unit?: ProductUnit;
  price_standard?: number | null;
  price_bulk?: number | null;
  bulk_min_kg?: number | null;
  stock_status?: StockStatus;
  next_availability?: string | null;
  stock_quantity?: number | null;
  stock_threshold?: number | null;
  display_order?: number | null;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isValidNumber(
  value: unknown,
  options: { nullable?: boolean; min?: number } = {}
): boolean {
  if (value === null && options.nullable) return true;

  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= (options.min ?? 0)
  );
}

function isValidText(value: unknown, maxLength: number): boolean {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function validateOptionalFields(body: ProductPayload): string | null {
  if (
    body.price_standard !== undefined &&
    !isValidNumber(body.price_standard, { nullable: true })
  ) {
    return "Le prix standard doit être un entier positif ou nul.";
  }

  if (
    body.price_bulk !== undefined &&
    !isValidNumber(body.price_bulk, { nullable: true })
  ) {
    return "Le prix volume doit être un entier positif ou nul.";
  }

  if (
    body.bulk_min_kg !== undefined &&
    !isValidNumber(body.bulk_min_kg, { nullable: true, min: 1 })
  ) {
    return "Le seuil de volume doit être un entier supérieur à zéro.";
  }

  if (
    body.stock_quantity !== undefined &&
    !isValidNumber(body.stock_quantity, { nullable: true })
  ) {
    return "La quantité en stock doit être un entier positif ou nul.";
  }

  if (
    body.stock_threshold !== undefined &&
    !isValidNumber(body.stock_threshold, { nullable: true })
  ) {
    return "Le seuil de stock doit être un entier positif ou nul.";
  }

  if (
    body.display_order !== undefined &&
    !isValidNumber(body.display_order, { nullable: true })
  ) {
    return "L'ordre d'affichage doit être un entier positif ou nul.";
  }

  if (
    body.stock_status !== undefined &&
    !STOCK_STATUSES.includes(body.stock_status)
  ) {
    return "Statut invalide. Choisissez disponible, rupture ou indisponible.";
  }

  if (
    body.category !== undefined &&
    !CATEGORIES.includes(body.category)
  ) {
    return "Catégorie de produit invalide.";
  }

  if (
    body.unit !== undefined &&
    !UNITS.includes(body.unit)
  ) {
    return "Unité de vente invalide.";
  }

  if (
    body.product_group !== undefined &&
    body.product_group !== null &&
    typeof body.product_group !== "string"
  ) {
    return "Le groupe du produit est invalide.";
  }

  if (
    body.variant !== undefined &&
    body.variant !== null &&
    typeof body.variant !== "string"
  ) {
    return "La variante du produit est invalide.";
  }

  if (
    body.next_availability !== undefined &&
    body.next_availability !== null &&
    typeof body.next_availability !== "string"
  ) {
    return "La prochaine disponibilité est invalide.";
  }

  return null;
}

export async function GET() {
  try {
    if (!(await isAdminAuthed())) {
      return jsonError("Accès non autorisé.", 401);
    }

    const { data, error } = await supabaseAdmin()
      .from("products")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Erreur de lecture des produits :", error);
      return jsonError("Impossible de charger les produits.", 500);
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    console.error("Erreur API GET produits :", error);
    return jsonError("Une erreur est survenue.", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return jsonError("Accès non autorisé.", 401);
    }

    const body = (await request.json()) as ProductPayload;

    if (!isValidText(body.name, 120)) {
      return jsonError("Le nom du produit est obligatoire (120 caractères maximum).", 400);
    }

    if (!body.category || !CATEGORIES.includes(body.category)) {
      return jsonError("Veuillez sélectionner une catégorie valide.", 400);
    }

    if (!isValidText(body.product_group, 100)) {
      return jsonError("Le groupe du produit est obligatoire.", 400);
    }

    if (!body.unit || !UNITS.includes(body.unit)) {
      return jsonError("Veuillez sélectionner une unité de vente valide.", 400);
    }

    if (
      body.variant != null &&
      (typeof body.variant !== "string" || body.variant.length > 100)
    ) {
      return jsonError("La variante ne doit pas dépasser 100 caractères.", 400);
    }

    const validationError = validateOptionalFields(body);

    if (validationError) {
      return jsonError(validationError, 400);
    }

    const product = {
      name: body.name!.trim(),
      category: body.category,
      product_group: body.product_group!.trim().toLowerCase(),
      variant: body.variant?.trim() || null,
      unit: body.unit,
      price_standard: body.price_standard ?? null,
      price_bulk: body.price_bulk ?? null,
      bulk_min_kg: body.bulk_min_kg ?? 0,
      stock_status: body.stock_status ?? "indisponible",
      next_availability: body.next_availability?.trim() || null,
      stock_quantity: body.stock_quantity ?? 0,
      stock_threshold: body.stock_threshold ?? 0,
      display_order: body.display_order ?? 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin()
      .from("products")
      .insert(product)
      .select("*")
      .single();

    if (error) {
      console.error("Erreur de création du produit :", error);
      return jsonError("Impossible de créer le produit.", 500);
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    console.error("Erreur API POST produits :", error);
    return jsonError("Une erreur est survenue lors de la création.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return jsonError("Accès non autorisé.", 401);
    }

    const body = (await request.json()) as ProductPayload;

    if (!isValidText(body.id, 100)) {
      return jsonError("L'identifiant du produit est obligatoire.", 400);
    }

    const allowedFields = [
      "name",
      "category",
      "product_group",
      "variant",
      "unit",
      "price_standard",
      "price_bulk",
      "bulk_min_kg",
      "stock_status",
      "next_availability",
      "stock_quantity",
      "stock_threshold",
      "display_order",
    ] as const;

    const hasEditableField = allowedFields.some(
      (field) => body[field] !== undefined
    );

    if (!hasEditableField) {
      return jsonError("Aucune modification à enregistrer.", 400);
    }

    if (
      body.name !== undefined &&
      !isValidText(body.name, 120)
    ) {
      return jsonError("Le nom du produit est invalide.", 400);
    }

    if (
      body.product_group !== undefined &&
      !isValidText(body.product_group, 100)
    ) {
      return jsonError("Le groupe du produit est invalide.", 400);
    }

    if (
      body.variant !== undefined &&
      body.variant !== null &&
      (typeof body.variant !== "string" || body.variant.length > 100)
    ) {
      return jsonError("La variante ne doit pas dépasser 100 caractères.", 400);
    }

    const validationError = validateOptionalFields(body);

    if (validationError) {
      return jsonError(validationError, 400);
    }

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (typeof updates.name === "string") {
      updates.name = updates.name.trim();
    }

    if (typeof updates.product_group === "string") {
      updates.product_group = updates.product_group.trim().toLowerCase();
    }

    if (typeof updates.variant === "string") {
      updates.variant = updates.variant.trim() || null;
    }

    if (typeof updates.next_availability === "string") {
      updates.next_availability = updates.next_availability.trim() || null;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin()
      .from("products")
      .update(updates)
      .eq("id", body.id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Erreur de mise à jour du produit :", error);
      return jsonError("Impossible d'enregistrer le produit.", 500);
    }

    if (!data) {
      return jsonError("Produit introuvable.", 404);
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error("Erreur API PATCH produits :", error);
    return jsonError("Une erreur est survenue lors de la mise à jour.", 500);
  }
}
