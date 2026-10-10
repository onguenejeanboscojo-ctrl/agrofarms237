
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

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
type Category = (typeof CATEGORIES)[number];
type Unit = (typeof UNITS)[number];

type ProductPayload = {
  id?: string;
  name?: string;
  category?: Category;
  product_group?: string | null;
  variant?: string | null;
  unit?: Unit;
  price_standard?: number | null;
  price_bulk?: number | null;
  bulk_min_kg?: number | null;
  stock_status?: StockStatus;
  next_availability?: string | null;
};

const ERROR_MESSAGES = {
  unauthorized: "Accès non autorisé.",
  server: "Une erreur est survenue sur le serveur.",
  invalidData: "Les données du produit sont invalides.",
  notFound: "Produit introuvable.",
};

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function checkAdmin() {
  try {
    return Boolean(await isAdminAuthed());
  } catch {
    return false;
  }
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeNullableNumber(
  value: unknown
): number | null | undefined {
  if (value === null || value === "") return null;

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  if (value < 0) return undefined;

  return value;
}

function isValidCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category);
}

function isValidUnit(value: unknown): value is Unit {
  return UNITS.includes(value as Unit);
}

function isValidStockStatus(value: unknown): value is StockStatus {
  return STOCK_STATUSES.includes(value as StockStatus);
}

/**
 * Règles métier :
 * - Un porcelet se vend uniquement à la pièce.
 * - Un porcelet ne peut pas être configuré comme produit fumé.
 * - Les autres produits conservent leurs unités respectives.
 */
function validateProductRules(
  product: ProductPayload
): string | null {
  const group = normalizeText(product.product_group)?.toLowerCase() ?? "";
  const name = normalizeText(product.name)?.toLowerCase() ?? "";
  const variant = normalizeText(product.variant)?.toLowerCase() ?? "";

  const isPorcelet =
    group === "porcelet" ||
    name.includes("porcelet");

  if (isPorcelet) {
    if (product.unit !== "piece") {
      return "Le porcelet doit obligatoirement être vendu à la pièce.";
    }

    if (variant.includes("fum")) {
      return "Le porcelet ne peut pas être configuré comme produit fumé.";
    }

    if (group && group !== "porcelet") {
      return "Le groupe du produit doit être « porcelet ».";
    }
  }

  return null;
}

function validateProductPayload(
  payload: ProductPayload,
  partial = false
): string | null {
  if (!payload || typeof payload !== "object") {
    return ERROR_MESSAGES.invalidData;
  }

  if (!partial || payload.name !== undefined) {
    if (!normalizeText(payload.name)) {
      return "Le nom du produit est obligatoire.";
    }
  }

  if (!partial || payload.category !== undefined) {
    if (!isValidCategory(payload.category)) {
      return "La catégorie du produit est invalide.";
    }
  }

  if (payload.unit !== undefined && !isValidUnit(payload.unit)) {
    return "L'unité de vente est invalide.";
  }

  if (
    payload.stock_status !== undefined &&
    !isValidStockStatus(payload.stock_status)
  ) {
    return "Le statut du stock est invalide.";
  }

  for (const field of [
    "price_standard",
    "price_bulk",
    "bulk_min_kg",
  ] as const) {
    if (payload[field] !== undefined) {
      const value = normalizeNullableNumber(payload[field]);

      if (value === undefined) {
        return `La valeur du champ ${field} est invalide.`;
      }
    }
  }

  if (
    payload.product_group !== undefined &&
    payload.product_group !== null &&
    typeof payload.product_group !== "string"
  ) {
    return "Le groupe du produit est invalide.";
  }

  if (
    payload.variant !== undefined &&
    payload.variant !== null &&
    typeof payload.variant !== "string"
  ) {
    return "La variante du produit est invalide.";
  }

  if (
    payload.next_availability !== undefined &&
    payload.next_availability !== null &&
    typeof payload.next_availability !== "string"
  ) {
    return "La date de disponibilité est invalide.";
  }

  const ruleError = validateProductRules(payload);

  if (ruleError) {
    return ruleError;
  }

  return null;
}

function sanitizeProductPayload(
  payload: ProductPayload,
  partial = false
) {
  const clean: Record<string, unknown> = {};

  const fields = [
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
  ] as const;

  for (const field of fields) {
    if (payload[field] === undefined) continue;

    if (
      field === "name" ||
      field === "product_group" ||
      field === "variant"
    ) {
      clean[field] =
        field === "name"
          ? normalizeText(payload[field])
          : normalizeText(payload[field]);
    } else if (
      field === "price_standard" ||
      field === "price_bulk" ||
      field === "bulk_min_kg"
    ) {
      clean[field] = normalizeNullableNumber(payload[field]);
    } else if (field === "next_availability") {
      clean[field] = normalizeText(payload[field]);
    } else {
      clean[field] = payload[field];
    }
  }

  return clean;
}

/**
 * GET /api/products
 * Récupère le catalogue destiné à l'administration.
 */
export async function GET() {
  if (!(await checkAdmin())) {
    return errorResponse(ERROR_MESSAGES.unauthorized, 401);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("GET /api/products:", error);
      return errorResponse(ERROR_MESSAGES.server, 500);
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    console.error("GET /api/products exception:", error);
    return errorResponse(ERROR_MESSAGES.server, 500);
  }
}

/**
 * POST /api/products
 * Crée un produit.
 */
export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) {
    return errorResponse(ERROR_MESSAGES.unauthorized, 401);
  }

  try {
    const payload = (await request.json()) as ProductPayload;

    const validationError = validateProductPayload(payload);

    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const product = sanitizeProductPayload(payload);

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(product)
      .select("*")
      .single();

    if (error) {
      console.error("POST /api/products:", error);
      return errorResponse(ERROR_MESSAGES.server, 500);
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products exception:", error);
    return errorResponse(ERROR_MESSAGES.invalidData, 400);
  }
}

/**
 * PATCH /api/products
 * Modifie un produit existant.
 * L'identifiant doit être envoyé dans le corps JSON.
 */
export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) {
    return errorResponse(ERROR_MESSAGES.unauthorized, 401);
  }

  try {
    const payload = (await request.json()) as ProductPayload;

    if (!payload.id || typeof payload.id !== "string") {
      return errorResponse("L'identifiant du produit est obligatoire.");
    }

    const { id, ...updates } = payload;

    if (Object.keys(updates).length === 0) {
      return errorResponse("Aucune modification à enregistrer.");
    }

    const validationError = validateProductPayload(
      updates,
      true
    );

    if (validationError) {
      return errorResponse(validationError, 400);
    }

    // Récupérer le produit existant pour valider les règles
    // métier même lorsque tous les champs ne sont pas envoyés.
    const { data: existingProduct, error: lookupError } =
      await supabaseAdmin
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (lookupError) {
      console.error("PATCH /api/products lookup:", lookupError);
      return errorResponse(ERROR_MESSAGES.server, 500);
    }

    if (!existingProduct) {
      return errorResponse(ERROR_MESSAGES.notFound, 404);
    }

    const mergedProduct: ProductPayload = {
      ...existingProduct,
      ...updates,
    };

    const ruleError = validateProductRules(mergedProduct);

    if (ruleError) {
      return errorResponse(ruleError, 400);
    }

    const cleanUpdates = sanitizeProductPayload(updates, true);

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(cleanUpdates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("PATCH /api/products update:", error);
      return errorResponse(ERROR_MESSAGES.server, 500);
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error("PATCH /api/products exception:", error);
    return errorResponse(ERROR_MESSAGES.invalidData, 400);
  }
}
