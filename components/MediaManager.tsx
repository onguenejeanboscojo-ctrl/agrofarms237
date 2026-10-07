"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  // Compatibilité ancien système
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
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [kind, setKind] =
    useState<"photo" | "video">("photo");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [siteLocation, setSiteLocation] =
    useState("");

  const [galleryEnabled, setGalleryEnabled] =
    useState(false);

  const [galleryCategory, setGalleryCategory] =
    useState("");

  const [caption, setCaption] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingCaption, setEditingCaption] =
    useState("");

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
          data.error ||
            "Impossible de charger les médias."
        );
      }

      setItems(data.items || []);
    } catch (err: any) {
      setError(
        err?.message ||
          "Erreur de chargement."
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

  /* =========================================================
     CHOIX DU FICHIER
  ========================================================= */

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetMessages();

    if (file.size > 25 * 1024 * 1024) {
      setSelectedFile(null);

      setError(
        "Fichier trop volumineux. La taille maximale est de 25 Mo."
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  function openFilePicker() {
    resetMessages();

    fileInputRef.current?.click();
  }

  function removeSelectedFile() {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  /* =========================================================
     ENVOI DU MÉDIA
  ========================================================= */

  async function handleUpload() {
    resetMessages();

    if (!selectedFile) {
      setError(
        "Choisis d'abord une photo ou une vidéo."
      );

      return;
    }

    if (!siteLocation) {
      setError(
        "Choisis l'emplacement du média sur le site."
      );

      return;
    }

    if (
      galleryEnabled &&
      !galleryCategory
    ) {
      setError(
        "Choisis une rubrique pour la Galerie."
      );

      return;
    }

    setUploading(true);

    try {
      const form = new FormData();

      form.append(
        "file",
        selectedFile
      );

      form.append(
        "kind",
        kind
      );

      form.append(
        "site_location",
        siteLocation
      );

      form.append(
        "gallery_enabled",
        galleryEnabled
          ? "true"
          : "false"
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

      form.append(
        "caption",
        caption
      );

      // Compatibilité avec l'ancien système
      form.append(
        "category",
        siteLocation
      );

      const res = await fetch(
        "/api/media",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Échec de l'envoi."
        );
      }

      setSelectedFile(null);
      setSiteLocation("");
      setGalleryEnabled(false);
      setGalleryCategory("");
      setCaption("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        "Le média a été ajouté avec succès."
      );

      await load();
    } catch (err: any) {
      setError(
        err?.message ||
          "Échec de l'envoi du média."
      );
    } finally {
      setUploading(false);
    }
  }

  /* =========================================================
     PUBLICATION / MASQUAGE
  ========================================================= */

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
            "Content-Type":
              "application/json",
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

  /* =========================================================
     MODIFICATION
  ========================================================= */

  function startEditing(
    item: MediaItem
  ) {
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

    if (
      editingGalleryEnabled &&
      !editingGalleryCategory
    ) {
      setError(
        "Choisis une rubrique pour la Galerie."
      );

      return;
    }

    const finalGalleryCategory =
      editingGalleryEnabled
        ? editingGalleryCategory ||
          null
        : null;

    try {
      const res = await fetch(
        `/api/media/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            site_location:
              editingSiteLocation ||
              null,

            gallery_enabled:
              editingGalleryEnabled,

            gallery_category:
              finalGalleryCategory,

            // Compatibilité ancien système
            category:
              editingSiteLocation ||
              null,

            caption:
              editingCaption ||
              null,
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
                  editingSiteLocation ||
                  null,

                category:
                  editingSiteLocation ||
                  null,

                gallery_enabled:
                  editingGalleryEnabled,

                gallery_category:
                  finalGalleryCategory,

                caption:
                  editingCaption ||
                  null,
              }
            : item
        )
      );

      setSuccess(
        "Média modifié avec succès."
      );

      cancelEditing();
    } catch (err: any) {
      setError(
        err?.message ||
          "Impossible de modifier le média."
      );
    }
  }

  /* =========================================================
     SUPPRESSION
  ========================================================= */

  async function remove(id: string) {
    resetMessages();

    const confirmed =
      window.confirm(
        "Supprimer définitivement ce média ?\n\n" +
          "Cette action supprimera également le fichier du stockage."
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

  /* =========================================================
     RÉORGANISATION
  ========================================================= */

  async function moveItem(
    id: string,
    direction: "up" | "down"
  ) {
    resetMessages();

    const index =
      sortedItems.findIndex(
        (item) =>
          item.id === id
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
      targetIndex >=
        sortedItems.length
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
      target.position ??
      targetIndex;

    const previous = items;

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.id === current.id
        ) {
          return {
            ...item,
            position:
              targetPosition,
          };
        }

        if (
          item.id === target.id
        ) {
          return {
            ...item,
            position:
              currentPosition,
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

      if (
        !res1.ok ||
        !res2.ok
      ) {
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

  /* =========================================================
     LIBELLÉS
  ========================================================= */

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

    return (
      GALLERY_CATEGORIES.find(
        (category) =>
          category.value ===
          item.gallery_category
      )?.label ||
      item.gallery_category
    );
  }

  /* =========================================================
     INTERFACE
  ========================================================= */

  return (
    <div>

      {/* =====================================================
          AJOUT
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
            Choisis d'abord ton fichier,
            puis indique où il doit être
            utilisé sur le site.
          </p>
        </div>

        {/* ===================================================
            TYPE + EMPLACEMENT
        ==================================================== */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <div className="field">
            <label>
              Type
            </label>

            <select
              value={kind}
              onChange={(e) => {
                setKind(
                  e.target.value as
                    | "photo"
                    | "video"
                );

                setSelectedFile(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value =
                    "";
                }
              }}
            >
              <option value="photo">
                Photo
              </option>

              <option value="video">
                Vidéo
              </option>
            </select>
          </div>

          <div className="field">
            <label>
              Emplacement du site
            </label>

            <select
              value={siteLocation}
              onChange={(e) =>
                setSiteLocation(
                  e.target.value
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

          <div className="field sm:col-span-2">
            <label>
              Légende{" "}
              <span className="ml-1 font-normal text-inkSoft">
                (optionnel)
              </span>
            </label>

            <input
              value={caption}
              onChange={(e) =>
                setCaption(
                  e.target.value
                )
              }
              placeholder="Ex. Bassins de production"
            />
          </div>

        </div>

        {/* ===================================================
            GALERIE
        ==================================================== */}

        <div className="mt-5 rounded-s border border-ink/10 bg-bgAlt p-4">

          <p className="text-[13px] font-bold">
            Galerie publique
          </p>

          <p className="mt-1 text-[12.5px] leading-5 text-inkSoft">
            Voulez-vous que cette photo
            ou vidéo apparaisse également
            dans la Galerie publique ?
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => {
                setGalleryEnabled(true);
              }}
              className={`rounded-s border px-4 py-2 text-[12.5px] font-semibold transition ${
                galleryEnabled
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-paper text-ink hover:bg-bgAlt"
              }`}
            >
              Oui, ajouter à la Galerie
            </button>

            <button
              type="button"
              onClick={() => {
                setGalleryEnabled(false);
                setGalleryCategory("");
              }}
              className={`rounded-s border px-4 py-2 text-[12.5px] font-semibold transition ${
                !galleryEnabled
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 bg-paper text-ink hover:bg-bgAlt"
              }`}
            >
              Non, uniquement sur le site
            </button>

          </div>

          {galleryEnabled && (
            <div className="mt-4 field">

              <label>
                Rubrique de la Galerie
              </label>

              <select
                value={galleryCategory}
                onChange={(e) =>
                  setGalleryCategory(
                    e.target.value
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

        {/* ===================================================
            FICHIER
        ==================================================== */}

        <input
          ref={fileInputRef}
          type="file"
          accept={
            kind === "photo"
              ? "image/*"
              : "video/*"
          }
          className="hidden"
          onChange={
            handleFileChange
          }
        />

        <button
          type="button"
          onClick={
            openFilePicker
          }
          disabled={uploading}
          className="btn btn-ink mt-5 w-full"
        >
          Choisir une{" "}
          {kind === "photo"
            ? "photo"
            : "vidéo"}
        </button>

        {/* FICHIER SÉLECTIONNÉ */}

        {selectedFile && (
          <div className="mt-3 rounded-s border border-ink/10 bg-bgAlt p-3">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">
                <p className="text-[12px] font-semibold">
                  Fichier sélectionné
                </p>

                <p className="mt-0.5 truncate text-[13px] text-inkSoft">
                  {selectedFile.name}
                </p>

                <p className="mt-0.5 text-[11px] text-inkSoft">
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  Mo
                </p>
              </div>

              <button
                type="button"
                onClick={
                  removeSelectedFile
                }
                className="shrink-0 text-[12px] font-semibold text-alert underline"
              >
                Retirer
              </button>

            </div>

          </div>
        )}

        <p className="mt-2 text-[13px] text-inkSoft">
          Taille maximale : 25 Mo.
        </p>

        {/* ===================================================
            ENVOYER
        ==================================================== */}

        <button
          type="button"
          onClick={
            handleUpload
          }
          disabled={
            uploading ||
            !selectedFile
          }
          className="btn btn-ink mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading
            ? "Envoi en cours..."
            : "Envoyer le média"}
        </button>

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
          MÉDIAS EXISTANTS
      ====================================================== */}

      <div className="mt-9">

        <div className="mb-4">
          <h2 className="font-serif text-[24px] font-semibold">
            MÉDIAS EXISTANTS
          </h2>

          <p className="mt-1 text-[13.5px] text-inkSoft">
            Modifie, masque, réorganise ou
            supprime tes médias depuis
            cette bibliothèque.
          </p>
        </div>

        {loading ? (
          <p className="text-inkSoft">
            Chargement...
          </p>
        ) : sortedItems.length === 0 ? (
          <div className="rounded-m border border-ink/10 bg-bgAlt p-8 text-center">

            <p className="font-semibold">
              Aucun média envoyé pour
              le moment.
            </p>

            <p className="mt-1 text-[13px] text-inkSoft">
              Les photos et vidéos ajoutées
              apparaîtront ici.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {sortedItems.map(
              (item, index) => {

                const isEditing =
                  editingId === item.id;

                const isFirst =
                  index === 0;

                const isLast =
                  index ===
                  sortedItems.length - 1;

                const displayedSiteLocation =
                  item.site_location ||
                  item.category ||
                  "";

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-m border border-ink/10 bg-paper"
                  >

                    {/* APERÇU */}

                    <div className="relative">

                      {item.kind ===
                      "photo" ? (
                        <img
                          src={item.url}
                          alt={
                            item.caption ||
                            "Média AgroFarms237"
                          }
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
                        {item.kind ===
                        "photo"
                          ? "Photo"
                          : "Vidéo"}
                      </div>

                    </div>

                    <div className="p-3.5">

                      {/* EMPLACEMENT */}

                      {displayedSiteLocation && (
                        <p className="text-[11.5px] font-bold text-goldDeep">
                          {CATEGORY_LABELS[
                            displayedSiteLocation
                          ] ||
                            displayedSiteLocation}
                        </p>
                      )}

                      {!isEditing ? (
                        <>

                          {/* LÉGENDE */}

                          {item.caption ? (
                            <p className="mt-1 text-[13px] text-inkSoft">
                              {item.caption}
                            </p>
                          ) : (
                            <p className="mt-1 text-[12px] italic text-inkSoft">
                              Aucune légende
                            </p>
                          )}

                          {/* GALERIE */}

                          <div className="mt-3 rounded-s border border-ink/10 bg-bgAlt p-2.5">

                            {item.gallery_enabled ? (
                              <>
                                <p className="text-[11px] font-bold uppercase tracking-wide text-green-700">
                                  Galerie publique
                                </p>

                                <p className="mt-0.5 text-[12px] text-inkSoft">
                                  {getGalleryLabel(
                                    item
                                  )}
                                </p>
                              </>
                            ) : (
                              <p className="text-[11.5px] text-inkSoft">
                                Uniquement sur son
                                emplacement du site
                              </p>
                            )}

                          </div>

                          {/* MONTER / DESCENDRE */}

                          <div className="mt-3 flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                moveItem(
                                  item.id,
                                  "up"
                                )
                              }
                              disabled={
                                isFirst
                              }
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
                              disabled={
                                isLast
                              }
                              className="flex-1 rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Descendre
                            </button>

                          </div>

                          {/* MODIFIER / PUBLICATION */}

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
                                onChange={(e) =>
                                  togglePublished(
                                    item.id,
                                    e.target
                                      .checked
                                  )
                                }
                              />

                              {item.published
                                ? "Publié"
                                : "Masqué"}

                            </label>

                          </div>

                          {/* SUPPRIMER */}

                          <button
                            type="button"
                            onClick={() =>
                              remove(
                                item.id
                              )
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

                        <div className="mt-3 space-y-3">

                          <div className="field">

                            <label>
                              Emplacement du site
                            </label>

                            <select
                              value={
                                editingSiteLocation
                              }
                              onChange={(e) =>
                                setEditingSiteLocation(
                                  e.target.value
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
                              onChange={(e) =>
                                setEditingCaption(
                                  e.target.value
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
                                  onChange={(e) =>
                                    setEditingGalleryCategory(
                                      e.target.value
                                    )
                                  }
                                >

                                  <option value="">
                                    Choisir une rubrique
                                  </option>

                                  {GALLERY_CATEGORIES.map(
                                    (
                                      galleryCategory
                                    ) => (
                                      <option
                                        key={
                                          galleryCategory.value
                                        }
                                        value={
                                          galleryCategory.value
                                        }
                                      >
                                        {
                                          galleryCategory.label
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
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
}
