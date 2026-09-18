import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

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

  if (!id) {
    return NextResponse.json(
      { error: "Identifiant de la photo manquant." },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  // Récupérer la photo avant suppression
  const { data: media, error: fetchError } = await sb
    .from("farm_breeding_media")
    .select("id, storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !media) {
    return NextResponse.json(
      { error: "Photo introuvable." },
      { status: 404 }
    );
  }

  // Supprimer le fichier du Storage
  if (media.storage_path) {
    const { error: storageError } = await sb.storage
      .from("media")
      .remove([media.storage_path]);

    if (storageError) {
      return NextResponse.json(
        {
          error:
            "Impossible de supprimer le fichier du stockage : " +
            storageError.message,
        },
        { status: 500 }
      );
    }
  }

  // Supprimer l'enregistrement de la base
  const { error: deleteError } = await sb
    .from("farm_breeding_media")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}
