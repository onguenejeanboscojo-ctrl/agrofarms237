import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const updates: {
      category?: string | null;
      caption?: string | null;
      position?: number;
      published?: boolean;
    } = {};

    if ("category" in body) {
      updates.category =
        typeof body.category === "string" && body.category.trim()
          ? body.category.trim()
          : null;
    }

    if ("caption" in body) {
      updates.caption =
        typeof body.caption === "string" && body.caption.trim()
          ? body.caption.trim()
          : null;
    }

    if ("position" in body) {
      const position = Number(body.position);

      if (!Number.isFinite(position)) {
        return NextResponse.json(
          { error: "La position doit être un nombre valide." },
          { status: 400 }
        );
      }

      updates.position = position;
    }

    if ("published" in body) {
      if (typeof body.published !== "boolean") {
        return NextResponse.json(
          { error: "La valeur de publication est invalide." },
          { status: 400 }
        );
      }

      updates.published = body.published;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Aucune modification valide reçue." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin()
      .from("media")
      .update(updates)
      .eq("id", params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const sb = supabaseAdmin();

  const { data: row, error: findError } = await sb
    .from("media")
    .select("storage_path")
    .eq("id", params.id)
    .single();

  if (findError) {
    return NextResponse.json(
      { error: findError.message },
      { status: 500 }
    );
  }

  if (row?.storage_path) {
    const { error: storageError } = await sb.storage
      .from("media")
      .remove([row.storage_path]);

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      );
    }
  }

  const { error } = await sb
    .from("media")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
