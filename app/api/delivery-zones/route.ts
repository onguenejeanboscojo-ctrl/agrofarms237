import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

// GET : récupérer les quartiers publiés
// ou tous les quartiers pour l'Admin
export async function GET(req: NextRequest) {
  const admin = isAdminAuthed();

  const { data, error } = await supabaseAdmin()
    .from("delivery_zones")
    .select("*")
    .order("zone", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const zones = admin
    ? data
    : (data || []).filter((item) => item.published === true);

  return NextResponse.json({ zones });
}

// POST : ajouter un quartier
export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const name = String(body.name || "").trim();
  const zone = Number(body.zone);
  const fee = Number(body.fee);
  const published = body.published !== false;

  if (!name) {
    return NextResponse.json(
      { error: "Le nom du quartier est obligatoire." },
      { status: 400 }
    );
  }

  if (![1, 2, 3].includes(zone)) {
    return NextResponse.json(
      { error: "La zone doit être 1, 2 ou 3." },
      { status: 400 }
    );
  }

  if (!Number.isFinite(fee) || fee < 0) {
    return NextResponse.json(
      { error: "Le tarif de livraison est invalide." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("delivery_zones")
    .insert({
      name,
      zone,
      fee,
      published,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ zone: data }, { status: 201 });
}

// PATCH : modifier un quartier
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const id = String(body.id || "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "Identifiant du quartier manquant." },
      { status: 400 }
    );
  }

  const fields: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();

    if (!name) {
      return NextResponse.json(
        { error: "Le nom du quartier est obligatoire." },
        { status: 400 }
      );
    }

    fields.name = name;
  }

  if (body.zone !== undefined) {
    const zone = Number(body.zone);

    if (![1, 2, 3].includes(zone)) {
      return NextResponse.json(
        { error: "La zone doit être 1, 2 ou 3." },
        { status: 400 }
      );
    }

    fields.zone = zone;
  }

  if (body.fee !== undefined) {
    const fee = Number(body.fee);

    if (!Number.isFinite(fee) || fee < 0) {
      return NextResponse.json(
        { error: "Le tarif de livraison est invalide." },
        { status: 400 }
      );
    }

    fields.fee = fee;
  }

  if (body.published !== undefined) {
    fields.published = Boolean(body.published);
  }

  fields.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin()
    .from("delivery_zones")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ zone: data });
}

// DELETE : supprimer un quartier
export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const id = String(body.id || "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "Identifiant du quartier manquant." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin()
    .from("delivery_zones")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
