"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_GROUPS,
  CATEGORY_LABELS,
  GALLERY_CATEGORIES,
} from "@/lib/mediaCategories";

type MediaItem = {
  id: string;
  url: string;
  storage_path?: string | null;
  kind: "photo" | "video";
  category?: string | null;
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
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState("");
  const [editingCategory, setEditingCategory] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const pa = a.position ?? 0;
      const pb = b.position ?? 0;

      if (pa !== pb) return pa - pb;

      return (
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
      );
    });
  }, [items]);

  async function load() {
    try {
      setLoading(true);

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
      setError(err.message || "Erreur de chargement.");
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
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    resetMessages();
    setUploading(true);

    try {
      const form = new FormData();

      form.append("file", file);
      form.append("kind", kind);
      form.append("category", category);
      form.append("caption", caption);

      const res = await fetch("/api/media", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Échec de l'envoi."
        );
      }

      setCaption("");
      setCategory("");

      setSuccess("Le média a été ajouté.");

      await load();
    } catch (err: any) {
      setError(
        err.message || "Échec de l'envoi."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
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
          ? { ...item, published }
          : item
      )
    );

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published }),
      });

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
        err.message ||
          "Impossible de modifier le statut."
      );
    }
  }

  function startEditing(item: MediaItem) {
    resetMessages();

    setEditingId(item.id);
    setEditingCaption(item.caption || "");
    setEditingCategory(item.category || "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingCaption("");
    setEditingCategory("");
  }

  async function saveEditing() {
    if (!editingId) return;

    resetMessages();

    try {
      const res = await fetch(
        `/api/media/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caption: editingCaption || null,
            category: editingCategory || null,
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
                caption:
                  editingCaption || null,
                category:
                  editingCategory || null,
              }
            : item
        )
      );

      setSuccess("Média modifié.");
      cancelEditing();
    } catch (err: any) {
      setError(
        err.message ||
          "Impossible de modifier le média."
      );
    }
  }

  async function remove(id: string) {
    resetMessages();

    const confirmed = window.confirm(
      "Supprimer définitivement ce média ?\n\nCette action supprimera également le fichier du stockage."
    );

    if (!confirmed) return;

    const previous = items;

    setItems((current) =>
      current.filter((item) => item.id !== id)
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
        err.message ||
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

    if (index === -1) return;

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

    const current = sortedItems[index];
    const target = sortedItems[targetIndex];

    const currentPosition =
      current.position ?? index;

    const targetPosition =
      target.position ?? targetIndex;

    const previous = items;

    setItems((currentItems) => {
      return currentItems.map((item) => {
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
      });
    });

    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/media/${current.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: targetPosition,
          }),
        }),

        fetch(`/api/media/${target.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: currentPosition,
          }),
        }),
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
    } catch (err: any) {
      setItems(previous);

      setError(
        err.message ||
          "Impossible de modifier l'ordre."
      );
    }
  }

  return (
    <div>
      {/* =====================================================
          AJOUTER UN MÉDIA
      ====================================================== */}

      <div className="max-w-[700px] rounded-m border border-ink/10 bg-paper p-7">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-goldDeep">
            Bibliothèque média
          </p>

          <h2 className="mt-1 font-serif text-[24px] font-semibold">
            Ajouter une photo ou une vidéo
          </h2>

          <p className="mt-2 text-[14px] leading-6 text-inkSoft">
            Ajoute un média puis indique où il doit être utilisé
            sur le site.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label>Type</label>

            <select
              value={kind}
              onChange={(e) =>
                setKind(
                  e.target.value as "photo" | "video"
                )
              }
            >
              <option value="photo">Photo</option>
              <option value="video">Vidéo</option>
            </select>
          </div>

          <div className="field">
            <label>Emplacement du site</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="">
                Choisir un emplacement
              </option>

              {CATEGORY_GROUPS.map((group) => (
                <optgroup
                  key={group.label}
                  label={group.label}
                >
                  {group.options.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="field sm:col-span-2">
            <label>
              Légende
              <span className="ml-1 font-normal text-inkSoft">
                (optionnel)
              </span>
            </label>

            <input
              value={caption}
              onChange={(e) =>
                setCaption(e.target.value)
              }
              placeholder="Ex. Bassins de production"
            />
          </div>
        </div>

        {/* =====================================================
            GALERIE
        ====================================================== */}

        <div className="mt-5 rounded-s border border-ink/10 bg-bgAlt p-4">
          <p className="text-[13px] font-bold">
            Galerie publique
          </p>

          <p className="mt-1 text-[12.5px] leading-5 text-inkSoft">
            La connexion entre l'emplacement du site et une
            rubrique de la Galerie sera activée dans l'étape
            suivante, sans supprimer le fonctionnement actuel.
          </p>

          <div className="mt-3">
            <select
              disabled
              className="opacity-60"
              defaultValue=""
            >
              <option value="">
                Galerie — à configurer
              </option>

              {GALLERY_CATEGORIES.map(
                (galleryCategory) => (
                  <option
                    key={galleryCategory.value}
                    value={galleryCategory.value}
                  >
                    {galleryCategory.label}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <label className="btn btn-ink mt-5 cursor-pointer">
          {uploading
            ? "Envoi en cours..."
            : "Choisir un fichier à envoyer"}

          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>

        <p className="mt-2 text-[13px] text-inkSoft">
          25 Mo maximum par fichier.
        </p>

        {error && (
          <p className="mt-4 text-[14px] font-semibold text-alert">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 text-[14px] font-semibold text-green-700">
            {success}
          </p>
        )}
      </div>

      {/* =====================================================
          LISTE DES MÉDIAS
      ====================================================== */}

      <div className="mt-9">
        <div className="mb-4">
          <h2 className="font-serif text-[24px] font-semibold">
            MÉDIAS EXISTANTS — VERSION TEST
          </h2>

          <p className="mt-1 text-[13.5px] text-inkSoft">
            Modifie, masque, réorganise ou supprime tes médias
            depuis cette bibliothèque.
          </p>
        </div>

        {loading ? (
          <p className="text-inkSoft">
            Chargement...
          </p>
        ) : sortedItems.length === 0 ? (
          <div className="rounded-m border border-ink/10 bg-bgAlt p-8 text-center">
            <p className="font-semibold">
              Aucun média envoyé pour le moment.
            </p>

            <p className="mt-1 text-[13px] text-inkSoft">
              Les photos et vidéos ajoutées apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedItems.map((item, index) => {
              const isEditing =
                editingId === item.id;

              const isFirst = index === 0;
              const isLast =
                index === sortedItems.length - 1;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-m border border-ink/10 bg-paper"
                >
                  {/* MEDIA */}

                  <div className="relative">
                    {item.kind === "photo" ? (
                      <img
                        src={item.url}
                        alt={item.caption || ""}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="aspect-square w-full object-cover"
                        muted
                        controls
                      />
                    )}

                    <div className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-paper">
                      {item.kind === "photo"
                        ? "Photo"
                        : "Vidéo"}
                    </div>
                  </div>

                  <div className="p-3.5">
                    {/* EMPLACEMENT */}

                    {item.category && (
                      <p className="text-[11.5px] font-bold text-goldDeep">
                        {CATEGORY_LABELS[item.category] ||
                          item.category}
                      </p>
                    )}

                    {/* CAPTION / MODIFICATION */}

                    {!isEditing ? (
                      item.caption ? (
                        <p className="mt-1 text-[13px] text-inkSoft">
                          {item.caption}
                        </p>
                      ) : (
                        <p className="mt-1 text-[12px] italic text-inkSoft">
                          Aucune légende
                        </p>
                      )
                    ) : (
                      <div className="mt-3 space-y-3">
                        <div className="field">
                          <label>Emplacement</label>

                          <select
                            value={editingCategory}
                            onChange={(e) =>
                              setEditingCategory(
                                e.target.value
                              )
                            }
                          >
                            <option value="">
                              Aucun emplacement
                            </option>

                            {CATEGORY_GROUPS.map(
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

                        <div className="field">
                          <label>Légende</label>

                          <input
                            value={editingCaption}
                            onChange={(e) =>
                              setEditingCaption(
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveEditing}
                            className="btn btn-ink flex-1"
                          >
                            Enregistrer
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="flex-1 rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}

                    {!isEditing && (
                      <>
                        {/* =================================================
                            MONTER / DESCENDRE
                        ================================================== */}

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              moveItem(
                                item.id,
                                "up"
                              )
                            }
                            disabled={isFirst}
                            className="flex-1 rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt disabled:cursor-not-allowed disabled:opacity-40"
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
                            disabled={isLast}
                            className="flex-1 rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Descendre
                          </button>
                        </div>

                        {/* =================================================
                            MODIFIER / PUBLIÉ
                        ================================================== */}

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(item)
                            }
                            className="rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt"
                          >
                            Modifier
                          </button>

                          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-s border border-ink/10 px-3 py-2 text-[12.5px] font-semibold">
                            <input
                              type="checkbox"
                              checked={item.published}
                              onChange={(e) =>
                                togglePublished(
                                  item.id,
                                  e.target.checked
                                )
                              }
                            />

                            {item.published
                              ? "Publié"
                              : "Masqué"}
                          </label>
                        </div>

                        {/* =================================================
                            SUPPRESSION
                        ================================================== */}

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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
