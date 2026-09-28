import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const ALLOWED_STATUSES = [
  "draft",
  "open",
  "full",
  "completed",
  "cancelled",
] as const;

type SessionStatus =
  (typeof ALLOWED_STATUSES)[number];

/**
 * GET
 * Récupère les sessions d'une formation.
 */
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const { data, error } = await supabaseAdmin()
      .from("professional_training_sessions")
      .select("*")
      .eq("training_id", id)
      .order("start_date", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "GET professional training sessions error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les sessions.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessions: data || [],
    });
  } catch (error) {
    console.error(
      "GET professional training sessions unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors du chargement des sessions.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST
 * Crée une session.
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();

    const startDate =
      typeof body.start_date === "string"
        ? body.start_date.trim()
        : "";

    const endDate =
      typeof body.end_date === "string"
        ? body.end_date.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    const format =
      typeof body.format === "string"
        ? body.format.trim()
        : "";

    const status =
      typeof body.status === "string"
        ? body.status
        : "draft";

    const capacity = Number(body.capacity);

    if (!startDate) {
      return NextResponse.json(
        {
          error:
            "La date de début est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 50
    ) {
      return NextResponse.json(
        {
          error:
            "La capacité doit être comprise entre 1 et 50 participants.",
        },
        { status: 400 }
      );
    }

    if (
      !ALLOWED_STATUSES.includes(
        status as SessionStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Le statut de la session est invalide.",
        },
        { status: 400 }
      );
    }

    if (
      endDate &&
      new Date(endDate) < new Date(startDate)
    ) {
      return NextResponse.json(
        {
          error:
            "La date de fin ne peut pas être antérieure à la date de début.",
        },
        { status: 400 }
      );
    }

    const { data: training, error: trainingError } =
      await supabaseAdmin()
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

    const { data, error } = await supabaseAdmin()
      .from("professional_training_sessions")
      .insert({
        training_id: id,
        start_date: startDate,
        end_date: endDate || null,
        capacity,
        status,
        location: location || null,
        format: format || null,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Create professional training session error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de créer la session.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        session: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST professional training session unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la création de la session.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH
 * Modifie une session.
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id: trainingId } = await context.params;

    const body = await request.json();

    const sessionId =
      typeof body.session_id === "string"
        ? body.session_id
        : "";

    if (!sessionId) {
      return NextResponse.json(
        {
          error:
            "Identifiant de session manquant.",
        },
        { status: 400 }
      );
    }

    const updates: {
      start_date?: string;
      end_date?: string | null;
      capacity?: number;
      status?: SessionStatus;
      location?: string | null;
      format?: string | null;
      updated_at: string;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.start_date === "string") {
      const value = body.start_date.trim();

      if (!value) {
        return NextResponse.json(
          {
            error:
              "La date de début est obligatoire.",
          },
          { status: 400 }
        );
      }

      updates.start_date = value;
    }

    if (typeof body.end_date === "string") {
      updates.end_date =
        body.end_date.trim() || null;
    }

    if (
      body.end_date === null ||
      body.end_date === ""
    ) {
      updates.end_date = null;
    }

    if (body.capacity !== undefined) {
      const capacity = Number(body.capacity);

      if (
        !Number.isInteger(capacity) ||
        capacity < 1 ||
        capacity > 50
      ) {
        return NextResponse.json(
          {
            error:
              "La capacité doit être comprise entre 1 et 50 participants.",
          },
          { status: 400 }
        );
      }

      updates.capacity = capacity;
    }

    if (typeof body.status === "string") {
      if (
        !ALLOWED_STATUSES.includes(
          body.status as SessionStatus
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Le statut de la session est invalide.",
          },
          { status: 400 }
        );
      }

      updates.status =
        body.status as SessionStatus;
    }

    if (typeof body.location === "string") {
      updates.location =
        body.location.trim() || null;
    }

    if (typeof body.format === "string") {
      updates.format =
        body.format.trim() || null;
    }

    const { data, error } = await supabaseAdmin()
      .from("professional_training_sessions")
      .update(updates)
      .eq("id", sessionId)
      .eq("training_id", trainingId)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Update professional training session error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de modifier la session.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      session: data,
    });
  } catch (error) {
    console.error(
      "PATCH professional training session unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la modification de la session.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE
 * Supprime une session.
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id: trainingId } = await context.params;

    const url = new URL(request.url);

    const sessionId =
      url.searchParams.get("session_id") || "";

    if (!sessionId) {
      return NextResponse.json(
        {
          error:
            "Identifiant de session manquant.",
        },
        { status: 400 }
      );
    }

    const { data: session, error: sessionError } =
      await supabaseAdmin()
        .from("professional_training_sessions")
        .select("id")
        .eq("id", sessionId)
        .eq("training_id", trainingId)
        .maybeSingle();

    if (sessionError) {
      console.error(
        "Session verification error:",
        sessionError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de vérifier la session.",
        },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          error: "Session introuvable.",
        },
        { status: 404 }
      );
    }

    const { error } = await supabaseAdmin()
      .from("professional_training_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("training_id", trainingId);

    if (error) {
      console.error(
        "Delete professional training session error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de supprimer la session.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE professional training session unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la suppression de la session.",
      },
      { status: 500 }
    );
  }
}
