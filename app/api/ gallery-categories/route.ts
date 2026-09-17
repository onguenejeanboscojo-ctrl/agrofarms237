import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { data, error } = await supabaseAdmin().from("gallery_categories").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}
