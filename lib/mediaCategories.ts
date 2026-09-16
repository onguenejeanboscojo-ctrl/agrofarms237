// Liste centrale des catégories de médias, utilisée à la fois par l'admin
// (formulaire d'ajout de photo) et par la page Galerie publique (pour créer
// une section par catégorie). Modifier cette liste met à jour les deux
// endroits automatiquement.

// Emplacements spéciaux : lus directement par des sections précises du site
// (diaporama d'accueil, section "Notre histoire") plutôt que par la Galerie.
export const SPECIAL_CATEGORIES = [
  { value: "hero", label: "Diaporama d'accueil (fond du haut de page)" },
  { value: "histoire", label: "Section « Notre histoire »" },
  { value: "production", label: "Section « Notre production » (carrousel)" },
];

// Catégories de la galerie : chacune devient une section dédiée sur la page
// Galerie publique, affichée uniquement si elle contient au moins une photo.
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

export const CATEGORY_GROUPS = [
  { label: "Emplacements spéciaux du site", options: SPECIAL_CATEGORIES },
  { label: "Catégories de la galerie", options: GALLERY_CATEGORIES },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((g) => g.options.map((o) => [o.value, o.label]))
);
