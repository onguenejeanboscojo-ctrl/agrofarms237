"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";

type Training = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_image_url: string | null;
  category: string | null;
  level: string | null;
  duration_days: number;
  price_xaf: number;
  format: string | null;
  certificate: boolean;
  published: boolean;
  position: number;
  session_count: number;
  registration_count: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
};

type Stats = {
  trainings: number;
  sessions: number;
  registrations: number;
  available_seats: number;
};

type Session = {
  id: string;
  training_id: string;
  start_date: string;
  end_date: string | null;
  capacity: number;
  status:
    | "draft"
    | "open"
    | "full"
    | "completed"
    | "cancelled";
  location: string | null;
  format: string | null;
  created_at: string;
  updated_at: string;
};

const EMPTY_STATS: Stats = {
  trainings: 0,
  sessions: 0,
  registrations: 0,
  available_seats: 0,
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function formatDate(value: string | null) {
  if (!value) return "Date non définie";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getSessionLabel(session: Session) {
  switch (session.status) {
    case "open":
      return "Ouverte";

    case "full":
      return "Complète";

    case "completed":
      return "Terminée";

    case "cancelled":
      return "Annulée";

    case "draft":
    default:
      return "Brouillon";
  }
}

function getSessionClass(session: Session) {
  switch (session.status) {
    case "open":
      return "bg-green-100 text-green-800";

    case "full":
      return "bg-amber-100 text-amber-800";

    case "completed":
      return "bg-bgAlt text-inkSoft";

    case "cancelled":
      return "bg-red-100 text-red-700";

    case "draft":
    default:
      return "bg-blue-50 text-blue-700";
  }
}

function isFutureSession(session: Session) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(`${session.start_date}T00:00:00`);

  return start >= today;
}

export default function AdminFormationsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [sessions, setSessions] = useState<
    Record<string, Session[]>
  >({});

  const [stats, setStats] =
    useState<Stats>(EMPTY_STATS);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadTrainings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/professional-trainings",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de charger les formations."
        );
      }

      const loadedTrainings =
        data.trainings || [];

      setTrainings(loadedTrainings);
      setStats(
        data.stats || EMPTY_STATS
      );

      /*
       * Les sessions sont récupérées séparément.
       * Cela permet à l'Admin de gérer les dates
       * sans exposer toute cette logique dans
       * la fiche de formation elle-même.
       */
      const sessionEntries =
        await Promise.all(
          loadedTrainings.map(
            async (training: Training) => {
              try {
                const sessionResponse =
                  await fetch(
                    `/api/professional-trainings/${training.id}/sessions`,
                    {
                      cache: "no-store",
                    }
                  );

                const sessionData =
                  await sessionResponse.json();

                if (!sessionResponse.ok) {
                  return [
                    training.id,
                    [],
                  ] as const;
                }

                return [
                  training.id,
                  sessionData.sessions ||
                    [],
                ] as const;
              } catch {
                return [
                  training.id,
                  [],
                ] as const;
              }
            }
          )
        );

      setSessions(
        Object.fromEntries(sessionEntries)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les formations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrainings();
  }, []);

  /*
   * La formation professionnelle actuelle est
   * volontairement traitée comme une offre fixe.
   *
   * Le contenu commercial se trouve sur la landing
   * page et ne doit pas être dupliqué ici.
   */
  const activeTraining =
    trainings.length > 0
      ? trainings[0]
      : null;

  const trainingSessions =
    activeTraining
      ? sessions[activeTraining.id] || []
      : [];

  const futureSessions =
    trainingSessions.filter(
      isFutureSession
    );

  const nextSession =
    futureSessions
      .filter(
        (session) =>
          session.status !== "cancelled" &&
          session.status !== "completed"
      )
      .sort((a, b) =>
        a.start_date.localeCompare(
          b.start_date
        )
      )[0] || null;

  const pastSessions =
    trainingSessions.filter(
      (session) =>
        !isFutureSession(session)
    );

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-5 py-9">
        {/* ===================================================== */}
        {/* HEADER                                                */}
        {/* ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-inkSoft">
              AgroFarms237
            </p>

            <h1 className="font-serif text-3xl font-semibold text-ink">
              Formations professionnelles
            </h1>

            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-inkSoft">
              Gérez les sessions, les dates, les
              lieux, les places et la disponibilité
              de votre formation professionnelle.
            </p>
          </div>

          <button
            type="button"
            onClick={loadTrainings}
            disabled={loading}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-ink/10 bg-paper px-5 py-3 text-sm font-semibold text-ink transition hover:bg-bgAlt disabled:opacity-50"
          >
            {loading
              ? "Actualisation..."
              : "Actualiser"}
          </button>
        </div>

        {/* ===================================================== */}
        {/* ERROR                                                 */}
        {/* ===================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================== */}
        {/* KPI                                                    */}
        {/* ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Sessions
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {loading
                ? "…"
                : stats.sessions}
            </p>

            <p className="mt-1 text-xs text-inkSoft">
              Programmées ou passées
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Inscriptions
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {loading
                ? "…"
                : stats.registrations}
            </p>

            <p className="mt-1 text-xs text-inkSoft">
              Confirmées
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Places disponibles
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {loading
                ? "…"
                : stats.available_seats}
            </p>

            <p className="mt-1 text-xs text-inkSoft">
              Sur les sessions existantes
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Pré-inscriptions
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              —
            </p>

            <p className="mt-1 text-xs text-inkSoft">
              Gestion détaillée dans la prochaine étape
            </p>
          </div>
        </section>

        {/* ===================================================== */}
        {/* OFFRE FIXE                                             */}
        {/* ===================================================== */}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-ink/10 bg-paper px-6 py-14 text-center">
            <p className="text-sm text-inkSoft">
              Chargement de la formation…
            </p>
          </div>
        ) : !activeTraining ? (
          <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-paper px-6 py-14 text-center">
            <p className="font-serif text-2xl font-semibold text-ink">
              Formation professionnelle
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-inkSoft">
              La formation professionnelle AgroFarms237
              n'est pas encore initialisée dans
              l'administration.
            </p>

            <p className="mt-4 text-xs text-inkSoft">
              Nous initialiserons cette offre dans
              l'étape suivante sans modifier la
              landing page.
            </p>
          </div>
        ) : (
          <>
            <section className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
              <div className="flex flex-col lg:flex-row">
                {/* IMAGE */}

                <div className="relative aspect-[16/8] w-full overflow-hidden bg-bgAlt lg:aspect-auto lg:min-h-[320px] lg:w-[360px]">
                  {activeTraining.cover_image_url ? (
                    <img
                      src={
                        activeTraining.cover_image_url
                      }
                      alt={activeTraining.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-inkSoft">
                      AgroFarms237
                    </div>
                  )}
                </div>

                {/* CONTENU */}

                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-goldDeep">
                          Formation professionnelle
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            activeTraining.published
                              ? "bg-green-100 text-green-800"
                              : "bg-bgAlt text-inkSoft"
                          }`}
                        >
                          {activeTraining.published
                            ? "Offre active"
                            : "Offre inactive"}
                        </span>
                      </div>

                      <h2 className="mt-4 max-w-2xl font-serif text-2xl font-semibold text-ink md:text-3xl">
                        Formation professionnelle
                        AgroFarms237
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-inkSoft">
                        Le contenu de cette formation
                        est géré directement sur la
                        landing page publique. Ici,
                        vous gérez uniquement sa
                        disponibilité commerciale.
                      </p>
                    </div>

                    <div className="shrink-0 sm:text-right">
                      <p className="text-2xl font-semibold text-ink">
                        {formatPrice(
                          activeTraining.price_xaf
                        )}{" "}
                        FCFA
                      </p>

                      <p className="mt-1 text-xs text-inkSoft">
                        {activeTraining.duration_days}{" "}
                        jours •{" "}
                        {activeTraining.format ||
                          "Présentiel"}
                      </p>
                    </div>
                  </div>

                  {/* PARAMÈTRES FIXES */}

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-bgAlt p-4">
                      <p className="text-xs text-inkSoft">
                        Tarif
                      </p>

                      <p className="mt-1 font-semibold text-ink">
                        {formatPrice(
                          activeTraining.price_xaf
                        )}{" "}
                        FCFA
                      </p>
                    </div>

                    <div className="rounded-xl bg-bgAlt p-4">
                      <p className="text-xs text-inkSoft">
                        Durée
                      </p>

                      <p className="mt-1 font-semibold text-ink">
                        {activeTraining.duration_days}{" "}
                        jours
                      </p>
                    </div>

                    <div className="rounded-xl bg-bgAlt p-4">
                      <p className="text-xs text-inkSoft">
                        Format
                      </p>

                      <p className="mt-1 font-semibold text-ink">
                        {activeTraining.format ||
                          "Présentiel"}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}

                  <div className="mt-7 flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-inkSoft">
                      Les dates et disponibilités
                      sont gérées dans les sessions.
                    </p>

                    <Link
                      href={`/admin/formations/${activeTraining.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Gérer les sessions
                      <span className="ml-2">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================= */}
            {/* PROCHAINE SESSION                                  */}
            {/* ================================================= */}

            <section className="mt-8">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
                  Disponibilité publique
                </p>

                <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
                  Prochaine session
                </h2>

                <p className="mt-1 text-sm text-inkSoft">
                  C'est cette session qui pourra être
                  affichée sur la landing page.
                </p>
              </div>

              {!nextSession ? (
                <div className="rounded-2xl border border-dashed border-ink/15 bg-paper px-6 py-12">
                  <p className="font-serif text-xl font-semibold text-ink">
                    Aucune prochaine session
                  </p>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-inkSoft">
                    Aucune date future active n'est
                    actuellement programmée. Le site
                    pourra proposer la pré-inscription
                    afin de recueillir les personnes
                    intéressées.
                  </p>

                  <div className="mt-5">
                    <Link
                      href={`/admin/formations/${activeTraining.id}`}
                      className="inline-flex items-center rounded-xl border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-bgAlt"
                    >
                      Programmer une session
                      <span className="ml-2">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
                  <div className="grid gap-0 md:grid-cols-4">
                    <div className="border-b border-ink/10 p-5 md:border-b-0 md:border-r">
                      <p className="text-xs text-inkSoft">
                        Date
                      </p>

                      <p className="mt-2 font-semibold text-ink">
                        {formatDate(
                          nextSession.start_date
                        )}
                      </p>

                      {nextSession.end_date && (
                        <p className="mt-1 text-sm text-inkSoft">
                          au{" "}
                          {formatDate(
                            nextSession.end_date
                          )}
                        </p>
                      )}
                    </div>

                    <div className="border-b border-ink/10 p-5 md:border-b-0 md:border-r">
                      <p className="text-xs text-inkSoft">
                        Lieu
                      </p>

                      <p className="mt-2 font-semibold text-ink">
                        {nextSession.location ||
                          "Lieu à confirmer"}
                      </p>
                    </div>

                    <div className="border-b border-ink/10 p-5 md:border-b-0 md:border-r">
                      <p className="text-xs text-inkSoft">
                        Places
                      </p>

                      <p className="mt-2 font-semibold text-ink">
                        {nextSession.capacity}
                      </p>

                      <p className="mt-1 text-sm text-inkSoft">
                        capacité maximale
                      </p>
                    </div>

                    <div className="p-5">
                      <p className="text-xs text-inkSoft">
                        Statut
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getSessionClass(
                          nextSession
                        )}`}
                      >
                        {getSessionLabel(
                          nextSession
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-ink/10 bg-bgAlt p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Affichage public
                      </p>

                      <p className="mt-1 text-xs text-inkSoft">
                        L'activation de cette session
                        sera gérée dans son espace de
                        configuration.
                      </p>
                    </div>

                    <Link
                      href={`/admin/formations/${activeTraining.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Modifier la session
                      <span className="ml-2">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* ================================================= */}
            {/* HISTORIQUE                                         */}
            {/* ================================================= */}

            <section className="mt-10">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
                  Historique
                </p>

                <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
                  Sessions précédentes
                </h2>
              </div>

              {pastSessions.length === 0 ? (
                <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-10 text-center">
                  <p className="text-sm text-inkSoft">
                    Aucune session passée pour le
                    moment.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
                  <div className="divide-y divide-ink/10">
                    {pastSessions
                      .sort((a, b) =>
                        b.start_date.localeCompare(
                          a.start_date
                        )
                      )
                      .map((session) => (
                        <div
                          key={session.id}
                          className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-ink">
                              {formatDate(
                                session.start_date
                              )}
                              {session.end_date
                                ? ` — ${formatDate(
                                    session.end_date
                                  )}`
                                : ""}
                            </p>

                            <p className="mt-1 text-sm text-inkSoft">
                              {session.location ||
                                "Lieu non renseigné"}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getSessionClass(
                                session
                              )}`}
                            >
                              {getSessionLabel(
                                session
                              )}
                            </span>

                            <Link
                              href={`/admin/formations/${activeTraining.id}`}
                              className="rounded-lg border border-ink/10 px-3 py-2 text-xs font-semibold text-ink hover:bg-bgAlt"
                            >
                              Gérer
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
