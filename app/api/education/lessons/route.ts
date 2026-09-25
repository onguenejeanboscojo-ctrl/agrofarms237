import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("module_id");

  let query = supabaseAdmin()
    .from("education_lessons")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (moduleId) {
    query = query.eq("module_id", moduleId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    lessons: data || [],
  });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const moduleId = String(body.module_id || "").trim();
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim();

  if (!moduleId) {
    return NextResponse.json(
      { error: "Le module est obligatoire." },
      { status: 400 }
    );
  }

  if (!title) {
    return NextResponse.json(
      { error: "Le titre du cours est obligatoire." },
      { status: 400 }
    );
  }

  if (!slug) {
    return NextResponse.json(
      { error: "Le slug du cours est obligatoire." },
      { status: 400 }
    );
  }

  const position = Number(body.position ?? 0);

  if (!Number.isInteger(position) || position < 0) {
    return NextResponse.json(
      { error: "La position est invalide." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("education_lessons")
    .insert({
      module_id: moduleId,
      title,
      slug,
      introduction: body.introduction
        ? String(body.introduction).trim()
        : null,
      content: body.content
        ? String(body.content)
        : null,
      image_url: body.image_url
        ? String(body.image_url).trim()
        : null,
      video_url: body.video_url
        ? String(body.video_url).trim()
        : null,
      published: body.published === true,
      position,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { lesson: data },
    { status: 201 }
  );
}

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const id = String(body.id || "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "Identifiant du cours manquant." },
      { status: 400 }
    );
  }

  const fields: Record<string, unknown> = {};

  if (body.module_id !== undefined) {
    const moduleId = String(body.module_id).trim();

    if (!moduleId) {
      return NextResponse.json(
        { error: "Le module est obligatoire." },
        { status: 400 }
      );
    }

    fields.module_id = moduleId;
  }

  if (body.title !== undefined) {
    const title = String(body.title).trim();

    if (!title) {
      return NextResponse.json(
        { error: "Le titre du cours est obligatoire." },
        { status: 400 }
      );
    }

    fields.title = title;
  }

  if (body.slug !== undefined) {
    const slug = String(body.slug).trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Le slug du cours est obligatoire." },
        { status: 400 }
      );
    }

    fields.slug = slug;
  }

  if (body.introduction !== undefined) {
    fields.introduction = body.introduction
      ? String(body.introduction).trim()
      : null;
  }

  if (body.content !== undefined) {
    fields.content = body.content
      ? String(body.content)
      : null;
  }

  if (body.image_url !== undefined) {
    fields.image_url = body.image_url
      ? String(body.image_url).trim()
      : null;
  }

  if (body.video_url !== undefined) {
    fields.video_url = body.video_url
      ? String(body.video_url).trim()
      : null;
  }

  if (body.published !== undefined) {
    fields.published = Boolean(body.published);
  }

  if (body.position !== undefined) {
    const position = Number(body.position);

    if (!Number.isInteger(position) || position < 0) {
      return NextResponse.json(
        { error: "La position est invalide." },
        { status: 400 }
      );
    }

    fields.position = position;
  }

  fields.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin()
    .from("education_lessons")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    lesson: data,
  });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const id = String(body.id || "").trim();

  if (!id) {
    return NextResponse.json(
      { error: "Identifiant du cours manquant." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin()
    .from("education_lessons")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
