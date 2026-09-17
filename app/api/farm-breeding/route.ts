import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET() {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("farm_breeding")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

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

export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "").trim();
    const category = String(
      formData.get("category") || ""
    ).trim();

    const description = String(
      formData.get("description") || ""
    ).trim();

    const status = String(
      formData.get("status") || "bientot"
    ).trim();

    const position = Number(
      formData.get("position") || 0
    );

    const file = formData.get("file");

    if (!name) {
      return NextResponse.json(
        { error: "Le nom de l'élevage est obligatoire." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "La catégorie est obligatoire." },
        { status: 400 }
      );
    }

    if (!["disponible", "bientot"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide." },
        { status: 400 }
      );
    }

    let photo_url: string | null = null;
    let photo_storage_path: string | null = null;

    // ======================================================
    // PHOTO
    // ======================================================

    if (file instanceof File && file.size > 0) {
      const maxSize = 25 * 1024 * 1024;

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error:
              "La photo est trop volumineuse. Maximum : 25 Mo.",
          },
          { status: 400 }
        );
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            error:
              "Le fichier doit être une image.",
          },
          { status: 400 }
        );
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const storagePath = `farm-breeding/${fileName}`;

      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const { error: uploadError } =
        await supabaseAdmin()
          .storage
          .from("media")
          .upload(storagePath, buffer, {
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) {
        return NextResponse.json(
          {
            error:
              "Impossible d'envoyer la photo : " +
              uploadError.message,
          },
          { status: 500 }
        );
      }

      const { data: publicUrlData } =
        supabaseAdmin()
          .storage
          .from("media")
          .getPublicUrl(storagePath);

      photo_url =
        publicUrlData.publicUrl;

      photo_storage_path = storagePath;
    }

    // ======================================================
    // ENREGISTREMENT
    // ======================================================

    const { data, error } =
      await supabaseAdmin()
        .from("farm_breeding")
        .insert({
          name,
          category,
          description: description || null,
          status,
          position: Number.isFinite(position)
            ? position
            : 0,
          published: true,
          photo_url,
          photo_storage_path,
        })
        .select()
        .single();

    if (error) {
      // Si l'enregistrement échoue après l'upload,
      // on supprime la photo pour éviter un fichier orphelin.
      if (photo_storage_path) {
        await supabaseAdmin()
          .storage
          .from("media")
          .remove([photo_storage_path]);
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        item: data,
      },
      { status: 201 }
    );
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
