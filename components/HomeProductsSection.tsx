
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import HomeProductOrderModal, {
  type HomeOrderProduct,
} from "@/components/HomeProductOrderModal";

type Product = {
  id: string;
  name: string;
  price_standard: number | null;
  price_bulk: number | null;
  bulk_min_kg: number | null;
  stock_status: string;
  category: string | null;
  product_group: string | null;
  variant: string | null;
  unit: string | null;
  display_order: number | null;
};

type MediaItem = {
  url: string;
  kind: string;
  category?: string | null;
  site_location?: string | null;
  published: boolean;
  position?: number | null;
  created_at?: string | null;
};

function normalize(value: string | null | undefined) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function mediaLocations(product: Product): string[] {
  const group = normalize(product.product_group);
  const variant = normalize(product.variant);
  const name = normalize(product.name);

  if (group === "silure" || name.includes("silure")) {
    return variant.includes("fum") || name.includes("fume")
      ? ["produit_silure_fume"]
      : ["produit_silure_frais"];
  }

  if (group === "carpe" || name.includes("carpe")) {
    return variant.includes("fum") || name.includes("fume")
      ? ["produit_carpe_fumee"]
      : ["produit_carpe_fraiche"];
  }

  if (group === "porcelet" || name.includes("porcelet")) {
    return ["produit_porcelet"];
  }

  if (group === "porc" || name.includes("porc")) {
    if (variant.includes("fum") || name.includes("fume")) {
      return ["produit_porc_fume"];
    }

    if (variant.includes("entier") || name.includes("entier")) {
      return ["produit_porc_entier"];
    }

    return ["produit_porc_frais"];
  }

  if (
    group === "poulet" ||
    group === "poulet de chair" ||
    name.includes("poulet")
  ) {
    if (variant.includes("fum") || name.includes("fume")) {
      return ["produit_poulet_fume"];
    }

    if (variant.includes("vivant") || name.includes("vivant")) {
      return ["produit_poulet_vivant"];
    }

    return ["produit_poulet_frais_nettoye"];
  }

  if (
    group.includes("oeuf") ||
    name.includes("oeuf") ||
    name.includes("alveole") ||
    variant.includes("alveole")
  ) {
    return ["produit_alveoles_oeufs"];
  }

  if (group.includes("poussin") || name.includes("poussin")) {
    return ["produit_poussins"];
  }

  if (group.includes("alevin") || name.includes("alevin")) {
    return ["produit_alevins"];
  }

  return [];
}

function getProductImages(
  product: Product,
  media: MediaItem[]
): string[] {
  const locations = mediaLocations(product);

  return media
    .filter((item) => {
      if (
        item.site_location &&
        locations.includes(item.site_location)
      ) {
        return true;
      }

      return false;
    })
    .map((item) => item.url)
    .filter(Boolean);
}

function formatPrice(price: number | null, unit: string | null) {
  if (typeof price !== "number") {
    return "Prix à confirmer";
  }

  const formatted = new Intl.NumberFormat("fr-FR").format(price);
  return `${formatted} FCFA${unit ? `/${unit}` : ""}`;
}

function toOrderProduct(product: Product): HomeOrderProduct {
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
    order_enabled:
      product.stock_status === "disponible" &&
      typeof product.price_standard === "number",
    order_options: [],
  };
}

export default async function HomeProductsSection() {
  let products: Product[] = [];
  let media: MediaItem[] = [];

  try {
    const { data, error } = await supabaseAdmin()
      .from("products")
      .select(
        "id,name,price_standard,price_bulk,bulk_min_kg,stock_status,category,product_group,variant,unit,display_order"
      )
      .eq("stock_status", "disponible")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Erreur chargement des produits :", error);
    } else {
      products = (data ?? []) as Product[];
    }
  } catch (error) {
    console.error("Erreur Supabase produits :", error);
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select(
        "url,kind,category,site_location,published,position,created_at"
      )
      .eq("published", true)
      .eq("kind", "photo")
      .not("url", "is", null)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement des médias :", error);
    } else {
      media = (data ?? []) as MediaItem[];
    }
  } catch (error) {
    console.error("Erreur Supabase médias :", error);
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
              Découvrez les produits actuellement disponibles chez Agrofarms237.
            </p>
          </div>

          <span className="rounded-full border border-[#173D2D]/15 px-4 py-2 text-xs font-semibold text-[#40594A]">
            Catalogue Agrofarms237
          </span>
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl bg-[#FBFAF6] p-6 text-sm text-[#627166]">
            Aucun produit n’est actuellement disponible.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const images = getProductImages(product, media);

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[22px] border border-[#173D2D]/8 bg-[#FBFAF6]"
                >
                  <div className="relative h-64 overflow-hidden bg-[#D8DCCF]">
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#173D2D] px-6 text-center text-[#E8C98A]">
                        <span className="font-serif text-xl">
                          {product.name}
                        </span>
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-[#E4F0DF] px-3 py-2 text-[11px] font-bold text-[#28563F]">
                      Disponible
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">
                      {product.name}
                    </h3>

                    {product.variant && (
                      <p className="mt-2 text-sm text-[#718074]">
                        {product.variant}
                      </p>
                    )}

                    <div className="mt-5 border-t border-[#173D2D]/10 pt-4">
                      <p className="text-lg font-bold text-[#173D2D]">
                        {formatPrice(
                          product.price_standard,
                          product.unit
                        )}
                      </p>

                      {typeof product.price_bulk === "number" &&
                        typeof product.bulk_min_kg === "number" && (
                          <p className="mt-1 text-xs text-[#718074]">
                            Tarif professionnel :{" "}
                            {formatPrice(product.price_bulk, product.unit)}
                            {" "}dès {product.bulk_min_kg} kg
                          </p>
                        )}
                    </div>

                    {typeof product.price_standard === "number" ? (
                      <HomeProductOrderModal
                        product={toOrderProduct(product)}
                        useDefaultOptions={false}
                      />
                    ) : (
                      <div className="mt-5 rounded-full bg-[#E8E7E0] px-5 py-3.5 text-center text-sm font-semibold text-[#858B81]">
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
          Les prix et disponibilités affichés sont à confirmer avant commande.
        </p>
      </div>
    </section>
  );
}
