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

  // Récupérer l'élevage existant
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
   * ---------------------------------------------------------
   * MODIFICATION AVEC PHOTO
   * ---------------------------------------------------------
   */
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    if (formData.get("name") !== null) {
      updates.name = String(formData.get("name") || "").trim();
    }

    if (formData.get("category") !== null) {
      updates.category = String(
        formData.get("category") || ""
      ).trim();
    }

    if (formData.get("description") !== null) {
      updates.description = String(
        formData.get("description") || ""
      ).trim();
    }

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

    if (formData.get("position") !== null) {
      updates.position = Number(
        formData.get("position") || 0
      );
    }

    if (formData.get("published") !== null) {
      const publishedValue = String(
        formData.get("published")
      );

      updates.published = publishedValue === "true";
    }

    /*
     * -------------------------------------------------------
     * NOUVELLE PHOTO
     * -------------------------------------------------------
     */
    const file = formData.get("file");

    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Le fichier doit être une image." },
          { status: 400 }
        );
      }

      const maxSize = 25 * 1024 * 1024;

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error:
              "La photo ne doit pas dépasser 25 Mo.",
          },
          { status: 400 }
        );
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `farm-breeding/${id}-${Date.now()}.${extension}`;

      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const { error: uploadError } = await sb.storage
        .from("media")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      const {
        data: publicUrlData,
      } = sb.storage
        .from("media")
        .getPublicUrl(filePath);

      updates.photo_url = publicUrlData.publicUrl;
      updates.photo_storage_path = filePath;

      /*
       * Supprimer l'ancienne photo après
       * avoir enregistré la nouvelle.
       */
      if (existingItem.photo_storage_path) {
        await sb.storage
          .from("media")
          .remove([
            existingItem.photo_storage_path,
          ]);
      }
    }
  }

  /*
   * ---------------------------------------------------------
   * MODIFICATION CLASSIQUE JSON
   * ---------------------------------------------------------
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
      updates.description = String(
        body.description
      ).trim();
    }

    if (body.status !== undefined) {
      if (
        !["disponible", "bientot"].includes(
          body.status
        )
      ) {
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
      updates.published = Boolean(
        body.published
      );
    }
  }

  updates.updated_at = new Date().toISOString();

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
 * =========================================================
 * SUPPRESSION D'UN ÉLEVAGE
 * =========================================================
 */

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

  const { data: item, error: fetchError } = await sb
    .from("farm_breeding")
    .select("id, photo_storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !item) {
    return NextResponse.json(
      { error: "Élevage introuvable." },
      { status: 404 }
    );
  }

  /*
   * Supprimer la photo du stockage
   */
  if (item.photo_storage_path) {
    await sb.storage
      .from("media")
      .remove([
        item.photo_storage_path,
      ]);
  }

  /*
   * Supprimer l'élevage
   */
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
