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
 * GET
 * Récupère une photo d'un produit de l'accueil.
 */
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID de la photo manquant." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("home_product_media")
      .select(
        "id,home_product_id,url,storage_path,position,created_at"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        "Erreur récupération photo produit Accueil :",
        error
      );

      return NextResponse.json(
        { error: "Impossible de récupérer la photo." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Photo introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Erreur inattendue récupération photo produit Accueil :",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

/**
 * PATCH
 * Remplace la photo d'un produit de l'accueil.
 *
 * La nouvelle photo est d'abord envoyée dans Storage,
 * puis l'enregistrement en base est mis à jour.
 */
export async function PATCH(
  request: Request,
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
        { error: "ID de la photo manquant." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucune nouvelle photo fournie." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format non accepté. Utilisez JPG, PNG ou WebP.",
        },
        { status: 400 }
      );
    }

    const MAX_SIZE = 25 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error:
            "La photo est trop lourde. Maximum : 25 Mo.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /*
     * Récupère l'ancienne photo.
     */
    const { data: existingMedia, error: mediaError } =
      await supabase
        .from("home_product_media")
        .select(
          "id,home_product_id,url,storage_path,position"
        )
        .eq("id", id)
        .maybeSingle();

    if (mediaError) {
      console.error(
        "Erreur récupération ancienne photo produit Accueil :",
        mediaError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer l'ancienne photo.",
        },
        { status: 500 }
      );
    }

    if (!existingMedia) {
      return NextResponse.json(
        { error: "Photo introuvable." },
        { status: 404 }
      );
    }

    /*
     * Détermine l'extension.
     */
    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
        ? "webp"
        : "jpg";

    /*
     * Nouveau chemin Storage.
     */
    const storagePath =
      `media/home-products/${existingMedia.home_product_id}/` +
      `${existingMedia.id}-${Date.now()}.${extension}`;

    /*
     * Conversion du fichier.
     */
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    /*
     * Upload de la nouvelle photo.
     */
    const { error: uploadError } =
      await supabase.storage
        .from("media")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Erreur upload nouvelle photo produit Accueil :",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'envoyer la nouvelle photo.",
        },
        { status: 500 }
      );
    }

    /*
     * URL publique.
     */
    const { data: publicUrlData } =
      supabase.storage
        .from("media")
        .getPublicUrl(storagePath);

    const publicUrl =
      publicUrlData.publicUrl;

    /*
     * Mise à jour de la base.
     */
    const { data: updatedMedia, error: updateError } =
      await supabase
        .from("home_product_media")
        .update({
          url: publicUrl,
          storage_path: storagePath,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(
          "id,home_product_id,url,storage_path,position,created_at"
        )
        .single();

    if (updateError) {
      console.error(
        "Erreur mise à jour photo produit Accueil :",
        updateError
      );

      /*
       * Si la base échoue, on supprime
       * la nouvelle photo qui vient d'être uploadée.
       */
      await supabase.storage
        .from("media")
        .remove([storagePath]);

      return NextResponse.json(
        {
          error:
            "Impossible de mettre à jour la photo.",
        },
        { status: 500 }
      );
    }

    /*
     * Suppression de l'ancienne photo.
     */
    if (existingMedia.storage_path) {
      const { error: removeOldError } =
        await supabase.storage
          .from("media")
          .remove([
            existingMedia.storage_path,
          ]);

      if (removeOldError) {
        console.error(
          "Erreur suppression ancienne photo produit Accueil :",
          removeOldError
        );
      }
    }

    return NextResponse.json({
      success: true,
      media: updatedMedia,
    });
  } catch (error) {
    console.error(
      "Erreur inattendue remplacement photo produit Accueil :",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

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
        { error: "ID de la photo manquant." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /*
     * Récupère la photo.
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
     * Suppression du fichier Storage.
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
      }
    }

    /*
     * Suppression de l'entrée en base.
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
