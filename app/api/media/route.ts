import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { data, error } = await supabaseAdmin().from("media").select("*").order("position").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

// Upload d'une photo/vidéo : reçoit un multipart/form-data avec un champ "file"
// (+ kind, category, caption optionnels), stocke le fichier dans le bucket
// Supabase "media" et enregistre la ligne correspondante en base.
export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const kind = (form.get("kind") as string) || "photo";
  const category = (form.get("category") as string) || null;
  const caption = (form.get("caption") as string) || null;

  if (!file) return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux (25 Mo max)." }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${kind}s/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await sb.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = sb.storage.from("media").getPublicUrl(path);

  const { data, error } = await sb
    .from("media")
    .insert({ url: publicUrl.publicUrl, storage_path: path, kind, category, caption, published: true })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ item: data });
}
