import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_LABELS,
} from "@/lib/mediaCategories";

export const revalidate = 30;

async function getGalleryMedia() {
  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select("*")
      .eq("published", true)
      .eq("gallery_enabled", true)
      .not("gallery_category", "is", null)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur galerie :", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erreur galerie :", error);
    return [];
  }
}

async function getCategoryDescriptions() {
  try {
    const { data, error } = await supabaseAdmin()
      .from("gallery_categories")
      .select("*");

    if (error) {
      return {};
    }

    const map: Record<string, string> = {};

    (data || []).forEach((row: any) => {
      if (row.category) {
        map[row.category] = row.description || "";
      }
    });

    return map;
  } catch {
    return {};
  }
}

function MediaCard({ item }: { item: any }) {
  return (
    <figure className="overflow-hidden rounded-m border border-ink/10 bg-bgAlt">
      <div className="relative">
        {item.kind === "photo" ? (
          <img
            src={item.url}
            alt={item.caption || "AgroFarms237"}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <video
            src={item.url}
            controls
            preload="metadata"
            className="aspect-square w-full object-cover"
          />
        )}

        {item.kind === "video" && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-paper">
            Vidéo
          </span>
        )}
      </div>

      {item.caption && (
        <figcaption className="border-t border-ink/10 px-3 py-2.5 text-[12.5px] leading-5 text-inkSoft">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

function EmptyCategory() {
  return (
    <div className="flex aspect-square items-center justify-center rounded-m border border-dashed border-ink/15 bg-bgAlt p-5 text-center">
      <div>
        <p className="font-serif text-[18px] font-semibold text-ink">
          Photos à venir
        </p>

        <p className="mt-1 text-[12px] leading-5 text-inkSoft">
          Cette rubrique sera alimentée progressivement par l'équipe
          AgroFarms237.
        </p>
      </div>
    </div>
  );
}

function CategoryWindow({
  label,
  description,
  items,
  reverse,
}: {
  label: string;
  description: string;
  items: any[];
  reverse?: boolean;
}) {
  return (
    <section
      className={`flex flex-col gap-7 rounded-m border border-ink/10 bg-paper p-6 sm:p-8 lg:flex-row lg:items-center ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="lg:w-[32%] lg:shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-goldDeep">
          Galerie AgroFarms237
        </span>

        <h2 className="mt-2 font-serif text-[25px] font-semibold">
          {label}
        </h2>

        {description.trim() ? (
          <p className="mt-3 text-[14px] leading-6 text-inkSoft">
            {description}
          </p>
        ) : (
          <p className="mt-3 text-[14px] leading-6 text-inkSoft">
            Découvrez progressivement les images de cette partie de notre
            activité.
          </p>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {items.map((item: any) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            <EmptyCategory />
          </div>
        )}
      </div>
    </section>
  );
}

export default async function GaleriePage() {
  const [items, descriptions] = await Promise.all([
    getGalleryMedia(),
    getCategoryDescriptions(),
  ]);

  return (
    <section className="px-5 py-[72px]">
      <div className="mx-auto max-w-[1180px]">
        {/* HERO */}

        <div className="max-w-[760px]">
          <span className="mb-2.5 inline-block text-[13px] font-bold text-goldDeep">
            Galerie
          </span>

          <h1 className="font-serif text-[clamp(30px,4.5vw,44px)] font-semibold leading-tight">
            La ferme en photos et vidéos.
          </h1>

          <p className="mt-3 max-w-[65ch] text-[15px] leading-7 text-inkSoft">
            Découvrez AgroFarms237 à travers nos élevages, nos productions,
            notre ferme et les différentes étapes de notre activité agricole.
          </p>
        </div>

        {/* GALERIE */}

        <div className="mt-11 flex flex-col gap-8">
          {GALLERY_CATEGORIES.map((category, index) => {
            const categoryItems = items.filter(
              (item: any) =>
                item.gallery_category === category.value
            );

            return (
              <CategoryWindow
                key={category.value}
                label={category.label}
                description={
                  descriptions[category.value] ||
                  ""
                }
                items={categoryItems}
                reverse={index % 2 === 1}
              />
            );
          })}
        </div>

        {/* PETITE NOTE DE FIN */}

        <div className="mt-10 border-t border-ink/10 pt-7">
          <p className="max-w-[70ch] text-[13px] leading-6 text-inkSoft">
            Cette galerie évolue au fil de la vie de la ferme. Les contenus
            sont ajoutés progressivement par l'équipe AgroFarms237.
          </p>
        </div>
      </div>
    </section>
  );
}
