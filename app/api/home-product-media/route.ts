import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const BUCKET = "media";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getExtension(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

/**
 * GET
 * Récupère une photo précise.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Identifiant de la photo obligatoire." },
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
        "Erreur récupération photo produit :",
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
      "Erreur inattendue récupération photo produit :",
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
 * Remplace une photo existante.
 *
 * La nouvelle photo est envoyée avec :
 * multipart/form-data
 * file = nouvelle image
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
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
        { error: "Identifiant de la photo obligatoire." },
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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format invalide. Utilisez JPG, PNG ou WebP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "La photo ne doit pas dépasser 25 Mo.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /*
     * Récupère l'ancienne photo.
     */
    const { data: existing, error: existingError } =
      await supabase
        .from("home_product_media")
        .select(
          "id,home_product_id,storage_path,position"
        )
        .eq("id", id)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Erreur recherche ancienne photo :",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de rechercher l'ancienne photo.",
        },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Photo introuvable." },
        { status: 404 }
      );
    }

    const extension = getExtension(file.type);

    const randomPart = Math.random()
      .toString(36)
      .slice(2, 10);

    const storagePath =
      `home-products/${existing.home_product_id}/` +
      `${Date.now()}-${randomPart}.${extension}`;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    /*
     * Upload de la nouvelle photo.
     */
    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Erreur upload nouvelle photo :",
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

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    const url =
      publicUrlData?.publicUrl;

    if (!url) {
      await supabase.storage
        .from(BUCKET)
        .remove([storagePath]);

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer l'URL de la nouvelle photo.",
        },
        { status: 500 }
      );
    }

    /*
     * Met à jour la ligne en conservant
     * le produit et la position.
     */
    const { data, error } = await supabase
      .from("home_product_media")
      .update({
        url,
        storage_path: storagePath,
      })
      .eq("id", id)
      .select(
        "id,home_product_id,url,storage_path,position,created_at"
      )
      .single();

    if (error) {
      console.error(
        "Erreur mise à jour photo produit :",
        error
      );

      /*
       * Nettoyage de la nouvelle photo
       * si la base échoue.
       */
      await supabase.storage
        .from(BUCKET)
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
     * Supprime l'ancienne photo du Storage.
     */
    if (existing.storage_path) {
      await supabase.storage
        .from(BUCKET)
        .remove([existing.storage_path]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Erreur inattendue remplacement photo produit :",
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
 * Supprime une photo existante.
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
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
        { error: "Identifiant de la photo obligatoire." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /*
     * Récupère la photo avant suppression.
     */
    const { data: existing, error: existingError } =
      await supabase
        .from("home_product_media")
        .select("id,storage_path")
        .eq("id", id)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Erreur recherche photo à supprimer :",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de rechercher la photo.",
        },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Photo introuvable." },
        { status: 404 }
      );
    }

    /*
     * Supprime le fichier du Storage.
     */
    if (existing.storage_path) {
      const { error: storageError } =
        await supabase.storage
          .from(BUCKET)
          .remove([existing.storage_path]);

      if (storageError) {
        console.error(
          "Erreur suppression fichier Storage :",
          storageError
        );
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
        "Erreur suppression photo produit :",
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
      "Erreur inattendue suppression photo produit :",
      error
    );

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
