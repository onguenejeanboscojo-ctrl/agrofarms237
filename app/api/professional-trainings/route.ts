import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

/**
 * GET
 * Récupère les formations professionnelles avec
 * leurs sessions et leurs statistiques de base.
 */
export async function GET() {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin();

    const [
      trainingsResult,
      sessionsResult,
      registrationsResult,
    ] = await Promise.all([
      supabase
        .from("professional_trainings")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true }),

      supabase
        .from("professional_training_sessions")
        .select("*")
        .order("start_date", { ascending: true }),

      supabase
        .from("professional_training_registrations")
        .select("id, session_id, registration_status"),
    ]);

    if (trainingsResult.error) {
      console.error(
        "Erreur récupération formations professionnelles :",
        trainingsResult.error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les formations professionnelles.",
        },
        { status: 500 }
      );
    }

    if (sessionsResult.error) {
      console.error(
        "Erreur récupération sessions professionnelles :",
        sessionsResult.error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les sessions de formation.",
        },
        { status: 500 }
      );
    }

    if (registrationsResult.error) {
      console.error(
        "Erreur récupération inscriptions professionnelles :",
        registrationsResult.error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les inscriptions.",
        },
        { status: 500 }
      );
    }

    const trainings = trainingsResult.data ?? [];
    const sessions = sessionsResult.data ?? [];
    const registrations = registrationsResult.data ?? [];

    const confirmedRegistrations = registrations.filter(
      (registration) =>
        registration.registration_status === "confirmed"
    );

    const availableSeats = sessions.reduce((total, session) => {
      const confirmedForSession = confirmedRegistrations.filter(
        (registration) =>
          registration.session_id === session.id
      ).length;

      return total + Math.max(
        session.capacity - confirmedForSession,
        0
      );
    }, 0);

    const trainingsWithStats = trainings.map((training) => {
      const trainingSessions = sessions.filter(
        (session) =>
          session.training_id === training.id
      );

      const trainingRegistrations = confirmedRegistrations.filter(
        (registration) =>
          trainingSessions.some(
            (session) =>
              session.id === registration.session_id
          )
      );

      const trainingAvailableSeats =
        trainingSessions.reduce((total, session) => {
          const confirmedForSession =
            confirmedRegistrations.filter(
              (registration) =>
                registration.session_id === session.id
            ).length;

          return total + Math.max(
            session.capacity - confirmedForSession,
            0
          );
        }, 0);

      return {
        ...training,
        session_count: trainingSessions.length,
        registration_count: trainingRegistrations.length,
        available_seats: trainingAvailableSeats,
      };
    });

    return NextResponse.json({
      trainings: trainingsWithStats,

      stats: {
        trainings: trainings.length,
        sessions: sessions.length,
        registrations: confirmedRegistrations.length,
        available_seats: availableSeats,
      },
    });
  } catch (error) {
    console.error(
      "Erreur inattendue formations professionnelles :",
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
 * POST
 * Création d'une formation professionnelle.
 */
export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        {
          error: "Le titre de la formation est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error: "Le slug de la formation est obligatoire.",
        },
        { status: 400 }
      );
    }

    const durationDays =
      body.duration_days === undefined ||
      body.duration_days === null ||
      body.duration_days === ""
        ? 3
        : Number(body.duration_days);

    const priceXaf =
      body.price_xaf === undefined ||
      body.price_xaf === null ||
      body.price_xaf === ""
        ? 60000
        : Number(body.price_xaf);

    if (
      !Number.isInteger(durationDays) ||
      durationDays <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "La durée de la formation doit être un nombre entier positif.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(priceXaf) ||
      priceXaf < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Le prix de la formation est invalide.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("professional_trainings")
      .insert({
        title,
        slug,

        short_description:
          typeof body.short_description === "string"
            ? body.short_description.trim() || null
            : null,

        description:
          typeof body.description === "string"
            ? body.description.trim() || null
            : null,

        cover_image_url:
          typeof body.cover_image_url === "string"
            ? body.cover_image_url.trim() || null
            : null,

        category:
          typeof body.category === "string"
            ? body.category.trim() || null
            : null,

        level:
          typeof body.level === "string"
            ? body.level.trim() || null
            : null,

        duration_days: durationDays,
        price_xaf: priceXaf,

        format:
          typeof body.format === "string"
            ? body.format.trim() || null
            : null,

        certificate:
          body.certificate === true,

        published:
          body.published === true,

        position:
          Number.isFinite(Number(body.position))
            ? Number(body.position)
            : 0,
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Erreur création formation professionnelle :",
        error
      );

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Une formation avec ce slug existe déjà.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Impossible de créer la formation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        training: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Erreur inattendue création formation :",
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
 * Modification d'une formation professionnelle.
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

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Identifiant de formation manquant.",
        },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.title === "string") {
      updates.title = body.title.trim();
    }

    if (typeof body.slug === "string") {
      updates.slug = body.slug.trim();
    }

    if (typeof body.short_description === "string") {
      updates.short_description =
        body.short_description.trim() || null;
    }

    if (typeof body.description === "string") {
      updates.description =
        body.description.trim() || null;
    }

    if (typeof body.cover_image_url === "string") {
      updates.cover_image_url =
        body.cover_image_url.trim() || null;
    }

    if (typeof body.category === "string") {
      updates.category =
        body.category.trim() || null;
    }

    if (typeof body.level === "string") {
      updates.level =
        body.level.trim() || null;
    }

    if (body.duration_days !== undefined) {
      const durationDays = Number(body.duration_days);

      if (
        !Number.isInteger(durationDays) ||
        durationDays <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "La durée de la formation est invalide.",
          },
          { status: 400 }
        );
      }

      updates.duration_days = durationDays;
    }

    if (body.price_xaf !== undefined) {
      const priceXaf = Number(body.price_xaf);

      if (
        !Number.isInteger(priceXaf) ||
        priceXaf < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Le prix de la formation est invalide.",
          },
          { status: 400 }
        );
      }

      updates.price_xaf = priceXaf;
    }

    if (typeof body.format === "string") {
      updates.format =
        body.format.trim() || null;
    }

    if (body.certificate !== undefined) {
      updates.certificate =
        body.certificate === true;
    }

    if (body.published !== undefined) {
      updates.published =
        body.published === true;
    }

    if (body.position !== undefined) {
      const position = Number(body.position);

      if (!Number.isFinite(position)) {
        return NextResponse.json(
          {
            error: "La position est invalide.",
          },
          { status: 400 }
        );
      }

      updates.position = position;
    }

    updates.updated_at = new Date().toISOString();

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("professional_trainings")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error(
        "Erreur modification formation professionnelle :",
        error
      );

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Une autre formation utilise déjà ce slug.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Impossible de modifier la formation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      training: data,
    });
  } catch (error) {
    console.error(
      "Erreur inattendue modification formation :",
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
 * DELETE
 * Suppression d'une formation professionnelle.
 */
export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Identifiant de formation manquant.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("professional_trainings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Erreur suppression formation professionnelle :",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de supprimer la formation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Erreur inattendue suppression formation :",
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
