
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import HomeProductOrderModal, {
  type HomeOrderProduct,
} from "@/components/HomeProductOrderModal";

type HomeProduct = HomeOrderProduct & {
  position: number;
  published: boolean;
};

type MediaItem = {
  url: string;
  kind: string;
  category?: string | null;
  site_location?: string | null;
  published?: boolean;
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

function getProductImageLocations(name: string): string[] {
  const productName = normalize(name);

  if (productName.includes("silure")) {
    return productName.includes("fum")
      ? ["produit_silure_fume"]
      : ["produit_silure_frais"];
  }

  if (productName.includes("carpe")) {
    return productName.includes("fum")
      ? ["produit_carpe_fumee"]
      : ["produit_carpe_fraiche"];
  }

  if (productName.includes("porcelet")) {
    return ["produit_porcelet"];
  }

  if (productName.includes("porc")) {
    if (productName.includes("fum")) {
      return ["produit_porc_fume"];
    }

    if (productName.includes("entier")) {
      return ["produit_porc_entier"];
    }

    return ["produit_porc_frais"];
  }

  if (productName.includes("poulet")) {
    if (productName.includes("fum")) {
      return ["produit_poulet_fume"];
    }

    if (productName.includes("vivant")) {
      return ["produit_poulet_vivant"];
    }

    return ["produit_poulet_frais_nettoye"];
  }

  if (
    productName.includes("oeuf") ||
    productName.includes("alveole")
  ) {
    return ["produit_alveoles_oeufs"];
  }

  if (productName.includes("poussin")) {
    return ["produit_poussins"];
  }

  if (productName.includes("alevin")) {
    return ["produit_alevins"];
  }

  return [];
}

function getLegacyCategories(name: string): string[] {
  const productName = normalize(name);

  if (productName.includes("silure")) {
    return productName.includes("fum")
      ? ["produit_silure_fume"]
      : ["produit_silure_frais", "elevage_silure"];
  }

  if (productName.includes("carpe")) {
    return ["carpe", "produit_carpe"];
  }

  if (productName.includes("porcelet")) {
    return ["produit_porcelet"];
  }

  if (productName.includes("porc")) {
    return productName.includes("fum")
      ? ["produit_porc_fume"]
      : ["porc", "elevage_porc"];
  }

  if (productName.includes("poulet")) {
    return productName.includes("fum")
      ? ["produit_poulet_fume"]
      : ["produit_poulet_frais", "poulet"];
  }

  if (
    productName.includes("oeuf") ||
    productName.includes("alveole")
  ) {
    return ["oeufs", "œufs"];
  }

  if (productName.includes("poussin")) {
    return ["produit_poussins"];
  }

  if (productName.includes("alevin")) {
    return ["produit_alevins"];
  }

  return [];
}

function getProductImages(
  productName: string,
  media: MediaItem[],
): string[] {
  const locations = getProductImageLocations(productName);
  const categories = getLegacyCategories(productName);

  // Priorité 1 : photos liées à l'emplacement exact du produit.
  const exactImages = media
    .filter(
      (item) =>
        item.site_location &&
        locations.includes(item.site_location),
    )
    .map((item) => item.url);

  if (exactImages.length > 0) {
    return Array.from(new Set(exactImages));
  }

  // Priorité 2 : anciennes photos du catalogue.
  const legacyImages = media
    .filter(
      (item) =>
        !item.site_location &&
        item.category &&
        categories.includes(normalize(item.category)),
    )
    .map((item) => item.url);

  return Array.from(new Set(legacyImages));
}

function formatPrice(
  price: number,
  unit: string | null,
) {
  const formatted = new Intl.NumberFormat("fr-FR").format(price);
  return `${formatted} FCFA${unit ? `/${unit}` : ""}`;
}

function getStatusLabel(status: string) {
  if (status === "disponible") return "Disponible";
  if (status === "rupture") return "En rupture";
  return "Bientôt disponible";
}

export default async function HomeProductsSection() {
  let products: HomeProduct[] = [];
  let media: MediaItem[] = [];

  try {
    const { data, error } = await supabaseAdmin()
      .from("home_products")
      .select(
        "id, name, description, status, price, price_unit, price_1_label, price_1, price_2_label, price_2, order_enabled, order_options, position, published",
      )
      .eq("published", true)
      .order("position", { ascending: true });

    if (error) {
      console.error(
        "Erreur chargement des produits accueil :",
        error,
      );
    } else {
      products = (data ?? []) as HomeProduct[];
    }
  } catch (error) {
    console.error("Erreur Supabase produits accueil :", error);
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("media")
      .select(
        "url,kind,category,site_location,published,position,created_at",
      )
      .eq("published", true)
      .eq("kind", "photo")
      .not("url", "is", null)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Erreur chargement des photos du catalogue :",
        error,
      );
    } else {
      media = (data ?? []) as MediaItem[];
    }
  } catch (error) {
    console.error("Erreur Supabase photos catalogue :", error);
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
              Découvrez notre catalogue. Les produits affichés sont
              ceux publiés par Agrofarms237.
            </p>
          </div>

          <span className="rounded-full border border-[#173D2D]/15 px-4 py-2 text-xs font-semibold text-[#40594A]">
            Catalogue Agrofarms237
          </span>
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl bg-[#FBFAF6] p-6 text-sm text-[#627166]">
            Nos produits seront bientôt présentés ici.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const available =
                product.status === "disponible" &&
                product.order_enabled;

              const mainPrice = product.price_1 ?? product.price;
              const images = getProductImages(product.name, media);

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
                        className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                          available ? "" : "grayscale-[35%]"
                        }`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#173D2D] px-6 text-center">
                        <span className="font-serif text-2xl text-[#E8C98A]">
                          {product.name}
                        </span>
                      </div>
                    )}

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-2 text-[11px] font-bold ${
                        available
                          ? "bg-[#E4F0DF] text-[#28563F]"
                          : "bg-white/90 text-[#69746A]"
                      }`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#718074]">
                      {product.description}
                    </p>

                    <div className="mt-5 border-t border-[#173D2D]/10 pt-4">
                      {mainPrice !== null ? (
                        <p className="text-lg font-bold text-[#173D2D]">
                          {formatPrice(mainPrice, product.price_unit)}
                        </p>
                      ) : (
                        <p className="text-lg font-bold text-[#173D2D]">
                          Nous consulter
                        </p>
                      )}

                      {product.price_2 !== null &&
                        product.price_2_label && (
                          <p className="mt-1 text-xs text-[#718074]">
                            {product.price_2_label} :{" "}
                            {formatPrice(
                              product.price_2,
                              product.price_unit,
                            )}
                          </p>
                        )}
                    </div>

                    {available ? (
                      <HomeProductOrderModal product={product} />
                    ) : (
                      <div className="mt-5 flex w-full cursor-not-allowed items-center justify-center rounded-full bg-[#E8E7E0] px-5 py-3.5 text-sm font-semibold text-[#858B81]">
                        {getStatusLabel(product.status)}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-7 text-xs leading-5 text-[#718074]">
          Les prix et disponibilités affichés sont à confirmer avant
          commande.
        </p>
      </div>
    </section>
  );
}
