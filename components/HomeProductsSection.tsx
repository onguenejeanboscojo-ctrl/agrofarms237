
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type HomeProduct = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  price: number | null;
  price_unit: string | null;
  price_1_label: string | null;
  price_1: number | null;
  price_2_label: string | null;
  price_2: number | null;
  order_enabled: boolean;
  position: number;
  published: boolean;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85";

function getProductImage(name: string) {
  const productName = name.toLowerCase();

  if (productName.includes("silure") && productName.includes("frais")) {
    return "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=1000&q=85";
  }

  if (productName.includes("silure")) {
    return "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85";
  }

  if (
    productName.includes("porc") ||
    productName.includes("poulet")
  ) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85";
  }

  return FALLBACK_IMAGE;
}

function formatPrice(price: number, unit: string | null) {
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

  try {
    const { data, error } = await supabaseAdmin()
      .from("home_products")
      .select(
        "id, name, description, status, price, price_unit, price_1_label, price_1, price_2_label, price_2, order_enabled, position, published"
      )
      .eq("published", true)
      .order("position", { ascending: true });

    if (error) {
      console.error("Erreur chargement des produits accueil :", error);
    } else {
      products = (data ?? []) as HomeProduct[];
    }
  } catch (error) {
    console.error("Erreur Supabase produits accueil :", error);
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

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[22px] border border-[#173D2D]/8 bg-[#FBFAF6]"
                >
                  <div className="relative h-64 overflow-hidden bg-[#D8DCCF]">
                    <img
                      src={getProductImage(product.name)}
                      alt={product.name}
                      className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                        available ? "" : "grayscale-[35%]"
                      }`}
                    />

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
                              product.price_unit
                            )}
                          </p>
                        )}
                    </div>

                    {available ? (
                      <a
                        href={`https://wa.me/237697983119?text=${encodeURIComponent(
                          `Bonjour Agrofarms237, je souhaite commander : ${product.name}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#173D2D] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#28563F]"
                      >
                        Commander sur WhatsApp ↗
                      </a>
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
