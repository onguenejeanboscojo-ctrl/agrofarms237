import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type RegistrationBody = {
  session_id?: unknown;
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
  organization?: unknown;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegistrationBody;

    const sessionId = clean(body.session_id);
    const fullName = clean(body.full_name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const organization = clean(body.organization);

    // =========================================================
    // VALIDATION DES INFORMATIONS
    // =========================================================

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Veuillez sélectionner une session.",
        },
        { status: 400 }
      );
    }

    if (!fullName) {
      return NextResponse.json(
        {
          error: "Le nom complet est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (fullName.length < 2) {
      return NextResponse.json(
        {
          error: "Veuillez renseigner un nom complet valide.",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          error: "Le numéro de téléphone est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (phone.length < 8) {
      return NextResponse.json(
        {
          error: "Veuillez renseigner un numéro de téléphone valide.",
        },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          error: "Veuillez renseigner une adresse e-mail valide.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // =========================================================
    // RÉCUPÉRATION DE LA SESSION
    // =========================================================

    const { data: session, error: sessionError } = await supabase
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
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error(
        "Erreur récupération session formation :",
        sessionError
      );

      return NextResponse.json(
        {
          error: "Impossible de vérifier cette session.",
        },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          error: "Cette session n'existe pas ou n'est plus disponible.",
        },
        { status: 404 }
      );
    }

    // =========================================================
    // VÉRIFICATION DU STATUT
    // =========================================================

    if (session.status !== "open") {
      if (session.status === "full") {
        return NextResponse.json(
          {
            error:
              "Cette session est complète. Veuillez choisir une autre session.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error:
            "Cette session n'est actuellement pas ouverte aux inscriptions.",
        },
        { status: 409 }
      );
    }

    // =========================================================
    // VÉRIFICATION DE LA DATE
    // =========================================================

    const today = new Date().toISOString().split("T")[0];

    if (session.start_date < today) {
      return NextResponse.json(
        {
          error:
            "Cette session est déjà passée. Veuillez choisir une prochaine session.",
        },
        { status: 409 }
      );
    }

    // =========================================================
    // RÉCUPÉRATION DE LA FORMATION
    // =========================================================

    const { data: training, error: trainingError } = await supabase
      .from("professional_trainings")
      .select(
        `
          id,
          title,
          price_xaf,
          duration_days,
          format,
          published
        `
      )
      .eq("id", session.training_id)
      .eq("published", true)
      .maybeSingle();

    if (trainingError) {
      console.error(
        "Erreur récupération formation :",
        trainingError
      );

      return NextResponse.json(
        {
          error: "Impossible de vérifier la formation.",
        },
        { status: 500 }
      );
    }

    if (!training) {
      return NextResponse.json(
        {
          error:
            "Cette formation n'est plus disponible à l'inscription.",
        },
        { status: 404 }
      );
    }

    // =========================================================
    // VÉRIFICATION DU PRIX
    // =========================================================

    const amountXaf = Number(training.price_xaf);

    if (!Number.isFinite(amountXaf) || amountXaf < 0) {
      console.error(
        "Prix formation invalide :",
        training.price_xaf
      );

      return NextResponse.json(
        {
          error:
            "Le tarif de cette formation est momentanément indisponible.",
        },
        { status: 500 }
      );
    }

    // =========================================================
    // VÉRIFICATION DES PLACES
    // =========================================================

    const { count, error: countError } = await supabase
      .from("professional_training_registrations")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("session_id", session.id)
      .in("registration_status", [
        "pending",
        "confirmed",
        "completed",
      ]);

    if (countError) {
      console.error(
        "Erreur comptage inscriptions :",
        countError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de vérifier les places disponibles.",
        },
        { status: 500 }
      );
    }

    const registeredCount = count ?? 0;

    if (registeredCount >= session.capacity) {
      // On synchronise le statut de la session avec la réalité.
      await supabase
        .from("professional_training_sessions")
        .update({
          status: "full",
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id)
        .eq("status", "open");

      return NextResponse.json(
        {
          error:
            "Cette session vient d'atteindre sa capacité maximale.",
        },
        { status: 409 }
      );
    }

    // =========================================================
    // VÉRIFICATION D'UNE INSCRIPTION IDENTIQUE
    // =========================================================

    const { data: existingRegistration, error: existingError } =
      await supabase
        .from("professional_training_registrations")
        .select("id, registration_status")
        .eq("session_id", session.id)
        .eq("phone", phone)
        .in("registration_status", [
          "pending",
          "confirmed",
          "completed",
        ])
        .limit(1)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Erreur vérification inscription existante :",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de vérifier votre inscription.",
        },
        { status: 500 }
      );
    }

    if (existingRegistration) {
      return NextResponse.json(
        {
          error:
            "Une inscription existe déjà pour ce numéro sur cette session.",
        },
        { status: 409 }
      );
    }

    // =========================================================
    // CRÉATION DE L'INSCRIPTION
    // =========================================================

    const { data: registration, error: registrationError } =
      await supabase
        .from("professional_training_registrations")
        .insert({
          session_id: session.id,
          full_name: fullName,
          email: email || null,
          phone,
          organization: organization || null,

          registration_status: "pending",
          payment_status: "pending",

          // IMPORTANT :
          // Le montant vient de Supabase,
          // jamais des données envoyées par le navigateur.
          amount_xaf: amountXaf,

          updated_at: new Date().toISOString(),
        })
        .select(
          `
            id,
            session_id,
            full_name,
            email,
            phone,
            organization,
            registration_status,
            payment_status,
            amount_xaf,
            created_at
          `
        )
        .single();

    if (registrationError) {
      console.error(
        "Erreur création inscription formation :",
        registrationError
      );

      return NextResponse.json(
        {
          error:
            "Impossible d'enregistrer votre inscription.",
        },
        { status: 500 }
      );
    }

    // =========================================================
    // MISE À JOUR DE LA SESSION SI DERNIÈRE PLACE
    // =========================================================

    const newRegisteredCount = registeredCount + 1;

    if (newRegisteredCount >= session.capacity) {
      await supabase
        .from("professional_training_sessions")
        .update({
          status: "full",
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.id)
        .eq("status", "open");
    }

    // =========================================================
    // RÉPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,

        registration: {
          id: registration.id,
          full_name: registration.full_name,
          amount_xaf: registration.amount_xaf,
          registration_status:
            registration.registration_status,
          payment_status:
            registration.payment_status,
        },

        training: {
          id: training.id,
          title: training.title,
          duration_days: training.duration_days,
          price_xaf: amountXaf,
        },

        session: {
          id: session.id,
          start_date: session.start_date,
          end_date: session.end_date,
          capacity: session.capacity,
          registered_count: newRegisteredCount,
          places_remaining:
            Math.max(
              session.capacity - newRegisteredCount,
              0
            ),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Erreur inattendue inscription formation :",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur inattendue est survenue. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
