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
      <div className="group relative flex aspect-[4/3] min-h-[260px] items-end overflow-hidden bg-[#18352B] p-6 text-left sm:p-8">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(216,189,131,0.28),transparent_35%),radial-gradient(ellipse_at_85%_75%,rgba(65,113,88,0.75),transparent_42%),linear-gradient(135deg,#10271F_0%,#18352B_55%,#0B1914_100%)]" />
        <div aria-hidden="true" className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-[#D8BD83]/30 sm:h-72 sm:w-72" />
        <div aria-hidden="true" className="absolute -right-2 -top-2 h-40 w-40 rounded-full border border-[#D8BD83]/20 sm:h-52 sm:w-52" />
        <div className="relative max-w-md border-l-2 border-[#D8BD83] pl-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D8BD83]">AgroFarms237 · Dans les coulisses</p>
          <p className="mt-3 font-serif text-2xl leading-tight text-[#F8F5EC] sm:text-3xl">La vie de la ferme, en images.</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{fallback}</p>
        </div>
        <span className="absolute right-5 top-5 rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70">Photo à venir</span>
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


  return (
    <main className="bg-white text-ink">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section id="ouverture-ferme" className="relative min-h-[600px] overflow-hidden bg-[#10271F] text-white sm:min-h-[660px] lg:min-h-[720px]">

        {heroImages.length > 0 && (
          <HeroSlideshow
            images={heroImages}
          />
        )}

        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(7,20,15,0.82)_0%,rgba(7,20,15,0.52)_48%,rgba(7,20,15,0.12)_100%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#F7F5EF] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-[1320px] items-center px-5 pb-32 pt-24 sm:min-h-[660px] sm:px-8 lg:min-h-[720px] lg:px-12 lg:pb-40">

          <div className="max-w-4xl">

            <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E2C98F] sm:text-xs">
              <span className="h-px w-9 bg-[#E2C98F]" />
              {content.hero_label}
            </p>

            <h1 className="max-w-4xl break-words font-serif text-[clamp(2.7rem,7vw,6.2rem)] font-medium leading-[0.98] tracking-[-0.04em]">
              {content.hero_title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              {content.hero_description}
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          CARTE IMMERSIVE — INTRODUCTION À LA FERME
      ====================================================== */}
      <section className="relative z-20 -mt-20 px-4 sm:-mt-24 sm:px-6 lg:-mt-28">
        <div className="mx-auto grid max-w-[1120px] overflow-hidden rounded-sm bg-white shadow-[0_28px_80px_rgba(14,38,30,0.16)] md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[250px] overflow-hidden bg-[#18352B] sm:min-h-[330px]">
            {heroImages.length > 0 ? (
              <img src={heroImages[0]} alt="Découverte de la ferme AgroFarms237" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(216,189,131,0.3),transparent_34%),linear-gradient(145deg,#284F3F,#10271F)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1914]/65 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E2C98F]">De notre ferme à votre table</p>
              <p className="mt-2 max-w-sm font-serif text-2xl leading-tight text-white sm:text-3xl">Une aventure agricole qui se construit chaque jour.</p>
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:px-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B7A37]">Bienvenue chez AgroFarms237</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#18352B] sm:text-4xl">Derrière chaque production, une histoire.</h2>
            <p className="mt-4 text-sm leading-7 text-black/60 sm:text-base">Nous développons notre ferme avec patience et exigence : consolider notre pisciculture, préparer de nouvelles filières et construire une agriculture locale durable, étape après étape.</p>
            <a href="#nos-productions" className="mt-7 inline-flex w-fit items-center gap-3 border-b border-[#B79A5B] pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#18352B] transition hover:gap-5">Explorer nos productions <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      {/* =====================================================
          ÉTAPES
      ====================================================== */}

      <section className="border-b border-black/10 bg-[#F7F5EF]">

        <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-9 max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9B7A37]">Notre chemin</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#18352B] sm:text-4xl">Une ferme vivante, en pleine construction.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">

            <div className="relative overflow-hidden border border-black/[0.07] bg-white p-6 shadow-[0_10px_35px_rgba(20,45,32,0.04)] sm:p-7">
              <span aria-hidden="true" className="absolute right-5 top-3 font-serif text-5xl text-[#18352B]/[0.07]">01</span>
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9B7A37]">
                {content.step1_label}
              </p>

              <h2 className="relative mt-3 font-serif text-2xl text-[#18352B]">
                {content.step1_title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-black/60">
                {content.step1_text}
              </p>

            </div>


            <div className="relative overflow-hidden border border-black/[0.07] bg-white p-6 shadow-[0_10px_35px_rgba(20,45,32,0.04)] sm:p-7">
              <span aria-hidden="true" className="absolute right-5 top-3 font-serif text-5xl text-[#18352B]/[0.07]">02</span>
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9B7A37]">
                {content.step2_label}
              </p>

              <h2 className="relative mt-3 font-serif text-2xl text-[#18352B]">
                {content.step2_title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-black/60">
                {content.step2_text}
              </p>

            </div>


            <div className="relative overflow-hidden border border-black/[0.07] bg-white p-6 shadow-[0_10px_35px_rgba(20,45,32,0.04)] sm:p-7">
              <span aria-hidden="true" className="absolute right-5 top-3 font-serif text-5xl text-[#18352B]/[0.07]">03</span>
              <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9B7A37]">
                {content.step3_label}
              </p>

              <h2 className="mt-3 break-words font-serif text-2xl text-[#18352B]">
                {content.step3_title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-black/60">
                {content.step3_text}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PISCICULTURE
      ====================================================== */}

      <section id="nos-productions" className="bg-white">

        <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">

          <div className="mb-12 max-w-3xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B7A37]">
              {content.fish_label}
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.025em] text-[#18352B] sm:text-5xl">
              {content.fish_title}
            </h2>

            <p className="mt-4 text-base leading-8 text-black/60">
              {content.fish_description}
            </p>

          </div>


          {poissons.length === 0 ? (

            <div className="border border-black/10 bg-bgAlt p-8 text-center">

              <p className="text-sm text-black/50">
                Aucun élevage de poisson n’est actuellement publié.
              </p>

            </div>

          ) : (

            <div className="grid gap-8 lg:grid-cols-2">

              {poissons.map((item) => {

                const finalMedia =
                  getMediaForFarm(
                    item,
                    siteMedia,
                    mediaByFarm
                  );


                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-sm border border-black/[0.06] bg-white shadow-[0_14px_45px_rgba(20,45,32,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(20,45,32,0.12)]"
                  >

                    <MediaBlock
                      media={finalMedia}
                      fallback={`Les visuels de ${item.name.toLowerCase()} seront bientôt disponibles.`}
                    />


                    <div className="p-6 sm:p-8">

                      <StatusBadge
                        status={item.status}
                      />


                      <h3 className="mt-4 font-serif text-3xl leading-tight text-[#18352B]">
                        {item.name}
                      </h3>


                      {item.description && (
                        <p className="mt-4 text-sm leading-7 text-black/60">
                          {item.description}
                        </p>
                      )}


                      {item.status ===
                        "disponible" && (
                        <p className="mt-5 text-sm font-medium text-ink">
                          Production actuelle
                        </p>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          ÉLEVAGE PORCIN
      ====================================================== */}

      <section className="bg-[#F3EFE5]">

        <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">

          <div className="mb-12 max-w-3xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B7A37]">
              {content.pigs_label}
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.025em] text-[#18352B] sm:text-5xl">
              {content.pigs_title}
            </h2>

            <p className="mt-4 text-base leading-8 text-black/60">
              {content.pigs_description}
            </p>

          </div>


          {porcs.length === 0 ? (

            <div className="border border-black/10 bg-white p-8 text-center">

              <p className="text-sm text-black/50">
                Aucun élevage porcin n’est actuellement publié.
              </p>

            </div>

          ) : (

            <div className="grid gap-8 lg:grid-cols-2">

              {porcs.map((item) => {

                /*
                 * IMPORTANT :
                 *
                 * Si une photo a été ajoutée dans :
                 *
                 * Admin → Galerie
                 * → Notre élevage — Porcs
                 *
                 * elle sera maintenant utilisée ici.
                 */
                const finalMedia =
                  getMediaForFarm(
                    item,
                    siteMedia,
                    mediaByFarm
                  );


                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-sm border border-black/[0.06] bg-white shadow-[0_14px_45px_rgba(20,45,32,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(20,45,32,0.12)]"
                  >

                    <MediaBlock
                      media={finalMedia}
                      fallback="Les visuels de cette production seront bientôt disponibles."
                    />


                    <div className="p-6 sm:p-8">

                      <StatusBadge
                        status={item.status}
                      />


                      <h3 className="mt-4 font-serif text-3xl leading-tight text-[#18352B]">
                        {item.name}
                      </h3>


                      {item.description && (
                        <p className="mt-4 text-sm leading-7 text-black/60">
                          {item.description}
                        </p>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          AVICULTURE
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">

          <div className="mb-12 max-w-3xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B7A37]">
              {content.poultry_label}
            </p>

            <h2 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.025em] text-[#18352B] sm:text-5xl">
              {content.poultry_title}
            </h2>

            <p className="mt-4 text-base leading-8 text-black/60">
              {content.poultry_description}
            </p>

          </div>


          {poulets.length === 0 ? (

            <div className="border border-black/10 bg-bgAlt p-8 text-center">

              <p className="text-sm text-black/50">
                Aucun élevage avicole n’est actuellement publié.
              </p>

            </div>

          ) : (

            <div className="grid gap-8 lg:grid-cols-2">

              {poulets.map((item) => {

                const finalMedia =
                  getMediaForFarm(
                    item,
                    siteMedia,
                    mediaByFarm
                  );


                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-sm border border-black/[0.06] bg-white shadow-[0_14px_45px_rgba(20,45,32,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(20,45,32,0.12)]"
                  >

                    <MediaBlock
                      media={finalMedia}
                      fallback="Les visuels de cette production seront bientôt disponibles."
                    />


                    <div className="p-6 sm:p-8">

                      <StatusBadge
                        status={item.status}
                      />


                      <h3 className="mt-4 font-serif text-3xl leading-tight text-[#18352B]">
                        {item.name}
                      </h3>


                      {item.description && (
                        <p className="mt-4 text-sm leading-7 text-black/60">
                          {item.description}
                        </p>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          AGRICULTURE
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#F3EFE5]">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#18352B]/10" />
        <div className="relative mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9B7A37]">
                Agriculture
              </p>

              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
                Des terres disponibles pour développer la ferme.
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-base leading-8 text-black/60">
                AgroFarms237 dispose de terres cultivables destinées à
                accompagner progressivement le développement de l’exploitation.
                Cette activité agricole sera développée au rythme de la ferme,
                en complément de la pisciculture et des élevages.
              </p>

              <div className="mt-8 border-l-2 border-gold pl-6">
                <p className="text-sm leading-7 text-black/60">
                  L’objectif est de construire progressivement un ensemble
                  cohérent où les différentes activités agricoles peuvent
                  évoluer au sein d’une même vision de ferme.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          VISION
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#10271F] text-white">
        <div aria-hidden="true" className="absolute -left-24 -top-24 h-96 w-96 rounded-full border border-[#D8BD83]/15" />
        <div aria-hidden="true" className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full border border-[#D8BD83]/10" />
        <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-32">

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E2C98F]">
            {content.vision_label}
          </p>

          <h2 className="mt-5 font-serif text-3xl leading-[1.08] tracking-[-0.025em] sm:text-4xl lg:text-6xl">
            {content.vision_title}
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/70">
            {content.vision_text}
          </p>

        </div>

      </section>

    </main>
  );
}
