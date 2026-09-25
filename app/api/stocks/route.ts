import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin()
    .from("products")
    .select(
      "id, name, stock_quantity, stock_threshold, stock_status, next_availability"
    )
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ stocks: data });
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  const { id, stock_quantity, stock_threshold } = body;

  if (!id) {
    return NextResponse.json(
      { error: "ID du produit requis" },
      { status: 400 }
    );
  }

  if (
    typeof stock_quantity !== "number" ||
    typeof stock_threshold !== "number" ||
    stock_quantity < 0 ||
    stock_threshold < 0
  ) {
    return NextResponse.json(
      { error: "Quantités invalides" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin()
    .from("products")
    .update({
      stock_quantity,
      stock_threshold,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
