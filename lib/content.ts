import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULTS: Record<string, string> = {
  hero_lead:
    "Une production agricole camerounaise pensée pour offrir des produits frais, accessibles et suivis directement depuis la ferme — à Yaoundé, Mimboman.",
  histoire_texte:
    "Agrofarms237 est née d'une volonté simple : produire au Cameroun des aliments de qualité, accessibles et issus d'une production locale maîtrisée.\n\nL'aventure commence avec l'élevage de silures à Yaoundé, avec l'ambition de construire progressivement une véritable entreprise agricole camerounaise.\n\nNotre objectif est de créer une marque proche de ses clients, transparente sur ses produits et capable de répondre aussi bien aux besoins des familles qu'à ceux des restaurants et des poissonneries.",
  professionnels_intro:
    "Un tarif dégressif à partir de 30 kg, une livraison organisée et la possibilité de mettre en place des commandes récurrentes.",
  partenaires_intro:
    "Agrofarms237 développe sa production et prépare ses futures gammes. Nous sommes ouverts aux échanges avec des partenaires qui partagent cette vision d'une agriculture camerounaise structurée.",
};

// Lit une valeur de contenu éditable, avec repli sur le texte par défaut si
// Supabase n'est pas encore configuré ou si la clé n'existe pas encore.
export async function getContent(key: keyof typeof DEFAULTS): Promise<string> {
  try {
    const { data } = await supabaseAdmin().from("site_content").select("value").eq("key", key).single();
    return data?.value ?? DEFAULTS[key];
  } catch {
    return DEFAULTS[key];
  }
}

export { DEFAULTS as CONTENT_DEFAULTS };
