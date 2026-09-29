import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export const runtime = "nodejs";

type RegistrationBody = {
  session_id?: unknown;
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
  organization?: unknown;
};

type UpdateRegistrationBody = {
  registration_id?: unknown;
  registration_status?: unknown;
  payment_status?: unknown;
};

const REGISTRATION_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/* =========================================================
   GET — ADMIN
   Récupère les inscriptions d'une formation
========================================================= */

export async function GET(request: Request) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const trainingId =
      url.searchParams.get("training_id");

    if (!trainingId) {
      return NextResponse.json(
        {
          error:
            "Identifiant de formation manquant.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* ---------------------------------------------------------
       FORMATION
    --------------------------------------------------------- */

    const {
      data: training,
      error: trainingError,
    } = await supabase
      .from("professional_trainings")
      .select(
        `
          id,
          title,
          price_xaf,
          duration_days,
          format
        `
      )
      .eq("id", trainingId)
      .maybeSingle();

    if (trainingError) {
      console.error(
        "GET registration training error:",
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
      return NextResponse.json(
        {
          error: "Formation introuvable.",
        },
        { status: 404 }
      );
    }

    /* ---------------------------------------------------------
       SESSIONS
    --------------------------------------------------------- */

    const {
      data: sessions,
      error: sessionsError,
    } = await supabase
      .from(
        "professional_training_sessions"
      )
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
      .eq("training_id", trainingId)
      .order("start_date", {
        ascending: false,
      });

    if (sessionsError) {
      console.error(
        "GET registration sessions error:",
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

    const sessionIds = (sessions || []).map(
      (session) => session.id
    );

    /* ---------------------------------------------------------
       AUCUNE SESSION
    --------------------------------------------------------- */

    if (sessionIds.length === 0) {
      return NextResponse.json({
        training,
        sessions: [],
        registrations: [],
        stats: {
          total: 0,
          pending: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
          paid: 0,
          payment_pending: 0,
        },
      });
    }

    /* ---------------------------------------------------------
       INSCRIPTIONS
    --------------------------------------------------------- */

    const {
      data: registrations,
      error: registrationsError,
    } = await supabase
      .from(
        "professional_training_registrations"
      )
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
          created_at,
          updated_at
        `
      )
      .in("session_id", sessionIds)
      .order("created_at", {
        ascending: false,
      });

    if (registrationsError) {
      console.error(
        "GET registrations error:",
        registrationsError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer les inscriptions.",
        },
        { status: 500 }
      );
    }

    const safeSessions = sessions || [];
    const safeRegistrations =
      registrations || [];

    /* ---------------------------------------------------------
       ENRICHISSEMENT
    --------------------------------------------------------- */

    const enrichedRegistrations =
      safeRegistrations.map(
        (registration) => {
          const session =
            safeSessions.find(
              (item) =>
                item.id ===
                registration.session_id
            );

          return {
            ...registration,

            session: session
              ? {
                  id: session.id,
                  start_date:
                    session.start_date,
                  end_date:
                    session.end_date,
                  capacity:
                    session.capacity,
                  status:
                    session.status,
                  location:
                    session.location,
                  format:
                    session.format ||
                    training.format ||
                    "Présentiel",
                }
              : null,
          };
        }
      );

    /* ---------------------------------------------------------
       STATISTIQUES
    --------------------------------------------------------- */

    const stats = {
      total: safeRegistrations.length,

      pending:
        safeRegistrations.filter(
          (item) =>
            item.registration_status ===
            "pending"
        ).length,

      confirmed:
        safeRegistrations.filter(
          (item) =>
            item.registration_status ===
            "confirmed"
        ).length,

      cancelled:
        safeRegistrations.filter(
          (item) =>
            item.registration_status ===
            "cancelled"
        ).length,

      completed:
        safeRegistrations.filter(
          (item) =>
            item.registration_status ===
            "completed"
        ).length,

      paid:
        safeRegistrations.filter(
          (item) =>
            item.payment_status === "paid"
        ).length,

      payment_pending:
        safeRegistrations.filter(
          (item) =>
            item.payment_status ===
            "pending"
        ).length,
    };

    return NextResponse.json({
      training,
      sessions: safeSessions,
      registrations:
        enrichedRegistrations,
      stats,
    });
  } catch (error) {
    console.error(
      "GET registrations unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur inattendue est survenue.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST — PUBLIC
   Création d'une inscription
========================================================= */

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as RegistrationBody;

    const sessionId = clean(
      body.session_id
    );

    const fullName = clean(
      body.full_name
    );

    const email = clean(
      body.email
    );

    const phone = clean(
      body.phone
    );

    const organization = clean(
      body.organization
    );

    /* =========================================================
       VALIDATION
    ========================================================= */

    if (!sessionId) {
      return NextResponse.json(
        {
          error:
            "Veuillez sélectionner une session.",
        },
        { status: 400 }
      );
    }

    if (!fullName) {
      return NextResponse.json(
        {
          error:
            "Le nom complet est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (fullName.length < 2) {
      return NextResponse.json(
        {
          error:
            "Veuillez renseigner un nom complet valide.",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          error:
            "Le numéro de téléphone est obligatoire.",
        },
        { status: 400 }
      );
    }

    if (phone.length < 8) {
      return NextResponse.json(
        {
          error:
            "Veuillez renseigner un numéro de téléphone valide.",
        },
        { status: 400 }
      );
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Veuillez renseigner une adresse e-mail valide.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* =========================================================
       SESSION
    ========================================================= */

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from(
        "professional_training_sessions"
      )
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
          error:
            "Impossible de vérifier cette session.",
        },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Cette session n'existe pas ou n'est plus disponible.",
        },
        { status: 404 }
      );
    }

    /* =========================================================
       STATUT SESSION
    ========================================================= */

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

    /* =========================================================
       DATE
    ========================================================= */

    const today = new Date()
      .toISOString()
      .split("T")[0];

    if (session.start_date < today) {
      return NextResponse.json(
        {
          error:
            "Cette session est déjà passée. Veuillez choisir une prochaine session.",
        },
        { status: 409 }
      );
    }

    /* =========================================================
       FORMATION
    ========================================================= */

    const {
      data: training,
      error: trainingError,
    } = await supabase
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
          error:
            "Impossible de vérifier la formation.",
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

    /* =========================================================
       PRIX SERVEUR
    ========================================================= */

    const amountXaf = Number(
      training.price_xaf
    );

    if (
      !Number.isFinite(amountXaf) ||
      amountXaf < 0
    ) {
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

    /* =========================================================
       PLACES
    ========================================================= */

    const {
      count,
      error: countError,
    } = await supabase
      .from(
        "professional_training_registrations"
      )
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

    if (
      registeredCount >=
      session.capacity
    ) {
      await supabase
        .from(
          "professional_training_sessions"
        )
        .update({
          status: "full",
          updated_at:
            new Date().toISOString(),
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

    /* =========================================================
       DOUBLON
    ========================================================= */

    const {
      data: existingRegistration,
      error: existingError,
    } = await supabase
      .from(
        "professional_training_registrations"
      )
      .select(
        "id, registration_status"
      )
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

    /* =========================================================
       CRÉATION
    ========================================================= */

    const {
      data: registration,
      error: registrationError,
    } = await supabase
      .from(
        "professional_training_registrations"
      )
      .insert({
        session_id: session.id,
        full_name: fullName,
        email: email || null,
        phone,
        organization:
          organization || null,

        registration_status:
          "pending",

        payment_status:
          "pending",

        amount_xaf: amountXaf,

        updated_at:
          new Date().toISOString(),
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

    /* =========================================================
       SYNCHRONISATION SESSION
    ========================================================= */

    const newRegisteredCount =
      registeredCount + 1;

    if (
      newRegisteredCount >=
      session.capacity
    ) {
      await supabase
        .from(
          "professional_training_sessions"
        )
        .update({
          status: "full",
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", session.id)
        .eq("status", "open");
    }

    return NextResponse.json(
      {
        success: true,

        registration: {
          id: registration.id,
          full_name:
            registration.full_name,
          amount_xaf:
            registration.amount_xaf,
          registration_status:
            registration.registration_status,
          payment_status:
            registration.payment_status,
        },

        training: {
          id: training.id,
          title: training.title,
          duration_days:
            training.duration_days,
          price_xaf: amountXaf,
        },

        session: {
          id: session.id,
          start_date:
            session.start_date,
          end_date:
            session.end_date,
          capacity:
            session.capacity,
          registered_count:
            newRegisteredCount,
          places_remaining:
            Math.max(
              session.capacity -
                newRegisteredCount,
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

/* =========================================================
   PATCH — ADMIN
   Modification des statuts
========================================================= */

export async function PATCH(
  request: Request
) {
  try {
    if (!(await isAdminAuthed())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const body =
      (await request.json()) as UpdateRegistrationBody;

    const registrationId =
      clean(body.registration_id);

    const registrationStatus =
      clean(body.registration_status);

    const paymentStatus =
      clean(body.payment_status);

    if (!registrationId) {
      return NextResponse.json(
        {
          error:
            "Identifiant d'inscription manquant.",
        },
        { status: 400 }
      );
    }

    if (
      registrationStatus &&
      !REGISTRATION_STATUSES.includes(
        registrationStatus as any
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Statut d'inscription invalide.",
        },
        { status: 400 }
      );
    }

    if (
      paymentStatus &&
      !PAYMENT_STATUSES.includes(
        paymentStatus as any
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Statut de paiement invalide.",
        },
        { status: 400 }
      );
    }

    if (
      !registrationStatus &&
      !paymentStatus
    ) {
      return NextResponse.json(
        {
          error:
            "Aucune modification demandée.",
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    /* ---------------------------------------------------------
       INSCRIPTION ACTUELLE
    --------------------------------------------------------- */

    const {
      data: existingRegistration,
      error: existingError,
    } = await supabase
      .from(
        "professional_training_registrations"
      )
      .select(
        `
          id,
          session_id,
          registration_status,
          payment_status
        `
      )
      .eq("id", registrationId)
      .maybeSingle();

    if (existingError) {
      console.error(
        "PATCH registration lookup error:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de récupérer cette inscription.",
        },
        { status: 500 }
      );
    }

    if (!existingRegistration) {
      return NextResponse.json(
        {
          error:
            "Inscription introuvable.",
        },
        { status: 404 }
      );
    }

    /* ---------------------------------------------------------
       SESSION
    --------------------------------------------------------- */

    const {
      data: session,
      error: sessionError,
    } = await supabase
      .from(
        "professional_training_sessions"
      )
      .select(
        `
          id,
          capacity,
          status
        `
      )
      .eq(
        "id",
        existingRegistration.session_id
      )
      .maybeSingle();

    if (sessionError) {
      console.error(
        "PATCH registration session error:",
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
          error:
            "La session associée est introuvable.",
        },
        { status: 404 }
      );
    }

    /* ---------------------------------------------------------
       MISE À JOUR
    --------------------------------------------------------- */

    const updates: Record<
      string,
      string
    > = {
      updated_at:
        new Date().toISOString(),
    };

    if (registrationStatus) {
      updates.registration_status =
        registrationStatus;
    }

    if (paymentStatus) {
      updates.payment_status =
        paymentStatus;
    }

    const {
      data: updatedRegistration,
      error: updateError,
    } = await supabase
      .from(
        "professional_training_registrations"
      )
      .update(updates)
      .eq("id", registrationId)
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
          created_at,
          updated_at
        `
      )
      .single();

    if (updateError) {
      console.error(
        "PATCH registration error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Impossible de modifier l'inscription.",
        },
        { status: 500 }
      );
    }

    /* ---------------------------------------------------------
       RECALCUL DES PLACES
    --------------------------------------------------------- */

    const {
      count: activeCount,
      error: activeCountError,
    } = await supabase
      .from(
        "professional_training_registrations"
      )
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "session_id",
        existingRegistration.session_id
      )
      .in("registration_status", [
        "pending",
        "confirmed",
        "completed",
      ]);

    if (!activeCountError) {
      const usedSeats =
        activeCount ?? 0;

      let nextSessionStatus =
        session.status;

      if (
        usedSeats >= session.capacity
      ) {
        nextSessionStatus = "full";
      } else if (
        session.status === "full"
      ) {
        nextSessionStatus = "open";
      }

      if (
        nextSessionStatus !==
        session.status
      ) {
        await supabase
          .from(
            "professional_training_sessions"
          )
          .update({
            status:
              nextSessionStatus,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            session.id
          );
      }
    }

    return NextResponse.json({
      success: true,
      registration:
        updatedRegistration,
    });
  } catch (error) {
    console.error(
      "PATCH registration unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Une erreur inattendue est survenue.",
      },
      { status: 500 }
    );
  }
}
