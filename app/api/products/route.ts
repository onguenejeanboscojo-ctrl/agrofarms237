
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

const ALLOWED_STATUSES = [
  "disponible",
  "stock_limite",
  "indisponible",
] as const;

function isValidNumberOrNull(value: unknown): boolean {
  return (
    value === null ||
    (typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0)
  );
}

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("products")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ products: data });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";
    const productGroup =
      typeof body.product_group === "string"
        ? body.product_group.trim()
        : "";
    const variant =
      typeof body.variant === "string"
        ? body.variant.trim()
        : "";
    const unit =
      typeof body.unit === "string" ? body.unit.trim() : "";

    if (!name || !category || !productGroup || !unit) {
      return NextResponse.json(
        {
          error:
            "Le nom, la catégorie, le groupe et l'unité sont obligatoires.",
        },
        { status: 400 }
      );
    }

    if (
      name.length > 120 ||
      category.length > 100 ||
      productGroup.length > 100 ||
      variant.length > 100 ||
      unit.length > 30
    ) {
      return NextResponse.json(
        { error: "Un des champs texte est trop long." },
        { status: 400 }
      );
    }

    const priceStandard = body.price_standard ?? null;
    const priceBulk = body.price_bulk ?? null;
    const bulkMinKg = body.bulk_min_kg ?? null;

    if (
      !isValidNumberOrNull(priceStandard) ||
      !isValidNumberOrNull(priceBulk) ||
      !isValidNumberOrNull(bulkMinKg)
    ) {
      return NextResponse.json(
        { error: "Les prix et le seuil doivent être positifs ou vides." },
        { status: 400 }
      );
    }

    const stockStatus =
      body.stock_status ?? "indisponible";

    if (
      !ALLOWED_STATUSES.includes(stockStatus)
    ) {
      return NextResponse.json(
        { error: "Statut de disponibilité invalide." },
        { status: 400 }
      );
    }

    const stockQuantity = body.stock_quantity ?? 0;
    const stockThreshold = body.stock_threshold ?? 0;
    const displayOrder = body.display_order ?? 99;

    if (
      !isValidNumberOrNull(stockQuantity) ||
      !isValidNumberOrNull(stockThreshold) ||
      !Number.isInteger(displayOrder) ||
      displayOrder < 0
    ) {
      return NextResponse.json(
        { error: "Valeurs de stock ou d'ordre invalides." },
        { status: 400 }
      );
    }

    const nextAvailability =
      typeof body.next_availability === "string"
        ? body.next_availability.trim() || null
        : null;

    const { data, error } = await supabaseAdmin()
      .from("products")
      .insert({
        name,
        category,
        product_group: productGroup,
        variant: variant || null,
        unit,
        price_standard: priceStandard,
        price_bulk: priceBulk,
        bulk_min_kg: bulkMinKg,
        stock_status: stockStatus,
        next_availability: nextAvailability,
        stock_quantity: stockQuantity,
        stock_threshold: stockThreshold,
        display_order: displayOrder,
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      console.error("Erreur création produit :", error);

      return NextResponse.json(
        { error: "Impossible de créer le produit." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, product: data },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, ...fields } = body;

    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "Identifiant produit invalide." },
        { status: 400 }
      );
    }

    const allowedFields = [
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
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in fields) {
        updates[field] = fields[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Aucune modification valide." },
        { status: 400 }
      );
    }

    if (
      "stock_status" in updates &&
      !ALLOWED_STATUSES.includes(
        updates.stock_status as (typeof ALLOWED_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Statut de disponibilité invalide." },
        { status: 400 }
      );
    }

    for (const field of [
      "price_standard",
      "price_bulk",
      "bulk_min_kg",
      "stock_quantity",
      "stock_threshold",
    ]) {
      if (
        field in updates &&
        !isValidNumberOrNull(updates[field])
      ) {
        return NextResponse.json(
          { error: `Valeur invalide pour ${field}.` },
          { status: 400 }
        );
      }
    }

    if (
      "display_order" in updates &&
      (!Number.isInteger(updates.display_order) ||
        (updates.display_order as number) < 0)
    ) {
      return NextResponse.json(
        { error: "Ordre d'affichage invalide." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin()
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Produit introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }
}
