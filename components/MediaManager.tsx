"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SITE_LOCATION_GROUPS,
  CATEGORY_LABELS,
  GALLERY_CATEGORIES,
} from "@/lib/mediaCategories";

type MediaItem = {
  id: string;
  url: string;
  storage_path?: string | null;
  kind: "photo" | "video";

  // Ancien système conservé pour compatibilité
  category?: string | null;

  // Nouveau système
  site_location?: string | null;
  gallery_enabled?: boolean;
  gallery_category?: string | null;

  caption?: string | null;
  published: boolean;
  position?: number | null;
  created_at?: string;
};

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [kind, setKind] = useState<"photo" | "video">("photo");

  const [siteLocation, setSiteLocation] = useState("");
  const [galleryEnabled, setGalleryEnabled] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState("");
  const [caption, setCaption] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState("");
  const [editingSiteLocation, setEditingSiteLocation] =
    useState("");
  const [editingGalleryEnabled, setEditingGalleryEnabled] =
    useState(false);
  const [editingGalleryCategory, setEditingGalleryCategory] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const positionA = a.position ?? 0;
      const positionB = b.position ?? 0;

      if (positionA !== positionB) {
        return positionA - positionB;
      }

      return (
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
      );
    });
  }, [items]);

  async function load() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/media", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Impossible de charger les médias."
        );
      }

      setItems(data.items || []);
    } catch (err: any) {
      setError(
        err?.message || "Erreur lors du chargement des médias."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetMessages();

    if (!siteLocation) {
      setError(
        "Choisis d'abord un emplacement sur le site."
      );

      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();

      form.append("file", file);
      form.append("kind", kind);

      form.append(
        "site_location",
        siteLocation
      );

      form.append(
        "gallery_enabled",
        galleryEnabled ? "true" : "false"
      );

      if (
        galleryEnabled &&
        galleryCategory
      ) {
        form.append(
          "gallery_category",
          galleryCategory
        );
      }

      form.append("caption", caption);

      // Compatibilité avec l'ancien système
      form.append("category", siteLocation);

      const res = await fetch("/api/media", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Échec de l'envoi du média."
        );
      }

      setCaption("");
      setSiteLocation("");
      setGalleryEnabled(false);
      setGalleryCategory("");

      setSuccess("Le média a été ajouté avec succès.");

      await load();
    } catch (err: any) {
      setError(
        err?.message || "Échec de l'envoi du média."
      );
    } finally {
      setUploading(false);

      // Permet de sélectionner à nouveau le même fichier
      event.target.value = "";
    }
  }

  async function togglePublished(
    id: string,
    published: boolean
  ) {
    resetMessages();

    const previous = items;

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              published,
            }
          : item
      )
    );

    try {
      const res = await fetch(
        `/api/media/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Impossible de modifier le statut."
        );
      }

      setSuccess(
        published
          ? "Média publié."
          : "Média masqué."
      );
    } catch (err: any) {
      setItems(previous);

      setError(
        err?.message ||
          "Impossible de modifier le statut."
      );
    }
  }

  function startEditing(item: MediaItem) {
    resetMessages();

    setEditingId(item.id);

    setEditingCaption(
      item.caption || ""
    );

    setEditingSiteLocation(
      item.site_location ||
        item.category ||
        ""
    );

    setEditingGalleryEnabled(
      Boolean(item.gallery_enabled)
    );

    setEditingGalleryCategory(
      item.gallery_category || ""
    );
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingCaption("");
    setEditingSiteLocation("");
    setEditingGalleryEnabled(false);
    setEditingGalleryCategory("");
  }

  async function saveEditing() {
    if (!editingId) {
      return;
    }

    resetMessages();

    const finalGalleryCategory =
      editingGalleryEnabled
        ? editingGalleryCategory || null
        : null;

    try {
      const res = await fetch(
        `/api/media/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site_location:
              editingSiteLocation || null,

            gallery_enabled:
              editingGalleryEnabled,

            gallery_category:
              finalGalleryCategory,

            // Compatibilité avec l'ancien système
            category:
              editingSiteLocation || null,

            caption:
              editingCaption || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Impossible de modifier le média."
        );
      }

      setItems((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,

                site_location:
                  editingSiteLocation || null,

                category:
                  editingSiteLocation || null,

                gallery_enabled:
                  editingGalleryEnabled,

                gallery_category:
                  finalGalleryCategory,

                caption:
                  editingCaption || null,
              }
            : item
        )
      );

      setSuccess("Média modifié avec succès.");

      cancelEditing();
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de modifier le média."
      );
    }
  }

  async function remove(id: string) {
    resetMessages();

    const confirmed = window.confirm(
      "Supprimer définitivement ce média ?\n\n" +
        "Le fichier sera également supprimé du stockage."
    );

    if (!confirmed) {
      return;
    }

    const previous = items;

    setItems((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    try {
      const res = await fetch(
        `/api/media/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Impossible de supprimer le média."
        );
      }

      setSuccess(
        "Média supprimé définitivement."
      );
    } catch (err: any) {
      setItems(previous);

      setError(
        err?.message ||
          "Impossible de supprimer le média."
      );
    }
  }

  async function moveItem(
    id: string,
    direction: "up" | "down"
  ) {
    resetMessages();

    const index = sortedItems.findIndex(
      (item) => item.id === id
    );

    if (index === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= sortedItems.length
    ) {
      return;
    }

    const current =
      sortedItems[index];

    const target =
      sortedItems[targetIndex];

    const currentPosition =
      current.position ?? index;

    const targetPosition =
      target.position ?? targetIndex;

    const previous = items;

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === current.id) {
          return {
            ...item,
            position: targetPosition,
          };
        }

        if (item.id === target.id) {
          return {
            ...item,
            position: currentPosition,
          };
        }

        return item;
      })
    );

    try {
      const [res1, res2] =
        await Promise.all([
          fetch(
            `/api/media/${current.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                position:
                  targetPosition,
              }),
            }
          ),

          fetch(
            `/api/media/${target.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                position:
                  currentPosition,
              }),
            }
          ),
        ]);

      if (!res1.ok || !res2.ok) {
        throw new Error(
          "Impossible de modifier l'ordre des médias."
        );
      }

      setSuccess(
        direction === "up"
          ? "Média remonté."
          : "Média descendu."
      );

      await load();
    } catch (err: any) {
      setItems(previous);

      setError(
        err?.message ||
          "Impossible de modifier l'ordre."
      );
    }
  }

  function getLocationLabel(
    item: MediaItem
  ) {
    const value =
      item.site_location ||
      item.category;

    if (!value) {
      return "Aucun emplacement";
    }

    return (
      CATEGORY_LABELS[value] ||
      value
    );
  }

  function getGalleryLabel(
    item: MediaItem
  ) {
    if (!item.gallery_enabled) {
      return "Non";
    }

    if (!item.gallery_category) {
      return "Oui — rubrique non définie";
    }

    const category =
      GALLERY_CATEGORIES.find(
        (itemCategory) =>
          itemCategory.value ===
          item.gallery_category
      );

    return (
      category?.label ||
      item.gallery_category
    );
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <div className="rounded-s border border-alert/20 bg-alert/5 px-4 py-3 text-[13px] text-alert">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-s border border-ink/10 bg-bgAlt px-4 py-3 text-[13px] text-ink">
          {success}
        </div>
      )}

      {/* =====================================================
          AJOUT D'UN MÉDIA
      ====================================================== */}

      <div className="rounded-s border border-ink/10 bg-paper p-5">

        <div className="mb-5">
          <h2 className="font-serif text-xl font-semibold">
            Ajouter un média
          </h2>

          <p className="mt-1 text-[13px] text-inkSoft">
            Choisis l'emplacement principal du
            média. Tu peux ensuite décider s'il doit
            également apparaître dans la Galerie
            publique.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {/* TYPE */}

          <div className="field">
            <label>
              Type de média
            </label>

            <select
              value={kind}
              onChange={(event) =>
                setKind(
                  event.target.value as
                    | "photo"
                    | "video"
                )
              }
            >
              <option value="photo">
                Photo
              </option>

              <option value="video">
                Vidéo
              </option>
            </select>
          </div>

          {/* EMPLACEMENT */}

          <div className="field">
            <label>
              Emplacement sur le site
            </label>

            <select
              value={siteLocation}
              onChange={(event) =>
                setSiteLocation(
                  event.target.value
                )
              }
            >
              <option value="">
                Choisir un emplacement
              </option>

              {SITE_LOCATION_GROUPS.map(
                (group) => (
                  <optgroup
                    key={group.label}
                    label={group.label}
                  >
                    {group.options.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </optgroup>
                )
              )}
            </select>
          </div>

          {/* LÉGENDE */}

          <div className="field md:col-span-2">
            <label>
              Légende
            </label>

            <input
              value={caption}
              onChange={(event) =>
                setCaption(
                  event.target.value
                )
              }
              placeholder="Courte description du média"
            />
          </div>

          {/* GALERIE */}

          <div className="md:col-span-2 rounded-s border border-ink/10 bg-bgAlt p-4">

            <p className="text-[13px] font-bold">
              Voulez-vous que cette photo ou vidéo
              aille aussi dans la Galerie ?
            </p>

            <div className="mt-3 flex max-w-sm gap-2">

              <button
                type="button"
                onClick={() =>
                  setGalleryEnabled(true)
                }
                className={`flex-1 rounded-s border px-4 py-2 text-[12px] font-semibold ${
                  galleryEnabled
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-paper text-ink"
                }`}
              >
                Oui
              </button>

              <button
                type="button"
                onClick={() => {
                  setGalleryEnabled(false);
                  setGalleryCategory("");
                }}
                className={`flex-1 rounded-s border px-4 py-2 text-[12px] font-semibold ${
                  !galleryEnabled
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 bg-paper text-ink"
                }`}
              >
                Non
              </button>

            </div>

            {galleryEnabled && (
              <div className="mt-4 max-w-md field">

                <label>
                  Rubrique de la Galerie
                </label>

                <select
                  value={galleryCategory}
                  onChange={(event) =>
                    setGalleryCategory(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Choisir une rubrique
                  </option>

                  {GALLERY_CATEGORIES.map(
                    (category) => (
                      <option
                        key={
                          category.value
                        }
                        value={
                          category.value
                        }
                      >
                        {category.label}
                      </option>
                    )
                  )}
                </select>

              </div>
            )}

          </div>

          {/* =================================================
              SÉLECTION DU FICHIER
          ================================================== */}

          <div className="md:col-span-2">

            <input
              id="media-file-input"
              type="file"
              accept={
                kind === "photo"
                  ? "image/*"
                  : "video/*"
              }
              onChange={handleUpload}
              disabled={
                uploading ||
                !siteLocation
              }
              className="sr-only"
            />

            <button
              type="button"
              onClick={() => {
                if (
                  !siteLocation ||
                  uploading
                ) {
                  return;
                }

                const input =
                  document.getElementById(
                    "media-file-input"
                  ) as HTMLInputElement | null;

                if (input) {
                  input.click();
                }
              }}
              disabled={
                uploading ||
                !siteLocation
              }
              className="w-full rounded-s border border-dashed border-ink/20 bg-bgAlt px-5 py-8 text-center transition hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div>

                <p className="text-[13px] font-semibold">
                  {uploading
                    ? "Envoi en cours..."
                    : "Choisir une photo ou une vidéo"}
                </p>

                <p className="mt-1 text-[11.5px] text-inkSoft">
                  {siteLocation
                    ? "Clique ici pour sélectionner un fichier sur ton ordinateur."
                    : "Choisis d'abord un emplacement sur le site."}
                </p>

                <p className="mt-1 text-[11px] text-inkSoft">
                  Taille maximale : 25 Mo
                </p>

              </div>
            </button>

            {!siteLocation && (
              <p className="mt-2 text-[11.5px] text-inkSoft">
                Choisis d'abord un emplacement
                sur le site.
              </p>
            )}

          </div>

        </div>
      </div>

      {/* =====================================================
          LISTE DES MÉDIAS
      ====================================================== */}

      <div>

        <div className="mb-4">
          <h2 className="font-serif text-xl font-semibold">
            Médias
          </h2>

          <p className="mt-1 text-[13px] text-inkSoft">
            {items.length} média
            {items.length > 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="rounded-s border border-ink/10 bg-paper p-6 text-[13px] text-inkSoft">
            Chargement des médias...
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="rounded-s border border-ink/10 bg-paper p-6 text-[13px] text-inkSoft">
            Aucun média pour le moment.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">

            {sortedItems.map(
              (item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-s border border-ink/10 bg-paper"
                >

                  {/* APERÇU */}

                  <div className="aspect-[16/10] bg-bgAlt">

                    {item.kind ===
                    "video" ? (
                      <video
                        src={item.url}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={
                          item.caption ||
                          "Média AgroFarms237"
                        }
                        className="h-full w-full object-cover"
                      />
                    )}

                  </div>

                  <div className="p-4">

                    {/* INFORMATIONS */}

                    <div className="space-y-2">

                      <div className="flex flex-wrap gap-2">

                        <span className="rounded-full bg-bgAlt px-2.5 py-1 text-[10.5px] font-semibold">
                          {item.kind ===
                          "photo"
                            ? "Photo"
                            : "Vidéo"}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
                            item.published
                              ? "bg-ink text-paper"
                              : "bg-bgAlt text-inkSoft"
                          }`}
                        >
                          {item.published
                            ? "Publié"
                            : "Masqué"}
                        </span>

                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-inkSoft">
                          Emplacement
                        </p>

                        <p className="mt-0.5 text-[13px] font-semibold">
                          {getLocationLabel(
                            item
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-inkSoft">
                          Galerie
                        </p>

                        <p className="mt-0.5 text-[13px]">
                          {getGalleryLabel(
                            item
                          )}
                        </p>
                      </div>

                      {item.caption && (
                        <p className="text-[12.5px] text-inkSoft">
                          {item.caption}
                        </p>
                      )}

                    </div>

                    {/* =================================================
                        AFFICHAGE NORMAL
                    ================================================== */}

                    {editingId !== item.id ? (
                      <>

                        <div className="mt-4 grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              moveItem(
                                item.id,
                                "up"
                              )
                            }
                            disabled={
                              index === 0
                            }
                            className="rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Monter
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              moveItem(
                                item.id,
                                "down"
                              )
                            }
                            disabled={
                              index ===
                              sortedItems.length -
                                1
                            }
                            className="rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Descendre
                          </button>

                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(
                                item
                              )
                            }
                            className="rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt"
                          >
                            Modifier
                          </button>

                          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-s border border-ink/10 px-3 py-2 text-[12.5px] font-semibold">

                            <input
                              type="checkbox"
                              checked={
                                item.published
                              }
                              onChange={(event) =>
                                togglePublished(
                                  item.id,
                                  event.target
                                    .checked
                                )
                              }
                            />

                            {item.published
                              ? "Publié"
                              : "Masqué"}

                          </label>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            remove(item.id)
                          }
                          className="mt-2 w-full text-[12.5px] font-semibold text-alert underline"
                        >
                          Supprimer définitivement
                        </button>

                      </>
                    ) : (
                      /* =================================================
                         MODE MODIFICATION
                      ================================================== */

                      <div className="mt-4 space-y-3">

                        <div className="field">

                          <label>
                            Emplacement du site
                          </label>

                          <select
                            value={
                              editingSiteLocation
                            }
                            onChange={(event) =>
                              setEditingSiteLocation(
                                event.target
                                  .value
                              )
                            }
                          >

                            <option value="">
                              Aucun emplacement
                            </option>

                            {SITE_LOCATION_GROUPS.map(
                              (group) => (
                                <optgroup
                                  key={
                                    group.label
                                  }
                                  label={
                                    group.label
                                  }
                                >
                                  {group.options.map(
                                    (
                                      option
                                    ) => (
                                      <option
                                        key={
                                          option.value
                                        }
                                        value={
                                          option.value
                                        }
                                      >
                                        {
                                          option.label
                                        }
                                      </option>
                                    )
                                  )}
                                </optgroup>
                              )
                            )}

                          </select>

                        </div>

                        <div className="field">

                          <label>
                            Légende
                          </label>

                          <input
                            value={
                              editingCaption
                            }
                            onChange={(event) =>
                              setEditingCaption(
                                event.target
                                  .value
                              )
                            }
                          />

                        </div>

                        {/* GALERIE */}

                        <div className="rounded-s border border-ink/10 bg-bgAlt p-3">

                          <p className="text-[12.5px] font-bold">
                            Galerie publique
                          </p>

                          <div className="mt-2 flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setEditingGalleryEnabled(
                                  true
                                )
                              }
                              className={`flex-1 rounded-s border px-3 py-2 text-[11.5px] font-semibold ${
                                editingGalleryEnabled
                                  ? "border-ink bg-ink text-paper"
                                  : "border-ink/15 bg-paper text-ink"
                              }`}
                            >
                              Oui
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingGalleryEnabled(
                                  false
                                );
                                setEditingGalleryCategory(
                                  ""
                                );
                              }}
                              className={`flex-1 rounded-s border px-3 py-2 text-[11.5px] font-semibold ${
                                !editingGalleryEnabled
                                  ? "border-ink bg-ink text-paper"
                                  : "border-ink/15 bg-paper text-ink"
                              }`}
                            >
                              Non
                            </button>

                          </div>

                          {editingGalleryEnabled && (
                            <div className="mt-3 field">

                              <label>
                                Rubrique de la Galerie
                              </label>

                              <select
                                value={
                                  editingGalleryCategory
                                }
                                onChange={(
                                  event
                                ) =>
                                  setEditingGalleryCategory(
                                    event.target
                                      .value
                                  )
                                }
                              >

                                <option value="">
                                  Choisir une rubrique
                                </option>

                                {GALLERY_CATEGORIES.map(
                                  (
                                    category
                                  ) => (
                                    <option
                                      key={
                                        category.value
                                      }
                                      value={
                                        category.value
                                      }
                                    >
                                      {
                                        category.label
                                      }
                                    </option>
                                  )
                                )}

                              </select>

                            </div>
                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={
                              saveEditing
                            }
                            className="btn btn-ink flex-1"
                          >
                            Enregistrer
                          </button>

                          <button
                            type="button"
                            onClick={
                              cancelEditing
                            }
                            className="flex-1 rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt"
                          >
                            Annuler
                          </button>

                        </div>

                      </div>
                    )}

                  </div>
                </div>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
}
