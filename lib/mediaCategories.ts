// ============================================================
// CATÉGORIES MÉDIAS AGROFARMS237
// ============================================================

// ============================================================
// EMPLACEMENTS SPÉCIAUX DU SITE
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
// CATÉGORIES — GALERIE
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
// CATÉGORIES — NOS PRODUITS
// ============================================================

export const PRODUCT_CATEGORIES = [
  {
    value: "produit_poisson_fume",
    label: "Produit — Poisson fumé",
  },
  {
    value: "produit_porc_fume",
    label: "Produit — Porc fumé",
  },
  {
    value: "produit_poulet_fume",
    label: "Produit — Poulet fumé",
  },
  {
    value: "produit_poulet_frais",
    label: "Produit — Poulet frais nettoyé",
  },
  {
    value: "produit_porcelet",
    label: "Produit — Porcelet",
  },
  {
    value: "produit_poussins",
    label: "Produit — Poussins",
  },
  {
    value: "produit_alevins",
    label: "Produit — Alevins",
  },
];

// ============================================================
// CATÉGORIES — ESPACE ÉDUCATION
// ============================================================

export const EDUCATION_CATEGORIES = [
  {
    value: "education_pisciculture",
    label: "Éducation — Pisciculture",
  },
  {
    value: "education_porcs",
    label: "Éducation — Élevage porcin",
  },
  {
    value: "education_aviculture",
    label: "Éducation — Aviculture",
  },
  {
    value: "education_agriculture",
    label: "Éducation — Agriculture",
  },
];

// ============================================================
// GROUPES POUR L'ADMIN
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
    label: "Nos produits",
    options: PRODUCT_CATEGORIES,
  },
  {
    label: "Espace Éducation",
    options: EDUCATION_CATEGORIES,
  },
  {
    label: "Catégories de la galerie",
    options: GALLERY_CATEGORIES,
  },
];

// ============================================================
// LIBELLÉS
// ============================================================

export const CATEGORY_LABELS: Record<string, string> =
  Object.fromEntries(
    CATEGORY_GROUPS.flatMap((group) =>
      group.options.map((option) => [
        option.value,
        option.label,
      ])
    )
  );
