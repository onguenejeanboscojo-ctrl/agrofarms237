import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("home_story_media")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Photo introuvable." },
      { status: 404 }
    );
  }

  const { error: deleteError } = await supabase
    .from("home_story_media")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  if (data.storage_path) {
    await supabase.storage
      .from("media")
      .remove([data.storage_path]);
  }

  return NextResponse.json({ success: true });
}
