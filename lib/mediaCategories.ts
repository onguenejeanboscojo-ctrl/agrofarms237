
 // ============================================================
 // AGROFARMS237 — CATÉGORIES MÉDIAS
 // ============================================================

 // Emplacements réels des médias sur le site
 export const SITE_LOCATIONS = [
   // ACCUEIL
   { value: "hero", label: "Accueil — Diaporama principal" },
   { value: "production", label: "Accueil — Notre production" },

   // NOTRE FERME — CARNET DE FERME
   { value: "apropos_hero", label: "Notre ferme — Hero / diaporama" },
   { value: "histoire", label: "Notre ferme — Notre histoire" },
   { value: "apropos_lieu", label: "Notre ferme — Carnet : Le lieu" },
   { value: "apropos_gestes", label: "Notre ferme — Carnet : Les gestes du quotidien" },
   { value: "apropos_nos_elevages", label: "Notre ferme — Carnet : Nos élevages / diaporama" },
   { value: "apropos_details", label: "Notre ferme — Carnet : Les détails qui comptent" },
   { value: "apropos_ferme_demain", label: "Notre ferme — Carnet : La ferme de demain" },
   { value: "apropos_agriculture", label: "Notre ferme — Agriculture et terres" },

   // SECTIONS DE LA FERME
   { value: "apropos_pisciculture", label: "Notre ferme — Pisciculture" },
   { value: "apropos_porcin", label: "Notre ferme — Élevage porcin" },
   { value: "apropos_aviculture", label: "Notre ferme — Aviculture" },
   { value: "apropos_vision", label: "Notre ferme — Vision" },
   { value: "apropos_etape_01", label: "Notre ferme — Étape 01 — Les premières productions" },
   { value: "apropos_etape_02", label: "Notre ferme — Étape 02 — La structuration" },
   { value: "apropos_etape_03", label: "Notre ferme — Étape 03 — La diversification" },
   { value: "apropos_etape_04", label: "Notre ferme — Étape 04 — La valorisation" },
   { value: "apropos_vie_ferme", label: "Notre ferme — La vie de la ferme" },
   { value: "apropos_actualites", label: "Notre ferme — Actualités" },
   { value: "equipe", label: "Notre ferme — Notre équipe" },

   // NOTRE ÉLEVAGE
   { value: "elevage_silure", label: "Notre élevage — Silure" },
   { value: "elevage_carpe", label: "Notre élevage — Carpe" },
   { value: "elevage_porcs", label: "Notre élevage — Porcs" },
   { value: "elevage_pondeuses", label: "Notre élevage — Poules pondeuses" },
   { value: "elevage_chair", label: "Notre élevage — Poulets de chair" },

   // PAGE PRODUITS — SECTIONS
   { value: "produits_hero", label: "Produits — Hero" },
   { value: "produits_pisciculture", label: "Produits — Filière Pisciculture" },
   { value: "produits_porcin", label: "Produits — Filière Élevage porcin" },
   { value: "produits_aviculture", label: "Produits — Filière Aviculture" },

   // PAGE PRODUITS — PHOTOS DU CATALOGUE
   { value: "produit_silure_frais", label: "Produit — Silure frais" },
   { value: "produit_silure_fume", label: "Produit — Silure fumé" },
   { value: "produit_carpe_fraiche", label: "Produit — Carpe fraîche" },
   { value: "produit_carpe_fumee", label: "Produit — Carpe fumée" },
   { value: "produit_porc_frais", label: "Produit — Porc frais" },
   { value: "produit_porc_fume", label: "Produit — Porc fumé" },
   { value: "produit_porc_entier", label: "Produit — Porc entier" },
   { value: "produit_porcelet", label: "Produit — Porcelet" },
   { value: "produit_poulet_frais_nettoye", label: "Produit — Poulet frais nettoyé" },
   { value: "produit_poulet_fume", label: "Produit — Poulet fumé" },
   { value: "produit_poulet_vivant", label: "Produit — Poulet vivant" },
   { value: "produit_alveoles_oeufs", label: "Produit — Alvéoles d’œufs" },
   { value: "produit_poussins", label: "Produit — Poussins" },
   { value: "produit_alevins", label: "Produit — Alevins" },

   // ESPACE ÉDUCATION
   { value: "education_pisciculture", label: "Éducation — Pisciculture" },
   { value: "education_porcs", label: "Éducation — Élevage porcin" },
   { value: "education_aviculture", label: "Éducation — Aviculture" },
   { value: "education_agriculture", label: "Éducation — Agriculture" },

   // FORMATION PROFESSIONNELLE
   { value: "formation_pro_hero", label: "Formation professionnelle — Hero de la page" },
 ];

 // ============================================================
 // GROUPES POUR L'ADMIN
 // ============================================================

 export const SITE_LOCATION_GROUPS = [
   {
     label: "Accueil",
     options: SITE_LOCATIONS.filter((item) =>
       ["hero", "production"].includes(item.value)
     ),
   },
   {
     label: "Notre ferme — Carnet de ferme",
     options: SITE_LOCATIONS.filter((item) =>
       [
         "apropos_hero",
         "histoire",
         "apropos_lieu",
         "apropos_gestes",
         "apropos_nos_elevages",
         "apropos_details",
         "apropos_ferme_demain",
         "apropos_agriculture",
         "apropos_pisciculture",
         "apropos_porcin",
         "apropos_aviculture",
         "apropos_vision",
         "apropos_etape_01",
         "apropos_etape_02",
         "apropos_etape_03",
         "apropos_etape_04",
         "apropos_vie_ferme",
         "apropos_actualites",
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
     options: SITE_LOCATIONS.filter(
       (item) =>
         [
           "produits_hero",
           "produits_pisciculture",
           "produits_porcin",
           "produits_aviculture",
         ].includes(item.value) || item.value.startsWith("produit_")
     ),
   },
   {
     label: "Espace Éducation",
     options: SITE_LOCATIONS.filter((item) =>
       item.value.startsWith("education_")
     ),
   },
   {
     label: "Formation professionnelle",
     options: SITE_LOCATIONS.filter((item) =>
       item.value.startsWith("formation_pro_")
     ),
   },
 ];

 // ============================================================
 // RUBRIQUES DE LA GALERIE PUBLIQUE
 // ============================================================

 export const GALLERY_CATEGORIES = [
   { value: "silures", label: "Silures" },
   { value: "porcs", label: "Porcs" },
   { value: "poules_pondeuses", label: "Poules pondeuses" },
   { value: "poulets", label: "Poulets" },
   { value: "bassins", label: "Bassins" },
   { value: "recoltes", label: "Récoltes" },
   { value: "alimentation", label: "Alimentation" },
   { value: "livraison", label: "Livraison / commandes" },
   { value: "ferme", label: "La ferme" },
   { value: "equipe", label: "Équipe" },
   { value: "produits", label: "Produits" },
   { value: "autre", label: "Autre" },
 ];

 // ============================================================
 // LIBELLÉS DES EMPLACEMENTS
 // ============================================================

 export const SITE_LOCATION_LABELS: Record<string, string> =
   Object.fromEntries(
     SITE_LOCATIONS.map((item) => [item.value, item.label])
   );

 // ============================================================
 // LIBELLÉS DES CATÉGORIES DE LA GALERIE
 // ============================================================

 export const GALLERY_CATEGORY_LABELS: Record<string, string> =
   Object.fromEntries(
     GALLERY_CATEGORIES.map((item) => [item.value, item.label])
   );

 // ============================================================
 // COMPATIBILITÉ AVEC L'ANCIEN SYSTÈME
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

 export const ELEVAGE_CATEGORIES = [
   { value: "elevage_silure", label: "Élevage — Silure" },
   { value: "elevage_carpe", label: "Élevage — Carpe" },
   { value: "elevage_porcs", label: "Élevage — Porcs" },
   { value: "elevage_pondeuses", label: "Élevage — Poules pondeuses" },
   { value: "elevage_chair", label: "Élevage — Poulets de chair" },
 ];

 export const PRODUCT_CATEGORIES = [
   { value: "produit_poisson_fume", label: "Produit — Poisson fumé" },
   { value: "produit_porc_fume", label: "Produit — Porc fumé" },
   { value: "produit_poulet_fume", label: "Produit — Poulet fumé" },
   { value: "produit_poulet_frais", label: "Produit — Poulet frais nettoyé" },
   { value: "produit_porcelet", label: "Produit — Porcelet" },
   { value: "produit_poussins", label: "Produit — Poussins" },
   { value: "produit_alevins", label: "Produit — Alevins" },
 ];

 export const EDUCATION_CATEGORIES = [
   { value: "education_pisciculture", label: "Éducation — Pisciculture" },
   { value: "education_porcs", label: "Éducation — Élevage porcin" },
   { value: "education_aviculture", label: "Éducation — Aviculture" },
   { value: "education_agriculture", label: "Éducation — Agriculture" },
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

 export const CATEGORY_LABELS: Record<string, string> = {
   ...SITE_LOCATION_LABELS,
   ...GALLERY_CATEGORY_LABELS,
 };
