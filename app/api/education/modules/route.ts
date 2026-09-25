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
    .from("education_modules")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    modules: data || [],
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

  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim();

  if (!title) {
    return NextResponse.json(
      { error: "Le titre du module est obligatoire." },
      { status: 400 }
    );
  }

  if (!slug) {
    return NextResponse.json(
      { error: "Le slug du module est obligatoire." },
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
    .from("education_modules")
    .insert({
      title,
      slug,
      description: body.description
        ? String(body.description).trim()
        : null,
      image_url: body.image_url
        ? String(body.image_url).trim()
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
    { module: data },
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
      { error: "Identifiant du module manquant." },
      { status: 400 }
    );
  }

  const fields: Record<string, unknown> = {};

  if (body.title !== undefined) {
    const title = String(body.title).trim();

    if (!title) {
      return NextResponse.json(
        { error: "Le titre du module est obligatoire." },
        { status: 400 }
      );
    }

    fields.title = title;
  }

  if (body.slug !== undefined) {
    const slug = String(body.slug).trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Le slug du module est obligatoire." },
        { status: 400 }
      );
    }

    fields.slug = slug;
  }

  if (body.description !== undefined) {
    fields.description = body.description
      ? String(body.description).trim()
      : null;
  }

  if (body.image_url !== undefined) {
    fields.image_url = body.image_url
      ? String(body.image_url).trim()
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
    .from("education_modules")
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
    module: data,
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
      { error: "Identifiant du module manquant." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin()
    .from("education_modules")
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
