import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductCarousel from "@/components/ProductCarousel";
import HeroSlideshow from "@/components/HeroSlideshow";

export const revalidate = 30;

type FarmItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  status: "disponible" | "bientot";
  photo_url: string | null;
  position: number;
  published: boolean;
};

type FarmMedia = {
  id: string;
  farm_breeding_id: string;
  url: string;
  storage_path: string;
  position: number;
  created_at: string;
};

type SiteMedia = {
  id: string;
  url: string;
  storage_path: string | null;
  kind: "photo" | "video";
  site_location: string | null;
  published: boolean;
  position: number;
  created_at: string;
};

type PageContent = {
  hero_label: string;
  hero_title: string;
  hero_description: string;

  step1_label: string;
  step1_title: string;
  step1_text: string;

  step2_label: string;
  step2_title: string;
  step2_text: string;

  step3_label: string;
  step3_title: string;
  step3_text: string;

  fish_label: string;
  fish_title: string;
  fish_description: string;

  pigs_label: string;
  pigs_title: string;
  pigs_description: string;

  poultry_label: string;
  poultry_title: string;
  poultry_description: string;

  vision_label: string;
  vision_title: string;
  vision_text: string;
};

const DEFAULT_CONTENT: PageContent = {
  hero_label: "Notre ferme",

  hero_title:
    "Une ferme en développement, production après production.",

  hero_description:
    "AgroFarms237 développe progressivement une ferme agricole autour de plusieurs filières. La pisciculture constitue aujourd’hui notre activité structurée, tandis que l’aviculture, l’élevage porcin et l’agriculture sont développés étape par étape.",

  step1_label: "Aujourd’hui",

  step1_title:
    "Pisciculture — silure",

  step1_text:
    "Notre activité actuellement structurée. Le silure est produit et commercialisé selon les disponibilités de la ferme.",

  step2_label:
    "Prochaine étape",

  step2_title:
    "Poulets de chair",

  step2_text:
    "Une production avicole en préparation, avec une disponibilité commerciale prévue à partir du 20 décembre 2026.",

  step3_label:
    "Développement",

  step3_title:
    "Porcs et agriculture",

  step3_text:
    "Deux axes de développement de la ferme : l’élevage porcin et la mise en valeur progressive des terres cultivables.",

  fish_label:
    "Production actuelle",

  fish_title:
    "Pisciculture",

  fish_description:
    "La pisciculture constitue aujourd’hui l’activité structurée d’AgroFarms237, avec le silure comme première production développée et commercialisée.",

  pigs_label:
    "Développement",

  pigs_title:
    "Élevage porcin",

  pigs_description:
    "L’élevage porcin est en phase de développement. La ferme prépare progressivement les installations et l’organisation nécessaires avant sa commercialisation.",

  poultry_label:
    "Aviculture",

  poultry_title:
    "Poulets",

  poultry_description:
    "L’aviculture est en préparation, avec un premier développement autour des poulets de chair dont la disponibilité commerciale est prévue à partir du 20 décembre 2026.",

  vision_label:
    "Notre vision",

  vision_title:
    "Construire une ferme agricole diversifiée, structurée et durable.",

  vision_text:
    "AgroFarms237 avance étape par étape : consolider la pisciculture, développer l’aviculture et l’élevage porcin, puis valoriser progressivement les terres agricoles disponibles.",
};


/**
 * Récupère le contenu éditorial de la page.
 */
async function getPageContent(): Promise<PageContent> {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("farm_breeding_content")
      .select("*")
      .order("created_at", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erreur récupération contenu Notre ferme :",
        error
      );

      return DEFAULT_CONTENT;
    }

    if (!data) {
      return DEFAULT_CONTENT;
    }

    return {
      ...DEFAULT_CONTENT,
      ...data,
    };
  } catch (error) {
    console.error(
      "Erreur inattendue récupération contenu :",
      error
    );

    return DEFAULT_CONTENT;
  }
}


/**
 * Récupère les élevages publiés.
 */
async function getFarmItems(): Promise<FarmItem[]> {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("farm_breeding")
      .select(
        "id,name,category,description,status,photo_url,position,published"
      )
      .eq("published", true)
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur récupération élevages :",
        error
      );

      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error(
      "Erreur inattendue récupération élevages :",
      error
    );

    return [];
  }
}


/**
 * Ancien système :
 * récupère les photos liées directement
 * à chaque élevage.
 *
 * On le conserve comme système de secours
 * pour ne rien casser.
 */
async function getFarmMedia(): Promise<FarmMedia[]> {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("farm_breeding_media")
      .select(
        "id,farm_breeding_id,url,storage_path,position,created_at"
      )
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur récupération photos des élevages :",
        error
      );

      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error(
      "Erreur inattendue récupération photos des élevages :",
      error
    );

    return [];
  }
}


/**
 * Nouveau système média.
 *
 * Les médias ajoutés depuis :
 *
 * Admin → Galerie
 *
 * avec un emplacement comme :
 *
 * Notre élevage — Porcs
 *
 * sont récupérés ici.
 */
async function getSiteMedia(): Promise<SiteMedia[]> {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("media")
      .select(
        "id,url,storage_path,kind,site_location,published,position,created_at"
      )
      .eq("published", true)
      .not("site_location", "is", null)
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Erreur récupération médias du site :",
        error
      );

      return [];
    }

    return (data ?? []).filter(
      (item) => item.kind === "photo"
    );
  } catch (error) {
    console.error(
      "Erreur inattendue récupération médias du site :",
      error
    );

    return [];
  }
}


function StatusBadge({
  status,
}: {
  status: "disponible" | "bientot";
}) {
  if (status === "disponible") {
    return (
      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        Disponible
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
      Bientôt disponible
    </span>
  );
}


function MediaBlock({
  media,
  fallback,
}: {
  media: FarmMedia[];
  fallback: string;
}) {
  if (media.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-black/5 px-6 text-center">
        <p className="text-sm text-black/45">
          {fallback}
        </p>
      </div>
    );
  }

  return (
    <ProductCarousel
      images={media.map((item) => item.url)}
    />
  );
}


/**
 * Transforme les nouveaux médias du système `media`
 * dans le même format que l'ancien composant.
 */
function convertSiteMedia(
  media: SiteMedia[],
  farmId: string
): FarmMedia[] {
  return media.map((item) => ({
    id: item.id,
    farm_breeding_id: farmId,
    url: item.url,
    storage_path: item.storage_path || "",
    position: item.position,
    created_at: item.created_at,
  }));
}


/**
 * Détermine les emplacements média correspondant
 * à un élevage.
 *
 * Poisson :
 *   elevage_silure
 *
 * Porcs :
 *   elevage_porcs
 *
 * Poulets :
 *   elevage_pondeuses
 *   elevage_chair
 */
function getSiteLocationsForFarm(
  item: FarmItem
): string[] {
  const normalize = (value: string) =>
    (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const category = normalize(item.category);
  const name = normalize(item.name);

  // SILURE
  if (
    category.includes("silure") ||
    name.includes("silure")
  ) {
    return ["elevage_silure"];
  }

  // CARPE
  if (
    category.includes("carpe") ||
    name.includes("carpe")
  ) {
    return ["elevage_carpe"];
  }

  // PORCS
  if (
    category.includes("porc") ||
    category.includes("elevage porcin") ||
    name.includes("porc")
  ) {
    return ["elevage_porcs"];
  }

  // POULES PONDEUSES
  if (
    category.includes("pondeuse") ||
    name.includes("pondeuse")
  ) {
    return ["elevage_pondeuses"];
  }

  // POULETS DE CHAIR
  if (
    category.includes("poulet") ||
    category.includes("aviculture") ||
    name.includes("poulet")
  ) {
    return ["elevage_chair"];
  }

  return [];
}


/**
 * Retourne les médias à afficher pour un élevage.
 *
 * PRIORITÉ :
 *
 * 1. Nouveau système `media.site_location`
 * 2. Ancien système `farm_breeding_media`
 * 3. photo_url de l'élevage
 */
function getMediaForFarm(
  item: FarmItem,
  siteMedia: SiteMedia[],
  legacyMedia: Record<string, FarmMedia[]>
): FarmMedia[] {
  const locations =
    getSiteLocationsForFarm(item);

  const newMedia = siteMedia.filter(
    (media) =>
      media.site_location &&
      locations.includes(media.site_location)
  );

  if (newMedia.length > 0) {
    return convertSiteMedia(
      newMedia,
      item.id
    );
  }

  const oldMedia =
    legacyMedia[item.id] || [];

  if (oldMedia.length > 0) {
    return oldMedia;
  }

  if (item.photo_url) {
    return [
      {
        id: `legacy-${item.id}`,
        farm_breeding_id: item.id,
        url: item.photo_url,
        storage_path: "",
        position: 0,
        created_at: "",
      },
    ];
  }

  return [];
}


export default async function NotreElevagePage() {
  const [
    content,
    farmItems,
    farmMedia,
    siteMedia,
  ] = await Promise.all([
    getPageContent(),
    getFarmItems(),
    getFarmMedia(),
    getSiteMedia(),
  ]);


  /**
   * Ancien système :
   *
   * élevage ID
   *      ↓
   * photos
   */
  const mediaByFarm: Record<
    string,
    FarmMedia[]
  > = {};

  for (const media of farmMedia) {
    if (!mediaByFarm[media.farm_breeding_id]) {
      mediaByFarm[media.farm_breeding_id] = [];
    }

    mediaByFarm[
      media.farm_breeding_id
    ].push(media);
  }


  /**
   * HERO
   *
   * On rassemble les médias provenant
   * du nouveau système et de l'ancien système.
   *
   * Les nouveaux médias ont priorité.
   */
  const heroImages = Array.from(
    new Set(
      farmItems.flatMap((item) => {
        const itemMedia =
          getMediaForFarm(
            item,
            siteMedia,
            mediaByFarm
          );

        if (itemMedia.length > 0) {
          return itemMedia.map(
            (media) => media.url
          );
        }

        return item.photo_url
          ? [item.photo_url]
          : [];
      })
    )
  );


  const poissons = farmItems.filter(
    (item) =>
      item.category
        .toLowerCase()
        .trim() === "poisson"
  );


  const porcs = farmItems.filter(
    (item) =>
      item.category
        .toLowerCase()
        .trim() === "porcs"
  );


  const poulets = farmItems.filter(
    (item) =>
      item.category
        .toLowerCase()
        .trim() === "poulets"
  );


  const allImages = heroImages.slice(0, 6);
  const firstFish = poissons[0];
  const firstFishMedia = firstFish
    ? getMediaForFarm(firstFish, siteMedia, mediaByFarm)
    : [];
  const storyImage = firstFishMedia[0]?.url || allImages[0] || null;

  const PhotoPlaceholder = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="relative flex min-h-[230px] items-end overflow-hidden rounded-2xl border border-[#D8D0BE] bg-[radial-gradient(ellipse_at_20%_10%,#54766A_0%,#18352B_55%,#0C211A_100%)] p-6 text-white sm:min-h-[280px]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(135deg, transparent 45%, rgba(232,212,161,.45) 45.2%, transparent 45.7%), linear-gradient(45deg, transparent 60%, rgba(255,255,255,.2) 60.2%, transparent 60.7%)" }} />
      <div className="relative">
        <span className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#E8D4A1]">AgroFarms237 · carnet de ferme</span>
        <p className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{title}</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <main className="overflow-hidden bg-[#F7F5EF] text-[#19362C]">
      {/* HERO IMMERSIF */}
      <section className="relative isolate min-h-[640px] overflow-hidden bg-[#10271F] text-white sm:min-h-[720px]">
        {heroImages.length > 0 ? (
          <div className="absolute inset-0">
            <HeroSlideshow images={heroImages} />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,#58766B_0%,#18352B_48%,#0B1D17_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07150F]/85 via-[#0B2119]/55 to-[#0B2119]/15" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#F7F5EF] to-transparent" />
        <div className="relative mx-auto flex min-h-[640px] max-w-[1320px] items-center px-5 pb-32 pt-28 sm:min-h-[720px] sm:px-10 sm:pb-40 lg:px-16">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.28em] text-[#E8D4A1] sm:text-xs">
              <span className="h-px w-10 bg-[#E8D4A1]" />{content.hero_label}
            </div>
            <h1 className="max-w-4xl break-words font-serif text-4xl font-medium leading-[1.02] tracking-[-.035em] sm:text-6xl lg:text-7xl xl:text-[88px]">
              {content.hero_title}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              {content.hero_description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#nos-productions" className="inline-flex items-center rounded-full bg-[#E8D4A1] px-6 py-3 text-sm font-semibold text-[#18352B] transition hover:bg-white">Explorer la ferme <span className="ml-3" aria-hidden="true">↘</span></a>
              <a href="#vie-ferme" className="inline-flex items-center rounded-full border border-white/35 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">La vie à la ferme</a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/20 pt-5 text-xs uppercase tracking-[.15em] text-white/65 sm:mt-16">
              <span>Produire localement</span><span>Avancer durablement</span><span>Grandir étape par étape</span>
            </div>
          </div>
        </div>
      </section>

      {/* PANNEAU HISTOIRE QUI CHEVAUCHE LE HERO */}
      <section className="relative z-10 mx-auto -mt-20 max-w-[1180px] px-5 sm:-mt-28 sm:px-8 lg:px-10">
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_25px_70px_rgba(20,42,32,.14)] md:grid-cols-[1.05fr_.95fr]">
          <div className="relative min-h-[270px] bg-[#18352B] sm:min-h-[360px]">
            {storyImage ? <img src={storyImage} alt="Aperçu de la production AgroFarms237" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0"><PhotoPlaceholder title="Une ferme qui se construit" subtitle="Les coulisses réelles de notre exploitation prendront place ici." /></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07150F]/55 to-transparent" />
            <span className="absolute bottom-5 left-6 text-[10px] font-semibold uppercase tracking-[.24em] text-white/85">De la ferme à votre table</span>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#A8833D]">Notre histoire · notre engagement</p>
            <h2 className="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">Une aventure agricole qui grandit, une production après l’autre.</h2>
            <p className="mt-5 text-sm leading-7 text-[#52645B]">AgroFarms237 se construit progressivement autour d’une conviction simple : développer une production locale suivie avec sérieux, valoriser les ressources disponibles et bâtir une ferme diversifiée, sans brûler les étapes.</p>
            <a href="#notre-parcours" className="mt-7 inline-flex w-fit items-center gap-3 border-b border-[#B89957] pb-2 text-sm font-semibold text-[#18352B]">Découvrir notre parcours <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      {/* PARCOURS DE DÉVELOPPEMENT */}
      <section id="notre-parcours" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#A8833D]">Notre progression</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">Une ferme en mouvement.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#66736B]">Chaque filière avance à son rythme. Nous consolidons l’existant avant d’élargir progressivement nos activités.</p>
          </div>
          <div className="border-t border-[#DAD8CF]">
            {[
              {label: content.step1_label, title: content.step1_title, text: content.step1_text, number: "01"},
              {label: content.step2_label, title: content.step2_title, text: content.step2_text, number: "02"},
              {label: content.step3_label, title: content.step3_title, text: content.step3_text, number: "03"},
            ].map((step) => (
              <div key={step.number} className="grid gap-3 border-b border-[#DAD8CF] py-6 sm:grid-cols-[70px_1fr] sm:gap-5 sm:py-8">
                <span className="font-serif text-2xl text-[#B89957]">{step.number}</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#A8833D]">{step.label}</p>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66736B]">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOSAÏQUE : LA VIE À LA FERME */}
      <section id="vie-ferme" className="bg-[#EDE9DE] py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#A8833D]">Carnet de ferme</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">La vie à la ferme, au-delà des produits.</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#66736B]">Les installations, les gestes du quotidien et les coulisses racontent aussi notre histoire. Les emplacements sans photo sont prêts à accueillir nos propres images.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-12">
            <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-[#18352B] md:col-span-7 md:min-h-[470px]">
              {allImages[0] ? <img src={allImages[0]} alt="Vue de la ferme AgroFarms237" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.03]" /> : <div className="absolute inset-0"><PhotoPlaceholder title="Au cœur de la ferme" subtitle="Photo à ajouter : vue générale de l’exploitation." /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07150F]/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white"><p className="text-[10px] uppercase tracking-[.22em] text-[#E8D4A1]">01 · Le lieu</p><h3 className="mt-2 font-serif text-2xl sm:text-3xl">Là où tout prend forme.</h3></div>
            </div>
            <div className="grid gap-4 md:col-span-5">
              <div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-[#18352B]">
                {allImages[1] ? <img src={allImages[1]} alt="Production agricole AgroFarms237" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0"><PhotoPlaceholder title="Les gestes du quotidien" subtitle="Photo à ajouter : entretien, alimentation ou suivi des élevages." /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07150F]/70 to-transparent" /><p className="absolute bottom-5 left-5 text-sm font-semibold text-white">02 · Les gestes du quotidien</p>
              </div>
              <div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-[#18352B]">
                {allImages[2] ? <img src={allImages[2]} alt="Élevage AgroFarms237" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0"><PhotoPlaceholder title="Nos élevages" subtitle="Photo à ajouter : poissons, porcs ou volailles dans leur environnement réel." /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07150F]/70 to-transparent" /><p className="absolute bottom-5 left-5 text-sm font-semibold text-white">03 · Nos élevages</p>
              </div>
            </div>
            <div className="relative min-h-[230px] overflow-hidden rounded-2xl bg-[#18352B] md:col-span-5">
              {allImages[3] ? <img src={allImages[3]} alt="Détails de la ferme AgroFarms237" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0"><PhotoPlaceholder title="Les détails qui comptent" subtitle="Photo à ajouter : matériel, eau, alimentation ou installations." /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07150F]/70 to-transparent" /><p className="absolute bottom-5 left-5 text-sm font-semibold text-white">04 · Les détails qui comptent</p>
            </div>
            <div className="relative min-h-[230px] overflow-hidden rounded-2xl bg-[#18352B] md:col-span-7">
              {allImages[4] ? <img src={allImages[4]} alt="L’avenir de la ferme AgroFarms237" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0"><PhotoPlaceholder title="La ferme de demain" subtitle="Photo à ajouter : nouveaux aménagements et étapes de développement." /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07150F]/70 to-transparent" /><p className="absolute bottom-5 left-5 text-sm font-semibold text-white">05 · La ferme de demain</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTIONS */}
      <section id="nos-productions" className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mb-12 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#A8833D]">Nos filières</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">Des productions différentes, une même exigence.</h2>
          <p className="mt-5 text-sm leading-7 text-[#66736B]">Découvrez les activités qui structurent AgroFarms237 aujourd’hui et celles que nous préparons progressivement.</p>
        </div>

        <div className="mb-12 overflow-hidden rounded-2xl bg-white shadow-[0_16px_50px_rgba(20,42,32,.08)] lg:grid lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative min-h-[280px] bg-[#18352B] lg:min-h-[470px]">
            {firstFishMedia[0]?.url ? <ProductCarousel images={firstFishMedia.map((m) => m.url)} /> : <PhotoPlaceholder title="Pisciculture · silure" subtitle="Photo à ajouter : bassins, poissons et gestes de production." />}
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="text-[10px] font-bold uppercase tracking-[.23em] text-[#A8833D]">{content.fish_label}</p>
            <h3 className="mt-4 font-serif text-3xl sm:text-4xl">{content.fish_title}</h3>
            <p className="mt-5 text-sm leading-7 text-[#66736B]">{content.fish_description}</p>
            <div className="mt-7 inline-flex w-fit items-center rounded-full border border-[#C7D4C9] bg-[#EFF4EF] px-4 py-2 text-xs font-semibold text-[#315C45]">Notre filière structurée aujourd’hui</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-[#E1DED4] bg-white">
            <div className="relative min-h-[250px] bg-[#18352B]">
              {porcs[0] && getMediaForFarm(porcs[0], siteMedia, mediaByFarm).length > 0 ? <ProductCarousel images={getMediaForFarm(porcs[0], siteMedia, mediaByFarm).map((m) => m.url)} /> : <PhotoPlaceholder title="Élevage porcin" subtitle="Un emplacement prêt à accueillir les photos réelles de la filière porcine." />}
            </div>
            <div className="p-7 sm:p-9"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#A8833D]">{content.pigs_label}</p><h3 className="mt-3 font-serif text-3xl">{content.pigs_title}</h3><p className="mt-4 text-sm leading-7 text-[#66736B]">{content.pigs_description}</p><div className="mt-5 flex flex-wrap gap-3">{porcs.map((item) => <span key={item.id} className="rounded-full border border-[#E1DED4] px-3 py-1.5 text-xs text-[#52645B]">{item.name} · {item.status === "disponible" ? "Disponible" : "En développement"}</span>)}</div></div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-[#E1DED4] bg-white">
            <div className="relative min-h-[250px] bg-[#18352B]">
              {poulets[0] && getMediaForFarm(poulets[0], siteMedia, mediaByFarm).length > 0 ? <ProductCarousel images={getMediaForFarm(poulets[0], siteMedia, mediaByFarm).map((m) => m.url)} /> : <PhotoPlaceholder title="Aviculture" subtitle="Un emplacement prêt à accueillir les photos réelles de la filière avicole." />}
            </div>
            <div className="p-7 sm:p-9"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#A8833D]">{content.poultry_label}</p><h3 className="mt-3 font-serif text-3xl">{content.poultry_title}</h3><p className="mt-4 text-sm leading-7 text-[#66736B]">{content.poultry_description}</p><div className="mt-5 flex flex-wrap gap-3">{poulets.map((item) => <span key={item.id} className="rounded-full border border-[#E1DED4] px-3 py-1.5 text-xs text-[#52645B]">{item.name} · {item.status === "disponible" ? "Disponible" : "En développement"}</span>)}</div></div>
          </section>
        </div>
      </section>

      {/* AGRICULTURE */}
      <section className="bg-[#EDE9DE] py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-10">
          <div><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#A8833D]">Une vision d’ensemble</p><h2 className="mt-4 font-serif text-3xl leading-tight sm:text-5xl">Des terres pour faire grandir le projet.</h2></div>
          <div><p className="text-base leading-8 text-[#52645B]">AgroFarms237 dispose de terres cultivables destinées à accompagner progressivement le développement de l’exploitation. Cette activité agricole sera développée au rythme de la ferme, en complément de la pisciculture et des élevages.</p><div className="mt-7 border-l-2 border-[#B89957] pl-6"><p className="text-sm leading-7 text-[#66736B]">L’objectif est de construire un ensemble cohérent où les différentes activités agricoles avancent au sein d’une même vision durable.</p></div></div>
        </div>
      </section>

      {/* VISION FINALE */}
      <section className="relative isolate overflow-hidden bg-[#10271F] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(91,126,104,.45),transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#E8D4A1]">{content.vision_label}</p>
          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-3xl leading-tight sm:text-5xl lg:text-6xl">{content.vision_title}</h2>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/70">{content.vision_text}</p>
          <a href="#nos-productions" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#E8D4A1] px-6 py-3 text-sm font-semibold text-[#18352B] transition hover:bg-white">Revoir nos productions <span aria-hidden="true">↑</span></a>
          <p className="mt-12 text-[10px] uppercase tracking-[.25em] text-white/40">AgroFarms237 · La qualité commence à la ferme.</p>
        </div>
      </section>
    </main>
  );
}
