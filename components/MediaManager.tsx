"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SITE_LOCATION_GROUPS,
  SITE_LOCATION_LABELS,
  GALLERY_CATEGORIES,
} from "@/lib/mediaCategories";

type CatalogProduct = {
  id: string;
  name: string;
  category?: string | null;
  product_group?: string | null;
  variant?: string | null;
  unit?: string | null;
};

type MediaItem = {
  id: string;
  url: string;
  storage_path?: string | null;
  kind: "photo" | "video";

  // Compatibilité avec les anciens médias
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
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [kind, setKind] = useState<"photo" | "video">("photo");

  // Emplacement principal du média sur le site
  const [siteLocation, setSiteLocation] = useState("");

  // Galerie publique
  const [galleryEnabled, setGalleryEnabled] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState("");

  const [caption, setCaption] = useState("");

  // Modification d'un média existant
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState("");
  const [editingSiteLocation, setEditingSiteLocation] = useState("");
  const [editingGalleryEnabled, setEditingGalleryEnabled] =
    useState(false);
  const [editingGalleryCategory, setEditingGalleryCategory] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // TRI
  // ==========================================================

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const pa = a.position ?? 0;
      const pb = b.position ?? 0;

      if (pa !== pb) {
        return pa - pb;
      }

      return (
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
      );
    });
  }, [items]);

  // ==========================================================
  // PRODUITS — SOURCE DE VÉRITÉ POUR LES EMPLACEMENTS PRODUITS
  // ==========================================================

  function normalize(value?: string | null) {
    return (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function getProductSiteLocation(product: CatalogProduct) {
    const group = normalize(product.product_group);
    const variant = normalize(product.variant);
    const name = normalize(product.name);

    // Cette correspondance reprend volontairement la même logique
    // que la page publique /produits.
    if (group === "silure") {
      if (
        variant.includes("fum") ||
        name.includes("fume")
      ) {
        return "produit_silure_fume";
      }

      return "produit_silure_frais";
    }

    if (group === "carpe") {
      return "produit_carpe_fraiche";
    }

    if (group === "porc") {
      if (
        variant.includes("fum") ||
        name.includes("fume")
      ) {
        return "produit_porc_fume";
      }

      if (
        variant.includes("entier") ||
        name.includes("entier")
      ) {
        return "produit_porc_entier";
      }

      if (
        variant.includes("frais") ||
        name.includes("frais")
      ) {
        return "produit_porc_frais";
      }

      return "produit_porc_frais";
    }

    if (
      group === "porcelet" ||
      name.includes("porcelet")
    ) {
      return "produit_porcelet";
    }

    if (
      group === "poulet de chair" ||
      group === "poulet"
    ) {
      if (
        variant.includes("fum") ||
        name.includes("fume")
      ) {
        return "produit_poulet_fume";
      }

      if (
        variant.includes("vivant") ||
        name.includes("vivant")
      ) {
        return "produit_poulet_vivant";
      }

      if (
        variant.includes("frais") ||
        variant.includes("nettoye") ||
        name.includes("frais") ||
        name.includes("nettoye")
      ) {
        return "produit_poulet_frais_nettoye";
      }

      return "produit_poulet_frais_nettoye";
    }

    if (
      group === "oeufs" ||
      group === "oeuf" ||
      name.includes("alveole") ||
      variant.includes("alveole")
    ) {
      return "produit_alveoles_oeufs";
    }

    if (
      group === "poussins" ||
      name.includes("poussin")
    ) {
      return "produit_poussins";
    }

    if (
      group === "alevins" ||
      name.includes("alevin")
    ) {
      return "produit_alevins";
    }

    return null;
  }

  const productSiteOptions = useMemo(() => {
    return products
      .map((product) => {
        const value = getProductSiteLocation(product);

        if (!value) {
          return null;
        }

        return {
          value,
          label: product.name,
        };
      })
      .filter(
        (
          item
        ): item is {
          value: string;
          label: string;
        } => Boolean(item)
      );
  }, [products]);

  const productSiteLocationLabels = useMemo(() => {
    return Object.fromEntries(
      productSiteOptions.map((item) => [
        item.value,
        item.label,
      ])
    );
  }, [productSiteOptions]);

  const siteLocationGroups = useMemo(() => {
    return SITE_LOCATION_GROUPS.map((group) => {
      if (group.label !== "Nos produits") {
        return group;
      }

      return {
        ...group,
        options: productSiteOptions,
      };
    });
  }, [productSiteOptions]);

  async function loadProducts() {
    try {
      setProductsLoading(true);

      const res = await fetch("/api/catalog-products", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Impossible de charger les produits."
        );
      }

      setProducts(data.items || []);
    } catch (err: any) {
      setError(
        err.message || "Impossible de charger les produits."
      );
    } finally {
      setProductsLoading(false);
    }
  }

  // ==========================================================
  // CHARGEMENT
  // ==========================================================

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
      setError(err.message || "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    loadProducts();
  }, []);

  // ==========================================================
  // MESSAGES
  // ==========================================================

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  // ==========================================================
  // AJOUT
  // ==========================================================

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    resetMessages();
    setUploading(true);

    try {
      if (!siteLocation) {
        throw new Error(
          "Choisis d'abord l'emplacement du média sur le site."
        );
      }

      if (galleryEnabled && !galleryCategory) {
        throw new Error(
          "Choisis une rubrique pour la Galerie publique."
        );
      }

      const form = new FormData();

      form.append("file", file);
      form.append("kind", kind);

      // Nouveau système
      form.append("site_location", siteLocation);

      form.append(
        "gallery_enabled",
        galleryEnabled ? "true" : "false"
      );

      if (galleryEnabled && galleryCategory) {
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
          data.error || "Échec de l'envoi."
        );
      }

      setCaption("");
      setSiteLocation("");
      setGalleryEnabled(false);
      setGalleryCategory("");

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

  // ==========================================================
  // PUBLIER / MASQUER
  // ==========================================================

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
        err.message ||
          "Impossible de modifier le statut."
      );
    }
  }

  // ==========================================================
  // MODIFICATION
  // ==========================================================

  function startEditing(item: MediaItem) {
    resetMessages();

    setEditingId(item.id);

    setEditingCaption(
      item.caption || ""
    );

    // Nouveau système prioritaire
    // Fallback vers category pour les anciens médias
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

    if (!editingSiteLocation) {
      setError(
        "Choisis un emplacement pour ce média."
      );
      return;
    }

    if (
      editingGalleryEnabled &&
      !editingGalleryCategory
    ) {
      setError(
        "Choisis une rubrique pour la Galerie publique."
      );
      return;
    }

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

            // Compatibilité ancien système
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

                category:
                  editingSiteLocation || null,

                site_location:
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

      setSuccess("Média modifié.");

      cancelEditing();
    } catch (err: any) {
      setError(
        err.message ||
          "Impossible de modifier le média."
      );
    }
  }

  // ==========================================================
  // SUPPRESSION
  // ==========================================================

  async function remove(id: string) {
    resetMessages();

    const confirmed = window.confirm(
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
        err.message ||
          "Impossible de supprimer le média."
      );
    }
  }

  // ==========================================================
  // MONTER / DESCENDRE
  // ==========================================================

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
    } catch (err: any) {
      setItems(previous);

      setError(
        err.message ||
          "Impossible de modifier l'ordre."
      );
    }
  }

  // ==========================================================
  // RENDU
  // ==========================================================

  return (
    <div>
      {/* ======================================================
          AJOUT
      ====================================================== */}

      <div className="max-w-[760px] rounded-m border border-ink/10 bg-paper p-7">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-goldDeep">
            Bibliothèque média
          </p>

          <h2 className="mt-1 font-serif text-[24px] font-semibold">
            Ajouter une photo ou une vidéo
          </h2>

          <p className="mt-2 text-[14px] leading-6 text-inkSoft">
            Choisis l'emplacement principal du média
            sur le site. Tu peux ensuite décider s'il
            doit également apparaître dans la Galerie
            publique.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* TYPE */}

          <div className="field">
            <label>Type</label>

            <select
              value={kind}
              onChange={(e) =>
                setKind(
                  e.target.value as
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

              {productsLoading && (
                <option value="" disabled>
                  Chargement des produits...
                </option>
              )}

              {siteLocationGroups.map(
                (group) => (
                  <optgroup
                    key={group.label}
                    label={group.label}
                  >
                    {group.options.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </optgroup>
                )
              )}
            </select>

            <p className="mt-1.5 text-[11.5px] leading-5 text-inkSoft">
              La rubrique « Nos produits » reprend automatiquement les produits
              disponibles dans le catalogue public.
            </p>
          </div>

          {/* LÉGENDE */}

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

        {/* ====================================================
            GALERIE
        ===================================================== */}

        <div className="mt-5 rounded-s border border-ink/10 bg-bgAlt p-4">
          <p className="text-[13px] font-bold">
            Galerie publique
          </p>

          <p className="mt-1 text-[12.5px] leading-5 text-inkSoft">
            Voulez-vous que cette photo ou vidéo
            apparaisse également dans la Galerie
            publique ?
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setGalleryEnabled(true)
              }
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
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>

        {/* UPLOAD */}

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

      {/* ======================================================
          MÉDIAS EXISTANTS
      ====================================================== */}

      <div className="mt-9">
        <div className="mb-5">
          <h2 className="font-serif text-[24px] font-semibold">
            MÉDIAS EXISTANTS
          </h2>

          <p className="mt-1 text-[13.5px] text-inkSoft">
            Modifie, masque, réorganise ou supprime
            tes médias depuis cette bibliothèque.
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
              Les photos et vidéos ajoutées
              apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    className="flex h-full flex-col overflow-hidden rounded-m border border-ink/10 bg-paper shadow-sm"
                  >
                    {/* APERÇU */}

                    <div className="relative">
                      {item.kind ===
                      "photo" ? (
                        <img
                          src={item.url}
                          alt={
                            item.caption ||
                            "Média Agrofarms237"
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

                    <div className="flex flex-1 flex-col p-4">
                      {/* EMPLACEMENT */}

                      {displayedSiteLocation && (
                        <p className="text-[11.5px] font-bold leading-5 text-goldDeep">
                          {productSiteLocationLabels[
                            displayedSiteLocation
                          ] ||
                            SITE_LOCATION_LABELS[
                              displayedSiteLocation
                            ] ||
                            displayedSiteLocation}
                        </p>
                      )}

                      {!isEditing ? (
                        <>
                          {/* LÉGENDE */}

                          {item.caption ? (
                            <p className="mt-1 text-[13px] leading-5 text-inkSoft">
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
                                  {GALLERY_CATEGORIES.find(
                                    (category) =>
                                      category.value ===
                                      item.gallery_category
                                  )?.label ||
                                    item.gallery_category ||
                                    "Rubrique non définie"}
                                </p>
                              </>
                            ) : (
                              <p className="text-[11.5px] text-inkSoft">
                                Uniquement sur son emplacement
                                du site
                              </p>
                            )}
                          </div>

                          {/* =================================================
                              ACTIONS
                          ================================================== */}

                          <div className="mt-auto pt-4">
                            {/* MONTER / DESCENDRE */}

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  moveItem(
                                    item.id,
                                    "up"
                                  )
                                }
                                disabled={isFirst}
                                className="rounded-s border border-ink/15 bg-paper px-3 py-2.5 text-[12px] font-semibold text-ink transition hover:bg-bgAlt disabled:cursor-not-allowed disabled:opacity-40"
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
                                className="rounded-s border border-ink/15 bg-paper px-3 py-2.5 text-[12px] font-semibold text-ink transition hover:bg-bgAlt disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Descendre
                              </button>
                            </div>

                            {/* MODIFIER / PUBLIER */}

                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditing(
                                    item
                                  )
                                }
                                className="rounded-s border border-ink/15 bg-paper px-3 py-2.5 text-[12px] font-semibold text-ink transition hover:bg-bgAlt"
                              >
                                Modifier
                              </button>

                              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-s border border-ink/10 bg-paper px-3 py-2.5 text-[12px] font-semibold">
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
                              className="mt-3 w-full rounded-s border border-alert/20 bg-alert/5 px-3 py-2.5 text-[12px] font-semibold text-alert transition hover:bg-alert/10"
                            >
                              Supprimer définitivement
                            </button>
                          </div>
                        </>
                      ) : (
                        /* =================================================
                           MODE MODIFICATION
                        ================================================== */

                        <div className="mt-3 space-y-3">
                          {/* EMPLACEMENT */}

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

                              {productsLoading && (
                                <option value="" disabled>
                                  Chargement des produits...
                                </option>
                              )}

                              {siteLocationGroups.map(
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

                            <p className="mt-1.5 text-[11.5px] leading-5 text-inkSoft">
                              Les produits proposés ici sont synchronisés avec le
                              catalogue public.
                            </p>
                          </div>

                          {/* LÉGENDE */}

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

                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingGalleryEnabled(
                                    true
                                  )
                                }
                                className={`rounded-s border px-3 py-2 text-[11.5px] font-semibold ${
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
                                className={`rounded-s border px-3 py-2 text-[11.5px] font-semibold ${
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

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={
                                saveEditing
                              }
                              className="btn btn-ink"
                            >
                              Enregistrer
                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelEditing
                              }
                              className="rounded-s border border-ink/15 bg-paper px-3 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-bgAlt"
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
