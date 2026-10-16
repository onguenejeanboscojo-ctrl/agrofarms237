
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const BUCKET = "media";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

// =====================================================
// GET — RÉCUPÉRER LES MÉDIAS PUBLIÉS
// =====================================================

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select("*")
      .eq("published", true)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return errorResponse(
        `Impossible de charger les médias : ${error.message}`,
        500
      );
    }

    return NextResponse.json({
      items: data || [],
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Une erreur inattendue est survenue lors du chargement.",
      500
    );
  }
}

// =====================================================
// POST — AJOUTER UNE PHOTO OU UNE VIDÉO
// =====================================================

export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return errorResponse(
      "Session administrateur invalide. Reconnecte-toi.",
      401
    );
  }

  let uploadedPath: string | null = null;

  try {
    const form = await req.formData();
    const file = form.get("file");

    const kind = String(form.get("kind") || "photo");

    const siteLocation = String(
      form.get("site_location") || form.get("category") || ""
    ).trim();

    const category = String(
      form.get("category") || siteLocation
    ).trim();

    const caption = String(form.get("caption") || "").trim();

    const galleryEnabled =
      String(form.get("gallery_enabled")) === "true";

    const galleryCategory = String(
      form.get("gallery_category") || ""
    ).trim();

    // Vérifier le fichier
    if (!(file instanceof File)) {
      return errorResponse(
        "Aucun fichier reçu. Sélectionne une photo ou une vidéo.",
        400
      );
    }

    if (!siteLocation) {
      return errorResponse(
        "Choisis un emplacement pour ce média.",
        400
      );
    }

    if (kind !== "photo" && kind !== "video") {
      return errorResponse(
        "Type de média invalide.",
        400
      );
    }

    if (file.size === 0) {
      return errorResponse(
        "Le fichier sélectionné est vide.",
        400
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(
        "Le fichier dépasse la taille maximale de 25 Mo.",
        413
      );
    }

    if (
      (kind === "photo" && !file.type.startsWith("image/")) ||
      (kind === "video" && !file.type.startsWith("video/"))
    ) {
      return errorResponse(
        kind === "photo"
          ? "Le fichier sélectionné n'est pas une image valide."
          : "Le fichier sélectionné n'est pas une vidéo valide.",
        400
      );
    }

    if (galleryEnabled && !galleryCategory) {
      return errorResponse(
        "Choisis une rubrique pour la galerie publique.",
        400
      );
    }

    const supabase = supabaseAdmin();

    // Nom de fichier unique pour éviter les collisions
    const originalName =
      file.name.split(/[\\/]/).pop() || "media";

    const extension =
      originalName.match(/\.([a-zA-Z0-9]{1,10})$/)?.[1];

    const safeExtension = extension
      ? `.${extension.toLowerCase()}`
      : "";

    const storagePath =
      `${Date.now()}-${crypto.randomUUID()}${safeExtension}`;

    // Envoyer le fichier dans Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return errorResponse(
        `Impossible de stocker le fichier : ${uploadError.message}`,
        500
      );
    }

    uploadedPath = storagePath;

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    if (!publicData.publicUrl) {
      return errorResponse(
        "Le fichier a été stocké, mais son URL publique est indisponible.",
        500
      );
    }

    // Enregistrer les informations du média dans la base
    const { data: inserted, error: insertError } = await supabase
      .from("media")
      .insert({
        url: publicData.publicUrl,
        storage_path: storagePath,
        kind,
        category: category || siteLocation,
        site_location: siteLocation,
        gallery_enabled: galleryEnabled,
        gallery_category: galleryEnabled
          ? galleryCategory
          : null,
        caption: caption || null,
        published: true,

        // IMPORTANT :
        // Ne pas utiliser Date.now() ici.
        // La colonne position est un entier PostgreSQL.
        position: 0,
      })
      .select("*")
      .single();

    if (insertError) {
      return errorResponse(
        `Le fichier a été envoyé, mais son enregistrement a échoué : ${insertError.message}`,
        500
      );
    }

    // L'enregistrement a réussi : conserver le fichier.
    uploadedPath = null;

    return NextResponse.json(
      {
        ok: true,
        item: inserted,
        message: "Votre média a été ajouté avec succès.",
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? `Impossible de téléverser ce média : ${error.message}`
        : "Une erreur inattendue a empêché le téléversement.",
      500
    );
  } finally {
    // Nettoyer le fichier si l'envoi a réussi mais que
    // l'enregistrement en base a échoué.
    if (uploadedPath) {
      try {
        await supabaseAdmin()
          .storage.from(BUCKET)
          .remove([uploadedPath]);
      } catch {
        // L'erreur principale sera conservée.
      }
    }
  }
}
