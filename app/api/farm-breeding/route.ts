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
    .from("farm_breeding")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const form = await req.formData();

  const name = String(form.get("name") || "").trim();
  const category = String(form.get("category") || "").trim();
  const description = String(form.get("description") || "").trim();
  const status = String(form.get("status") || "bientot").trim();
  const position = Number(form.get("position") || 0);
  const file = form.get("file") as File | null;

  if (!name || !category) {
    return NextResponse.json(
      { error: "Le nom et la catégorie sont obligatoires." },
      { status: 400 }
    );
  }

  if (!["disponible", "bientot"].includes(status)) {
    return NextResponse.json(
      { error: "Statut invalide." },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();

  let photo_url: string | null = null;
  let photo_storage_path: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Photo trop volumineuse (25 Mo maximum)." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "jpg";

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

    photo_url = publicUrl.publicUrl;
    photo_storage_path = path;
  }

  const { data, error } = await sb
    .from("farm_breeding")
    .insert({
      name,
      category,
      description: description || null,
      status,
      photo_url,
      photo_storage_path,
      position,
      published: true,
    })
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
