//
// ============================================================
// AGROFARMS237 — CATÉGORIES MÉDIAS
// ============================================================
//
// Principe :
//
// 1. SITE_LOCATIONS
//    → emplacement principal du média sur le site.
//
// 2. GALLERY_CATEGORIES
//    → rubrique optionnelle de la Galerie publique.
//
// Un média peut donc être :
//
//   Emplacement site = elevage_porcs
//   Galerie = Oui
//   Rubrique Galerie = Porcs
//
// ou :
//
//   Emplacement site = elevage_porcs
//   Galerie = Non
//
// ============================================================


// ============================================================
// EMPLACEMENTS RÉELS DU SITE
// ============================================================

export const SITE_LOCATIONS = [
  {
    value: "hero",
    label: "Accueil — Diaporama principal",
  },

  {
    value: "histoire",
    label: "À propos — Notre histoire",
  },

  {
    value: "production",
    label: "Accueil — Notre production",
  },

  {
    value: "elevage_silure",
    label: "Notre élevage — Silure",
  },

  {
    value: "elevage_porcs",
    label: "Notre élevage — Porcs",
  },

  {
    value: "elevage_pondeuses",
    label: "Notre élevage — Poules pondeuses",
  },

  {
    value: "elevage_chair",
    label: "Notre élevage — Poulets de chair",
  },

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

  {
    value: "produit_alveoles_oeufs",
    label: "Produit — Alvéoles d’œufs",
  },

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

  {
    value: "equipe",
    label: "À propos — Notre équipe",
  },
];


// ============================================================
// GROUPES POUR L'ADMIN
// ============================================================

export const SITE_LOCATION_GROUPS = [
  {
    label: "Accueil",
    options: SITE_LOCATIONS.filter((item) =>
      [
        "hero",
        "production",
      ].includes(item.value)
    ),
  },

  {
    label: "À propos",
    options: SITE_LOCATIONS.filter((item) =>
      [
        "histoire",
        "equipe",
      ].includes(item.value)
    ),
  },

  {
    label: "Notre élevage",
    options: SITE_LOCATIONS.filter((item) =>
      item.value.startsWith("elevage_")
    ),
  },

  {
    label: "Nos produits",
    options: SITE_LOCATIONS.filter((item) =>
      item.value.startsWith("produit_")
    ),
  },

  {
    label: "Espace Éducation",
    options: SITE_LOCATIONS.filter((item) =>
      item.value.startsWith("education_")
    ),
  },
];


// ============================================================
// RUBRIQUES DE LA GALERIE PUBLIQUE
// ============================================================
//
// Ces rubriques existent toujours sur la page Galerie,
// même lorsqu'aucun média n'y est encore publié.
//

export const GALLERY_CATEGORIES = [
  {
    value: "silures",
    label: "Silures",
  },

  {
    value: "porcs",
    label: "Porcs",
  },

  {
    value: "poules_pondeuses",
    label: "Poules pondeuses",
  },

  {
    value: "poulets",
    label: "Poulets",
  },

  {
    value: "bassins",
    label: "Bassins",
  },

  {
    value: "recoltes",
    label: "Récoltes",
  },

  {
    value: "alimentation",
    label: "Alimentation",
  },

  {
    value: "livraison",
    label: "Livraison / commandes",
  },

  {
    value: "ferme",
    label: "La ferme",
  },

  {
    value: "equipe",
    label: "Équipe",
  },

  {
    value: "produits",
    label: "Produits",
  },

  {
    value: "autre",
    label: "Autre",
  },
];


// ============================================================
// LIBELLÉS DES EMPLACEMENTS
// ============================================================

export const SITE_LOCATION_LABELS: Record<
  string,
  string
> = Object.fromEntries(
  SITE_LOCATIONS.map((item) => [
    item.value,
    item.label,
  ])
);


// ============================================================
// LIBELLÉS GALERIE
// ============================================================

export const GALLERY_CATEGORY_LABELS: Record<
  string,
  string
> = Object.fromEntries(
  GALLERY_CATEGORIES.map((item) => [
    item.value,
    item.label,
  ])
);


// ============================================================
// COMPATIBILITÉ AVEC L'ANCIEN SYSTÈME
// ============================================================
//
// Ces constantes restent disponibles pour éviter de casser
// les composants existants pendant la transition.
//

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


export const ELEVAGE_CATEGORIES = [
  {
    value: "elevage_silure",
    label: "Élevage — Silure",
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

  {
    value: "produit_alveoles_oeufs",
    label: "Produit — Alvéoles d’œufs",
  },
];


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
// ANCIEN GROUPAGE — COMPATIBILITÉ
// ============================================================

export const CATEGORY_GROUPS = [
  {
    label: "Emplacements du site",
    options: SITE_LOCATIONS,
  },

  {
    label: "Catégories de la galerie",
    options: GALLERY_CATEGORIES,
  },
];


// ============================================================
// ANCIENS LIBELLÉS
// ============================================================

export const CATEGORY_LABELS: Record<
  string,
  string
> = {
  ...SITE_LOCATION_LABELS,
  ...GALLERY_CATEGORY_LABELS,
};
