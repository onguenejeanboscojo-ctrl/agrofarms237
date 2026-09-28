"use client";

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

export default function AdminFormationsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [stats, setStats] = useState<Stats>({
    trainings: 0,
    sessions: 0,
    registrations: 0,
    available_seats: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      setTrainings(data.trainings || []);
      setStats(
        data.stats || {
          trainings: 0,
          sessions: 0,
          registrations: 0,
          available_seats: 0,
        }
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

  function formatPrice(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value);
  }

  return (
    <>
      <AdminNav />

      <main className="mx-auto max-w-[1180px] px-5 py-9">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-inkSoft">
              AgroFarms237
            </p>

            <h1 className="font-serif text-3xl font-semibold text-ink">
              Formations professionnelles
            </h1>

            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-inkSoft">
              Gérez les formations professionnelles, leurs
              programmes, leurs sessions et les inscriptions.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            + Nouvelle formation
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* KPI */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Formations
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {loading ? "…" : stats.trainings}
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Sessions
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {loading ? "…" : stats.sessions}
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Inscriptions confirmées
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {loading ? "…" : stats.registrations}
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-paper p-5">
            <p className="text-sm text-inkSoft">
              Places disponibles
            </p>

            <p className="mt-2 text-3xl font-semibold text-ink">
              {loading ? "…" : stats.available_seats}
            </p>
          </div>
        </section>

        {/* CATALOGUE */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">
                Catalogue des formations
              </h2>

              <p className="mt-1 text-sm text-inkSoft">
                Les formations professionnelles disponibles
                dans votre espace d’administration.
              </p>
            </div>

            <button
              type="button"
              onClick={loadTrainings}
              disabled={loading}
              className="rounded-lg border border-ink/10 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-bgAlt disabled:opacity-50"
            >
              Actualiser
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-12 text-center">
              <p className="text-sm text-inkSoft">
                Chargement des formations…
              </p>
            </div>
          ) : trainings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 bg-paper px-6 py-14 text-center">
              <p className="font-medium text-ink">
                Aucune formation professionnelle
              </p>

              <p className="mt-2 text-sm text-inkSoft">
                Créez votre première formation pour
                commencer.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {trainings.map((training) => (
                <article
                  key={training.id}
                  className="overflow-hidden rounded-2xl border border-ink/10 bg-paper"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* IMAGE */}
                    <div className="relative aspect-[16/8] w-full overflow-hidden bg-bgAlt lg:aspect-auto lg:w-[280px] lg:min-h-[220px]">
                      {training.cover_image_url ? (
                        <img
                          src={training.cover_image_url}
                          alt={training.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-[180px] items-center justify-center px-6 text-center">
                          <span className="text-sm text-inkSoft">
                            Aucune image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-xl font-semibold text-ink">
                              {training.title}
                            </h3>

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
                          </div>

                          {training.short_description && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-inkSoft">
                              {training.short_description}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <p className="text-lg font-semibold text-ink">
                            {formatPrice(
                              training.price_xaf
                            )}{" "}
                            FCFA
                          </p>

                          <p className="text-xs text-inkSoft">
                            {training.duration_days} jour
                            {training.duration_days > 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-bgAlt p-4">
                          <p className="text-xs text-inkSoft">
                            Sessions
                          </p>

                          <p className="mt-1 text-lg font-semibold text-ink">
                            {training.session_count}
                          </p>
                        </div>

                        <div className="rounded-xl bg-bgAlt p-4">
                          <p className="text-xs text-inkSoft">
                            Inscriptions
                          </p>

                          <p className="mt-1 text-lg font-semibold text-ink">
                            {training.registration_count}
                          </p>
                        </div>

                        <div className="rounded-xl bg-bgAlt p-4">
                          <p className="text-xs text-inkSoft">
                            Places disponibles
                          </p>

                          <p className="mt-1 text-lg font-semibold text-ink">
                            {training.available_seats}
                          </p>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2 text-xs text-inkSoft">
                          {training.category && (
                            <span className="rounded-full border border-ink/10 px-3 py-1.5">
                              {training.category}
                            </span>
                          )}

                          {training.level && (
                            <span className="rounded-full border border-ink/10 px-3 py-1.5">
                              {training.level}
                            </span>
                          )}

                          {training.format && (
                            <span className="rounded-full border border-ink/10 px-3 py-1.5">
                              {training.format}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="rounded-lg border border-ink/10 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-bgAlt"
                        >
                          Gérer la formation
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
