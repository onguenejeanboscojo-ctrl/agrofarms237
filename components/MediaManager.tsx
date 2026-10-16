
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SITE_LOCATION_GROUPS,
  SITE_LOCATION_LABELS,
  GALLERY_CATEGORIES,
} from "@/lib/mediaCategories";
import {
  Search,
  Upload,
  Images,
  House,
  Sprout,
  Fish,
  ShoppingBasket,
  BookOpen,
  GraduationCap,
  BriefcaseBusiness,
  Handshake,
  ShoppingCart,
  ImagePlus,
  Film,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  Filter,
  LayoutGrid,
  FolderOpen,
  RefreshCw,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

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
  category?: string | null;
  site_location?: string | null;
  gallery_enabled?: boolean;
  gallery_category?: string | null;
  caption?: string | null;
  published: boolean;
  position?: number | null;
  created_at?: string;
};

type LocationGroup = {
  label: string;
  options: { value: string; label: string }[];
};

type EditForm = {
  caption: string;
  site_location: string;
  gallery_enabled: boolean;
  gallery_category: string;
};

const sectionIcons: Record<string, typeof House> = {
  Accueil: House,
  "Notre ferme — Carnet de ferme": Sprout,
  "Notre élevage": Fish,
  "Nos produits": ShoppingBasket,
  "Espace Éducation": BookOpen,
  "Formation professionnelle": GraduationCap,
  "Espace professionnels": BriefcaseBusiness,
  "Partenaires & investisseurs": Handshake,
  "Page Commander": ShoppingCart,
};

const panelClass =
  "rounded-2xl border border-[#173D2D]/10 bg-white shadow-sm";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

function normalize(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getProductLocation(product: CatalogProduct): string | null {
  const text = normalize(
    `${product.name} ${product.variant ?? ""} ${product.product_group ?? ""}`
  );

  if (text.includes("silure"))
    return text.includes("fum")
      ? "produit_silure_fume"
      : "produit_silure_frais";

  if (text.includes("carpe"))
    return text.includes("fum")
      ? "produit_carpe_fumee"
      : "produit_carpe_fraiche";

  if (text.includes("porcelet")) return "produit_porcelet";

  if (text.includes("porc")) {
    if (text.includes("fum")) return "produit_porc_fume";
    if (text.includes("entier")) return "produit_porc_entier";
    return "produit_porc_frais";
  }

  if (text.includes("poulet")) {
    if (text.includes("fum")) return "produit_poulet_fume";
    if (text.includes("vivant")) return "produit_poulet_vivant";
    return "produit_poulet_frais_nettoye";
  }

  if (text.includes("oeuf") || text.includes("alveole"))
    return "produit_alveoles_oeufs";

  if (text.includes("poussin")) return "produit_poussins";
  if (text.includes("alevin")) return "produit_alevins";

  return null;
}

function getMediaLocation(item: MediaItem) {
  return item.site_location || item.category || "";
}

function getLocationLabel(location: string) {
  return SITE_LOCATION_LABELS[location] || location || "Sans emplacement";
}

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeGroup, setActiveGroup] = useState("Accueil");
  const [activeLocation, setActiveLocation] = useState("");
  const [view, setView] = useState<"locations" | "all" | "public" | "unassigned">(
    "locations"
  );
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | "photo" | "video">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "hidden"
  >("all");

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadKind, setUploadKind] = useState<"photo" | "video">("photo");
  const [uploadLocation, setUploadLocation] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadGallery, setUploadGallery] = useState(false);
  const [uploadGalleryCategory, setUploadGalleryCategory] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    caption: "",
    site_location: "",
    gallery_enabled: false,
    gallery_category: "",
  });
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const response = await fetch("/api/media", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger les médias.");
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur de chargement des médias."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    const byId = new Map<string, CatalogProduct>();

    try {
      for (const endpoint of ["/api/catalog-products", "/api/products"]) {
        try {
          const response = await fetch(endpoint, { cache: "no-store" });
          const data = await response.json();
          if (!response.ok) continue;

          const candidates = Array.isArray(data)
            ? data
            : data?.items ?? data?.products ?? data?.data ?? [];

          if (!Array.isArray(candidates)) continue;

          for (const candidate of candidates) {
            if (
              candidate &&
              typeof candidate.id === "string" &&
              typeof candidate.name === "string"
            ) {
              byId.set(candidate.id, {
                ...byId.get(candidate.id),
                ...candidate,
              });
            }
          }
        } catch {
          // L'autre endpoint peut encore fournir les produits.
        }
      }

      setProducts(Array.from(byId.values()));
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    void loadProducts();
  }, [load, loadProducts]);

  const locationGroups = useMemo<LocationGroup[]>(() => {
    return SITE_LOCATION_GROUPS.map((group) => {
      if (group.label !== "Nos produits") return group;

      const extra = products
        .map((product) => {
          const value = getProductLocation(product);
          return value ? { value, label: product.name } : null;
        })
        .filter(
          (item): item is { value: string; label: string } => item !== null
        );

      const unique = new Map<string, { value: string; label: string }>();
      [...group.options, ...extra].forEach((option) => {
        if (!unique.has(option.value)) unique.set(option.value, option);
      });

      return { ...group, options: Array.from(unique.values()) };
    });
  }, [products]);

  const activeGroupData = locationGroups.find(
    (group) => group.label === activeGroup
  );

  const groupLocations = activeGroupData?.options ?? [];

  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          (a.position ?? 0) - (b.position ?? 0) ||
          (a.created_at ?? "").localeCompare(b.created_at ?? "")
      ),
    [items]
  );

  const countsByLocation = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const location = getMediaLocation(item);
      if (location) counts[location] = (counts[location] ?? 0) + 1;
    });
    return counts;
  }, [items]);

  const groupCount = useMemo(() => {
    const locations = new Set(groupLocations.map((item) => item.value));
    return items.filter((item) => locations.has(getMediaLocation(item))).length;
  }, [items, groupLocations]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      const location = getMediaLocation(item);
      const text = normalize(
        `${item.caption ?? ""} ${getLocationLabel(location)} ${item.id}`
      );

      if (search && !text.includes(normalize(search))) return false;
      if (kindFilter !== "all" && item.kind !== kindFilter) return false;

      if (statusFilter === "published" && !item.published) return false;
      if (statusFilter === "hidden" && item.published) return false;

      if (view === "public" && !item.gallery_enabled) return false;
      if (view === "unassigned" && location) return false;

      if (view === "locations") {
        if (activeLocation) return location === activeLocation;
        const locations = new Set(groupLocations.map((entry) => entry.value));
        return locations.has(location);
      }

      return true;
    });
  }, [
    sortedItems,
    search,
    kindFilter,
    statusFilter,
    view,
    activeLocation,
    groupLocations,
  ]);

  const publicCount = items.filter((item) => item.gallery_enabled).length;
  const publishedCount = items.filter((item) => item.published).length;
  const unassignedCount = items.filter(
    (item) => !getMediaLocation(item)
  ).length;

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function selectGroup(label: string) {
    setActiveGroup(label);
    setActiveLocation("");
    setView("locations");
    setSearch("");
  }

  function openUpload(location = activeLocation) {
    clearMessages();
    setUploadLocation(location);
    setUploadCaption("");
    setUploadGallery(false);
    setUploadGalleryCategory("");
    setUploadKind("photo");
    setUploadOpen(true);
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    clearMessages();

    if (!uploadLocation) {
      setError("Choisis d'abord l'emplacement du média.");
      event.target.value = "";
      return;
    }

    if (uploadGallery && !uploadGalleryCategory) {
      setError("Choisis une rubrique pour la galerie publique.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", uploadKind);
      form.append("site_location", uploadLocation);
      form.append("category", uploadLocation);
      form.append("gallery_enabled", String(uploadGallery));
      form.append("caption", uploadCaption);

      if (uploadGallery) {
        form.append("gallery_category", uploadGalleryCategory);
      }

      const response = await fetch("/api/media", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Échec de l'envoi du fichier.");
      }

      setSuccess("Le média a été ajouté avec succès.");
      setUploadOpen(false);
      await load(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function startEditing(item: MediaItem) {
    clearMessages();
    setEditingId(item.id);
    setEditForm({
      caption: item.caption ?? "",
      site_location: getMediaLocation(item),
      gallery_enabled: Boolean(item.gallery_enabled),
      gallery_category: item.gallery_category ?? "",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm({
      caption: "",
      site_location: "",
      gallery_enabled: false,
      gallery_category: "",
    });
  }

  async function saveEditing() {
    if (!editingId) return;

    clearMessages();

    if (!editForm.site_location) {
      setError("Choisis un emplacement pour ce média.");
      return;
    }

    if (editForm.gallery_enabled && !editForm.gallery_category) {
      setError("Choisis une rubrique pour la galerie publique.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/media/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_location: editForm.site_location,
          category: editForm.site_location,
          caption: editForm.caption || null,
          gallery_enabled: editForm.gallery_enabled,
          gallery_category: editForm.gallery_enabled
            ? editForm.gallery_category
            : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Impossible de modifier le média.");
      }

      setItems((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                site_location: editForm.site_location,
                category: editForm.site_location,
                caption: editForm.caption || null,
                gallery_enabled: editForm.gallery_enabled,
                gallery_category: editForm.gallery_enabled
                  ? editForm.gallery_category
                  : null,
              }
            : item
        )
      );

      setSuccess("Modifications enregistrées.");
      cancelEditing();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de modifier le média."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(item: MediaItem) {
    clearMessages();
    const published = !item.published;

    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, published } : entry
      )
    );

    try {
      const response = await fetch(`/api/media/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Impossible de modifier la publication.");
      }

      setSuccess(published ? "Média publié." : "Média masqué.");
    } catch (err) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, published: item.published } : entry
        )
      );
      setError(err instanceof Error ? err.message : "Erreur de publication.");
    }
  }

  async function remove(item: MediaItem) {
    const confirmed = window.confirm(
      "Supprimer définitivement ce média ?\n\nLe fichier sera également supprimé du stockage."
    );
    if (!confirmed) return;

    clearMessages();
    const previous = items;
    setItems((current) => current.filter((entry) => entry.id !== item.id));

    try {
      const response = await fetch(`/api/media/${item.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de supprimer ce média.");
      }

      setSuccess("Média supprimé définitivement.");
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Erreur de suppression.");
    }
  }

  async function moveItem(item: MediaItem, direction: "up" | "down") {
    clearMessages();

    const currentIndex = filteredItems.findIndex(
      (entry) => entry.id === item.id
    );
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= filteredItems.length) {
      return;
    }

    const target = filteredItems[targetIndex];
    const currentPosition = item.position ?? currentIndex;
    const targetPosition = target.position ?? targetIndex;
    const previous = items;

    setItems((current) =>
      current.map((entry) => {
        if (entry.id === item.id) return { ...entry, position: targetPosition };
        if (entry.id === target.id) return { ...entry, position: currentPosition };
        return entry;
      })
    );

    try {
      const responses = await Promise.all([
        fetch(`/api/media/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: targetPosition }),
        }),
        fetch(`/api/media/${target.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: currentPosition }),
        }),
      ]);

      if (responses.some((response) => !response.ok)) {
        throw new Error("Impossible d'enregistrer l'ordre des médias.");
      }

      setSuccess("Ordre des médias mis à jour.");
    } catch (err) {
      setItems(previous);
      setError(err instanceof Error ? err.message : "Erreur de réorganisation.");
    }
  }

  const activeTitle =
    view === "all"
      ? "Tous les médias"
      : view === "public"
        ? "Galerie publique"
        : view === "unassigned"
          ? "Médias sans emplacement"
          : activeLocation
            ? getLocationLabel(activeLocation)
            : activeGroup;

  return (
    <div className="space-y-6 text-[#173D2D]">
      {/* EN-TÊTE */}
      <div className="relative overflow-hidden rounded-3xl bg-[#173D2D] p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-white/10" />

        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#D9BC7C]">
              <Images size={16} />
              Centre de gestion visuelle
            </div>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              Bibliothèque média
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Organise les photos et vidéos d'AgroFarms237 par section du site.
              Choisis où chaque média apparaît et gère séparément sa visibilité
              dans la galerie publique.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openUpload()}
            className={`${buttonClass} bg-[#D9BC7C] text-[#173D2D] hover:bg-[#E8D4A4]`}
          >
            <Upload size={17} />
            Ajouter un média
          </button>
        </div>

        <div className="relative mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total des médias", value: items.length, icon: Images },
            { label: "Publiés sur le site", value: publishedCount, icon: Eye },
            { label: "Galerie publique", value: publicCount, icon: LayoutGrid },
            { label: "Sans emplacement", value: unassignedCount, icon: FolderOpen },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.07] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs leading-5 text-white/65">
                    {stat.label}
                  </span>
                  <Icon size={17} className="text-[#D9BC7C]" />
                </div>
                <p className="mt-2 text-3xl font-semibold tabular-nums">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MESSAGES */}
      {(error || success) && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error ? <X size={18} /> : <Check size={18} />}
          <p className="flex-1">{error || success}</p>
          <button
            type="button"
            onClick={clearMessages}
            aria-label="Fermer le message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* NAVIGATION ET BIBLIOTHÈQUE */}
      <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={`${panelClass} overflow-hidden`}>
          <div className="border-b border-[#173D2D]/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8D9B8D]">
              Bibliothèque
            </p>
          </div>

          <div className="space-y-1 p-3">
            <button
              type="button"
              onClick={() => {
                setView("all");
                setActiveLocation("");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                view === "all"
                  ? "bg-[#173D2D] text-white"
                  : "hover:bg-[#F2F2EA]"
              }`}
            >
              <Images size={18} />
              <span className="flex-1">Tous les médias</span>
              <span className="text-xs opacity-70">{items.length}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setView("public");
                setActiveLocation("");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                view === "public"
                  ? "bg-[#173D2D] text-white"
                  : "hover:bg-[#F2F2EA]"
              }`}
            >
              <Eye size={18} />
              <span className="flex-1">Galerie publique</span>
              <span className="text-xs opacity-70">{publicCount}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setView("unassigned");
                setActiveLocation("");
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                view === "unassigned"
                  ? "bg-[#173D2D] text-white"
                  : "hover:bg-[#F2F2EA]"
              }`}
            >
              <FolderOpen size={18} />
              <span className="flex-1">Sans emplacement</span>
              <span className="text-xs opacity-70">{unassignedCount}</span>
            </button>
          </div>

          <div className="border-y border-[#173D2D]/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8D9B8D]">
              Sections du site
            </p>
          </div>

          <nav className="space-y-1 p-3">
            {locationGroups.map((group) => {
              const Icon = sectionIcons[group.label] ?? Images;
              const locations = new Set(group.options.map((entry) => entry.value));
              const count = items.filter((item) =>
                locations.has(getMediaLocation(item))
              ).length;
              const selected = view === "locations" && activeGroup === group.label;

              return (
                <button
                  type="button"
                  key={group.label}
                  onClick={() => selectGroup(group.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    selected
                      ? "bg-[#E8EDE5] text-[#173D2D]"
                      : "text-[#52675A] hover:bg-[#F5F5EF]"
                  }`}
                >
                  <Icon size={18} />
                  <span className="min-w-0 flex-1 text-sm font-medium">
                    {group.label}
                  </span>
                  <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-xs tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-5">
          {/* BARRE DE RECHERCHE */}
          <div className={`${panelClass} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B7863D]">
                  {view === "locations" ? "Emplacements du site" : "Bibliothèque"}
                </p>
                <h3 className="mt-1 break-words font-serif text-2xl font-semibold">
                  {activeTitle}
                </h3>
                <p className="mt-1 text-sm text-[#718074]">
                  {filteredItems.length} média{filteredItems.length > 1 ? "s" : ""}
                  {" "}affiché{filteredItems.length > 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void load(true);
                  void loadProducts();
                }}
                disabled={refreshing}
                className={`${buttonClass} border border-[#173D2D]/15 text-[#173D2D] hover:bg-[#F2F2EA]`}
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Actualiser
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="relative block md:col-span-2 xl:col-span-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D9B8D]"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un média..."
                  className="w-full rounded-xl border border-[#173D2D]/15 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#B7863D]"
                />
              </label>

              <label className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D9B8D]"
                />
                <select
                  value={kindFilter}
                  onChange={(event) =>
                    setKindFilter(event.target.value as typeof kindFilter)
                  }
                  className="w-full appearance-none rounded-xl border border-[#173D2D]/15 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-[#B7863D]"
                >
                  <option value="all">Tous les types</option>
                  <option value="photo">Photos</option>
                  <option value="video">Vidéos</option>
                </select>
              </label>

              <label>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as typeof statusFilter)
                  }
                  className="w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-3 text-sm outline-none focus:border-[#B7863D]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publiés sur le site</option>
                  <option value="hidden">Masqués sur le site</option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setKindFilter("all");
                  setStatusFilter("all");
                }}
                className={`${buttonClass} border border-[#173D2D]/15 text-[#52675A] hover:bg-[#F2F2EA]`}
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          {/* SOUS-EMPLACEMENTS */}
          {view === "locations" && !activeLocation && (
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              {groupLocations.map((location) => {
                const count = countsByLocation[location.value] ?? 0;

                return (
                  <button
                    key={location.value}
                    type="button"
                    onClick={() => setActiveLocation(location.value)}
                    className="group flex min-h-[116px] items-start gap-3 rounded-2xl border border-[#173D2D]/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#B7863D]/60 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#173D2D] transition group-hover:bg-[#173D2D] group-hover:text-white">
                      <FolderOpen size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-5">{location.label}</p>
                      <p className="mt-2 text-xs text-[#718074]">
                        {count} média{count > 1 ? "s" : ""}
                      </p>
                    </div>
                    <ExternalLink
                      size={15}
                      className="shrink-0 text-[#9AA59B] transition group-hover:text-[#B7863D]"
                    />
                  </button>
                );
              })}

              {groupLocations.length === 0 && (
                <div className={`${panelClass} p-6 text-sm text-[#718074]`}>
                  {productsLoading
                    ? "Chargement des emplacements..."
                    : "Aucun emplacement disponible dans cette section."}
                </div>
              )}
            </div>
          )}

          {view === "locations" && activeLocation && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#B7863D]/25 bg-[#F9F5EA] p-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveLocation("")}
                  className="rounded-lg border border-[#173D2D]/10 bg-white p-2 hover:bg-[#F2F2EA]"
                  aria-label="Retour aux emplacements"
                >
                  <ChevronUp size={18} />
                </button>
                <div className="min-w-0">
                  <p className="text-xs text-[#8C774E]">Emplacement sélectionné</p>
                  <p className="break-words font-semibold">
                    {getLocationLabel(activeLocation)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openUpload(activeLocation)}
                className={`${buttonClass} bg-[#173D2D] text-white hover:bg-[#28563F]`}
              >
                <ImagePlus size={16} />
                Ajouter ici
              </button>
            </div>
          )}

          {/* GRILLE DES MÉDIAS */}
          {loading ? (
            <div className={`${panelClass} flex items-center justify-center gap-3 p-14 text-sm text-[#718074]`}>
              <RefreshCw size={18} className="animate-spin" />
              Chargement des médias...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={`${panelClass} flex flex-col items-center px-6 py-14 text-center`}>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8EDE5] text-[#173D2D]">
                <ImageIcon size={28} />
              </div>
              <h4 className="mt-5 font-serif text-xl font-semibold">
                Aucun média trouvé
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#718074]">
                Cet espace ne contient aucun média correspondant aux filtres.
                Tu peux en ajouter un ou modifier ta recherche.
              </p>
              {view === "locations" && (
                <button
                  type="button"
                  onClick={() => openUpload(activeLocation)}
                  className={`${buttonClass} mt-5 bg-[#173D2D] text-white hover:bg-[#28563F]`}
                >
                  <Upload size={16} />
                  Ajouter un média
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {filteredItems.map((item, index) => {
                const editing = editingId === item.id;

                return (
                  <article
                    key={item.id}
                    className={`${panelClass} min-w-0 overflow-hidden`}
                  >
                    <div className="group relative aspect-[4/3] overflow-hidden bg-[#E8E8DF]">
                      {item.kind === "photo" ? (
                        <img
                          src={item.url}
                          alt={item.caption || "Média AgroFarms237"}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )}

                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#173D2D]/90 px-3 py-1.5 text-[11px] font-semibold text-white">
                          {item.kind === "photo" ? (
                            <ImageIcon size={13} />
                          ) : (
                            <Film size={13} />
                          )}
                          {item.kind === "photo" ? "Photo" : "Vidéo"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                            item.published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-white/90 text-[#52675A]"
                          }`}
                        >
                          {item.published ? "Publié" : "Masqué"}
                        </span>
                      </div>

                      {item.gallery_enabled && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#D9BC7C] px-3 py-1.5 text-[11px] font-bold text-[#173D2D]">
                          <Images size={13} />
                          Galerie publique
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 p-4">
                      {editing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold">
                              Emplacement sur le site
                            </label>
                            <select
                              value={editForm.site_location}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  site_location: event.target.value,
                                }))
                              }
                              className="w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-2.5 text-sm"
                            >
                              <option value="">Choisir un emplacement</option>
                              {locationGroups.map((group) => (
                                <optgroup key={group.label} label={group.label}>
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

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold">
                              Légende
                            </label>
                            <input
                              value={editForm.caption}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  caption: event.target.value,
                                }))
                              }
                              placeholder="Ajouter une légende..."
                              className="w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-2.5 text-sm"
                            />
                          </div>

                          <div className="rounded-xl bg-[#F5F5EF] p-3">
                            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                              <input
                                type="checkbox"
                                checked={editForm.gallery_enabled}
                                onChange={(event) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    gallery_enabled: event.target.checked,
                                    gallery_category: event.target.checked
                                      ? current.gallery_category
                                      : "",
                                  }))
                                }
                                className="h-4 w-4 accent-[#173D2D]"
                              />
                              Afficher aussi dans la galerie publique
                            </label>

                            {editForm.gallery_enabled && (
                              <select
                                value={editForm.gallery_category}
                                onChange={(event) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    gallery_category: event.target.value,
                                  }))
                                }
                                className="mt-3 w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-2.5 text-sm"
                              >
                                <option value="">Choisir une rubrique</option>
                                {GALLERY_CATEGORIES.map((category) => (
                                  <option
                                    key={category.value}
                                    value={category.value}
                                  >
                                    {category.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => void saveEditing()}
                              disabled={saving}
                              className={`${buttonClass} bg-[#173D2D] text-white hover:bg-[#28563F]`}
                            >
                              <Check size={15} />
                              {saving ? "Enregistrement..." : "Enregistrer"}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className={`${buttonClass} border border-[#173D2D]/15 hover:bg-[#F2F2EA]`}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#B7863D]">
                              {getLocationLabel(getMediaLocation(item))}
                            </p>
                            <p className="mt-1 break-words font-semibold">
                              {item.caption || "Sans légende"}
                            </p>
                            {item.created_at && (
                              <p className="mt-1 text-xs text-[#8D9B8D]">
                                Ajouté le{" "}
                                {new Date(item.created_at).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </p>
                            )}
                            {item.gallery_enabled && (
                              <p className="mt-2 text-xs text-[#52675A]">
                                Rubrique publique :{" "}
                                {GALLERY_CATEGORIES.find(
                                  (category) =>
                                    category.value === item.gallery_category
                                )?.label ||
                                  item.gallery_category ||
                                  "Non définie"}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => void moveItem(item, "up")}
                              disabled={index === 0}
                              className={`${buttonClass} border border-[#173D2D]/15 px-2 text-xs hover:bg-[#F2F2EA]`}
                            >
                              <ChevronUp size={15} />
                              Monter
                            </button>
                            <button
                              type="button"
                              onClick={() => void moveItem(item, "down")}
                              disabled={index === filteredItems.length - 1}
                              className={`${buttonClass} border border-[#173D2D]/15 px-2 text-xs hover:bg-[#F2F2EA]`}
                            >
                              <ChevronDown size={15} />
                              Descendre
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => startEditing(item)}
                              className={`${buttonClass} border border-[#173D2D]/15 hover:bg-[#F2F2EA]`}
                            >
                              <Pencil size={15} />
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => void togglePublished(item)}
                              className={`${buttonClass} border border-[#173D2D]/15 hover:bg-[#F2F2EA]`}
                            >
                              {item.published ? (
                                <EyeOff size={15} />
                              ) : (
                                <Eye size={15} />
                              )}
                              {item.published ? "Masquer" : "Publier"}
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#173D2D]/10 pt-3">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52675A] hover:text-[#B7863D]"
                            >
                              <ExternalLink size={14} />
                              Ouvrir le fichier
                            </a>
                            <button
                              type="button"
                              onClick={() => void remove(item)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* FENÊTRE D'AJOUT */}
      {uploadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10271D]/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !uploading) {
              setUploadOpen(false);
            }
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 bg-[#173D2D] p-6 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D9BC7C]">
                  Bibliothèque média
                </p>
                <h3 className="mt-1 font-serif text-2xl font-semibold">
                  Ajouter un média
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Choisis l'emplacement principal puis sa visibilité publique.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !uploading && setUploadOpen(false)}
                disabled={uploading}
                aria-label="Fermer"
                className="rounded-xl p-2 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Type de média
                  </label>
                  <select
                    value={uploadKind}
                    onChange={(event) =>
                      setUploadKind(event.target.value as "photo" | "video")
                    }
                    className="w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-3 text-sm"
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Vidéo</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold">
                    Emplacement principal
                  </label>
                  <select
                    value={uploadLocation}
                    onChange={(event) => setUploadLocation(event.target.value)}
                    className="w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-3 text-sm"
                  >
                    <option value="">Choisir un emplacement</option>
                    {locationGroups.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {productsLoading && (
                    <p className="mt-1 text-xs text-[#8D9B8D]">
                      Chargement des emplacements produits...
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Légende <span className="font-normal text-[#8D9B8D]">(facultatif)</span>
                </label>
                <input
                  value={uploadCaption}
                  onChange={(event) => setUploadCaption(event.target.value)}
                  placeholder="Ex. Nos bassins de production"
                  className="w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-3 text-sm"
                />
              </div>

              <div className="rounded-2xl border border-[#173D2D]/10 bg-[#F7F7F1] p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={uploadGallery}
                    onChange={(event) => {
                      setUploadGallery(event.target.checked);
                      if (!event.target.checked) setUploadGalleryCategory("");
                    }}
                    className="mt-1 h-4 w-4 accent-[#173D2D]"
                  />
                  <span>
                    <span className="block text-sm font-semibold">
                      Afficher aussi dans la galerie publique
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#718074]">
                      Le média restera associé à son emplacement principal.
                      Cette option l'ajoute également à la galerie visible par
                      les visiteurs.
                    </span>
                  </span>
                </label>

                {uploadGallery && (
                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-semibold">
                      Rubrique de la galerie publique
                    </label>
                    <select
                      value={uploadGalleryCategory}
                      onChange={(event) =>
                        setUploadGalleryCategory(event.target.value)
                      }
                      className="w-full rounded-xl border border-[#173D2D]/15 bg-white px-3 py-3 text-sm"
                    >
                      <option value="">Choisir une rubrique</option>
                      {GALLERY_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border-2 border-dashed border-[#173D2D]/20 bg-[#FBFBF7] p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#173D2D]">
                  {uploadKind === "photo" ? (
                    <ImagePlus size={23} />
                  ) : (
                    <Film size={23} />
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {uploadKind === "photo" ? "Choisir une photo" : "Choisir une vidéo"}
                </p>
                <p className="mt-1 text-xs text-[#718074]">
                  Taille maximale annoncée : 25 Mo par fichier
                </p>
                <label
                  className={`${buttonClass} mt-4 cursor-pointer bg-[#173D2D] text-white hover:bg-[#28563F]`}
                >
                  <Upload size={16} />
                  {uploading ? "Envoi en cours..." : "Parcourir les fichiers"}
                  <input
                    type="file"
                    accept={uploadKind === "photo" ? "image/*" : "video/*"}
                    className="hidden"
                    disabled={uploading}
                    onChange={handleUpload}
                  />
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  disabled={uploading}
                  className={`${buttonClass} border border-[#173D2D]/15 hover:bg-[#F2F2EA]`}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
