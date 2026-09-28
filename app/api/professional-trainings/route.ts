import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

const DEFAULT_COVER_IMAGE =
  "/images/education/modules/gestion-exploitation.jpg";

const DEFAULT_MODULES = [
  {
    title: "Introduction et fondamentaux",
    description:
      "Comprendre les notions essentielles et les principes fondamentaux du domaine.",
  },
  {
    title: "Préparation et mise en place",
    description:
      "Préparer correctement son activité, ses équipements et son environnement de travail.",
  },
  {
    title: "Techniques pratiques",
    description:
      "Découvrir et appliquer les principales techniques nécessaires à la pratique.",
  },
  {
    title: "Gestion et suivi",
    description:
      "Mettre en place un suivi efficace et apprendre à gérer les principaux indicateurs.",
  },
  {
    title: "Rentabilité et développement",
    description:
      "Comprendre les coûts, la rentabilité et les leviers permettant de développer son activité.",
  },
];

export async function GET() {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { data: trainings, error } =
      await supabaseAdmin()
        .from("professional_trainings")
        .select("*")
        .order("position", {
          ascending: true,
        })
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "GET professional trainings error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les formations.",
        },
        { status: 500 }
      );
    }

    const { data: sessions } =
      await supabaseAdmin()
        .from("professional_training_sessions")
        .select(
          "id, training_id, capacity, status"
        );

    const { data: registrations } =
      await supabaseAdmin()
        .from("professional_training_registrations")
        .select(
          "id, session_id, registration_status"
        );

    const safeSessions = sessions || [];
    const safeRegistrations = registrations || [];

    const enrichedTrainings = (trainings || []).map(
      (training) => {
        const trainingSessions =
          safeSessions.filter(
            (session) =>
              session.training_id === training.id
          );

        const trainingSessionIds =
          trainingSessions.map(
            (session) => session.id
          );

        const confirmedRegistrations =
          safeRegistrations.filter(
            (registration) =>
              trainingSessionIds.includes(
                registration.session_id
              ) &&
              registration.registration_status ===
                "confirmed"
          );

        const usedSeats =
          confirmedRegistrations.length;

        const totalCapacity =
          trainingSessions.reduce(
            (total, session) =>
              total + Number(session.capacity || 0),
            0
          );

        return {
          ...training,
          session_count:
            trainingSessions.length,
          registration_count:
            confirmedRegistrations.length,
          available_seats: Math.max(
            totalCapacity - usedSeats,
            0
          ),
        };
      }
    );

    const stats = {
      trainings: enrichedTrainings.length,

      sessions: safeSessions.length,

      registrations: safeRegistrations.filter(
        (registration) =>
          registration.registration_status ===
          "confirmed"
      ).length,

      available_seats: enrichedTrainings.reduce(
        (total, training) =>
          total + training.available_seats,
        0
      ),
    };

    return NextResponse.json({
      trainings: enrichedTrainings,
      stats,
    });
  } catch (error) {
    console.error(
      "GET professional trainings unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors du chargement des formations.",
      },
      { status: 500 }
    );
  }
}

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
          error:
            "Le titre de la formation est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Le slug de la formation est obligatoire.",
        },
        { status: 400 }
      );
    }

    const durationDays =
      body.duration_days === undefined
        ? 3
        : Number(body.duration_days);

    const priceXaf =
      body.price_xaf === undefined
        ? 60000
        : Number(body.price_xaf);

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

    const { data: existingTraining } =
      await supabaseAdmin()
        .from("professional_trainings")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

    if (existingTraining) {
      return NextResponse.json(
        {
          error:
            "Une formation utilise déjà ce slug.",
        },
        { status: 409 }
      );
    }

    const { data: training, error } =
      await supabaseAdmin()
        .from("professional_trainings")
        .insert({
          title,

          slug,

          short_description:
            typeof body.short_description === "string"
              ? body.short_description.trim() ||
                null
              : null,

          description:
            typeof body.description === "string"
              ? body.description.trim() || null
              : null,

          cover_image_url:
            typeof body.cover_image_url === "string"
              ? body.cover_image_url.trim() ||
                DEFAULT_COVER_IMAGE
              : DEFAULT_COVER_IMAGE,

          category:
            typeof body.category === "string"
              ? body.category.trim() || "Agriculture"
              : "Agriculture",

          level:
            typeof body.level === "string"
              ? body.level.trim() || "Débutant"
              : "Débutant",

          duration_days: durationDays,

          price_xaf: priceXaf,

          format:
            typeof body.format === "string"
              ? body.format.trim() || "Présentiel"
              : "Présentiel",

          certificate:
            typeof body.certificate === "boolean"
              ? body.certificate
              : false,

          published:
            typeof body.published === "boolean"
              ? body.published
              : false,

          position: 0,
        })
        .select("*")
        .single();

    if (error || !training) {
      console.error(
        "Create professional training error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de créer la formation.",
        },
        { status: 500 }
      );
    }

    /*
     * Création automatique du programme de base.
     */
    const modules = DEFAULT_MODULES.map(
      (module, index) => ({
        training_id: training.id,
        title: module.title,
        description: module.description,
        position: index,
      })
    );

    const { error: modulesError } =
      await supabaseAdmin()
        .from("professional_training_modules")
        .insert(modules);

    /*
     * Si les modules ne peuvent pas être créés,
     * on supprime également la formation pour
     * éviter de laisser une création incomplète.
     */
    if (modulesError) {
      console.error(
        "Create default training modules error:",
        modulesError
      );

      await supabaseAdmin()
        .from("professional_trainings")
        .delete()
        .eq("id", training.id);

      return NextResponse.json(
        {
          error:
            "La formation n'a pas pu être initialisée correctement.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        training,
        default_modules_created: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST professional trainings unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la création de la formation.",
      },
      { status: 500 }
    );
  }
}

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
        ? body.id
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Identifiant de formation manquant.",
        },
        { status: 400 }
      );
    }

    const updates: Record<
      string,
      string | number | boolean | null
    > = {
      updated_at: new Date().toISOString(),
    };

    const textFields = [
      "title",
      "slug",
      "short_description",
      "description",
      "cover_image_url",
      "category",
      "level",
      "format",
    ];

    for (const field of textFields) {
      if (body[field] !== undefined) {
        if (
          typeof body[field] === "string"
        ) {
          updates[field] =
            body[field].trim() || null;
        }
      }
    }

    if (body.duration_days !== undefined) {
      const value = Number(
        body.duration_days
      );

      if (
        !Number.isInteger(value) ||
        value <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "La durée est invalide.",
          },
          { status: 400 }
        );
      }

      updates.duration_days = value;
    }

    if (body.price_xaf !== undefined) {
      const value = Number(body.price_xaf);

      if (
        !Number.isInteger(value) ||
        value < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Le prix est invalide.",
          },
          { status: 400 }
        );
      }

      updates.price_xaf = value;
    }

    if (
      typeof body.certificate === "boolean"
    ) {
      updates.certificate =
        body.certificate;
    }

    if (
      typeof body.published === "boolean"
    ) {
      updates.published = body.published;
    }

    const { data, error } =
      await supabaseAdmin()
        .from("professional_trainings")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
      console.error(
        "Update professional training error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Impossible de modifier la formation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      training: data,
    });
  } catch (error) {
    console.error(
      "PATCH professional training unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la modification.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);

    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Identifiant de formation manquant.",
        },
        { status: 400 }
      );
    }

    const { error } =
      await supabaseAdmin()
        .from("professional_trainings")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Delete professional training error:",
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
      "DELETE professional training unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur est survenue lors de la suppression.",
      },
      { status: 500 }
    );
  }
}
