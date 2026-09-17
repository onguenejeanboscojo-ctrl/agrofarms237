// Liste centrale des catégories de médias.
// Ces catégories sont utilisées par l'administration pour classer les
// photos/vidéos et par les différentes pages publiques du site.

// ============================================================
// EMPLACEMENTS SPÉCIAUX
// ============================================================

export const SPECIAL_CATEGORIES = [
  {
    value: "hero",
    label: "Diaporama d'accueil (fond du haut de page)",
  },
  {
    value: "histoire",
    label: "Section « Notre histoire »",
  },
  {
    value: "production",
    label: "Section « Notre production » (carrousel)",
  },
];

// ============================================================
// CATÉGORIES DE LA GALERIE
// ============================================================

export const GALLERY_CATEGORIES = [
  { value: "equipe", label: "Équipe" },
  { value: "bassins", label: "Bassins" },
  { value: "silures", label: "Silures" },
  { value: "recolte", label: "Récolte" },
  { value: "alimentation", label: "Alimentation" },
  { value: "livraison", label: "Livraison / commandes" },
  { value: "ferme", label: "La ferme en général" },
  { value: "autre", label: "Autre" },
];

// ============================================================
// CATÉGORIES — NOTRE ÉLEVAGE
// ============================================================

export const ELEVAGE_CATEGORIES = [
  {
    value: "elevage_silure",
    label: "Élevage — Silure",
  },
  {
    value: "elevage_carpe",
    label: "Élevage — Carpe",
  },
  {
    value: "elevage_porcs",
    label: "Élevage — Porcs",
  },
  {
    value: "elevage_pondeuses",
    label: "Élevage — Poules pondeuses",
  },
  {
    value: "elevage_chair",
    label: "Élevage — Poulets de chair",
  },
];

// ============================================================
// GROUPES UTILISÉS PAR L'ADMIN
// ============================================================

export const CATEGORY_GROUPS = [
  {
    label: "Emplacements spéciaux du site",
    options: SPECIAL_CATEGORIES,
  },
  {
    label: "Notre élevage",
    options: ELEVAGE_CATEGORIES,
  },
  {
    label: "Catégories de la galerie",
    options: GALLERY_CATEGORIES,
  },
];

// ============================================================
// LIBELLÉS DES CATÉGORIES
// ============================================================

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((group) =>
    group.options.map((option) => [option.value, option.label])
  )
);
