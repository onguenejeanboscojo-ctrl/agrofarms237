import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { data, error } = await supabaseAdmin()
    .from("team_members")
    .select("*")
    .order("position")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

// Ajout d'un membre de l'équipe : reçoit un multipart/form-data avec les
// champs texte (name, role, bio) et une photo optionnelle ("file"), stockée
// dans le même bucket que la Galerie, sous team/.
export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const form = await req.formData();
  const name = (form.get("name") as string) || "";
  const role = (form.get("role") as string) || "";
  const bio = (form.get("bio") as string) || null;
  const file = form.get("file") as File | null;

  if (!name || !role) {
    return NextResponse.json({ error: "Le nom et le poste sont obligatoires." }, { status: 400 });
  }

  const sb = supabaseAdmin();
  let photo_url: string | null = null;
  let photo_storage_path: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Photo trop volumineuse (25 Mo max)." }, { status: 400 });
    }
    const ext = file.name.split(".").pop() || "jpg";
    const path = `team/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await sb.storage.from("media").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    const { data: publicUrl } = sb.storage.from("media").getPublicUrl(path);
    photo_url = publicUrl.publicUrl;
    photo_storage_path = path;
  }

  const { data, error } = await sb
    .from("team_members")
    .insert({ name, role, bio, photo_url, photo_storage_path, published: true })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ item: data });
}
