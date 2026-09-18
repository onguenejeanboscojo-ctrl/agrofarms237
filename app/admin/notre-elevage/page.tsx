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

type PageContent = {
  id: string;

  hero_label: string;
  hero_title: string;
  hero_description: string;

  step1_label: string;
  step1_title: string;
  step1_text: string;

  step2_label: string;
  step2_title: string;
  step2_text: string;

  step3_label: string;
  step3_title: string;
  step3_text: string;

  fish_label: string;
  fish_title: string;
  fish_description: string;

  pigs_label: string;
  pigs_title: string;
  pigs_description: string;

  poultry_label: string;
  poultry_title: string;
  poultry_description: string;

  vision_label: string;
  vision_title: string;
  vision_text: string;
};

const EMPTY_FORM = {
  name: "",
  category: "Poisson",
  description: "",
  status: "disponible",
  position: "0",
};

const EMPTY_CONTENT: PageContent = {
  id: "",

  hero_label: "Notre élevage",
  hero_title: "Une ferme qui grandit, élevage après élevage.",
  hero_description:
    "Le silure constitue aujourd’hui notre activité principale, produite à Yaoundé, Mimboman. Demain, notre ferme accueillera progressivement d’autres productions pour construire un modèle agricole plus complet, local et durable.",

  step1_label: "Aujourd’hui",
  step1_title: "Silure frais",
  step1_text:
    "Production active à Yaoundé, Mimboman, vendue directement aux familles et professionnels.",

  step2_label: "Prochaine étape",
  step2_title: "Produits fumés",
  step2_text:
    "Une gamme de silure fumé, pensée pour la conservation et pour étendre la livraison au-delà de Yaoundé.",

  step3_label: "Développement",
  step3_title: "Porcs, poulets de chair, poules pondeuses",
  step3_text: "Une diversification progressive.",

  fish_label: "Notre production",
  fish_title: "Poissons",
  fish_description:
    "Une production piscicole qui commence avec le silure et s’élargira progressivement à d’autres espèces.",

  pigs_label: "Développement",
  pigs_title: "Élevage porcin",
  pigs_description:
    "Notre projet d’élevage porcin s’inscrit dans une logique de diversification progressive de la ferme.",

  poultry_label: "Aviculture",
  poultry_title: "Poulets",
  poultry_description:
    "Une future activité avicole qui regroupera progressivement poules pondeuses et poulets de chair.",

  vision_label: "Notre vision",
  vision_title:
    "Construire une ferme capable de nourrir, de créer et de transmettre.",
  vision_text:
    "Agrofarms237 avance étape par étape, avec l’ambition de développer une agriculture locale structurée, productive et durable.",
};

export default function NotreElevageAdminPage() {
  const [items, setItems] = useState<FarmItem[]>([]);
  const [content, setContent] = useState<PageContent>(EMPTY_CONTENT);

  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadItems() {
    setLoading(true);

    try {
      const response = await fetch("/api/farm-breeding", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de charger les élevages."
        );
      }

      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function loadContent() {
    setContentLoading(true);

    try {
      const response = await fetch("/api/farm-breeding-content", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de charger le contenu."
        );
      }

      if (data.content) {
        setContent(data.content);
      }
    } catch (err: any) {
      setError(err.message || "Impossible de charger le contenu.");
    } finally {
      setContentLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
    loadContent();
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
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  async function saveContent(e: React.FormEvent) {
    e.preventDefault();

    setSavingContent(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/farm-breeding-content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible d'enregistrer le contenu."
        );
      }

      if (data.content) {
        setContent(data.content);
      }

      setMessage("Le contenu de la page a été enregistré avec succès.");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSavingContent(false);
    }
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

  function updateContent(
    field: keyof PageContent,
    value: string
  ) {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }));
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

          <p className="mt-3 max-w-3xl text-sm leading-7 text-inkSoft">
            Gérez ici le contenu de la page Notre élevage ainsi que les
            différents élevages présentés sur le site.
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

        {/* =========================================
            CONTENU DE LA PAGE
        ========================================= */}
        <section className="mb-12 rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-goldDeep">
              Éditeur
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold">
              Contenu de la page
            </h2>

            <p className="mt-2 text-sm leading-6 text-inkSoft">
              Modifiez les textes affichés sur la page publique
              « Notre élevage ».
            </p>
          </div>

          {contentLoading ? (
            <div className="rounded-xl border border-ink/10 bg-white p-8 text-center text-sm text-inkSoft">
              Chargement du contenu...
            </div>
          ) : (
            <form onSubmit={saveContent} className="space-y-10">
              {/* HERO */}
              <div className="border-b border-ink/10 pb-10">
                <h3 className="mb-5 font-serif text-xl font-semibold">
                  1. Hero
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Petit titre
                    </label>

                    <input
                      type="text"
                      value={content.hero_label}
                      onChange={(e) =>
                        updateContent(
                          "hero_label",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Grand titre
                    </label>

                    <input
                      type="text"
                      value={content.hero_title}
                      onChange={(e) =>
                        updateContent(
                          "hero_title",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Description
                    </label>

                    <textarea
                      value={content.hero_description}
                      onChange={(e) =>
                        updateContent(
                          "hero_description",
                          e.target.value
                        )
                      }
                      rows={5}
                      className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                    />
                  </div>
                </div>
              </div>

              {/* LES 3 ÉTAPES */}
              <div className="border-b border-ink/10 pb-10">
                <h3 className="mb-6 font-serif text-xl font-semibold">
                  2. Les trois étapes
                </h3>

                <div className="grid gap-8 lg:grid-cols-3">
                  {/* ÉTAPE 1 */}
                  <div className="rounded-xl border border-ink/10 bg-white p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-goldDeep">
                      Étape 1
                    </p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={content.step1_label}
                        onChange={(e) =>
                          updateContent(
                            "step1_label",
                            e.target.value
                          )
                        }
                        placeholder="Label"
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-goldDeep"
                      />

                      <input
                        type="text"
                        value={content.step1_title}
                        onChange={(e) =>
                          updateContent(
                            "step1_title",
                            e.target.value
                          )
                        }
                        placeholder="Titre"
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-goldDeep"
                      />

                      <textarea
                        value={content.step1_text}
                        onChange={(e) =>
                          updateContent(
                            "step1_text",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        rows={5}
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                      />
                    </div>
                  </div>

                  {/* ÉTAPE 2 */}
                  <div className="rounded-xl border border-ink/10 bg-white p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-goldDeep">
                      Étape 2
                    </p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={content.step2_label}
                        onChange={(e) =>
                          updateContent(
                            "step2_label",
                            e.target.value
                          )
                        }
                        placeholder="Label"
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-goldDeep"
                      />

                      <input
                        type="text"
                        value={content.step2_title}
                        onChange={(e) =>
                          updateContent(
                            "step2_title",
                            e.target.value
                          )
                        }
                        placeholder="Titre"
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-goldDeep"
                      />

                      <textarea
                        value={content.step2_text}
                        onChange={(e) =>
                          updateContent(
                            "step2_text",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        rows={5}
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                      />
                    </div>
                  </div>

                  {/* ÉTAPE 3 */}
                  <div className="rounded-xl border border-ink/10 bg-white p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-goldDeep">
                      Étape 3
                    </p>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={content.step3_label}
                        onChange={(e) =>
                          updateContent(
                            "step3_label",
                            e.target.value
                          )
                        }
                        placeholder="Label"
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-goldDeep"
                      />

                      <input
                        type="text"
                        value={content.step3_title}
                        onChange={(e) =>
                          updateContent(
                            "step3_title",
                            e.target.value
                          )
                        }
                        placeholder="Titre"
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm outline-none focus:border-goldDeep"
                      />

                      <textarea
                        value={content.step3_text}
                        onChange={(e) =>
                          updateContent(
                            "step3_text",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        rows={5}
                        className="w-full rounded-lg border border-ink/15 px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* POISSONS */}
              <div className="border-b border-ink/10 pb-10">
                <h3 className="mb-5 font-serif text-xl font-semibold">
                  3. Section Poissons
                </h3>

                <div className="space-y-5">
                  <input
                    type="text"
                    value={content.fish_label}
                    onChange={(e) =>
                      updateContent(
                        "fish_label",
                        e.target.value
                      )
                    }
                    placeholder="Petit titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <input
                    type="text"
                    value={content.fish_title}
                    onChange={(e) =>
                      updateContent(
                        "fish_title",
                        e.target.value
                      )
                    }
                    placeholder="Titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <textarea
                    value={content.fish_description}
                    onChange={(e) =>
                      updateContent(
                        "fish_description",
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Description"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                  />
                </div>
              </div>

              {/* PORCS */}
              <div className="border-b border-ink/10 pb-10">
                <h3 className="mb-5 font-serif text-xl font-semibold">
                  4. Section Élevage porcin
                </h3>

                <div className="space-y-5">
                  <input
                    type="text"
                    value={content.pigs_label}
                    onChange={(e) =>
                      updateContent(
                        "pigs_label",
                        e.target.value
                      )
                    }
                    placeholder="Petit titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <input
                    type="text"
                    value={content.pigs_title}
                    onChange={(e) =>
                      updateContent(
                        "pigs_title",
                        e.target.value
                      )
                    }
                    placeholder="Titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <textarea
                    value={content.pigs_description}
                    onChange={(e) =>
                      updateContent(
                        "pigs_description",
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Description"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                  />
                </div>
              </div>

              {/* AVICULTURE */}
              <div className="border-b border-ink/10 pb-10">
                <h3 className="mb-5 font-serif text-xl font-semibold">
                  5. Section Aviculture
                </h3>

                <div className="space-y-5">
                  <input
                    type="text"
                    value={content.poultry_label}
                    onChange={(e) =>
                      updateContent(
                        "poultry_label",
                        e.target.value
                      )
                    }
                    placeholder="Petit titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <input
                    type="text"
                    value={content.poultry_title}
                    onChange={(e) =>
                      updateContent(
                        "poultry_title",
                        e.target.value
                      )
                    }
                    placeholder="Titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <textarea
                    value={content.poultry_description}
                    onChange={(e) =>
                      updateContent(
                        "poultry_description",
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Description"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                  />
                </div>
              </div>

              {/* VISION */}
              <div>
                <h3 className="mb-5 font-serif text-xl font-semibold">
                  6. Notre vision
                </h3>

                <div className="space-y-5">
                  <input
                    type="text"
                    value={content.vision_label}
                    onChange={(e) =>
                      updateContent(
                        "vision_label",
                        e.target.value
                      )
                    }
                    placeholder="Petit titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <input
                    type="text"
                    value={content.vision_title}
                    onChange={(e) =>
                      updateContent(
                        "vision_title",
                        e.target.value
                      )
                    }
                    placeholder="Titre"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-goldDeep"
                  />

                  <textarea
                    value={content.vision_text}
                    onChange={(e) =>
                      updateContent(
                        "vision_text",
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="Texte"
                    className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-goldDeep"
                  />
                </div>
              </div>

              {/* ENREGISTRER */}
              <div className="border-t border-ink/10 pt-6">
                <button
                  type="submit"
                  disabled={savingContent}
                  className="rounded-lg bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {savingContent
                    ? "Enregistrement..."
                    : "Enregistrer le contenu de la page"}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* =========================================
            GESTION DES ÉLEVAGES
        ========================================= */}
        <section className="mb-12 rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-goldDeep">
              Gestion
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold">
              {editingId
                ? "Modifier un élevage"
                : "Ajouter un élevage"}
            </h2>

            <p className="mt-2 text-sm text-inkSoft">
              Ajoutez ou modifiez les différentes productions de la
              ferme.
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

        {/* LISTE DES ÉLEVAGES */}
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
                        onClick={() =>
                          togglePublished(item)
                        }
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
