
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const BUCKET = "media";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

// Récupération des médias publiés
export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("media")
    .select("*")
    .eq("published", true)
    .order("position")
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(
      `Impossible de charger les médias : ${error.message}`,
      500
    );
  }

  return NextResponse.json({ items: data || [] });
}

// Téléversement d'un média depuis l'administration
export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return errorResponse("Session administrateur invalide. Reconnecte-toi.", 401);
  }

  let uploadedPath: string | null = null;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const kindValue = String(form.get("kind") || "photo");
    const siteLocation = String(
      form.get("site_location") || form.get("category") || ""
    ).trim();
    const category = String(
      form.get("category") || siteLocation
    ).trim();
    const caption = String(form.get("caption") || "").trim();
    const galleryEnabled = String(form.get("gallery_enabled")) === "true";
    const galleryCategory = String(
      form.get("gallery_category") || ""
    ).trim();

    if (!(file instanceof File)) {
      return errorResponse("Aucun fichier reçu. Sélectionne une photo ou une vidéo.", 400);
    }

    if (!siteLocation) {
      return errorResponse("Aucun emplacement du site n'a été sélectionné.", 400);
    }

    if (kindValue !== "photo" && kindValue !== "video") {
      return errorResponse("Type de média invalide. Choisis une photo ou une vidéo.", 400);
    }

    if (file.size === 0) {
      return errorResponse("Le fichier est vide. Choisis un autre fichier.", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("Le fichier dépasse la limite de 25 Mo.", 413);
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (
      (kindValue === "photo" && !isImage) ||
      (kindValue === "video" && !isVideo)
    ) {
      return errorResponse(
        kindValue === "photo"
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
    const originalName = file.name.split(/[\\/]/).pop() || "media";
    const extension = originalName.match(/\.([a-zA-Z0-9]{1,10})$/)?.[1]
      ?.toLowerCase();

    const safeExtension = extension ? `.${extension}` : "";
    const storagePath = `${Date.now()}-${crypto.randomUUID()}${safeExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return errorResponse(
        `Échec du stockage du fichier : ${uploadError.message}`,
        500
      );
    }

    uploadedPath = storagePath;

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    if (!publicData.publicUrl) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return errorResponse(
        "Le fichier a été stocké, mais son URL publique n'a pas pu être créée. Vérifie la configuration du stockage.",
        500
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("media")
      .insert({
        url: publicData.publicUrl,
        storage_path: storagePath,
        kind: kindValue,
        category: category || siteLocation,
        site_location: siteLocation,
        gallery_enabled: galleryEnabled,
        gallery_category: galleryEnabled ? galleryCategory : null,
        caption: caption || null,
        published: true,
        position: Date.now(),
      })
      .select("*")
      .single();

    if (insertError) {
      await supabase.storage.from(BUCKET).remove([storagePath]);

      return errorResponse(
        `Le fichier a été envoyé, mais son enregistrement a échoué : ${insertError.message}`,
        500
      );
    }

    uploadedPath = null;

    return NextResponse.json(
      {
        ok: true,
        item: inserted,
        message: "Le média a été ajouté avec succès.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (uploadedPath) {
      await supabaseAdmin()
        .storage.from(BUCKET)
        .remove([uploadedPath]);
    }

    return errorResponse(
      error instanceof Error
        ? `Impossible de téléverser ce média : ${error.message}`
        : "Une erreur inattendue a empêché le téléversement.",
      500
    );
  }
}
