
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import HomeProductOrderModal, {
  type HomeOrderProduct,
} from "@/components/HomeProductOrderModal";

export const revalidate = 30;

type CatalogProduct = {
  id: string;
  name: string;
  price_standard: number | null;
  price_bulk: number | null;
  bulk_min_kg: number | null;
  stock_status: string;
  stock_quantity: number | null;
  stock_threshold: number | null;
  category: string | null;
  product_group: string | null;
  variant: string | null;
  unit: string | null;
  display_order: number;
};

type MediaItem = {
  id: string;
  url: string;
  kind: string;
  category?: string | null;
  site_location?: string | null;
  caption?: string | null;
};

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getProductLocation(product: CatalogProduct): string | null {
  const name = normalize(
    `${product.name} ${product.variant ?? ""} ${product.product_group ?? ""}`
  );

  if (name.includes("silure")) {
    return name.includes("fum")
      ? "produit_silure_fume"
      : "produit_silure_frais";
  }

  if (name.includes("carpe")) {
    return name.includes("fum")
      ? "produit_carpe_fumee"
      : "produit_carpe_fraiche";
  }

  if (name.includes("porcelet")) {
    return "produit_porcelet";
  }

  if (name.includes("porc")) {
    if (name.includes("fum")) return "produit_porc_fume";
    if (name.includes("entier")) return "produit_porc_entier";
    return "produit_porc_frais";
  }

  if (name.includes("poulet")) {
    if (name.includes("fum")) return "produit_poulet_fume";
    if (name.includes("vivant")) return "produit_poulet_vivant";
    return "produit_poulet_frais_nettoye";
  }

  if (name.includes("oeuf") || name.includes("alveole")) {
    return "produit_alveoles_oeufs";
  }

  if (name.includes("poussin")) return "produit_poussins";
  if (name.includes("alevin")) return "produit_alevins";

  return null;
}

function getLegacyCategories(product: CatalogProduct): string[] {
  const name = normalize(
    `${product.name} ${product.variant ?? ""} ${product.product_group ?? ""}`
  );

  if (name.includes("silure")) {
    return name.includes("fum")
      ? ["produit_silure_fume"]
      : ["produit_silure_frais", "elevage_silure"];
  }

  if (name.includes("carpe")) {
    return name.includes("fum")
      ? ["carpe", "produit_carpe", "produit_carpe_fumee"]
      : ["carpe", "produit_carpe", "produit_carpe_fraiche"];
  }

  if (name.includes("porcelet")) return ["produit_porcelet"];

  if (name.includes("porc")) {
    return name.includes("fum")
      ? ["produit_porc_fume"]
      : ["porc", "elevage_porc"];
  }

  if (name.includes("poulet")) {
    return name.includes("fum")
      ? ["produit_poulet_fume"]
      : ["produit_poulet_frais", "poulet"];
  }

  if (name.includes("oeuf")) return ["oeufs", "œufs"];
  if (name.includes("poussin")) return ["produit_poussins"];
  if (name.includes("alevin")) return ["produit_alevins"];

  return [];
}

function getProductImages(
  product: CatalogProduct,
  media: MediaItem[]
): string[] {
  const location = getProductLocation(product);
  const legacyCategories = getLegacyCategories(product);

  return media
    .filter((item) => {
      if (item.site_location && location) {
        return item.site_location === location;
      }

      if (!item.site_location && item.category) {
        return legacyCategories.includes(item.category);
      }

      return false;
    })
    .map((item) => item.url)
    .filter(Boolean);
}

function formatPrice(price: number, unit: string | null) {
  const formatted = new Intl.NumberFormat("fr-FR").format(price);
  return `${formatted} FCFA${unit ? `/${unit}` : ""}`;
}

function toOrderProduct(product: CatalogProduct): HomeOrderProduct {
  const available = product.stock_status === "disponible";

  return {
    id: product.id,
    name: product.name,
    description: null,
    status: product.stock_status,
    price: product.price_standard,
    price_unit: product.unit,
    price_1_label: null,
    price_1: product.price_standard,
    price_2_label:
      typeof product.bulk_min_kg === "number"
        ? `À partir de ${product.bulk_min_kg} kg`
        : null,
    price_2: product.price_bulk,
    order_enabled: available && typeof product.price_standard === "number",
    order_options: [],
  };
}

export default async function HomeProductsSection() {
  let products: CatalogProduct[] = [];
  let media: MediaItem[] = [];

  try {
    const supabase = supabaseAdmin();

    const [productsResult, mediaResult] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id,name,price_standard,price_bulk,bulk_min_kg,stock_status,stock_quantity,stock_threshold,category,product_group,variant,unit,display_order"
        )
        .eq("stock_status", "disponible")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true }),

      supabase
        .from("media")
        .select("id,url,kind,category,site_location,caption")
        .eq("published", true)
        .eq("kind", "photo")
        .order("position", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

    if (productsResult.error) {
      console.error(
        "Erreur chargement du catalogue sur l’accueil :",
        productsResult.error
      );
    } else {
      products = (productsResult.data ?? []) as CatalogProduct[];
    }

    if (mediaResult.error) {
      console.error(
        "Erreur chargement des photos des produits :",
        mediaResult.error
      );
    } else {
      media = (mediaResult.data ?? []) as MediaItem[];
    }
  } catch (error) {
    console.error("Erreur Supabase sur les produits de l’accueil :", error);
  }

  return (
    <section
      id="produits"
      className="bg-[#EDE9DE] px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#B7863D]">
              Notre sélection
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Les produits de la ferme
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-[#627166]">
              Découvrez les produits actuellement disponibles chez
              AgroFarms237.
            </p>
          </div>

          <a
            href="/produits"
            className="rounded-full border border-[#173D2D]/15 px-4 py-2 text-xs font-semibold text-[#40594A] transition hover:bg-[#FBFAF6]"
          >
            Voir tout le catalogue
          </a>
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl bg-[#FBFAF6] p-6 text-sm text-[#627166]">
            Aucun produit n’est actuellement marqué comme disponible.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const images = getProductImages(product, media);
              const mainImage = images[0];
              const orderProduct = toOrderProduct(product);

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[22px] border border-[#173D2D]/8 bg-[#FBFAF6]"
                >
                  <div className="relative h-64 overflow-hidden bg-[#D8DCCF]">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#627166]">
                        Photo à ajouter dans la galerie du produit
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-[#E4F0DF] px-3 py-2 text-[11px] font-bold text-[#28563F]">
                      Disponible
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#173D2D]">
                      {product.name}
                    </h3>

                    {(product.variant || product.product_group) && (
                      <p className="mt-2 text-sm leading-6 text-[#718074]">
                        {[product.product_group, product.variant]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    <div className="mt-5 border-t border-[#173D2D]/10 pt-4">
                      {product.price_standard !== null ? (
                        <p className="text-lg font-bold text-[#173D2D]">
                          {formatPrice(
                            product.price_standard,
                            product.unit
                          )}
                        </p>
                      ) : (
                        <p className="text-lg font-bold text-[#173D2D]">
                          Nous consulter
                        </p>
                      )}

                      {product.price_bulk !== null &&
                        product.bulk_min_kg !== null && (
                          <p className="mt-1 text-xs text-[#718074]">
                            À partir de {product.bulk_min_kg} kg :{" "}
                            {formatPrice(product.price_bulk, product.unit)}
                          </p>
                        )}
                    </div>

                    {orderProduct.order_enabled ? (
                      <HomeProductOrderModal product={orderProduct} />
                    ) : (
                      <div className="mt-5 flex w-full items-center justify-center rounded-full bg-[#E8E7E0] px-5 py-3.5 text-sm font-semibold text-[#858B81]">
                        Prix à confirmer
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-7 text-xs leading-5 text-[#718074]">
          Les prix affichés proviennent du catalogue AgroFarms237.
        </p>
      </div>
    </section>
  );
}
