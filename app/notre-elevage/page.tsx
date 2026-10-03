import Link from "next/link";
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
  hero_label: "Notre élevage",
  hero_title: "Une ferme qui grandit, élevage après élevage.",
  hero_description:
    "Le silure constitue aujourd’hui notre activité principale, produite à Yaoundé, Mimboman. Demain, notre ferme accueillera progressivement d’autres productions pour construire un modèle agricole plus complet, local et durable.",

  step1_label: "Aujourd’hui",
  step1_title: "Silure frais",
  step1_text:
    "Production active à Yaoundé, Mimboman, vendue directement aux familles et professionnels.",

  step2_label: "Prochaine étape",
  step2_title: "Produits fumés",
  step2_text:
    "Une gamme de silure fumé, pensée pour la conservation et pour étendre la livraison au-delà de Yaoundé.",

  step3_label: "Développement",
  step3_title: "Porcs, poulets de chair, poules pondeuses",
  step3_text: "Une diversification progressive.",

  fish_label: "Notre production",
  fish_title: "Poissons",
  fish_description:
    "Une production piscicole qui commence avec le silure et s’élargira progressivement à d’autres espèces.",

  pigs_label: "Développement",
  pigs_title: "Élevage porcin",
  pigs_description:
    "Notre projet d’élevage porcin s’inscrit dans une logique de diversification progressive de la ferme.",

  poultry_label: "Aviculture",
  poultry_title: "Poulets",
  poultry_description:
    "Une future activité avicole qui regroupera progressivement poules pondeuses et poulets de chair.",

  vision_label: "Notre vision",
  vision_title:
    "Construire une ferme capable de nourrir, de créer et de transmettre.",
  vision_text:
    "Agrofarms237 avance étape par étape, avec l’ambition de développer une agriculture locale structurée, productive et durable.",
};

async function getPageContent(): Promise<PageContent> {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("farm_breeding_content")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erreur récupération contenu Notre élevage :",
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

async function getFarmItems(): Promise<FarmItem[]> {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("farm_breeding")
      .select(
        "id,name,category,description,status,photo_url,position,published"
      )
      .eq("published", true)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

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

async function getFarmMedia(): Promise<FarmMedia[]> {
  try {
    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("farm_breeding_media")
      .select(
        "id,farm_breeding_id,url,storage_path,position,created_at"
      )
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

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

function FarmCard({
  item,
  media,
  fallback,
}: {
  item: FarmItem;
  media: FarmMedia[];
  fallback: string;
}) {
  const finalMedia =
    media.length > 0
      ? media
      : item.photo_url
      ? [
          {
            id: `legacy-${item.id}`,
            farm_breeding_id: item.id,
            url: item.photo_url,
            storage_path: "",
            position: 0,
            created_at: "",
          },
        ]
      : [];

  return (
    <article className="group overflow-hidden border border-black/10 bg-white">
      <div className="overflow-hidden">
        <MediaBlock
          media={finalMedia}
          fallback={fallback}
        />
      </div>

      <div className="p-7 sm:p-8">
        <StatusBadge status={item.status} />

        <h3 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-4 max-w-xl text-sm leading-7 text-black/60">
            {item.description}
          </p>
        )}

        <div className="mt-7 h-px w-12 bg-gold" />

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
          {item.status === "disponible"
            ? "Production actuelle"
            : "Développement"}
        </p>
      </div>
    </article>
  );
}

export default async function NotreElevagePage() {
  const [content, farmItems, farmMedia] =
    await Promise.all([
      getPageContent(),
      getFarmItems(),
      getFarmMedia(),
    ]);

  const mediaByFarm: Record<string, FarmMedia[]> = {};

  for (const media of farmMedia) {
    if (!mediaByFarm[media.farm_breeding_id]) {
      mediaByFarm[media.farm_breeding_id] = [];
    }

    mediaByFarm[media.farm_breeding_id].push(media);
  }

  const heroImages = Array.from(
    new Set(
      farmItems.flatMap((item) => {
        const ownMedia = mediaByFarm[item.id] || [];

        if (ownMedia.length > 0) {
          return ownMedia.map((media) => media.url);
        }

        return item.photo_url ? [item.photo_url] : [];
      })
    )
  );

  const poissons = farmItems.filter(
    (item) =>
      item.category.toLowerCase() === "poisson"
  );

  const porcs = farmItems.filter(
    (item) =>
      item.category.toLowerCase() === "porcs"
  );

  const poulets = farmItems.filter(
    (item) =>
      item.category.toLowerCase() === "poulets"
  );

  return (
    <main className="bg-white text-ink">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative min-h-[560px] overflow-hidden bg-[#18352B] text-white">
        {heroImages.length > 0 && (
          <HeroSlideshow images={heroImages} />
        )}

        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/55 to-black/25" />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
              {content.hero_label}
            </p>

            <h1 className="max-w-4xl font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl xl:text-7xl">
              {content.hero_title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              {content.hero_description}
            </p>

          </div>
        </div>
      </section>

      {/* =====================================================
          TRAJECTOIRE
      ====================================================== */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="grid gap-12 md:grid-cols-3 md:gap-0">

            {/* 01 */}
            <div className="relative md:pr-10">
              <div className="mb-6 flex items-center gap-4">
                <span className="font-serif text-4xl text-black/10">
                  01
                </span>

                <span className="h-px flex-1 bg-black/10 md:hidden" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {content.step1_label}
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
                {content.step1_title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/60">
                {content.step1_text}
              </p>

              <div className="absolute right-0 top-0 hidden h-full w-px bg-black/10 md:block" />
            </div>

            {/* 02 */}
            <div className="relative md:px-10">
              <div className="mb-6 flex items-center gap-4">
                <span className="font-serif text-4xl text-black/10">
                  02
                </span>

                <span className="h-px flex-1 bg-black/10 md:hidden" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {content.step2_label}
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
                {content.step2_title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/60">
                {content.step2_text}
              </p>

              <div className="absolute right-0 top-0 hidden h-full w-px bg-black/10 md:block" />
            </div>

            {/* 03 */}
            <div className="relative md:pl-10">
              <div className="mb-6 flex items-center gap-4">
                <span className="font-serif text-4xl text-black/10">
                  03
                </span>

                <span className="h-px flex-1 bg-black/10 md:hidden" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {content.step3_label}
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
                {content.step3_title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/60">
                {content.step3_text}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          NOS ACTIVITÉS
      ====================================================== */}
      <section className="bg-bgAlt">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Notre ferme
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              Produire aujourd’hui,
              construire demain.
            </h2>

            <p className="mt-6 text-base leading-8 text-black/60">
              AgroFarms237 développe progressivement ses activités
              autour de plusieurs productions agricoles, avec une
              approche structurée de la production, de la valorisation
              et du développement de la ferme.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">

            {/* PISCICULTURE */}
            <div className="border border-black/10 bg-white p-8 sm:p-9">
              <div className="flex items-start justify-between gap-6">
                <span className="font-serif text-5xl text-black/10">
                  01
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Aujourd’hui
                </span>
              </div>

              <h3 className="mt-10 font-serif text-3xl">
                Pisciculture
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                {content.fish_description}
              </p>

              <div className="mt-8 h-px w-12 bg-gold" />

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-black/40">
                Silure
              </p>
            </div>

            {/* PORC */}
            <div className="border border-black/10 bg-white p-8 sm:p-9">
              <div className="flex items-start justify-between gap-6">
                <span className="font-serif text-5xl text-black/10">
                  02
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                  Développement
                </span>
              </div>

              <h3 className="mt-10 font-serif text-3xl">
                Élevage porcin
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                {content.pigs_description}
              </p>

              <div className="mt-8 h-px w-12 bg-gold" />

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-black/40">
                Porcs
              </p>
            </div>

            {/* AVICULTURE */}
            <div className="border border-black/10 bg-white p-8 sm:p-9">
              <div className="flex items-start justify-between gap-6">
                <span className="font-serif text-5xl text-black/10">
                  03
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                  Développement
                </span>
              </div>

              <h3 className="mt-10 font-serif text-3xl">
                Aviculture
              </h3>

              <p className="mt-4 text-sm leading-7 text-black/60">
                {content.poultry_description}
              </p>

              <div className="mt-8 h-px w-12 bg-gold" />

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-black/40">
                Poules et poulets
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          POISSONS
      ====================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mb-14 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {content.fish_label}
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              {content.fish_title}
            </h2>

            <p className="mt-5 text-base leading-8 text-black/60">
              {content.fish_description}
            </p>
          </div>

          {poissons.length === 0 ? (
            <div className="border border-black/10 bg-bgAlt p-10 text-center">
              <p className="text-sm text-black/50">
                Aucun élevage de poisson n’est actuellement publié.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {poissons.map((item) => (
                <FarmCard
                  key={item.id}
                  item={item}
                  media={mediaByFarm[item.id] || []}
                  fallback={`Les visuels de ${item.name.toLowerCase()} seront bientôt disponibles.`}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          PORCS
      ====================================================== */}
      <section className="bg-bgAlt">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mb-14 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {content.pigs_label}
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              {content.pigs_title}
            </h2>

            <p className="mt-5 text-base leading-8 text-black/60">
              {content.pigs_description}
            </p>
          </div>

          {porcs.length === 0 ? (
            <div className="border border-black/10 bg-white p-10 text-center">
              <p className="text-sm text-black/50">
                Aucun élevage porcin n’est actuellement publié.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {porcs.map((item) => (
                <FarmCard
                  key={item.id}
                  item={item}
                  media={mediaByFarm[item.id] || []}
                  fallback="Les visuels de cette production seront bientôt disponibles."
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          AVICULTURE
      ====================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="mb-14 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {content.poultry_label}
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              {content.poultry_title}
            </h2>

            <p className="mt-5 text-base leading-8 text-black/60">
              {content.poultry_description}
            </p>
          </div>

          {poulets.length === 0 ? (
            <div className="border border-black/10 bg-bgAlt p-10 text-center">
              <p className="text-sm text-black/50">
                Aucun élevage avicole n’est actuellement publié.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {poulets.map((item) => (
                <FarmCard
                  key={item.id}
                  item={item}
                  media={mediaByFarm[item.id] || []}
                  fallback="Les visuels de cette production seront bientôt disponibles."
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          VISION
      ====================================================== */}
      <section className="bg-[#18352B] text-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8 lg:py-32">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {content.vision_label}
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {content.vision_title}
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            {content.vision_text}
          </p>

        </div>
      </section>

      {/* =====================================================
          CTA FINAL
      ====================================================== */}
      <section className="bg-[#F3EFE5]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                AgroFarms237
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                De la ferme à votre table,
                étape après étape.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-black/60">
                Découvrez nos produits disponibles ou échangez
                avec AgroFarms237 pour construire un partenariat
                adapté à votre activité.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/produits"
                className="inline-flex min-h-12 items-center justify-center border border-[#18352B] bg-[#18352B] px-7 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Découvrir nos produits
              </Link>

              <Link
                href="/commander"
                className="inline-flex min-h-12 items-center justify-center border border-[#18352B] px-7 text-sm font-semibold text-[#18352B] transition hover:bg-white"
              >
                Commander
              </Link>

              <Link
                href="/partenaires"
                className="inline-flex min-h-12 items-center justify-center border border-black/10 bg-white px-7 text-sm font-semibold text-ink transition hover:border-black/20"
              >
                Devenir partenaire
              </Link>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
