import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/isAdminAuthed";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const isAuthed = await isAdminAuthed();

    if (!isAuthed) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
      .from("professional_training_modules")
      .select("*")
      .eq("training_id", id)
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET professional training modules error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les modules.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      modules: data || [],
    });
  } catch (error) {
    console.error(
      "GET professional training modules unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors du chargement des modules.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const isAuthed = await isAdminAuthed();

    if (!isAuthed) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Le titre du module est obligatoire.",
        },
        { status: 400 }
      );
    }

    // Vérification de l'existence de la formation
    const { data: training, error: trainingError } =
      await supabaseAdmin
        .from("professional_trainings")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (trainingError) {
      console.error(
        "Training verification error:",
        trainingError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de vérifier la formation.",
        },
        { status: 500 }
      );
    }

    if (!training) {
      return NextResponse.json(
        {
          error: "Formation introuvable.",
        },
        { status: 404 }
      );
    }

    // Détermination automatique de la position
    const { data: lastModule, error: lastModuleError } =
      await supabaseAdmin
        .from("professional_training_modules")
        .select("position")
        .eq("training_id", id)
        .order("position", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (lastModuleError) {
      console.error(
        "Last module lookup error:",
        lastModuleError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de déterminer la position du module.",
        },
        { status: 500 }
      );
    }

    const position =
      typeof lastModule?.position === "number"
        ? lastModule.position + 1
        : 0;

    const { data, error } = await supabaseAdmin
      .from("professional_training_modules")
      .insert({
        training_id: id,
        title,
        description: description || null,
        position,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Create professional training module error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de créer le module.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        module: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST professional training module unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la création du module.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const isAuthed = await isAdminAuthed();

    if (!isAuthed) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id: trainingId } = await context.params;

    const body = await request.json();

    const moduleId =
      typeof body.module_id === "string"
        ? body.module_id
        : "";

    if (!moduleId) {
      return NextResponse.json(
        {
          error: "Identifiant du module manquant.",
        },
        { status: 400 }
      );
    }

    const updates: {
      title?: string;
      description?: string | null;
      position?: number;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.title === "string") {
      const title = body.title.trim();

      if (!title) {
        return NextResponse.json(
          {
            error:
              "Le titre du module est obligatoire.",
          },
          { status: 400 }
        );
      }

      updates.title = title;
    }

    if (typeof body.description === "string") {
      updates.description =
        body.description.trim() || null;
    }

    if (typeof body.position === "number") {
      updates.position = body.position;
    }

    const { data, error } = await supabaseAdmin
      .from("professional_training_modules")
      .update(updates)
      .eq("id", moduleId)
      .eq("training_id", trainingId)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Update professional training module error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de modifier le module.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      module: data,
    });
  } catch (error) {
    console.error(
      "PATCH professional training module unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la modification du module.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const isAuthed = await isAdminAuthed();

    if (!isAuthed) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id: trainingId } = await context.params;

    const url = new URL(request.url);

    const moduleId =
      url.searchParams.get("module_id") || "";

    if (!moduleId) {
      return NextResponse.json(
        {
          error: "Identifiant du module manquant.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("professional_training_modules")
      .delete()
      .eq("id", moduleId)
      .eq("training_id", trainingId);

    if (error) {
      console.error(
        "Delete professional training module error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de supprimer le module.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE professional training module unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la suppression du module.",
      },
      { status: 500 }
    );
  }
}
