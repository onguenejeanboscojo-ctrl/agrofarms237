import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * DELETE
 * Supprime une photo d'un produit de l'accueil.
 *
 * La photo est supprimée :
 * 1. de Supabase Storage
 * 2. de la table home_product_media
 */
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "ID de la photo manquant.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /*
     * Récupère d'abord la photo pour connaître
     * son chemin dans Supabase Storage.
     */
    const { data: media, error: mediaError } =
      await supabase
        .from("home_product_media")
        .select(
          "id,home_product_id,url,storage_path,position"
        )
        .eq("id", id)
        .maybeSingle();

    if (mediaError) {
      console.error(
        "Erreur récupération photo produit Accueil :",
        mediaError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer la photo.",
        },
        { status: 500 }
      );
    }

    if (!media) {
      return NextResponse.json(
        {
          error: "Photo introuvable.",
        },
        { status: 404 }
      );
    }

    /*
     * Supprime le fichier du Storage.
     */
    if (media.storage_path) {
      const { error: storageError } =
        await supabase.storage
          .from("media")
          .remove([media.storage_path]);

      if (storageError) {
        console.error(
          "Erreur suppression fichier Storage :",
          storageError
        );

        /*
         * On continue malgré tout pour éviter
         * de laisser une entrée inutile en base.
         */
      }
    }

    /*
     * Supprime l'enregistrement en base.
     */
    const { error: deleteError } =
      await supabase
        .from("home_product_media")
        .delete()
        .eq("id", id);

    if (deleteError) {
      console.error(
        "Erreur suppression photo produit Accueil :",
        deleteError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de supprimer la photo.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Erreur inattendue suppression photo produit Accueil :",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
