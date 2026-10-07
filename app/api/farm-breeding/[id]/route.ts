import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

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
  const contentType = req.headers.get("content-type") || "";
  const sb = supabaseAdmin();

  // Vérifier que l'élevage existe
  const { data: existingItem, error: fetchError } = await sb
    .from("farm_breeding")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existingItem) {
    return NextResponse.json(
      { error: "Élevage introuvable." },
      { status: 404 }
    );
  }

  const updates: Record<string, unknown> = {};

  /*
   * ============================
   * FORM-DATA
   * ============================
   */
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    if (formData.get("name") !== null) {
      updates.name = String(formData.get("name") || "").trim();
    }

    if (formData.get("category") !== null) {
      updates.category = String(formData.get("category") || "").trim();
    }

    if (formData.get("description") !== null) {
      updates.description = String(
        formData.get("description") || ""
      ).trim();
    }

    // Statut
    if (formData.get("status") !== null) {
      const status = String(formData.get("status") || "");

      if (!["disponible", "bientot"].includes(status)) {
        return NextResponse.json(
          { error: "Statut invalide." },
          { status: 400 }
        );
      }

      updates.status = status;
    }

    // Position
    if (formData.get("position") !== null) {
      updates.position = Number(
        formData.get("position") || 0
      );
    }

    // Publication
    if (formData.get("published") !== null) {
      const publishedValue = String(
        formData.get("published")
      );

      updates.published = publishedValue === "true";
    }

    /*
     * ============================
     * NOUVELLE PHOTO
     * ============================
     */
    const file = formData.get("file");

    if (file instanceof File && file.size > 0) {
      // Vérification du type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Le fichier doit être une image." },
          { status: 400 }
        );
      }

      // Limite 25 Mo
      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json(
          {
            error:
              "Image trop volumineuse (25 Mo maximum).",
          },
          { status: 400 }
        );
      }

      const ext =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const path = `farm-breeding/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error: uploadError } = await sb.storage
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

      const { data: publicUrl } = sb.storage
        .from("media")
        .getPublicUrl(path);

      updates.photo_url = publicUrl.publicUrl;
      updates.photo_storage_path = path;

      /*
       * Supprimer l'ancienne photo après avoir
       * correctement préparé la nouvelle.
       */
      if (existingItem.photo_storage_path) {
        await sb.storage
          .from("media")
          .remove([existingItem.photo_storage_path]);
      }
    }
  }

  /*
   * ============================
   * JSON
   * ============================
   */
  else {
    const body = await req.json();

    if (body.name !== undefined) {
      updates.name = String(body.name).trim();
    }

    if (body.category !== undefined) {
      updates.category = String(body.category).trim();
    }

    if (body.description !== undefined) {
      updates.description = String(body.description).trim();
    }

    // Statut
    if (body.status !== undefined) {
      if (!["disponible", "bientot"].includes(body.status)) {
        return NextResponse.json(
          { error: "Statut invalide." },
          { status: 400 }
        );
      }

      updates.status = body.status;
    }

    // Position
    if (body.position !== undefined) {
      updates.position = Number(body.position);
    }

    // Publication
    if (body.published !== undefined) {
      updates.published = Boolean(body.published);
    }
  }

  /*
   * ============================
   * PROTECTION
   * ============================
   */

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Aucune modification à enregistrer." },
      { status: 400 }
    );
  }

  /*
   * ============================
   * MISE À JOUR SUPABASE
   * ============================
   */

  const { data, error } = await sb
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

/*
 * ============================
 * DELETE
 * ============================
 */

export async function DELETE(
  _req: NextRequest,
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

  // Récupérer l'élément avant suppression
  const { data: item, error: fetchError } = await sb
    .from("farm_breeding")
    .select("photo_storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !item) {
    return NextResponse.json(
      { error: "Élevage introuvable." },
      { status: 404 }
    );
  }

  // Supprimer la photo du Storage
  if (item.photo_storage_path) {
    await sb.storage
      .from("media")
      .remove([item.photo_storage_path]);
  }

  // Supprimer l'entrée
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
    ok: true,
  });
}
