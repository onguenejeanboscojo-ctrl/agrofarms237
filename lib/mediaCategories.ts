export type MediaCategory = {
  value: string;
  label: string;
};

export type MediaCategoryGroup = {
  label: string;
  options: MediaCategory[];
};

/**
 * Emplacements média utilisés par le site public.
 *
 * IMPORTANT :
 * Les valeurs `value` doivent correspondre exactement
 * aux `site_location` utilisés dans les pages du site.
 */
export const SITE_LOCATION_GROUPS: MediaCategoryGroup[] = [
  {
    label: "Accueil",
    options: [
      {
        value: "accueil_hero",
        label: "Accueil — Hero",
      },
      {
        value: "accueil_presentation",
        label: "Accueil — Présentation",
      },
      {
        value: "accueil_activites",
        label: "Accueil — Activités",
      },
      {
        value: "accueil_elevage",
        label: "Accueil — Notre élevage",
      },
    ],
  },

  {
    label: "Nos produits",
    options: [
      // Médias propres à la page Produits
      {
        value: "produits_hero",
        label: "Produits — Hero",
      },
      {
        value: "produits_pisciculture",
        label: "Produits — Filière Pisciculture",
      },
      {
        value: "produits_porcin",
        label: "Produits — Filière Élevage porcin",
      },
      {
        value: "produits_aviculture",
        label: "Produits — Filière Aviculture",
      },

      // Produits
      {
        value: "produit_silure_frais",
        label: "Produit — Silure frais",
      },
      {
        value: "produit_silure_fume",
        label: "Produit — Silure fumé",
      },
      {
        value: "produit_carpe_fraiche",
        label: "Produit — Carpe fraîche",
      },
      {
        value: "produit_carpe_fumee",
        label: "Produit — Carpe fumée",
      },
      {
        value: "produit_porc_frais",
        label: "Produit — Porc frais",
      },
      {
        value: "produit_porc_fume",
        label: "Produit — Porc fumé",
      },
      {
        value: "produit_porc_entier",
        label: "Produit — Porc entier",
      },
      {
        value: "produit_porcelet",
        label: "Produit — Porcelet",
      },
      {
        value: "produit_poulet_frais_nettoye",
        label: "Produit — Poulet frais nettoyé",
      },
      {
        value: "produit_poulet_fume",
        label: "Produit — Poulet fumé",
      },
      {
        value: "produit_poulet_vivant",
        label: "Produit — Poulet vivant",
      },
      {
        value: "produit_alveoles_oeufs",
        label: "Produit — Alvéoles d’œufs",
      },
      {
        value: "produit_poussins",
        label: "Produit — Poussins",
      },
      {
        value: "produit_alevins",
        label: "Produit — Alevins",
      },
    ],
  },

  {
    label: "À propos",
    options: [
      {
        value: "a_propos_hero",
        label: "À propos — Hero",
      },
      {
        value: "a_propos_activites",
        label: "À propos — Activités",
      },
      {
        value: "a_propos_ferme",
        label: "À propos — Vie de la ferme",
      },
      {
        value: "a_propos_equipe",
        label: "À propos — Équipe",
      },
    ],
  },

  {
    label: "Notre élevage",
    options: [
      {
        value: "elevage_hero",
        label: "Notre élevage — Hero",
      },
      {
        value: "elevage_pisciculture",
        label: "Notre élevage — Pisciculture",
      },
      {
        value: "elevage_porcin",
        label: "Notre élevage — Élevage porcin",
      },
      {
        value: "elevage_aviculture",
        label: "Notre élevage — Aviculture",
      },
    ],
  },

  {
    label: "Professionnels",
    options: [
      {
        value: "professionnels_hero",
        label: "Professionnels — Hero",
      },
      {
        value: "professionnels_contenu",
        label: "Professionnels — Contenu",
      },
    ],
  },

  {
    label: "Partenaires",
    options: [
      {
        value: "partenaires_hero",
        label: "Partenaires — Hero",
      },
      {
        value: "partenaires_contenu",
        label: "Partenaires — Contenu",
      },
    ],
  },

  {
    label: "Contact",
    options: [
      {
        value: "contact_hero",
        label: "Contact — Hero",
      },
    ],
  },

  {
    label: "Actualités",
    options: [
      {
        value: "actualites_hero",
        label: "Actualités — Hero",
      },
      {
        value: "actualite_article",
        label: "Actualité — Article",
      },
    ],
  },

  {
    label: "Galerie",
    options: [
      {
        value: "galerie_hero",
        label: "Galerie — Hero",
      },
    ],
  },
];

/**
 * Retourne tous les emplacements disponibles sous forme plate.
 */
export const SITE_LOCATION_OPTIONS: MediaCategory[] =
  SITE_LOCATION_GROUPS.flatMap((group) => group.options);

/**
 * Recherche le libellé d'un emplacement.
 */
export function getSiteLocationLabel(
  value?: string | null
): string {
  if (!value) return "Non défini";

  return (
    SITE_LOCATION_OPTIONS.find(
      (option) => option.value === value
    )?.label || value
  );
}
