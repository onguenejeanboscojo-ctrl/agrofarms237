import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const CONTENT_FIELDS = [
  "hero_label",
  "hero_title",
  "hero_description",

  "step1_label",
  "step1_title",
  "step1_text",

  "step2_label",
  "step2_title",
  "step2_text",

  "step3_label",
  "step3_title",
  "step3_text",

  "fish_label",
  "fish_title",
  "fish_description",

  "pigs_label",
  "pigs_title",
  "pigs_description",

  "poultry_label",
  "poultry_title",
  "poultry_description",

  "vision_label",
  "vision_title",
  "vision_text",
] as const;

/* =========================
   RÉCUPÉRER LE CONTENU
========================= */

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("farm_breeding_content")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erreur récupération contenu Notre élevage :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible de récupérer le contenu.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Une erreur est survenue.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   MODIFIER LE CONTENU
========================= */

export async function PATCH(request: Request) {
  try {
    const authenticated = await isAdminAuthed();

    if (!authenticated) {
      return NextResponse.json(
        {
          error: "Non autorisé.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const supabase = supabaseAdmin();

    /* On récupère l'unique fiche de contenu */
    const { data: existing, error: existingError } = await supabase
      .from("farm_breeding_content")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);

      return NextResponse.json(
        {
          error: "Impossible de récupérer la fiche de contenu.",
        },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        {
          error: "Aucune fiche de contenu n'existe encore.",
        },
        { status: 404 }
      );
    }

    const updates: Record<string, string> = {};

    for (const field of CONTENT_FIELDS) {
      if (body[field] !== undefined) {
        updates[field] = String(body[field] ?? "");
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("farm_breeding_content")
      .update(updates)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Erreur modification contenu Notre élevage :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible d'enregistrer les modifications.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      content: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Une erreur est survenue.",
      },
      { status: 500 }
    );
  }
}
