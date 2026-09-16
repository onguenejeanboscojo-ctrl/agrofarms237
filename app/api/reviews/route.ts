import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { data, error } = await supabaseAdmin().from("reviews").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

// Ajout manuel d'un avis reçu par téléphone/WhatsApp — ne jamais inventer de
// faux avis, ce champ sert à retranscrire un vrai retour client.
export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { author_name, client_type, content, published } = await req.json();
  if (!author_name || !content) {
    return NextResponse.json({ error: "Nom et contenu de l'avis requis." }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin()
    .from("reviews")
    .insert({ author_name, client_type: client_type || null, content, published: !!published })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
