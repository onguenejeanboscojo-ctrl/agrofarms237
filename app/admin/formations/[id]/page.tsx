"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

type Stats = {
  trainings: number;
  sessions: number;
  registrations: number;
  available_seats: number;
};

export default function AdminFormationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [training, setTraining] =
    useState<Training | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function formatPrice(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value);
  }

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

  useEffect(() => {
    if (id) {
      loadTraining();
    }
  }, [id]);

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
            {/* IMAGE */}
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

            {/* INFOS */}
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

        {/* MODULES */}
        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                Étape 01
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                Programme de formation
              </h2>

              <p className="mt-2 text-sm leading-6 text-inkSoft">
                Organisez ici les différents modules et
                contenus de la formation.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Ajouter un module
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-8 text-center">
            <p className="font-medium text-ink">
              Aucun module configuré
            </p>

            <p className="mt-2 text-sm text-inkSoft">
              Les modules seront ajoutés dans la prochaine
              étape.
            </p>
          </div>
        </section>

        {/* SESSIONS */}
        <section className="mt-7 rounded-2xl border border-ink/10 bg-paper p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                Étape 02
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                Sessions
              </h2>

              <p className="mt-2 text-sm leading-6 text-inkSoft">
                Programmez les dates, lieux et capacités
                des différentes sessions.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              + Ajouter une session
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-ink/15 bg-bgAlt px-5 py-8 text-center">
            <p className="font-medium text-ink">
              Aucune session configurée
            </p>

            <p className="mt-2 text-sm text-inkSoft">
              Les sessions pourront être créées avec leur
              capacité et leurs dates.
            </p>
          </div>
        </section>

        {/* INSCRIPTIONS */}
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
              className="rounded-xl border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-bgAlt"
            >
              Voir les inscriptions
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
