"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
  pre_registration_enabled: boolean;
  position: number;
  session_count: number;
  registration_count: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
};

type TrainingSession = {
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

const SESSION_STATUSES = [
  {
    value: "draft",
    label: "Brouillon",
  },
  {
    value: "open",
    label: "Ouverte",
  },
  {
    value: "full",
    label: "Complète",
  },
  {
    value: "completed",
    label: "Terminée",
  },
  {
    value: "cancelled",
    label: "Annulée",
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

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

function getSessionStatusLabel(status: string) {
  return (
    SESSION_STATUSES.find(
      (item) => item.value === status
    )?.label || status
  );
}

function getSessionStatusClass(status: string) {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800";

    case "full":
      return "bg-amber-100 text-amber-800";

    case "completed":
      return "bg-blue-100 text-blue-800";

    case "cancelled":
      return "bg-red-100 text-red-800";

    default:
      return "bg-bgAlt text-inkSoft";
  }
}

function isFutureSession(session: TrainingSession) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const start = new Date(
    `${session.start_date}T00:00:00`
  );

  return start >= today;
}

export default function AdminFormationDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const [training, setTraining] =
    useState<Training | null>(null);

  const [sessions, setSessions] = useState<
    TrainingSession[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [sessionsLoading, setSessionsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [sessionError, setSessionError] =
    useState("");

  /* =========================================================
     FORMATION SETTINGS
  ========================================================= */

  const [price, setPrice] =
    useState("");

  const [published, setPublished] =
    useState(false);

  const [
    preRegistrationEnabled,
    setPreRegistrationEnabled,
  ] = useState(false);

  const [savingSettings, setSavingSettings] =
    useState(false);

  const [settingsMessage, setSettingsMessage] =
    useState("");

  /* =========================================================
     SESSION FORM
  ========================================================= */

  const [showSessionForm, setShowSessionForm] =
    useState(false);

  const [editingSessionId, setEditingSessionId] =
    useState<string | null>(null);

  const [sessionStartDate, setSessionStartDate] =
    useState("");

  const [sessionEndDate, setSessionEndDate] =
    useState("");

  const [sessionCapacity, setSessionCapacity] =
    useState("15");

  const [sessionStatus, setSessionStatus] =
    useState("draft");

  const [sessionLocation, setSessionLocation] =
    useState("");

  const [sessionFormat, setSessionFormat] =
    useState("Présentiel");

  const [savingSession, setSavingSession] =
    useState(false);

  const [deletingSessionId, setDeletingSessionId] =
    useState<string | null>(null);

  /* =========================================================
     LOAD FORMATION
  ========================================================= */

  async function loadTraining() {
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
            "Impossible de charger la formation."
        );
      }

      const found = (
        data.trainings || []
      ).find(
        (item: Training) =>
          item.id === id
      );

      if (!found) {
        throw new Error(
          "Cette formation est introuvable."
        );
      }

      setTraining(found);

      setPrice(
        String(found.price_xaf ?? 60000)
      );

      setPublished(
        Boolean(found.published)
      );

      setPreRegistrationEnabled(
        Boolean(
          found.pre_registration_enabled
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger la formation."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     LOAD SESSIONS
  ========================================================= */

  async function loadSessions() {
    setSessionsLoading(true);
    setSessionError("");

    try {
      const response = await fetch(
        `/api/professional-trainings/${id}/sessions`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de charger les sessions."
        );
      }

      setSessions(
        data.sessions || []
      );
    } catch (err) {
      setSessionError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les sessions."
      );
    } finally {
      setSessionsLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;

    loadTraining();
    loadSessions();
  }, [id]);

  /* =========================================================
     FORMATION SETTINGS
  ========================================================= */

  async function saveSettings() {
    setSavingSettings(true);
    setSettingsMessage("");
    setError("");

    try {
      const numericPrice = Number(price);

      if (
        !Number.isInteger(numericPrice) ||
        numericPrice < 0
      ) {
        throw new Error(
          "Le prix doit être un montant valide."
        );
      }

      const response = await fetch(
        "/api/professional-trainings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            price_xaf: numericPrice,
            published,
            pre_registration_enabled:
              preRegistrationEnabled,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'enregistrer les paramètres."
        );
      }

      setTraining(data.training);

      setSettingsMessage(
        "Les paramètres ont été enregistrés."
      );

      setTimeout(() => {
        setSettingsMessage("");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer les paramètres."
      );
    } finally {
      setSavingSettings(false);
    }
  }

  /* =========================================================
     SESSION FORM
  ========================================================= */

  function openNewSessionForm() {
    setEditingSessionId(null);

    setSessionStartDate("");
    setSessionEndDate("");
    setSessionCapacity("15");
    setSessionStatus("draft");
    setSessionLocation("");
    setSessionFormat("Présentiel");

    setSessionError("");
    setShowSessionForm(true);
  }

  function openEditSessionForm(
    session: TrainingSession
  ) {
    setEditingSessionId(session.id);

    setSessionStartDate(
      session.start_date
    );

    setSessionEndDate(
      session.end_date || ""
    );

    setSessionCapacity(
      String(session.capacity)
    );

    setSessionStatus(
      session.status
    );

    setSessionLocation(
      session.location || ""
    );

    setSessionFormat(
      session.format || "Présentiel"
    );

    setSessionError("");
    setShowSessionForm(true);
  }

  function closeSessionForm() {
    if (savingSession) return;

    setShowSessionForm(false);
    setEditingSessionId(null);

    setSessionStartDate("");
    setSessionEndDate("");
    setSessionCapacity("15");
    setSessionStatus("draft");
    setSessionLocation("");
    setSessionFormat("Présentiel");

    setSessionError("");
  }

  async function handleSaveSession(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSavingSession(true);
    setSessionError("");

    try {
      if (!sessionStartDate) {
        throw new Error(
          "La date de début est obligatoire."
        );
      }

      const capacity =
        Number(sessionCapacity);

      if (
        !Number.isInteger(capacity) ||
        capacity < 1 ||
        capacity > 50
      ) {
        throw new Error(
          "La capacité doit être comprise entre 1 et 50 participants."
        );
      }

      if (
        sessionEndDate &&
        sessionEndDate < sessionStartDate
      ) {
        throw new Error(
          "La date de fin ne peut pas être antérieure à la date de début."
        );
      }

      const response = await fetch(
        `/api/professional-trainings/${id}/sessions`,
        {
          method: editingSessionId
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            editingSessionId
              ? {
                  session_id:
                    editingSessionId,
                  start_date:
                    sessionStartDate,
                  end_date:
                    sessionEndDate ||
                    null,
                  capacity,
                  status:
                    sessionStatus,
                  location:
                    sessionLocation.trim() ||
                    null,
                  format:
                    sessionFormat.trim() ||
                    "Présentiel",
                }
              : {
                  start_date:
                    sessionStartDate,
                  end_date:
                    sessionEndDate ||
                    null,
                  capacity,
                  status:
                    sessionStatus,
                  location:
                    sessionLocation.trim() ||
                    null,
                  format:
                    sessionFormat.trim() ||
                    "Présentiel",
                }
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'enregistrer la session."
        );
      }

      closeSessionForm();

      await loadSessions();
      await loadTraining();
    } catch (err) {
      setSessionError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer la session."
      );
    } finally {
      setSavingSession(false);
    }
  }

  async function handleDeleteSession(
    sessionId: string
  ) {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer cette session ?"
      );

    if (!confirmed) return;

    setDeletingSessionId(sessionId);
    setSessionError("");

    try {
      const response = await fetch(
        `/api/professional-trainings/${id}/sessions?session_id=${sessionId}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de supprimer la session."
        );
      }

      await loadSessions();
      await loadTraining();
    } catch (err) {
      setSessionError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer la session."
      );
    } finally {
      setDeletingSessionId(null);
    }
  }

  /* =========================================================
     SESSIONS — DERIVED DATA
  ========================================================= */

  const nextSession = useMemo(() => {
    return (
      sessions
        .filter(
          (session) =>
            isFutureSession(session) &&
            session.status !==
              "cancelled" &&
            session.status !==
              "completed"
        )
        .sort((a, b) =>
          a.start_date.localeCompare(
            b.start_date
          )
        )[0] || null
    );
  }, [sessions]);

  const pastSessions = useMemo(() => {
    return [...sessions]
      .filter(
        (session) =>
          !isFutureSession(session)
      )
      .sort((a, b) =>
        b.start_date.localeCompare(
          a.start_date
        )
      );
  }, [sessions]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <AdminNav />

        <main className="mx-auto max-w-[1100px] px-5 py-12">
          <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-14 text-center">
            <p className="text-sm text-inkSoft">
              Chargement de la formation…
            </p>
          </div>
        </main>
      </>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !training) {
    return (
      <>
        <AdminNav />

        <main className="mx-auto max-w-[1100px] px-5 py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8">
            <p className="font-semibold text-red-800">
              {error ||
                "Formation introuvable."}
            </p>

            <Link
              href="/admin/formations"
              className="mt-5 inline-flex rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              ← Retour aux formations
            </Link>
          </div>
        </main>
      </>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-5 py-9">
        {/* RETOUR */}

        <Link
          href="/admin/formations"
          className="inline-flex items-center text-sm font-semibold text-inkSoft transition hover:text-ink"
        >
          ← Retour aux formations
        </Link>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
          <div className="flex flex-col lg:flex-row">
            <div className="relative min-h-[260px] bg-bgAlt lg:w-[340px]">
              {training.cover_image_url ? (
                <img
                  src={
                    training.cover_image_url
                  }
                  alt="Formation professionnelle AgroFarms237"
                  className="h-full min-h-[260px] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[260px] items-center justify-center px-6 text-center">
                  <span className="text-sm text-inkSoft">
                    AgroFarms237
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 p-7 lg:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-goldDeep">
                  Formation professionnelle
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    training.published
                      ? "bg-green-100 text-green-800"
                      : "bg-bgAlt text-inkSoft"
                  }`}
                >
                  {training.published
                    ? "Visible sur le site"
                    : "Masquée du site"}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl font-semibold text-ink">
                Formation professionnelle
                AgroFarms237
              </h1>

              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-inkSoft">
                Cette page sert uniquement à
                programmer et gérer la disponibilité
                commerciale de la formation.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-bgAlt p-4">
                  <p className="text-xs text-inkSoft">
                    Prix actuel
                  </p>

                  <p className="mt-1 font-semibold text-ink">
                    {formatPrice(
                      training.price_xaf
                    )}{" "}
                    FCFA
                  </p>
                </div>

                <div className="rounded-xl bg-bgAlt p-4">
                  <p className="text-xs text-inkSoft">
                    Durée
                  </p>

                  <p className="mt-1 font-semibold text-ink">
                    {training.duration_days}{" "}
                    jours
                  </p>
                </div>

                <div className="rounded-xl bg-bgAlt p-4">
                  <p className="text-xs text-inkSoft">
                    Format
                  </p>

                  <p className="mt-1 font-semibold text-ink">
                    {training.format ||
                      "Présentiel"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PARAMÈTRES COMMERCIAUX
        ====================================================== */}

        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-6 md:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
              Configuration
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
              Paramètres commerciaux
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-inkSoft">
              Gérez ici uniquement le prix et la
              visibilité de la formation. Le contenu
              de la landing page reste fixe.
            </p>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* PRIX */}

            <div>
              <label className="text-sm font-semibold text-ink">
                Tarif de la formation
              </label>

              <div className="mt-2 flex">
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  className="w-full rounded-l-xl border border-r-0 border-ink/10 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-ink/30"
                />

                <span className="flex items-center rounded-r-xl border border-ink/10 bg-bgAlt px-4 text-sm font-semibold text-inkSoft">
                  FCFA
                </span>
              </div>

              <p className="mt-2 text-xs text-inkSoft">
                Valeur actuelle recommandée :
                60 000 FCFA.
              </p>
            </div>

            {/* VISIBILITÉ */}

            <div className="space-y-4">
              <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-ink/10 bg-bgAlt p-4">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold text-ink">
                    Afficher la formation sur
                    le site public
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-inkSoft">
                    Si activé, AgroFarms237 peut
                    afficher la disponibilité de
                    la formation sur la landing
                    page.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-ink/10 bg-bgAlt p-4">
                <input
                  type="checkbox"
                  checked={
                    preRegistrationEnabled
                  }
                  onChange={(event) =>
                    setPreRegistrationEnabled(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  <span className="block text-sm font-semibold text-ink">
                    Autoriser les
                    pré-inscriptions
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-inkSoft">
                    Permet aux personnes intéressées
                    de réserver leur intérêt même
                    lorsqu'aucune date n'est encore
                    disponible. Aucun paiement n'est
                    demandé.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {settingsMessage && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {settingsMessage}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end border-t border-ink/10 pt-5">
            <button
              type="button"
              onClick={saveSettings}
              disabled={savingSettings}
              className="cursor-pointer rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingSettings
                ? "Enregistrement..."
                : "Enregistrer les paramètres"}
            </button>
          </div>
        </section>

        {/* =====================================================
            PROCHAINE SESSION
        ====================================================== */}

        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-6 md:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
                Disponibilité
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
                Prochaine session
              </h2>

              <p className="mt-2 text-sm leading-6 text-inkSoft">
                C'est ici que vous programmez la
                prochaine date de formation.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewSessionForm}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Programmer une session
            </button>
          </div>

          {/* FORMULAIRE */}

          {showSessionForm && (
            <div className="mt-7 rounded-2xl border border-ink/10 bg-bgAlt p-5 md:p-6">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-inkSoft">
                  {editingSessionId
                    ? "Modification"
                    : "Nouvelle session"}
                </p>

                <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
                  {editingSessionId
                    ? "Modifier la session"
                    : "Programmer une nouvelle session"}
                </h3>
              </div>

              <form
                onSubmit={
                  handleSaveSession
                }
                className="space-y-6"
              >
                {/* DATES */}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Date de début *
                    </label>

                    <input
                      type="date"
                      value={
                        sessionStartDate
                      }
                      onChange={(event) =>
                        setSessionStartDate(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Date de fin
                    </label>

                    <input
                      type="date"
                      value={
                        sessionEndDate
                      }
                      min={
                        sessionStartDate ||
                        undefined
                      }
                      onChange={(event) =>
                        setSessionEndDate(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                    />
                  </div>
                </div>

                {/* LIEU */}

                <div>
                  <label className="text-sm font-semibold text-ink">
                    Lieu
                  </label>

                  <input
                    value={sessionLocation}
                    onChange={(event) =>
                      setSessionLocation(
                        event.target.value
                      )
                    }
                    placeholder="Ex. Yaoundé — lieu à confirmer"
                    className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                  />
                </div>

                {/* PLACES + FORMAT */}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Nombre de places *
                    </label>

                    <div className="mt-2 flex">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={
                          sessionCapacity
                        }
                        onChange={(event) =>
                          setSessionCapacity(
                            event.target.value
                          )
                        }
                        className="w-full rounded-l-xl border border-r-0 border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                      />

                      <span className="flex items-center rounded-r-xl border border-ink/10 bg-white px-4 text-sm text-inkSoft">
                        places
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-inkSoft">
                      Par défaut : 15. Maximum :
                      50.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Format
                    </label>

                    <select
                      value={sessionFormat}
                      onChange={(event) =>
                        setSessionFormat(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                    >
                      <option value="Présentiel">
                        Présentiel
                      </option>

                      <option value="En ligne">
                        En ligne
                      </option>

                      <option value="Hybride">
                        Hybride
                      </option>
                    </select>
                  </div>
                </div>

                {/* STATUT */}

                <div>
                  <label className="text-sm font-semibold text-ink">
                    Statut de la session
                  </label>

                  <select
                    value={sessionStatus}
                    onChange={(event) =>
                      setSessionStatus(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                  >
                    {SESSION_STATUSES.map(
                      (status) => (
                        <option
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </option>
                      )
                    )}
                  </select>

                  <p className="mt-2 text-xs text-inkSoft">
                    Pour afficher une session
                    comme disponible, utilisez
                    « Ouverte ».
                  </p>
                </div>

                {sessionError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {sessionError}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      closeSessionForm
                    }
                    disabled={savingSession}
                    className="cursor-pointer rounded-xl border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-paper disabled:opacity-50"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={savingSession}
                    className="cursor-pointer rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingSession
                      ? "Enregistrement..."
                      : editingSessionId
                      ? "Enregistrer"
                      : "Programmer la session"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PROCHAINE SESSION */}

          {!sessionsLoading &&
            nextSession && (
              <div className="mt-7 overflow-hidden rounded-2xl border border-green-200 bg-green-50/50">
                <div className="border-b border-green-200 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
                      Prochaine session
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getSessionStatusClass(
                        nextSession.status
                      )}`}
                    >
                      {getSessionStatusLabel(
                        nextSession.status
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="border-b border-green-200 p-5 lg:border-b-0 lg:border-r">
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

                  <div className="border-b border-green-200 p-5 lg:border-b-0 lg:border-r">
                    <p className="text-xs text-inkSoft">
                      Lieu
                    </p>

                    <p className="mt-2 font-semibold text-ink">
                      {nextSession.location ||
                        "Lieu à confirmer"}
                    </p>
                  </div>

                  <div className="border-b border-green-200 p-5 lg:border-b-0 lg:border-r">
                    <p className="text-xs text-inkSoft">
                      Places
                    </p>

                    <p className="mt-2 font-semibold text-ink">
                      {nextSession.capacity}
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-inkSoft">
                      Tarif
                    </p>

                    <p className="mt-2 font-semibold text-ink">
                      {formatPrice(
                        training.price_xaf
                      )}{" "}
                      FCFA
                    </p>
                  </div>
                </div>

                <div className="flex justify-end border-t border-green-200 p-4">
                  <button
                    type="button"
                    onClick={() =>
                      openEditSessionForm(
                        nextSession
                      )
                    }
                    className="cursor-pointer rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-xs font-semibold text-ink hover:bg-bgAlt"
                  >
                    Modifier la session
                  </button>
                </div>
              </div>
            )}

          {!sessionsLoading &&
            !nextSession && (
              <div className="mt-7 rounded-2xl border border-dashed border-ink/15 bg-bgAlt px-6 py-10 text-center">
                <p className="font-serif text-xl font-semibold text-ink">
                  Aucune prochaine session
                </p>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-inkSoft">
                  Programmez une date lorsque vous
                  serez prêt. Si les pré-inscriptions
                  sont activées, le site pourra
                  recueillir les personnes intéressées
                  en attendant.
                </p>
              </div>
            )}
        </section>

        {/* =====================================================
            HISTORIQUE
        ====================================================== */}

        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-6 md:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
              Historique
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
              Sessions passées
            </h2>
          </div>

          {sessionsLoading ? (
            <div className="mt-6 rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-10 text-center">
              <p className="text-sm text-inkSoft">
                Chargement…
              </p>
            </div>
          ) : pastSessions.length ===
            0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-10 text-center">
              <p className="text-sm text-inkSoft">
                Aucune session passée pour le
                moment.
              </p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/10 bg-white">
              {pastSessions.map(
                (session) => (
                  <div
                    key={session.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
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

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getSessionStatusClass(
                            session.status
                          )}`}
                        >
                          {getSessionStatusLabel(
                            session.status
                          )}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-inkSoft">
                        {session.location ||
                          "Lieu non renseigné"}{" "}
                        •{" "}
                        {session.capacity}{" "}
                        places
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditSessionForm(
                            session
                          )
                        }
                        className="cursor-pointer rounded-lg border border-ink/10 px-3 py-2 text-xs font-semibold text-ink hover:bg-bgAlt"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSession(
                            session.id
                          )
                        }
                        disabled={
                          deletingSessionId ===
                          session.id
                        }
                        className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingSessionId ===
                        session.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            INSCRIPTIONS
        ====================================================== */}

        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-6 md:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-goldDeep">
                Participants
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
                Inscriptions
              </h2>

              <p className="mt-2 text-sm leading-6 text-inkSoft">
                Les inscriptions et pré-inscriptions
                seront affichées ici une fois le
                formulaire public connecté.
              </p>
            </div>

            <div className="rounded-xl bg-bgAlt px-5 py-4">
              <p className="text-xs text-inkSoft">
                Inscriptions confirmées
              </p>

              <p className="mt-1 text-2xl font-semibold text-ink">
                {training.registration_count}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
