import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  GALLERY_CATEGORIES,
} from "@/lib/mediaCategories";

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
      .select(
        "id,url,kind,caption,gallery_category,gallery_enabled,published,position,created_at"
      )
      .eq("published", true)
      .eq("gallery_enabled", true)
      .not("gallery_category", "is", null)
      .order("position", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Erreur récupération Galerie :",
        error
      );

      return [];
    }

    return (data || []) as MediaItem[];
  } catch (error) {
    console.error(
      "Erreur inattendue Galerie :",
      error
    );

    return [];
  }
}

const GALLERY_DESCRIPTIONS: Record<
  string,
  string
> = {
  silures:
    "Notre production de silures, des bassins à la commercialisation.",

  porcs:
    "Le développement de notre activité d’élevage porcin.",

  poules_pondeuses:
    "L’univers des poules pondeuses et de notre future production d’œufs.",

  poulets:
    "Notre activité avicole et les poulets élevés à la ferme.",

  bassins:
    "Les bassins, installations et espaces dédiés à la pisciculture.",

  recoltes:
    "Les récoltes et les différentes productions de la ferme.",

  alimentation:
    "L’alimentation, les soins et les pratiques quotidiennes de la ferme.",

  livraison:
    "Les commandes, préparations et livraisons AgroFarms237.",

  ferme:
    "La vie quotidienne et les différents espaces de notre ferme.",

  equipe:
    "Les personnes qui font vivre et grandir AgroFarms237.",

  produits:
    "Nos produits et les différentes formes de valorisation.",

  autre:
    "D’autres moments et contenus de la vie d’AgroFarms237.",
};

function categoryLabel(value: string) {
  const category =
    GALLERY_CATEGORIES.find(
      (item) => item.value === value
    );

  return (
    category?.label || value
  );
}

function MediaCard({
  item,
}: {
  item: MediaItem;
}) {
  return (
    <article className="group overflow-hidden rounded-md border border-ink/10 bg-paper">
      <div className="relative aspect-[4/3] overflow-hidden bg-bgAlt">
        {item.kind === "photo" ? (
          <img
            src={item.url}
            alt={
              item.caption ||
              "Photo AgroFarms237"
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <video
            src={item.url}
            className="h-full w-full object-cover"
            controls
            playsInline
          />
        )}
      </div>

      {item.caption && (
        <div className="px-4 py-3">
          <p className="text-[13px] leading-5 text-inkSoft">
            {item.caption}
          </p>
        </div>
      )}
    </article>
  );
}

export default async function GaleriePage() {
  const media =
    await getGalleryMedia();

  return (
    <main className="min-h-screen bg-paper">

      {/* HERO */}

      <section className="border-b border-ink/10 bg-ink px-5 py-20 text-paper md:py-28">
        <div className="mx-auto max-w-[1180px]">

          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gold">
            AgroFarms237
          </p>

          <h1 className="mt-4 max-w-[850px] font-serif text-[clamp(42px,7vw,76px)] font-semibold leading-[0.98]">
            La vie de la ferme
            en images.
          </h1>

          <p className="mt-6 max-w-[680px] text-[16px] leading-7 text-paper/70">
            Découvrez nos productions,
            nos élevages, nos installations
            et les différents moments qui
            font vivre AgroFarms237.
          </p>

        </div>
      </section>

      {/* GALERIE */}

      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-[1180px]">

          {GALLERY_CATEGORIES.map(
            (category) => {

              const categoryMedia =
                media.filter(
                  (item) =>
                    item.gallery_category ===
                    category.value
                );

              return (
                <section
                  key={category.value}
                  className="mb-20 last:mb-0"
                >

                  <div className="mb-8 max-w-[760px]">

                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-goldDeep">
                      Galerie
                    </p>

                    <h2 className="mt-2 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
                      {category.label}
                    </h2>

                    <p className="mt-3 text-[15px] leading-7 text-inkSoft">
                      {GALLERY_DESCRIPTIONS[
                        category.value
                      ] ||
                        "Découvrez les images associées à cette rubrique."}
                    </p>

                  </div>

                  {categoryMedia.length ===
                  0 ? (
                    <div className="border border-dashed border-ink/15 bg-bgAlt px-6 py-10 text-center">

                      <p className="font-serif text-[22px] font-semibold">
                        Photos à venir
                      </p>

                      <p className="mt-2 text-[13.5px] text-inkSoft">
                        Cette rubrique sera
                        alimentée progressivement
                        avec les contenus de
                        la ferme.
                      </p>

                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                      {categoryMedia.map(
                        (item) => (
                          <MediaCard
                            key={item.id}
                            item={item}
                          />
                        )
                      )}

                    </div>
                  )}

                </section>
              );
            }
          )}

        </div>
      </section>

      {/* CTA */}

      <section className="bg-ink px-5 py-20 text-paper">
        <div className="mx-auto max-w-[850px] text-center">

          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-gold">
            AgroFarms237
          </p>

          <h2 className="mt-3 font-serif text-[clamp(30px,5vw,46px)] font-semibold">
            La qualité commence
            à la ferme.
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[15px] leading-7 text-paper/70">
            Une ferme qui se construit
            progressivement, avec une
            attention particulière portée
            à la production, à la qualité
            et à la valorisation de nos
            produits.
          </p>

        </div>
      </section>

    </main>
  );
}
