import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function PATCH(req: NextRequest, { params }: { params: { category: string } }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const description = typeof body.description === "string" ? body.description : "";
  const { error } = await supabaseAdmin()
    .from("gallery_categories")
    .upsert(
      { category: params.category, description, updated_at: new Date().toISOString() },
      { onConflict: "category" }
    );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
