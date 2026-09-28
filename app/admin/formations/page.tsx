"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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

const EMPTY_STATS: Stats = {
  trainings: 0,
  sessions: 0,
  registrations: 0,
  available_seats: 0,
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminFormationsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [durationDays, setDurationDays] = useState("3");
  const [priceXaf, setPriceXaf] = useState("60000");
  const [format, setFormat] = useState("");
  const [certificate, setCertificate] = useState(false);
  const [published, setPublished] = useState(false);

  async function loadTrainings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/professional-trainings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de charger les formations."
        );
      }

      setTrainings(data.trainings || []);
      setStats(data.stats || EMPTY_STATS);
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

  function openCreateForm() {
    setTitle("");
    setSlug("");
    setShortDescription("");
    setDescription("");
    setCoverImageUrl("");
    setCategory("");
    setLevel("");
    setDurationDays("3");
    setPriceXaf("60000");
    setFormat("");
    setCertificate(false);
    setPublished(false);
    setFormMessage("");
    setShowForm(true);
  }

  function closeCreateForm() {
    if (saving) return;

    setShowForm(false);
    setFormMessage("");
  }

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug || slug === createSlug(title)) {
      setSlug(createSlug(value));
    }
  }

  async function handleCreateTraining(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setFormMessage("");
    setError("");

    try {
      if (!title.trim()) {
        setFormMessage(
          "Le titre de la formation est obligatoire."
        );
        return;
      }

      if (!slug.trim()) {
        setFormMessage(
          "Le slug de la formation est obligatoire."
        );
        return;
      }

      const duration = Number(durationDays);
      const price = Number(priceXaf);

      if (!Number.isInteger(duration) || duration <= 0) {
        setFormMessage(
          "La durée doit être un nombre entier positif."
        );
        return;
      }

      if (!Number.isInteger(price) || price < 0) {
        setFormMessage("Le prix indiqué est invalide.");
        return;
      }

      const response = await fetch(
        "/api/professional-trainings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            slug: slug.trim(),
            short_description:
              shortDescription.trim() || null,
            description: description.trim() || null,
            cover_image_url:
              coverImageUrl.trim() || null,
            category: category.trim() || null,
            level: level.trim() || null,
            duration_days: duration,
            price_xaf: price,
            format: format.trim() || null,
            certificate,
            published,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFormMessage(
          data.error ||
            "Impossible de créer la formation."
        );
        return;
      }

      setShowForm(false);
      await loadTrainings();
    } catch (err) {
      setFormMessage(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
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
              Gérez les formations professionnelles,
              leurs programmes, leurs sessions et les
              inscriptions.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
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

        {/* FORMULAIRE */}
        {showForm && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
            <div className="border-b border-ink/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-inkSoft">
                    Nouvelle formation
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                    Créer une formation professionnelle
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-inkSoft">
                    Les valeurs commerciales prévues sont
                    préremplies : 60 000 FCFA et 3 jours.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCreateForm}
                  disabled={saving}
                  className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold text-ink hover:bg-bgAlt disabled:opacity-50"
                >
                  Fermer
                </button>
              </div>
            </div>

            <form
              onSubmit={handleCreateTraining}
              className="space-y-7 p-6"
            >
              {/* INFORMATIONS GÉNÉRALES */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Informations générales
                </h3>

                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Nom de la formation *
                    </label>

                    <input
                      value={title}
                      onChange={(event) =>
                        handleTitleChange(event.target.value)
                      }
                      placeholder="Ex. Maîtriser la pisciculture"
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Slug *
                    </label>

                    <input
                      value={slug}
                      onChange={(event) =>
                        setSlug(event.target.value)
                      }
                      placeholder="maitriser-la-pisciculture"
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                    />
                  </div>
                </div>
              </div>

              {/* PRÉSENTATION */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Présentation
                </h3>

                <div className="mt-4 space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Description courte
                    </label>

                    <textarea
                      value={shortDescription}
                      onChange={(event) =>
                        setShortDescription(
                          event.target.value
                        )
                      }
                      rows={3}
                      placeholder="Une présentation courte de la formation."
                      className="mt-2 w-full resize-y rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Description complète
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      rows={6}
                      placeholder="Présentez le contenu, les objectifs et le déroulement de la formation."
                      className="mt-2 w-full resize-y rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                    />
                  </div>
                </div>
              </div>

              {/* IMAGE */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Image de couverture
                </h3>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-ink">
                    URL de l&apos;image
                  </label>

                  <input
                    value={coverImageUrl}
                    onChange={(event) =>
                      setCoverImageUrl(event.target.value)
                    }
                    placeholder="https://..."
                    className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                  />

                  <p className="mt-2 text-xs leading-5 text-inkSoft">
                    L&apos;upload d&apos;image sera ajouté dans
                    une prochaine étape.
                  </p>
                </div>
              </div>

              {/* PARAMÈTRES */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Paramètres de la formation
                </h3>

                <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Catégorie
                    </label>

                    <input
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      placeholder="Ex. Pisciculture"
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Niveau
                    </label>

                    <select
                      value={level}
                      onChange={(event) =>
                        setLevel(event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink/30"
                    >
                      <option value="">
                        Non précisé
                      </option>
                      <option value="Débutant">
                        Débutant
                      </option>
                      <option value="Intermédiaire">
                        Intermédiaire
                      </option>
                      <option value="Avancé">
                        Avancé
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Durée
                    </label>

                    <div className="mt-2 flex">
                      <input
                        type="number"
                        min="1"
                        value={durationDays}
                        onChange={(event) =>
                          setDurationDays(
                            event.target.value
                          )
                        }
                        className="w-full rounded-l-xl border border-r-0 border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                      />

                      <span className="flex items-center rounded-r-xl border border-ink/10 bg-bgAlt px-3 text-sm text-inkSoft">
                        jours
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Prix
                    </label>

                    <div className="mt-2 flex">
                      <input
                        type="number"
                        min="0"
                        value={priceXaf}
                        onChange={(event) =>
                          setPriceXaf(event.target.value)
                        }
                        className="w-full rounded-l-xl border border-r-0 border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink/30"
                      />

                      <span className="flex items-center rounded-r-xl border border-ink/10 bg-bgAlt px-3 text-sm text-inkSoft">
                        FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORGANISATION */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  Organisation
                </h3>

                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-ink">
                      Format
                    </label>

                    <select
                      value={format}
                      onChange={(event) =>
                        setFormat(event.target.value)
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

                  <div className="flex flex-col justify-end gap-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={certificate}
                        onChange={(event) =>
                          setCertificate(
                            event.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-semibold text-ink">
                        Certificat prévu
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(event) =>
                          setPublished(
                            event.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm font-semibold text-ink">
                        Publier immédiatement
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* MESSAGE */}
              {formMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formMessage}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreateForm}
                  disabled={saving}
                  className="rounded-xl border border-ink/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-bgAlt disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Création..."
                    : "Créer la formation"}
                </button>
              </div>
            </form>
          </section>
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

                        {/* GÉRER */}
                        <Link
                          href={`/admin/formations/${training.id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-ink/10 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-bgAlt"
                        >
                          Gérer la formation
                        </Link>
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
