"use client";

import { useEffect, useState } from "react";
import { CATEGORY_GROUPS, CATEGORY_LABELS } from "@/lib/mediaCategories";

export default function MediaManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [kind, setKind] = useState("photo");
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Impossible de charger les médias.");
        return;
      }

      setItems(data.items || []);
    } catch {
      setError("Impossible de charger les médias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setUploading(true);

    const form = new FormData();

    form.append("file", file);
    form.append("kind", kind);
    form.append("category", category);
    form.append("caption", caption);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Échec de l'envoi.");
        return;
      }

      setCaption("");
      setCategory("");

      await load();

      e.target.value = "";
    } catch {
      setError("Une erreur est survenue pendant l'envoi.");
    } finally {
      setUploading(false);
    }
  }

  async function togglePublished(
    id: string,
    published: boolean
  ) {
    const previousItems = items;

    // Mise à jour immédiate de l'interface
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, published }
          : item
      )
    );

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setItems(previousItems);
        setError(
          data.error ||
            "Impossible de modifier la visibilité du média."
        );
      }
    } catch {
      setItems(previousItems);
      setError(
        "Impossible de modifier la visibilité du média."
      );
    }
  }

  async function remove(id: string) {
    if (
      !confirm(
        "Supprimer définitivement ce média ? Cette action est irréversible."
      )
    ) {
      return;
    }

    const previousItems = items;

    setItems((current) =>
      current.filter((item) => item.id !== id)
    );

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setItems(previousItems);
        setError(
          data.error ||
            "Impossible de supprimer ce média."
        );
      }
    } catch {
      setItems(previousItems);
      setError("Impossible de supprimer ce média.");
    }
  }

  return (
    <div>
      {/* =====================================================
          AJOUTER UN MÉDIA
      ====================================================== */}

      <div className="max-w-[560px] rounded-md border border-ink/10 bg-paper p-7">
        <h2 className="font-serif text-xl font-semibold">
          Ajouter un média
        </h2>

        <p className="mt-1 text-[13px] text-inkSoft">
          Ajoutez une photo ou une vidéo et choisissez
          l'endroit où elle sera utilisée sur le site.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label>Type</label>

            <select
              value={kind}
              onChange={(e) =>
                setKind(e.target.value)
              }
            >
              <option value="photo">Photo</option>
              <option value="video">Vidéo</option>
            </select>
          </div>

          <div className="field">
            <label>Catégorie / emplacement</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="">
                Choisir une catégorie
              </option>

              {CATEGORY_GROUPS.map((group) => (
                <optgroup
                  key={group.label}
                  label={group.label}
                >
                  {group.options.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="field sm:col-span-2">
            <label>Légende (optionnel)</label>

            <input
              value={caption}
              onChange={(e) =>
                setCaption(e.target.value)
              }
              placeholder="Ex. Bassins de silures en production"
            />
          </div>
        </div>

        <label className="btn btn-ink mt-5 cursor-pointer">
          {uploading
            ? "Envoi en cours..."
            : "Choisir un fichier à envoyer"}

          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>

        {error && (
          <p className="mt-3 text-[14px] font-semibold text-alert">
            {error}
          </p>
        )}

        <p className="mt-2 text-[13px] text-inkSoft">
          25 Mo maximum par fichier.
        </p>
      </div>

      {/* =====================================================
          LISTE DES MÉDIAS
      ====================================================== */}

      <div className="mt-8">
        {loading ? (
          <p className="text-inkSoft">
            Chargement...
          </p>
        ) : items.length === 0 ? (
          <p className="text-inkSoft">
            Aucun média envoyé pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-md border border-ink/10 bg-paper"
              >
                {/* APERÇU */}

                <div className="relative">
                  {item.kind === "photo" ? (
                    <img
                      src={item.url}
                      alt={
                        item.caption ||
                        "Média AgroFarms237"
                      }
                      className={`aspect-square w-full object-cover ${
                        !item.published
                          ? "opacity-45 grayscale"
                          : ""
                      }`}
                    />
                  ) : (
                    <video
                      src={item.url}
                      className={`aspect-square w-full object-cover ${
                        !item.published
                          ? "opacity-45 grayscale"
                          : ""
                      }`}
                      muted
                    />
                  )}

                  {/* STATUT */}

                  <div className="absolute left-2.5 top-2.5">
                    {item.published ? (
                      <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold text-ink">
                        Publié
                      </span>
                    ) : (
                      <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-paper">
                        Masqué
                      </span>
                    )}
                  </div>
                </div>

                {/* INFORMATIONS */}

                <div className="p-3">
                  {item.category && (
                    <p className="text-[11.5px] font-semibold text-goldDeep">
                      {CATEGORY_LABELS[item.category] ||
                        item.category}
                    </p>
                  )}

                  {item.caption && (
                    <p className="mt-1 line-clamp-2 text-[12.5px] text-inkSoft">
                      {item.caption}
                    </p>
                  )}

                  {/* VISIBILITÉ */}

                  <div className="mt-3 border-t border-ink/10 pt-3">
                    <button
                      type="button"
                      onClick={() =>
                        togglePublished(
                          item.id,
                          !item.published
                        )
                      }
                      className={`w-full rounded-md border px-3 py-2 text-[12.5px] font-semibold transition ${
                        item.published
                          ? "border-ink/10 bg-bgAlt text-ink"
                          : "border-gold/30 bg-gold/10 text-goldDeep"
                      }`}
                    >
                      {item.published
                        ? "Masquer du site"
                        : "Publier sur le site"}
                    </button>
                  </div>

                  {/* SUPPRESSION */}

                  <button
                    type="button"
                    onClick={() =>
                      remove(item.id)
                    }
                    className="mt-2 w-full text-[12.5px] font-semibold text-alert underline"
                  >
                    Supprimer définitivement
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
