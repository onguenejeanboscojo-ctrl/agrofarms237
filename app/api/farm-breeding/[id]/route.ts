import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.category !== undefined)
    updates.category = String(body.category).trim();
  if (body.description !== undefined)
    updates.description = String(body.description).trim();
  if (body.status !== undefined) {
    if (!["disponible", "bientot"].includes(body.status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    updates.status = body.status;
  }

  if (body.position !== undefined) {
    updates.position = Number(body.position);
  }

  if (body.published !== undefined) {
    updates.published = Boolean(body.published);
  }

  const { data, error } = await supabaseAdmin()
    .from("farm_breeding")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    item: data,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const sb = supabaseAdmin();

  // Récupérer l'élevage avant suppression
  const { data: item, error: fetchError } = await sb
    .from("farm_breeding")
    .select("id, photo_storage_path")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message },
      { status: 404 }
    );
  }

  // Supprimer la photo du stockage si elle existe
  if (item?.photo_storage_path) {
    await sb.storage
      .from("media")
      .remove([item.photo_storage_path]);
  }

  // Supprimer l'élevage
  const { error } = await sb
    .from("farm_breeding")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}
