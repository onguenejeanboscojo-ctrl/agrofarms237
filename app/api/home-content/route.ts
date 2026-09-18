import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

/**
 * GET
 * Récupère le contenu de la page Accueil.
 */
export async function GET() {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("home_content")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erreur récupération contenu Accueil :",
        error
      );

      return NextResponse.json(
        {
          error: "Impossible de récupérer le contenu de l'accueil.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? null);
  } catch (error) {
    console.error(
      "Erreur inattendue récupération contenu Accueil :",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur serveur.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH
 * Modifie le contenu de la page Accueil.
 *
 * Seul un administrateur authentifié peut modifier
 * le contenu.
 */
export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const supabase = supabaseAdmin();

    const { data: existing, error: existingError } =
      await supabase
        .from("home_content")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Erreur recherche contenu Accueil :",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de rechercher le contenu de l'accueil.",
        },
        { status: 500 }
      );
    }

    let data;
    let error;

    if (existing?.id) {
      const result = await supabase
        .from("home_content")
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("*")
        .single();

      data = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from("home_content")
        .insert({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error(
        "Erreur modification contenu Accueil :",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de modifier le contenu de l'accueil.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Erreur inattendue modification contenu Accueil :",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur serveur.",
      },
      { status: 500 }
    );
  }
}
