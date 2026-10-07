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
      site_location?: string | null;
      gallery_enabled?: boolean;
      gallery_category?: string | null;
    } = {};

    // =====================================================
    // COMPATIBILITÉ AVEC L'ANCIEN SYSTÈME
    // =====================================================

    if ("category" in body) {
      updates.category =
        typeof body.category === "string" &&
        body.category.trim()
          ? body.category.trim()
          : null;
    }

    // =====================================================
    // NOUVEAU SYSTÈME — EMPLACEMENT SUR LE SITE
    // =====================================================

    if ("site_location" in body) {
      updates.site_location =
        typeof body.site_location === "string" &&
        body.site_location.trim()
          ? body.site_location.trim()
          : null;
    }

    // =====================================================
    // NOUVEAU SYSTÈME — GALERIE
    // =====================================================

    if ("gallery_enabled" in body) {
      if (typeof body.gallery_enabled !== "boolean") {
        return NextResponse.json(
          {
            error:
              "La valeur de publication dans la Galerie est invalide.",
          },
          { status: 400 }
        );
      }

      updates.gallery_enabled = body.gallery_enabled;
    }

    if ("gallery_category" in body) {
      updates.gallery_category =
        typeof body.gallery_category === "string" &&
        body.gallery_category.trim()
          ? body.gallery_category.trim()
          : null;
    }

    // Si la Galerie est désactivée,
    // aucune rubrique Galerie ne doit rester associée.
    if (
      "gallery_enabled" in body &&
      body.gallery_enabled === false
    ) {
      updates.gallery_category = null;
    }

    // =====================================================
    // LÉGENDE
    // =====================================================

    if ("caption" in body) {
      updates.caption =
        typeof body.caption === "string" &&
        body.caption.trim()
          ? body.caption.trim()
          : null;
    }

    // =====================================================
    // POSITION
    // =====================================================

    if ("position" in body) {
      const position = Number(body.position);

      if (!Number.isFinite(position)) {
        return NextResponse.json(
          {
            error:
              "La position doit être un nombre valide.",
          },
          { status: 400 }
        );
      }

      updates.position = position;
    }

    // =====================================================
    // PUBLICATION
    // =====================================================

    if ("published" in body) {
      if (typeof body.published !== "boolean") {
        return NextResponse.json(
          {
            error:
              "La valeur de publication est invalide.",
          },
          { status: 400 }
        );
      }

      updates.published = body.published;
    }

    // =====================================================
    // VÉRIFICATION
    // =====================================================

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error:
            "Aucune modification valide reçue.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // MISE À JOUR SUPABASE
    // =====================================================

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
