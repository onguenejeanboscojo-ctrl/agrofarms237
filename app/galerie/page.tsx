import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { GALLERY_CATEGORIES } from "@/lib/mediaCategories";
import HeroSlideshow from "./HeroSlideshow";

export const revalidate = 30;

type MediaItem = {
  id: string;
  url: string;
  kind: "photo" | "video";
  caption?: string | null;
  gallery_category?: string | null;
  gallery_enabled?: boolean;
  published: boolean;
  position?: number | null;
  created_at?: string;
};

async function getGalleryMedia(): Promise<MediaItem[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select("id,url,kind,caption,gallery_category,gallery_enabled,published,position,created_at")
      .eq("published", true)
      .eq("gallery_enabled", true)
      .not("gallery_category", "is", null)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur récupération Galerie :", error);
      return [];
    }

    return (data || []) as MediaItem[];
  } catch (error) {
    console.error("Erreur inattendue Galerie :", error);
    return [];
  }
}

const GALLERY_DESCRIPTIONS: Record<string, string> = {
  silures: "Du bassin à la récolte, découvrez les coulisses de notre pisciculture.",
  porcs: "Les étapes et les moments qui accompagnent le développement de notre élevage porcin.",
  poules_pondeuses: "Au cœur de l’aviculture et de notre projet de production d’œufs.",
  poulets: "Les coulisses de notre activité avicole et de l’élevage des poulets.",
  bassins: "Les installations, les bassins et le travail quotidien en pisciculture.",
  recoltes: "Les récoltes et les productions qui prennent forme au fil du temps.",
  alimentation: "Les gestes d’entretien, l’alimentation et l’attention portée aux élevages.",
  livraison: "De la préparation des commandes à leur livraison : la ferme en mouvement.",
  ferme: "Les lieux, les gestes et les instants qui racontent la vie de la ferme.",
  equipe: "Les personnes qui font vivre et grandir AgroFarms237, jour après jour.",
  produits: "Nos productions et les différentes façons de les valoriser.",
  autre: "D’autres instants pour découvrir l’univers AgroFarms237 sous toutes ses facettes.",
};

function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const wide = index % 7 === 0;

  return (
    <article className={`group relative min-w-0 overflow-hidden rounded-[1.15rem] border border-[#18382E]/10 bg-white ${wide ? "md:col-span-2" : ""}`}>
      <div className={`relative overflow-hidden bg-[#E8E2D3] ${wide ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        {item.kind === "photo" ? (
          <img
            src={item.url}
            alt={item.caption || "Photographie de l’univers AgroFarms237"}
            loading={index < 3 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <video
            src={item.url}
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            aria-label={item.caption || "Vidéo AgroFarms237"}
          />
        )}
        {item.kind === "photo" && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081C14]/55 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#102A20]/65 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.18em] text-white backdrop-blur-sm">
          {item.kind === "video" ? "Vidéo" : "Photographie"}
        </span>
        {item.caption && item.kind === "photo" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="max-w-2xl text-sm leading-6 text-white drop-shadow sm:text-base">{item.caption}</p>
          </div>
        )}
      </div>
      {item.caption && item.kind === "video" && (
        <div className="px-4 py-4 sm:px-5">
          <p className="text-sm leading-6 text-[#52645B]">{item.caption}</p>
        </div>
      )}
    </article>
  );
}

export default async function GaleriePage() {
  const media = await getGalleryMedia();
  const heroSlides = media.filter((item) => item.kind === "photo");
  const populatedCategories = GALLERY_CATEGORIES
    .map((category) => ({
      ...category,
      items: media.filter((item) => item.gallery_category === category.value),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F5EF] text-[#19362C]">
      {/* HERO IMMERSIF */}
      <section className="relative isolate min-h-[600px] overflow-hidden bg-[#10271F] text-white sm:min-h-[690px]">
        <HeroSlideshow slides={heroSlides.map(({ id, url, caption }) => ({ id, url, caption }))} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07150F]/90 via-[#0B2119]/65 to-[#0B2119]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07150F]/65 via-transparent to-[#07150F]/10" />

        <div className="relative mx-auto flex min-h-[600px] max-w-[1320px] flex-col justify-end px-5 pb-14 pt-28 sm:min-h-[690px] sm:px-10 sm:pb-20 lg:px-16">
          <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.28em] text-[#E8D4A1] sm:text-xs">
            <span className="h-px w-9 bg-[#E8D4A1]" />
            L’univers AgroFarms237
          </div>
          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[.98] tracking-[-.035em] sm:text-7xl lg:text-[88px]">
            La ferme se raconte
            <span className="block text-[#E8D4A1]">en images.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
            Des bassins aux élevages, des gestes du quotidien aux récoltes : entrez dans les coulisses d’une ferme qui grandit, production après production.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#explorer" className="inline-flex items-center gap-3 rounded-full bg-[#E8D4A1] px-6 py-3.5 text-sm font-semibold text-[#18352B] transition hover:bg-white">
              Explorer la galerie <span aria-hidden="true">↓</span>
            </a>
            <span className="px-2 text-xs tracking-wide text-white/65">
              {media.length} {media.length === 1 ? "contenu publié" : "contenus publiés"}
            </span>
          </div>
          <div className="mt-12 flex items-end justify-between border-t border-white/25 pt-4 text-[10px] uppercase tracking-[.2em] text-white/65 sm:mt-16">
            <span>Produire · Élever · Valoriser</span>
            <span className="hidden sm:block">La qualité commence à la ferme.</span>
          </div>
        </div>
      </section>

      {/* INTRODUCTION & NAVIGATION PAR CATÉGORIE */}
      <section id="explorer" className="scroll-mt-8 px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-24 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-7 border-b border-[#19362C]/15 pb-10 md:grid-cols-[.8fr_1.2fr] md:items-end md:gap-12 md:pb-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#A8833D]">Le carnet visuel de la ferme</p>
              <h2 className="mt-4 max-w-lg font-serif text-4xl font-medium leading-tight tracking-[-.025em] sm:text-5xl">Un univers, plusieurs histoires.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#66736B] sm:text-base sm:leading-8">
              Chaque image témoigne d’une étape, d’un savoir-faire ou d’un moment partagé. Parcourez nos différentes activités et découvrez AgroFarms237 au plus près du terrain.
            </p>
          </div>

          {populatedCategories.length > 0 ? (
            <nav aria-label="Explorer les catégories de la galerie" className="flex gap-2.5 overflow-x-auto py-6 [scrollbar-width:thin]">
              {populatedCategories.map((category) => (
                <a key={category.value} href={`#galerie-${category.value}`} className="shrink-0 rounded-full border border-[#19362C]/15 bg-white/60 px-4 py-2.5 text-xs font-medium text-[#365448] transition hover:border-[#A8833D] hover:bg-[#18352B] hover:text-white sm:text-sm">
                  {category.label}<span className="ml-2 text-[#A8833D]">{category.items.length}</span>
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      {/* CONTENUS : SEULES LES CATÉGORIES AVEC MÉDIAS PUBLIÉS SONT AFFICHÉES */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
        <div className="mx-auto max-w-[1180px]">
          {populatedCategories.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-[#19362C]/20 bg-[#EFEADE] px-6 py-16 text-center sm:px-12 sm:py-24">
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#A8833D]">Bientôt dans la galerie</p>
              <h2 className="mx-auto mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">Les histoires de la ferme prendront bientôt vie ici.</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#66736B]">Les contenus apparaîtront ici dès qu’ils seront publiés et activés dans la galerie depuis l’administration.</p>
            </div>
          ) : (
            populatedCategories.map((category, categoryIndex) => (
              <section key={category.value} id={`galerie-${category.value}`} className="mb-20 scroll-mt-8 last:mb-0 sm:mb-28">
                <div className="mb-7 grid gap-4 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
                  <div className="max-w-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#A8833D]">Chapitre {String(categoryIndex + 1).padStart(2, "0")}</p>
                    <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-[-.025em] sm:text-5xl">{category.label}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-[#66736B] sm:text-base">{GALLERY_DESCRIPTIONS[category.value] || "Découvrez les images associées à cette rubrique."}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[.16em] text-[#66736B]">{category.items.length} {category.items.length === 1 ? "souvenir" : "moments"}</p>
                </div>
                <div className="grid auto-rows-auto grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {category.items.map((item, index) => (
                    <MediaCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="relative overflow-hidden bg-[#10271F] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-10">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-[#E8D4A1]/15" />
        <div className="pointer-events-none absolute -right-8 -top-16 h-64 w-64 rounded-full border border-[#E8D4A1]/15" />
        <div className="relative mx-auto max-w-[980px] text-center">
          <p className="text-[10px] font-bold uppercase tracking-[.28em] text-[#E8D4A1]">AgroFarms237</p>
          <h2 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-[-.025em] sm:text-6xl">La qualité commence <span className="text-[#E8D4A1]">à la ferme.</span></h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">Une exploitation qui se construit avec patience, exigence et ambition, au service d’une agriculture plus structurée et de productions valorisées.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/notre-elevage" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-medium transition hover:border-[#E8D4A1] hover:text-[#E8D4A1]">Découvrir notre ferme</Link>
            <Link href="/produits" className="inline-flex items-center justify-center rounded-full bg-[#E8D4A1] px-6 py-3.5 text-sm font-semibold text-[#18352B] transition hover:bg-white">Découvrir nos produits</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
