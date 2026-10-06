import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("media")
    .select("*")
    .order("position")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    items: data || [],
  });
}

// ============================================================
// UPLOAD D'UN MÉDIA
// ============================================================

export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const form = await req.formData();

    const file = form.get("file") as File | null;

    const kind =
      (form.get("kind") as string) || "photo";

    const category =
      (form.get("category") as string) || null;

    const caption =
      (form.get("caption") as string) || null;

    /*
     * Nouveaux champs :
     * - emplacement principal sur le site
     * - présence éventuelle dans la Galerie
     * - rubrique de Galerie
     */
    const siteLocation =
      (form.get("site_location") as string) || null;

    const galleryEnabled =
      form.get("gallery_enabled") === "true";

    const galleryCategory =
      (form.get("gallery_category") as string) || null;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    if (!["photo", "video"].includes(kind)) {
      return NextResponse.json(
        { error: "Type de média invalide." },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        {
          error:
            "Fichier trop volumineux (25 Mo max).",
        },
        { status: 400 }
      );
    }

    /*
     * Si le média n'est pas destiné à la Galerie,
     * on ne conserve aucune rubrique Galerie.
     */
    const finalGalleryCategory = galleryEnabled
      ? galleryCategory
      : null;

    const sb = supabaseAdmin();

    const ext =
      file.name.split(".").pop() || "bin";

    const path = `${kind}s/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    // --------------------------------------------------------
    // Upload Storage
    // --------------------------------------------------------

    const { error: uploadError } =
      await sb.storage
        .from("media")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrl } =
      sb.storage
        .from("media")
        .getPublicUrl(path);

    // --------------------------------------------------------
    // Position suivante
    // --------------------------------------------------------

    const { data: lastMedia } = await sb
      .from("media")
      .select("position")
      .order("position", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    const nextPosition =
      typeof lastMedia?.position === "number"
        ? lastMedia.position + 1
        : 0;

    // --------------------------------------------------------
    // Création de la ligne média
    // --------------------------------------------------------

    const { data, error } = await sb
      .from("media")
      .insert({
        url: publicUrl.publicUrl,
        storage_path: path,
        kind,
        category,
        caption,

        // Nouveaux champs
        site_location: siteLocation,
        gallery_enabled: galleryEnabled,
        gallery_category: finalGalleryCategory,

        published: true,
        position: nextPosition,
      })
      .select()
      .single();

    if (error) {
      /*
       * Si l'insertion échoue après l'upload,
       * on tente de supprimer le fichier pour
       * éviter de laisser un fichier orphelin.
       */
      await sb.storage
        .from("media")
        .remove([path]);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      item: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Une erreur est survenue.",
      },
      { status: 500 }
    );
  }
}
