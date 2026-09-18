import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET() {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("home_story_media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Aucune image reçue." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Le fichier doit être une image." },
      { status: 400 }
    );
  }

  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: "L'image ne doit pas dépasser 25 Mo." },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `story-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`;

  const storagePath = `media/home-story/${fileName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("media")
    .getPublicUrl(storagePath);

  const url = publicUrlData.publicUrl;

  const { data, error: insertError } = await supabase
    .from("home_story_media")
    .insert({
      url,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (insertError) {
    await supabase.storage
      .from("media")
      .remove([storagePath]);

    return NextResponse.json(
      { error: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
