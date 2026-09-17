"use client";

import { useEffect, useState } from "react";

type FarmItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  status: "disponible" | "bientot";
  photo_url: string | null;
  position: number;
  published: boolean;
};

const EMPTY_FORM = {
  name: "",
  category: "Poisson",
  description: "",
  status: "disponible",
  position: "0",
};

export default function NotreElevageAdminPage() {
  const [items, setItems] = useState<FarmItem[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadItems() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/farm-breeding", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible de charger les élevages.");
      }

      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setPhoto(null);
    setEditingId(null);

    const input = document.getElementById(
      "farm-photo"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  function editItem(item: FarmItem) {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      category: item.category || "Poisson",
      description: item.description || "",
      status: item.status || "bientot",
      position: String(item.position ?? 0),
    });

    setPhoto(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (editingId) {
        const response = await fetch(
          `/api/farm-breeding/${editingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: form.name,
              category: form.category,
              description: form.description,
              status: form.status,
              position: Number(form.position) || 0,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Impossible de modifier l'élevage."
          );
        }

        setMessage("Élevage modifié avec succès.");
      } else {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("category", form.category);
        formData.append("description", form.description);
        formData.append("status", form.status);
        formData.append(
          "position",
          String(Number(form.position) || 0)
        );

        if (photo) {
          formData.append("file", photo);
        }

        const response = await fetch("/api/farm-breeding", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Impossible d'ajouter l'élevage."
          );
        }

        setMessage("Élevage ajouté avec succès.");
      }

      resetForm();
      await loadItems();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(item: FarmItem) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/farm-breeding/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published: !item.published,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de modifier la publication."
        );
      }

      setMessage(
        item.published
          ? "Élevage masqué du site."
          : "Élevage publié sur le site."
      );

      await loadItems();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    }
  }

  async function deleteItem(item: FarmItem) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer « ${item.name} » ?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/farm-breeding/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de supprimer l'élevage."
        );
      }

      setMessage("Élevage supprimé.");

      if (editingId === item.id) {
        resetForm();
      }

      await loadItems();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    }
  }

  return (
    <main className="min-h-screen bg-bgAlt px-5 py-10">
      <div className="mx-auto max-w-6xl">

        {/* EN-TÊTE */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-goldDeep">
            Administration
          </p>

          <h1 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
            Notre élevage
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-inkSoft">
            Gérez ici les différents élevages présentés sur le site :
            poissons, porcs et poulets.
          </p>
        </div>

        {/* MESSAGES */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORMULAIRE */}
        <section className="mb-12 rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold">
              {editingId
                ? "Modifier un élevage"
                : "Ajouter un élevage"}
            </h2>

            <p className="mt-2 text-sm text-inkSoft">
              {editingId
                ? "Modifiez les informations puis enregistrez."
                : "Créez une nouvelle fiche d'élevage."}
            </p>
          </div>

          <form onSubmit={saveItem} className="space-y-6">

            {/* NOM + CATÉGORIE */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nom
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ex : Silure"
                  required
                  className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Catégorie
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                >
                  <option value="Poisson">Poisson</option>
                  <option value="Porcs">Porcs</option>
                  <option value="Poulets">Poulets</option>
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Présentez cet élevage..."
                rows={5}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
              />
            </div>

            {/* STATUT + ORDRE */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Disponibilité
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                >
                  <option value="disponible">
                    Disponible
                  </option>

                  <option value="bientot">
                    Bientôt disponible
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Ordre d'affichage
                </label>

                <input
                  type="number"
                  value={form.position}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      position: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                />
              </div>
            </div>

            {/* PHOTO */}
            {!editingId && (
              <div>
                <label
                  htmlFor="farm-photo"
                  className="mb-2 block text-sm font-semibold"
                >
                  Photo
                </label>

                <input
                  id="farm-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhoto(e.target.files?.[0] || null)
                  }
                  className="block w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs text-inkSoft">
                  JPG, PNG ou WEBP — 25 Mo maximum.
                </p>
              </div>
            )}

            {/* BOUTONS */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {saving
                  ? "Enregistrement..."
                  : editingId
                  ? "Enregistrer les modifications"
                  : "Ajouter l'élevage"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-ink/15 bg-white px-6 py-3 text-sm font-semibold"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTE */}
        <section>
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold">
              Élevages enregistrés
            </h2>

            <p className="mt-2 text-sm text-inkSoft">
              {items.length} élevage(s) enregistré(s).
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-ink/10 bg-paper p-8 text-center text-sm text-inkSoft">
              Chargement...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink/15 bg-paper p-10 text-center">
              <p className="text-sm text-inkSoft">
                Aucun élevage n'est encore enregistré.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-sm"
                >
                  {/* PHOTO */}
                  <div className="aspect-[16/9] bg-bgAlt">
                    {item.photo_url ? (
                      <img
                        src={item.photo_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-inkSoft">
                        Aucune photo
                      </div>
                    )}
                  </div>

                  {/* CONTENU */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-goldDeep">
                          {item.category}
                        </p>

                        <h3 className="mt-1 font-serif text-xl font-semibold">
                          {item.name}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "disponible"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status === "disponible"
                          ? "Disponible"
                          : "Bientôt disponible"}
                      </span>
                    </div>

                    {item.description && (
                      <p className="mt-4 text-sm leading-6 text-inkSoft">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => editItem(item)}
                        className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-bgAlt"
                      >
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePublished(item)}
                        className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-bgAlt"
                      >
                        {item.published
                          ? "Masquer"
                          : "Publier"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteItem(item)}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
