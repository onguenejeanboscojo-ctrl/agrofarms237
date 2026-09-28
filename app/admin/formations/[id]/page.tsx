"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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
  position: number;

  session_count: number;
  registration_count: number;
  available_seats: number;

  created_at: string;
  updated_at: string;
};

type TrainingModule = {
  id: string;
  training_id: string;
  title: string;
  description: string | null;
  position: number;
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

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
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

export default function AdminFormationDetailPage() {
  const params = useParams();

  const id = params.id as string;

  const [training, setTraining] =
    useState<Training | null>(null);

  const [modules, setModules] = useState<
    TrainingModule[]
  >([]);

  const [sessions, setSessions] = useState<
    TrainingSession[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [modulesLoading, setModulesLoading] =
    useState(true);
  const [sessionsLoading, setSessionsLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [moduleError, setModuleError] =
    useState("");
  const [sessionError, setSessionError] =
    useState("");

  /* =========================
     MODULE FORM
  ========================= */

  const [showModuleForm, setShowModuleForm] =
    useState(false);

  const [editingModuleId, setEditingModuleId] =
    useState<string | null>(null);

  const [moduleTitle, setModuleTitle] =
    useState("");

  const [moduleDescription, setModuleDescription] =
    useState("");

  const [savingModule, setSavingModule] =
    useState(false);

  const [deletingModuleId, setDeletingModuleId] =
    useState<string | null>(null);

  /* =========================
     SESSION FORM
  ========================= */

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
    useState("");

  const [savingSession, setSavingSession] =
    useState(false);

  const [deletingSessionId, setDeletingSessionId] =
    useState<string | null>(null);

  /* =========================
     LOAD TRAINING
  ========================= */

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

      const found = (data.trainings || []).find(
        (item: Training) => item.id === id
      );

      if (!found) {
        throw new Error(
          "Cette formation est introuvable."
        );
      }

      setTraining(found);
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

  /* =========================
     LOAD MODULES
  ========================= */

  async function loadModules() {
    setModulesLoading(true);
    setModuleError("");

    try {
      const response = await fetch(
        `/api/professional-trainings/${id}/modules`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de charger le programme."
        );
      }

      setModules(data.modules || []);
    } catch (err) {
      setModuleError(
        err instanceof Error
          ? err.message
          : "Impossible de charger le programme."
      );
    } finally {
      setModulesLoading(false);
    }
  }

  /* =========================
     LOAD SESSIONS
  ========================= */

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

      setSessions(data.sessions || []);
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
    loadModules();
    loadSessions();
  }, [id]);

  /* =========================
     MODULE ACTIONS
  ========================= */

  function openNewModuleForm() {
    setEditingModuleId(null);
    setModuleTitle("");
    setModuleDescription("");
    setModuleError("");
    setShowModuleForm(true);
  }

  function openEditModuleForm(
    module: TrainingModule
  ) {
    setEditingModuleId(module.id);
    setModuleTitle(module.title);
    setModuleDescription(
      module.description || ""
    );
    setModuleError("");
    setShowModuleForm(true);
  }

  function closeModuleForm() {
    if (savingModule) return;

    setShowModuleForm(false);
    setEditingModuleId(null);
    setModuleTitle("");
    setModuleDescription("");
    setModuleError("");
  }

  async function handleSaveModule(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSavingModule(true);
    setModuleError("");

    try {
      if (!moduleTitle.trim()) {
        setModuleError(
          "Le titre du module est obligatoire."
        );
        return;
      }

      const response = await fetch(
        `/api/professional-trainings/${id}/modules`,
        {
          method: editingModuleId
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            editingModuleId
              ? {
                  module_id: editingModuleId,
                  title: moduleTitle.trim(),
                  description:
                    moduleDescription.trim() ||
                    null,
                }
              : {
                  title: moduleTitle.trim(),
                  description:
                    moduleDescription.trim() ||
                    null,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'enregistrer le module."
        );
      }

      closeModuleForm();

      await loadModules();
      await loadTraining();
    } catch (err) {
      setModuleError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le module."
      );
    } finally {
      setSavingModule(false);
    }
  }

  async function handleDeleteModule(
    moduleId: string
  ) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce module ?"
    );

    if (!confirmed) return;

    setDeletingModuleId(moduleId);
    setModuleError("");

    try {
      const response = await fetch(
        `/api/professional-trainings/${id}/modules?module_id=${moduleId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible de supprimer le module."
        );
      }

      await loadModules();
    } catch (err) {
      setModuleError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer le module."
      );
    } finally {
      setDeletingModuleId(null);
    }
  }

  /* =========================
     SESSION ACTIONS
  ========================= */

  function openNewSessionForm() {
    setEditingSessionId(null);
    setSessionStartDate("");
    setSessionEndDate("");
    setSessionCapacity("15");
    setSessionStatus("draft");
    setSessionLocation("");
    setSessionFormat("");
    setSessionError("");
    setShowSessionForm(true);
  }

  function openEditSessionForm(
    session: TrainingSession
  ) {
    setEditingSessionId(session.id);
    setSessionStartDate(session.start_date);
    setSessionEndDate(session.end_date || "");
    setSessionCapacity(
      String(session.capacity)
    );
    setSessionStatus(session.status);
    setSessionLocation(
      session.location || ""
    );
    setSessionFormat(session.format || "");
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
    setSessionFormat("");
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
        setSessionError(
          "La date de début est obligatoire."
        );
        return;
      }

      const capacity = Number(sessionCapacity);

      if (
        !Number.isInteger(capacity) ||
        capacity < 1 ||
        capacity > 50
      ) {
        setSessionError(
          "La capacité doit être comprise entre 1 et 50 participants."
        );
        return;
      }

      if (
        sessionEndDate &&
        sessionEndDate < sessionStartDate
      ) {
        setSessionError(
          "La date de fin ne peut pas être antérieure à la date de début."
        );
        return;
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
                  session_id: editingSessionId,
                  start_date: sessionStartDate,
                  end_date:
                    sessionEndDate || null,
                  capacity,
                  status: sessionStatus,
                  location:
                    sessionLocation.trim() ||
                    null,
                  format:
                    sessionFormat.trim() ||
                    null,
                }
              : {
                  start_date: sessionStartDate,
                  end_date:
                    sessionEndDate || null,
                  capacity,
                  status: sessionStatus,
                  location:
                    sessionLocation.trim() ||
                    null,
                  format:
                    sessionFormat.trim() ||
                    null,
                }
          ),
        }
      );

      const data = await response.json();

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
    const confirmed = window.confirm(
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

      const data = await response.json();

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

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <AdminNav />

        <main className="mx-auto max-w-[1180px] px-5 py-12">
          <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-14 text-center">
            <p className="text-sm text-inkSoft">
              Chargement de la formation…
            </p>
          </div>
        </main>
      </>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !training) {
    return (
      <>
        <AdminNav />

        <main className="mx-auto max-w-[1180px] px-5 py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8">
            <p className="font-semibold text-red-800">
              {error || "Formation introuvable."}
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

  /* =========================
     PAGE
  ========================= */

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-5 py-9">
        {/* RETOUR */}
        <Link
          href="/admin/formations"
          className="inline-flex items-center text-sm font-semibold text-inkSoft transition hover:text-ink"
        >
          ← Retour aux formations
        </Link>

        {/* HEADER */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
          <div className="grid lg:grid-cols-[360px_1fr]">
            <div className="min-h-[260px] bg-bgAlt">
              {training.cover_image_url ? (
                <img
                  src={training.cover_image_url}
                  alt={training.title}
                  className="h-full min-h-[260px] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[260px] items-center justify-center px-6 text-center">
                  <span className="text-sm text-inkSoft">
                    Aucune image de couverture
                  </span>
                </div>
              )}
            </div>

            <div className="p-7 lg:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    training.published
                      ? "bg-green-100 text-green-800"
                      : "bg-bgAlt text-inkSoft"
                  }`}
                >
                  {training.published
                    ? "Publiée"
                    : "Brouillon"}
                </span>

                {training.category && (
                  <span className="rounded-full border border-ink/10 px-3 py-1 text-xs font-semibold text-inkSoft">
                    {training.category}
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-serif text-3xl font-semibold text-ink">
                {training.title}
              </h1>

              {training.short_description && (
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-inkSoft">
                  {training.short_description}
                </p>
              )}

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-bgAlt p-4">
                  <p className="text-xs text-inkSoft">
                    Prix
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
                    {training.duration_days} jour
                    {training.duration_days > 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <div className="rounded-xl bg-bgAlt p-4">
                  <p className="text-xs text-inkSoft">
                    Format
                  </p>

                  <p className="mt-1 font-semibold text-ink">
                    {training.format ||
                      "Non précisé"}
                  </p>
                </div>

                <div className="rounded-xl bg-bgAlt p-4">
                  <p className="text-xs text-inkSoft">
                    Certificat
                  </p>

                  <p className="mt-1 font-semibold text-ink">
                    {training.certificate
                      ? "Oui"
                      : "Non"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Sessions
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {training.session_count}
            </p>

            <p className="mt-1 text-xs text-inkSoft">
              Sessions programmées
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Inscriptions confirmées
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {training.registration_count}
            </p>

            <p className="mt-1 text-xs text-inkSoft">
              Participants confirmés
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Places disponibles
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {training.available_seats}
            </p>

            <p className="mt-1 text-xs text-inkSoft">
              Sur les sessions existantes
            </p>
          </div>
        </section>

        {/* DESCRIPTION */}
        {training.description && (
          <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
              Présentation
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
              À propos de cette formation
            </h2>

            <div className="mt-4 max-w-4xl whitespace-pre-line text-[15px] leading-8 text-inkSoft">
              {training.description}
            </div>
          </section>
        )}

        {/* =====================================================
            PROGRAMME
        ====================================================== */}
        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                Étape 01
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                Programme de formation
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-inkSoft">
                Organisez les différents modules qui
                composent cette formation.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewModuleForm}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Ajouter un module
            </button>
          </div>

          {/* FORMULAIRE MODULE */}
          {showModuleForm && (
            <div className="mt-7 rounded-2xl border border-ink/10 bg-bgAlt p-5">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                  {editingModuleId
                    ? "Modifier le module"
                    : "Nouveau module"}
                </p>

                <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
                  {editingModuleId
                    ? "Modifier le programme"
                    : "Ajouter un module au programme"}
                </h3>
              </div>

              <form
                onSubmit={handleSaveModule}
                className="space-y-5"
              >
                <div>
                  <label className="text-sm font-semibold text-ink">
                    Titre du module *
                  </label>

                  <input
                    value={moduleTitle}
                    onChange={(event) =>
                      setModuleTitle(
                        event.target.value
                      )
                    }
                    placeholder="Ex. Fondamentaux de la pisciculture"
                    className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-ink">
                    Description
                  </label>

                  <textarea
                    value={moduleDescription}
                    onChange={(event) =>
                      setModuleDescription(
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Décrivez brièvement ce que contient ce module."
                    className="mt-2 w-full resize-y rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                  />
                </div>

                {moduleError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {moduleError}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModuleForm}
                    disabled={savingModule}
                    className="cursor-pointer rounded-xl border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-paper disabled:opacity-50"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={savingModule}
                    className="cursor-pointer rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingModule
                      ? "Enregistrement..."
                      : editingModuleId
                      ? "Enregistrer les modifications"
                      : "Ajouter le module"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ERREUR MODULE */}
          {moduleError && !showModuleForm && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {moduleError}
            </div>
          )}

          {/* LISTE MODULES */}
          <div className="mt-7">
            {modulesLoading ? (
              <div className="rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-10 text-center">
                <p className="text-sm text-inkSoft">
                  Chargement du programme…
                </p>
              </div>
            ) : modules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-10 text-center">
                <p className="font-medium text-ink">
                  Aucun module configuré
                </p>

                <p className="mt-2 text-sm text-inkSoft">
                  Commencez par ajouter le premier module
                  de cette formation.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <article
                    key={module.id}
                    className="rounded-xl border border-ink/10 bg-white p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="font-serif text-lg font-semibold text-ink">
                            {module.title}
                          </h3>

                          {module.description ? (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-inkSoft">
                              {module.description}
                            </p>
                          ) : (
                            <p className="mt-2 text-sm italic text-inkSoft">
                              Aucune description.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModuleForm(
                              module
                            )
                          }
                          className="cursor-pointer rounded-lg border border-ink/10 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-bgAlt"
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteModule(
                              module.id
                            )
                          }
                          disabled={
                            deletingModuleId ===
                            module.id
                          }
                          className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingModuleId ===
                          module.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            SESSIONS
        ====================================================== */}
        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                Étape 02
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                Sessions
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-inkSoft">
                Programmez les dates, lieux et capacités
                des différentes sessions.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewSessionForm}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Ajouter une session
            </button>
          </div>

          {/* FORMULAIRE SESSION */}
          {showSessionForm && (
            <div className="mt-7 rounded-2xl border border-ink/10 bg-bgAlt p-5">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                  {editingSessionId
                    ? "Modifier la session"
                    : "Nouvelle session"}
                </p>

                <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
                  {editingSessionId
                    ? "Modifier les informations"
                    : "Programmer une nouvelle session"}
                </h3>
              </div>

              <form
                onSubmit={handleSaveSession}
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
                      value={sessionStartDate}
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
                      value={sessionEndDate}
                      min={sessionStartDate || undefined}
                      onChange={(event) =>
                        setSessionEndDate(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                    />
                  </div>
                </div>

                {/* CAPACITÉ + STATUT */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Capacité *
                    </label>

                    <div className="mt-2 flex">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={sessionCapacity}
                        onChange={(event) =>
                          setSessionCapacity(
                            event.target.value
                          )
                        }
                        className="w-full rounded-l-xl border border-r-0 border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                      />

                      <span className="flex items-center rounded-r-xl border border-ink/10 bg-white px-4 text-sm text-inkSoft">
                        participants
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-inkSoft">
                      Par défaut : 15. Maximum : 50.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Statut
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
                  </div>
                </div>

                {/* LIEU + FORMAT */}
                <div className="grid gap-5 md:grid-cols-2">
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
                      placeholder="Ex. Yaoundé, Centre de formation AgroFarms237"
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                    />
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
                      <option value="">
                        Non précisé
                      </option>
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

                {sessionError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {sessionError}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeSessionForm}
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
                      ? "Enregistrer les modifications"
                      : "Créer la session"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ERREUR SESSION */}
          {sessionError && !showSessionForm && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {sessionError}
            </div>
          )}

          {/* LISTE SESSIONS */}
          <div className="mt-7">
            {sessionsLoading ? (
              <div className="rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-10 text-center">
                <p className="text-sm text-inkSoft">
                  Chargement des sessions…
                </p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-10 text-center">
                <p className="font-medium text-ink">
                  Aucune session configurée
                </p>

                <p className="mt-2 text-sm text-inkSoft">
                  Créez une session pour ouvrir des
                  inscriptions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, index) => (
                  <article
                    key={session.id}
                    className="rounded-xl border border-ink/10 bg-white p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                            {index + 1}
                          </span>

                          <h3 className="font-serif text-lg font-semibold text-ink">
                            Session du{" "}
                            {formatDate(
                              session.start_date
                            )}
                          </h3>

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

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="rounded-lg bg-bgAlt p-3">
                            <p className="text-xs text-inkSoft">
                              Date de fin
                            </p>

                            <p className="mt-1 text-sm font-semibold text-ink">
                              {formatDate(
                                session.end_date
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-bgAlt p-3">
                            <p className="text-xs text-inkSoft">
                              Capacité
                            </p>

                            <p className="mt-1 text-sm font-semibold text-ink">
                              {session.capacity}{" "}
                              participants
                            </p>
                          </div>

                          <div className="rounded-lg bg-bgAlt p-3">
                            <p className="text-xs text-inkSoft">
                              Lieu
                            </p>

                            <p className="mt-1 text-sm font-semibold text-ink">
                              {session.location ||
                                "Non précisé"}
                            </p>
                          </div>

                          <div className="rounded-lg bg-bgAlt p-3">
                            <p className="text-xs text-inkSoft">
                              Format
                            </p>

                            <p className="mt-1 text-sm font-semibold text-ink">
                              {session.format ||
                                "Non précisé"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditSessionForm(
                              session
                            )
                          }
                          className="cursor-pointer rounded-lg border border-ink/10 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-bgAlt"
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
                          className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingSessionId ===
                          session.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            INSCRIPTIONS
        ====================================================== */}
        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
              Étape 03
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
              Inscriptions
            </h2>

            <p className="mt-2 text-sm leading-6 text-inkSoft">
              Consultez et gérez les participants inscrits
              aux sessions de cette formation.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-bgAlt p-5">
              <p className="text-sm text-inkSoft">
                Inscriptions confirmées
              </p>

              <p className="mt-2 text-2xl font-semibold text-ink">
                {training.registration_count}
              </p>
            </div>

            <div className="rounded-xl bg-bgAlt p-5">
              <p className="text-sm text-inkSoft">
                Places disponibles
              </p>

              <p className="mt-2 text-2xl font-semibold text-ink">
                {training.available_seats}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl border border-ink/10 px-5 py-3 text-sm font-semibold text-inkSoft opacity-60"
            >
              Voir les inscriptions
            </button>

            <p className="mt-2 text-xs text-inkSoft">
              La gestion des inscriptions sera activée
              après la mise en place du formulaire public.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
