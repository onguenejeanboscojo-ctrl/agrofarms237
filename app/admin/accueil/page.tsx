"use client";

import { useEffect, useState } from "react";

type HomeContent = {
  hero_label: string;
  hero_title: string;
  hero_description: string;
  hero_button_primary_label: string;
  hero_button_primary_url: string;
  hero_button_secondary_label: string;
  hero_button_secondary_url: string;

  commitments_title: string;
  commitment1_title: string;
  commitment1_text: string;
  commitment2_title: string;
  commitment2_text: string;
  commitment3_title: string;
  commitment3_text: string;
  commitment4_title: string;
  commitment4_text: string;

  products_label: string;
  products_title: string;
  products_description: string;

  story_label: string;
  story_title: string;
  story_text: string;
  story_button_label: string;
  story_button_url: string;

  future_label: string;
  future_title: string;
  future_text: string;

  cta_label: string;
  cta_title: string;
  cta_text: string;
  cta_button_primary_label: string;
  cta_button_primary_url: string;
  cta_button_secondary_label: string;
  cta_button_secondary_url: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  status: "disponible" | "bientot" | "rupture";
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

type ProductMedia = {
  id: string;
  home_product_id: string;
  url: string;
  storage_path: string;
  position: number;
};

const emptyContent: HomeContent = {
  hero_label: "",
  hero_title: "",
  hero_description: "",
  hero_button_primary_label: "",
  hero_button_primary_url: "",
  hero_button_secondary_label: "",
  hero_button_secondary_url: "",

  commitments_title: "",
  commitment1_title: "",
  commitment1_text: "",
  commitment2_title: "",
  commitment2_text: "",
  commitment3_title: "",
  commitment3_text: "",
  commitment4_title: "",
  commitment4_text: "",

  products_label: "",
  products_title: "",
  products_description: "",

  story_label: "",
  story_title: "",
  story_text: "",
  story_button_label: "",
  story_button_url: "",

  future_label: "",
  future_title: "",
  future_text: "",

  cta_label: "",
  cta_title: "",
  cta_text: "",
  cta_button_primary_label: "",
  cta_button_primary_url: "",
  cta_button_secondary_label: "",
  cta_button_secondary_url: "",
};

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D4B44] focus:ring-2 focus:ring-[#1D4B44]/10";

const textareaClass =
  "w-full min-h-[110px] rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D4B44] focus:ring-2 focus:ring-[#1D4B44]/10";

const sectionClass =
  "rounded-2xl border border-black/10 bg-white p-6 shadow-sm";

export default function AccueilAdminPage() {
  const [content, setContent] = useState<HomeContent>(emptyContent);
  const [products, setProducts] = useState<Product[]>([]);
  const [media, setMedia] = useState<Record<string, ProductMedia[]>>({});

  const [loading, setLoading] = useState(true);
  const [savingContent, setSavingContent] = useState(false);
  const [message, setMessage] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    status: "bientot" as Product["status"],
    price: "",
    price_unit: "kg",
    price_1_label: "",
    price_1: "",
    price_2_label: "",
    price_2: "",
    order_enabled: false,
    position: "0",
    published: true,
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);

      const [contentRes, productsRes] = await Promise.all([
        fetch("/api/home-content"),
        fetch("/api/home-products"),
      ]);

      const contentData = await contentRes.json();
      const productsData = await productsRes.json();

      if (contentData) {
        setContent({
          ...emptyContent,
          ...contentData,
        });
      }

      const loadedProducts = Array.isArray(productsData)
        ? productsData
        : productsData.products || [];

      setProducts(loadedProducts);

      const mediaMap: Record<string, ProductMedia[]> = {};

      await Promise.all(
        loadedProducts.map(async (product: Product) => {
          const res = await fetch(
            `/api/home-product-media?home_product_id=${product.id}`
          );

          if (!res.ok) return;

          const data = await res.json();

          mediaMap[product.id] = Array.isArray(data)
            ? data
            : data.media || [];
        })
      );

      setMedia(mediaMap);
    } catch (error) {
      console.error(error);
      setMessage("Une erreur est survenue lors du chargement.");
    } finally {
      setLoading(false);
    }
  }

  function updateContent(
    field: keyof HomeContent,
    value: string
  ) {
    setContent((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveContent() {
    try {
      setSavingContent(true);
      setMessage("");

      const response = await fetch("/api/home-content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Impossible d'enregistrer."
        );
      }

      setMessage("✓ Contenu de l'accueil enregistré.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'enregistrement."
      );
    } finally {
      setSavingContent(false);
    }
  }

  function resetProductForm() {
    setProductForm({
      name: "",
      description: "",
      status: "bientot",
      price: "",
      price_unit: "kg",
      price_1_label: "",
      price_1: "",
      price_2_label: "",
      price_2: "",
      order_enabled: false,
      position: String(products.length),
      published: true,
    });

    setEditingProduct(null);
    setShowProductForm(false);
  }

  function editProduct(product: Product) {
    setEditingProduct(product);

    setProductForm({
      name: product.name || "",
      description: product.description || "",
      status: product.status,
      price:
        product.price !== null
          ? String(product.price)
          : "",
      price_unit: product.price_unit || "kg",
      price_1_label: product.price_1_label || "",
      price_1:
        product.price_1 !== null
          ? String(product.price_1)
          : "",
      price_2_label: product.price_2_label || "",
      price_2:
        product.price_2 !== null
          ? String(product.price_2)
          : "",
      order_enabled: product.order_enabled,
      position: String(product.position ?? 0),
      published: product.published,
    });

    setShowProductForm(true);
  }

  async function saveProduct() {
    try {
      setMessage("");

      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        status: productForm.status,
        price:
          productForm.price !== ""
            ? Number(productForm.price)
            : null,
        price_unit: productForm.price_unit,
        price_1_label:
          productForm.price_1_label.trim() || null,
        price_1:
          productForm.price_1 !== ""
            ? Number(productForm.price_1)
            : null,
        price_2_label:
          productForm.price_2_label.trim() || null,
        price_2:
          productForm.price_2 !== ""
            ? Number(productForm.price_2)
            : null,
        order_enabled:
          productForm.status === "disponible"
            ? productForm.order_enabled
            : false,
        position: Number(productForm.position) || 0,
        published: productForm.published,
      };

      if (!payload.name) {
        setMessage("Le nom du produit est obligatoire.");
        return;
      }

      const response = await fetch(
        editingProduct
          ? `/api/home-products/${editingProduct.id}`
          : "/api/home-products",
        {
          method: editingProduct ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Impossible d'enregistrer le produit."
        );
      }

      await loadAll();
      resetProductForm();

      setMessage(
        editingProduct
          ? "✓ Produit modifié."
          : "✓ Produit ajouté."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'enregistrement du produit."
      );
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Supprimer définitivement « ${product.name} » ?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/home-products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Impossible de supprimer le produit."
        );
      }

      await loadAll();

      setMessage("✓ Produit supprimé.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression."
      );
    }
  }

  async function uploadProductPhoto(
    productId: string,
    file: File
  ) {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "home_product_id",
        productId
      );

      const response = await fetch(
        "/api/home-product-media",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Impossible d'envoyer la photo."
        );
      }

      await loadAll();

      setMessage("✓ Photo ajoutée.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout de la photo."
      );
    }
  }

  async function deletePhoto(photo: ProductMedia) {
    const confirmed = window.confirm(
      "Supprimer cette photo ?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/home-product-media/${photo.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Impossible de supprimer la photo."
        );
      }

      await loadAll();

      setMessage("✓ Photo supprimée.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression."
      );
    }
  }

  function statusLabel(status: Product["status"]) {
    if (status === "disponible") return "Disponible";
    if (status === "rupture") return "Rupture de stock";
    return "Bientôt disponible";
  }

  function statusClass(status: Product["status"]) {
    if (status === "disponible") {
      return "bg-green-50 text-green-700";
    }

    if (status === "rupture") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] p-8">
        <div className="mx-auto max-w-[1250px]">
          <p className="text-sm text-black/60">
            Chargement de l'administration de l'accueil…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] px-5 py-10">
      <div className="mx-auto max-w-[1250px] space-y-8">
        {/* HEADER */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1D4B44]">
            Administration
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#0E2622]">
                Accueil
              </h1>

              <p className="mt-2 text-sm text-black/60">
                Gérez ici tout le contenu visible sur la page
                d’accueil d’Agrofarms237.
              </p>
            </div>

            <button
              onClick={saveContent}
              disabled={savingContent}
              className="rounded-xl bg-[#1D4B44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#153a35] disabled:opacity-50"
            >
              {savingContent
                ? "Enregistrement…"
                : "Enregistrer le contenu"}
            </button>
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#0E2622]">
              {message}
            </div>
          )}
        </header>

        {/* HERO */}
        <section className={sectionClass}>
          <SectionTitle
            number="01"
            title="Hero"
            description="Le premier écran de la page d’accueil."
          />

          <div className="mt-6 grid gap-5">
            <Field
              label="Petit label"
              value={content.hero_label}
              onChange={(value) =>
                updateContent("hero_label", value)
              }
            />

            <Field
              label="Titre principal"
              value={content.hero_title}
              onChange={(value) =>
                updateContent("hero_title", value)
              }
            />

            <TextArea
              label="Description"
              value={content.hero_description}
              onChange={(value) =>
                updateContent(
                  "hero_description",
                  value
                )
              }
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Bouton principal"
                value={
                  content.hero_button_primary_label
                }
                onChange={(value) =>
                  updateContent(
                    "hero_button_primary_label",
                    value
                  )
                }
              />

              <Field
                label="URL bouton principal"
                value={
                  content.hero_button_primary_url
                }
                onChange={(value) =>
                  updateContent(
                    "hero_button_primary_url",
                    value
                  )
                }
              />

              <Field
                label="Bouton secondaire"
                value={
                  content.hero_button_secondary_label
                }
                onChange={(value) =>
                  updateContent(
                    "hero_button_secondary_label",
                    value
                  )
                }
              />

              <Field
                label="URL bouton secondaire"
                value={
                  content.hero_button_secondary_url
                }
                onChange={(value) =>
                  updateContent(
                    "hero_button_secondary_url",
                    value
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* ENGAGEMENTS */}
        <section className={sectionClass}>
          <SectionTitle
            number="02"
            title="Pourquoi Agrofarms237"
            description="Les quatre engagements présentés sur l'accueil."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <CommitmentEditor
              number="01"
              title={content.commitment1_title}
              text={content.commitment1_text}
              onTitleChange={(value) =>
                updateContent(
                  "commitment1_title",
                  value
                )
              }
              onTextChange={(value) =>
                updateContent(
                  "commitment1_text",
                  value
                )
              }
            />

            <CommitmentEditor
              number="02"
              title={content.commitment2_title}
              text={content.commitment2_text}
              onTitleChange={(value) =>
                updateContent(
                  "commitment2_title",
                  value
                )
              }
              onTextChange={(value) =>
                updateContent(
                  "commitment2_text",
                  value
                )
              }
            />

            <CommitmentEditor
              number="03"
              title={content.commitment3_title}
              text={content.commitment3_text}
              onTitleChange={(value) =>
                updateContent(
                  "commitment3_title",
                  value
                )
              }
              onTextChange={(value) =>
                updateContent(
                  "commitment3_text",
                  value
                )
              }
            />

            <CommitmentEditor
              number="04"
              title={content.commitment4_title}
              text={content.commitment4_text}
              onTitleChange={(value) =>
                updateContent(
                  "commitment4_title",
                  value
                )
              }
              onTextChange={(value) =>
                updateContent(
                  "commitment4_text",
                  value
                )
              }
            />
          </div>

          <div className="mt-5">
            <Field
              label="Titre de la section"
              value={content.commitments_title}
              onChange={(value) =>
                updateContent(
                  "commitments_title",
                  value
                )
              }
            />
          </div>
        </section>

        {/* PRODUITS */}
        <section className={sectionClass}>
          <SectionTitle
            number="03"
            title="De la ferme à votre table"
            description="Produits commercialisés, prix, disponibilité et photos."
          />

          <div className="mt-6 grid gap-5">
            <Field
              label="Petit label"
              value={content.products_label}
              onChange={(value) =>
                updateContent(
                  "products_label",
                  value
                )
              }
            />

            <Field
              label="Titre"
              value={content.products_title}
              onChange={(value) =>
                updateContent(
                  "products_title",
                  value
                )
              }
            />

            <TextArea
              label="Description"
              value={content.products_description}
              onChange={(value) =>
                updateContent(
                  "products_description",
                  value
                )
              }
            />
          </div>

          <div className="mt-8 border-t border-black/10 pt-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-[#0E2622]">
                  Produits
                </h3>
                <p className="mt-1 text-sm text-black/50">
                  Chaque produit possède ses propres prix,
                  statut et photos.
                </p>
              </div>

              <button
                onClick={() => {
                  resetProductForm();
                  setShowProductForm(true);
                }}
                className="rounded-xl bg-[#1D4B44] px-4 py-3 text-sm font-semibold text-white"
              >
                + Ajouter un produit
              </button>
            </div>

            {showProductForm && (
              <div className="mt-6 rounded-2xl border border-[#1D4B44]/20 bg-[#F7F5EF] p-5">
                <h3 className="text-lg font-semibold text-[#0E2622]">
                  {editingProduct
                    ? "Modifier le produit"
                    : "Nouveau produit"}
                </h3>

                <div className="mt-5 grid gap-5">
                  <Field
                    label="Nom du produit"
                    value={productForm.name}
                    onChange={(value) =>
                      setProductForm((p) => ({
                        ...p,
                        name: value,
                      }))
                    }
                  />

                  <TextArea
                    label="Description"
                    value={productForm.description}
                    onChange={(value) =>
                      setProductForm((p) => ({
                        ...p,
                        description: value,
                      }))
                    }
                  />

                  <div className="grid gap-5 md:grid-cols-3">
                    <SelectField
                      label="Statut"
                      value={productForm.status}
                      onChange={(value) =>
                        setProductForm((p) => ({
                          ...p,
                          status:
                            value as Product["status"],
                          order_enabled:
                            value === "disponible"
                              ? p.order_enabled
                              : false,
                        }))
                      }
                      options={[
                        {
                          value: "disponible",
                          label: "Disponible",
                        },
                        {
                          value: "bientot",
                          label: "Bientôt disponible",
                        },
                        {
                          value: "rupture",
                          label: "Rupture de stock",
                        },
                      ]}
                    />

                    <Field
                      label="Prix standard"
                      type="number"
                      value={productForm.price}
                      onChange={(value) =>
                        setProductForm((p) => ({
                          ...p,
                          price: value,
                        }))
                      }
                    />

                    <Field
                      label="Unité"
                      value={productForm.price_unit}
                      onChange={(value) =>
                        setProductForm((p) => ({
                          ...p,
                          price_unit: value,
                        }))
                      }
                    />
                  </div>

                  <div className="rounded-xl border border-black/10 bg-white p-4">
                    <p className="text-sm font-semibold text-[#0E2622]">
                      Tarification spéciale
                    </p>

                    <p className="mt-1 text-xs text-black/50">
                      Utile notamment pour le Silure : deux
                      niveaux de prix.
                    </p>

                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                      <div>
                        <Field
                          label="Libellé prix 1"
                          value={
                            productForm.price_1_label
                          }
                          onChange={(value) =>
                            setProductForm((p) => ({
                              ...p,
                              price_1_label: value,
                            }))
                          }
                        />

                        <div className="mt-3">
                          <Field
                            label="Prix 1"
                            type="number"
                            value={productForm.price_1}
                            onChange={(value) =>
                              setProductForm((p) => ({
                                ...p,
                                price_1: value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Field
                          label="Libellé prix 2"
                          value={
                            productForm.price_2_label
                          }
                          onChange={(value) =>
                            setProductForm((p) => ({
                              ...p,
                              price_2_label: value,
                            }))
                          }
                        />

                        <div className="mt-3">
                          <Field
                            label="Prix 2"
                            type="number"
                            value={productForm.price_2}
                            onChange={(value) =>
                              setProductForm((p) => ({
                                ...p,
                                price_2: value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <Field
                      label="Position"
                      type="number"
                      value={productForm.position}
                      onChange={(value) =>
                        setProductForm((p) => ({
                          ...p,
                          position: value,
                        }))
                      }
                    />

                    <label className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          productForm.published
                        }
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            published:
                              e.target.checked,
                          }))
                        }
                      />

                      <span className="text-sm">
                        Visible sur le site
                      </span>
                    </label>

                    <label
                      className={`flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 ${
                        productForm.status !==
                        "disponible"
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          productForm.order_enabled
                        }
                        disabled={
                          productForm.status !==
                          "disponible"
                        }
                        onChange={(e) =>
                          setProductForm((p) => ({
                            ...p,
                            order_enabled:
                              e.target.checked,
                          }))
                        }
                      />

                      <span className="text-sm">
                        Autoriser Commander
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      onClick={resetProductForm}
                      className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold"
                    >
                      Annuler
                    </button>

                    <button
                      onClick={saveProduct}
                      className="rounded-xl bg-[#1D4B44] px-5 py-3 text-sm font-semibold text-white"
                    >
                      {editingProduct
                        ? "Enregistrer les modifications"
                        : "Créer le produit"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-5">
              {products.length === 0 && (
                <div className="rounded-xl border border-dashed border-black/20 bg-[#F7F5EF] p-8 text-center text-sm text-black/50">
                  Aucun produit configuré.
                </div>
              )}

              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-black/10 bg-[#F7F5EF] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-xl font-semibold text-[#0E2622]">
                          {product.name}
                        </h4>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            product.status
                          )}`}
                        >
                          {statusLabel(
                            product.status
                          )}
                        </span>

                        {!product.published && (
                          <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/50">
                            Masqué
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        {product.price !== null && (
                          <span className="rounded-lg bg-white px-3 py-2">
                            {product.price.toLocaleString(
                              "fr-FR"
                            )}{" "}
                            FCFA /{" "}
                            {product.price_unit ||
                              "unité"}
                          </span>
                        )}

                        {product.price_1 !==
                          null && (
                          <span className="rounded-lg bg-white px-3 py-2">
                            {product.price_1_label ||
                              "Prix 1"}{" "}
                            :{" "}
                            {product.price_1.toLocaleString(
                              "fr-FR"
                            )}{" "}
                            FCFA
                          </span>
                        )}

                        {product.price_2 !==
                          null && (
                          <span className="rounded-lg bg-white px-3 py-2">
                            {product.price_2_label ||
                              "Prix 2"}{" "}
                            :{" "}
                            {product.price_2.toLocaleString(
                              "fr-FR"
                            )}{" "}
                            FCFA
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          editProduct(product)
                        }
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(product)
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* PHOTOS */}
                  <div className="mt-6 border-t border-black/10 pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#0E2622]">
                          Photos du produit
                        </p>

                        <p className="mt-1 text-xs text-black/50">
                          Ces photos appartiennent uniquement
                          à ce produit.
                        </p>
                      </div>

                      <label className="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                        + Ajouter
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file =
                              e.target.files?.[0];

                            if (file) {
                              uploadProductPhoto(
                                product.id,
                                file
                              );
                            }

                            e.currentTarget.value =
                              "";
                          }}
                        />
                      </label>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {(media[product.id] || []).map(
                        (photo) => (
                          <div
                            key={photo.id}
                            className="group relative aspect-square overflow-hidden rounded-xl bg-black/5"
                          >
                            <img
                              src={photo.url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />

                            <button
                              onClick={() =>
                                deletePhoto(photo)
                              }
                              className="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                            >
                              Supprimer
                            </button>
                          </div>
                        )
                      )}

                      {(media[product.id] || [])
                        .length === 0 && (
                        <div className="col-span-full rounded-xl border border-dashed border-black/15 p-6 text-center text-xs text-black/40">
                          Aucune photo pour ce produit.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HISTOIRE */}
        <section className={sectionClass}>
          <SectionTitle
            number="04"
            title="Notre histoire"
            description="Le bloc éditorial consacré à l'histoire de la ferme."
          />

          <div className="mt-6 grid gap-5">
            <Field
              label="Petit label"
              value={content.story_label}
              onChange={(value) =>
                updateContent(
                  "story_label",
                  value
                )
              }
            />

            <Field
              label="Titre"
              value={content.story_title}
              onChange={(value) =>
                updateContent(
                  "story_title",
                  value
                )
              }
            />

            <TextArea
              label="Texte"
              value={content.story_text}
              onChange={(value) =>
                updateContent(
                  "story_text",
                  value
                )
              }
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Texte du bouton"
                value={content.story_button_label}
                onChange={(value) =>
                  updateContent(
                    "story_button_label",
                    value
                  )
                }
              />

              <Field
                label="URL du bouton"
                value={content.story_button_url}
                onChange={(value) =>
                  updateContent(
                    "story_button_url",
                    value
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* AVENIR */}
        <section className={sectionClass}>
          <SectionTitle
            number="05"
            title="Notre vision / avenir"
            description="Le bloc qui présente les perspectives d'Agrofarms237."
          />

          <div className="mt-6 grid gap-5">
            <Field
              label="Petit label"
              value={content.future_label}
              onChange={(value) =>
                updateContent(
                  "future_label",
                  value
                )
              }
            />

            <Field
              label="Titre"
              value={content.future_title}
              onChange={(value) =>
                updateContent(
                  "future_title",
                  value
                )
              }
            />

            <TextArea
              label="Texte"
              value={content.future_text}
              onChange={(value) =>
                updateContent(
                  "future_text",
                  value
                )
              }
            />
          </div>
        </section>

        {/* CTA */}
        <section className={sectionClass}>
          <SectionTitle
            number="06"
            title="Appel à l'action final"
            description="Le dernier bloc avant le pied de page."
          />

          <div className="mt-6 grid gap-5">
            <Field
              label="Petit label"
              value={content.cta_label}
              onChange={(value) =>
                updateContent(
                  "cta_label",
                  value
                )
              }
            />

            <Field
              label="Titre"
              value={content.cta_title}
              onChange={(value) =>
                updateContent(
                  "cta_title",
                  value
                )
              }
            />

            <TextArea
              label="Texte"
              value={content.cta_text}
              onChange={(value) =>
                updateContent(
                  "cta_text",
                  value
                )
              }
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Bouton principal"
                value={
                  content.cta_button_primary_label
                }
                onChange={(value) =>
                  updateContent(
                    "cta_button_primary_label",
                    value
                  )
                }
              />

              <Field
                label="URL bouton principal"
                value={
                  content.cta_button_primary_url
                }
                onChange={(value) =>
                  updateContent(
                    "cta_button_primary_url",
                    value
                  )
                }
              />

              <Field
                label="Bouton secondaire"
                value={
                  content.cta_button_secondary_label
                }
                onChange={(value) =>
                  updateContent(
                    "cta_button_secondary_label",
                    value
                  )
                }
              />

              <Field
                label="URL bouton secondaire"
                value={
                  content.cta_button_secondary_url
                }
                onChange={(value) =>
                  updateContent(
                    "cta_button_secondary_url",
                    value
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* SAVE */}
        <div className="flex justify-end pb-10">
          <button
            onClick={saveContent}
            disabled={savingContent}
            className="rounded-xl bg-[#1D4B44] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#153a35] disabled:opacity-50"
          >
            {savingContent
              ? "Enregistrement…"
              : "Enregistrer tout le contenu"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

function SectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D4B44] text-xs font-semibold text-white">
        {number}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#0E2622]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-black/50">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-black/50">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={inputClass}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-black/50">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={textareaClass}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-black/50">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={inputClass}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CommitmentEditor({
  number,
  title,
  text,
  onTitleChange,
  onTextChange,
}: {
  number: string;
  title: string;
  text: string;
  onTitleChange: (value: string) => void;
  onTextChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-[#F7F5EF] p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D4B44] text-xs font-semibold text-white">
          {number}
        </span>

        <span className="text-sm font-semibold text-[#0E2622]">
          Engagement {number}
        </span>
      </div>

      <Field
        label="Titre"
        value={title}
        onChange={onTitleChange}
      />

      <div className="mt-4">
        <TextArea
          label="Texte"
          value={text}
          onChange={onTextChange}
        />
      </div>
    </div>
  );
}
