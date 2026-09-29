import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { data: training, error: trainingError } =
      await supabaseAdmin()
        .from("professional_trainings")
        .select(
          `
            id,
            title,
            slug,
            short_description,
            description,
            cover_image_url,
            category,
            level,
            duration_days,
            price_xaf,
            format,
            certificate,
            published,
            pre_registration_enabled
          `
        )
        .eq("published", true)
        .order("position", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle();

    if (trainingError) {
      console.error(
        "Public professional training error:",
        trainingError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer la formation.",
        },
        { status: 500 }
      );
    }

    if (!training) {
      return NextResponse.json({
        training: null,
        session: null,
      });
    }

    /*
     * ---------------------------------------------------------
     * RÉCUPÉRATION DES SESSIONS
     * ---------------------------------------------------------
     */

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const { data: sessions, error: sessionsError } =
      await supabaseAdmin()
        .from("professional_training_sessions")
        .select(
          `
            id,
            training_id,
            start_date,
            end_date,
            capacity,
            status,
            location,
            format
          `
        )
        .eq("training_id", training.id)
        .eq("status", "open")
        .gte("start_date", today)
        .order("start_date", {
          ascending: true,
        });

    if (sessionsError) {
      console.error(
        "Public professional sessions error:",
        sessionsError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les sessions.",
        },
        { status: 500 }
      );
    }

    /*
     * ---------------------------------------------------------
     * AUCUNE SESSION OUVERTE
     * ---------------------------------------------------------
     */

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({
        training,
        session: null,
      });
    }

    /*
     * ---------------------------------------------------------
     * ON CHERCHE LA PREMIÈRE SESSION DISPONIBLE
     * ---------------------------------------------------------
     */

    for (const currentSession of sessions) {
      const { count, error: countError } =
        await supabaseAdmin()
          .from(
            "professional_training_registrations"
          )
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq(
            "session_id",
            currentSession.id
          )
          .in("registration_status", [
            "pending",
            "confirmed",
            "completed",
          ]);

      if (countError) {
        console.error(
          "Public registration count error:",
          countError
        );

        continue;
      }

      const usedSeats = count || 0;

      const capacity =
        Number(currentSession.capacity || 0);

      const remainingSeats = Math.max(
        capacity - usedSeats,
        0
      );

      /*
       * Une session pleine ne doit pas être
       * proposée au visiteur.
       */

      if (remainingSeats <= 0) {
        continue;
      }

      return NextResponse.json({
        training,
        session: {
          id: currentSession.id,
          start_date:
            currentSession.start_date,
          end_date:
            currentSession.end_date,
          capacity,
          status:
            currentSession.status,
          location:
            currentSession.location,
          format:
            currentSession.format ||
            training.format ||
            "Présentiel",
          remaining_seats:
            remainingSeats,
        },
      });
    }

    /*
     * ---------------------------------------------------------
     * TOUTES LES SESSIONS SONT PLEINES
     * ---------------------------------------------------------
     */

    return NextResponse.json({
      training,
      session: null,
    });
  } catch (error) {
    console.error(
      "GET public professional training unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors du chargement de la formation.",
      },
      { status: 500 }
    );
  }
}
