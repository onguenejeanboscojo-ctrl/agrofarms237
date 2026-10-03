"use client";

import { useEffect, useState } from "react";
import { CATEGORY_GROUPS, CATEGORY_LABELS } from "@/lib/mediaCategories";

type MediaItem = {
  id: string;
  url: string;
  storage_path?: string | null;
  kind: "photo" | "video";
  category?: string | null;
  caption?: string | null;
  published: boolean;
  position?: number | null;
};

type EditState = {
  category: string;
  caption: string;
  position: string;
  published: boolean;
};

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [kind, setKind] = useState("photo");
  const [category, setCategory] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const res = await fetch("/api/media", {
        cache: "no-store",
      });

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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const form = new FormData();

      form.append("file", file);
      form.append("kind", kind);
      form.append("category", category);
      form.append("caption", caption);

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

  function startEdit(item: MediaItem) {
    setEditingId(item.id);

    setEdit({
      category: item.category || "",
      caption: item.caption || "",
      position: String(item.position ?? 0),
      published: item.published,
    });

    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEdit(null);
  }

  async function saveEdit(id: string) {
    if (!edit) return;

    setSaving(true);
    setError("");

    const position = Number(edit.position);

    if (!Number.isFinite(position)) {
      setError("La position doit être un nombre.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: edit.category || null,
          caption: edit.caption.trim() || null,
          position,
          published: edit.published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Impossible d'enregistrer les modifications.");
        return;
      }

      setItems((current) =>
        current
          .map((item) =>
            item.id === id
              ? {
                  ...item,
                  category: edit.category || null,
                  caption: edit.caption.trim() || null,
                  position,
                  published: edit.published,
                }
              : item
          )
          .sort((a, b) => {
            const positionA = a.position ?? 0;
            const positionB = b.position ?? 0;

            if (positionA !== positionB) {
              return positionA - positionB;
            }

            return 0;
          })
      );

      cancelEdit();
    } catch {
      setError("Une erreur est survenue pendant l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(id: string, published: boolean) {
    setError("");

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, published } : item
      )
    );

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published }),
      });

      if (!res.ok) {
        await load();
        const data = await res.json().catch(() => null);
        setError(data?.error || "Impossible de modifier la publication.");
      }
    } catch {
      await load();
      setError("Impossible de modifier la publication.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement ce média ?")) return;

    setError("");

    const previous = items;

    setItems((current) => current.filter((item) => item.id !== id));

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setItems(previous);

        const data = await res.json().catch(() => null);
        setError(data?.error || "Impossible de supprimer ce média.");
      }
    } catch {
      setItems(previous);
      setError("Impossible de supprimer ce média.");
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= items.length) return;

    const current = items[index];
    const target = items[targetIndex];

    const currentPosition = current.position ?? index;
    const targetPosition = target.position ?? targetIndex;

    setError("");

    try {
      const [firstResponse, secondResponse] = await Promise.all([
        fetch(`/api/media/${current.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: targetPosition,
          }),
        }),
        fetch(`/api/media/${target.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: currentPosition,
          }),
        }),
      ]);

      if (!firstResponse.ok || !secondResponse.ok) {
        await load();
        setError("Impossible de modifier l'ordre.");
        return;
      }

      const next = [...items];

      next[index] = {
        ...current,
        position: targetPosition,
      };

      next[targetIndex] = {
        ...target,
        position: currentPosition,
      };

      [next[index], next[targetIndex]] = [
        next[targetIndex],
        next[index],
      ];

      setItems(next);
    } catch {
      await load();
      setError("Impossible de modifier l'ordre.");
    }
  }

  return (
    <div>
      {/* AJOUT D'UN MÉDIA */}
      <div className="max-w-[720px] rounded-m border border-ink/10 bg-paper p-7">
        <div className="mb-6">
          <h2 className="font-serif text-xl font-semibold">
            Ajouter un média
          </h2>

          <p className="mt-1 text-[13.5px] leading-6 text-inkSoft">
            Ajoute une photo ou une vidéo à la galerie publique.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label>Type</label>

            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="photo">Photo</option>
              <option value="video">Vidéo</option>
            </select>
          </div>

          <div className="field">
            <label>Catégorie</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choisir une catégorie</option>

              {CATEGORY_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="field sm:col-span-2">
            <label>Légende</label>

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ex. Récolte de silures dans nos bassins"
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

        <p className="mt-2 text-[13px] text-inkSoft">
          25 Mo maximum par fichier.
        </p>

        {error && (
          <p className="mt-4 text-[14px] font-semibold text-alert">
            {error}
          </p>
        )}
      </div>

      {/* LISTE */}
      <div className="mt-10">
        <div className="mb-5">
          <h2 className="font-serif text-xl font-semibold">
            Médias de la galerie
          </h2>

          <p className="mt-1 text-[13.5px] text-inkSoft">
            Gère ici les médias visibles sur la page Galerie.
          </p>
        </div>

        {loading ? (
          <p className="text-inkSoft">Chargement...</p>
        ) : items.length === 0 ? (
          <div className="rounded-m border border-dashed border-ink/15 bg-paper p-10 text-center">
            <p className="text-inkSoft">
              Aucun média envoyé pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, index) => {
              const isEditing = editingId === item.id;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-m border border-ink/10 bg-paper"
                >
                  {/* APERÇU */}
                  <div className="relative aspect-square bg-bgAlt">
                    {item.kind === "photo" ? (
                      <img
                        src={item.url}
                        alt={item.caption || "Média Agrofarms237"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="h-full w-full object-cover"
                        controls
                        muted
                      />
                    )}

                    <div className="absolute left-2.5 top-2.5 rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                      {item.kind === "photo" ? "Photo" : "Vidéo"}
                    </div>
                  </div>

                  {/* INFORMATIONS */}
                  <div className="p-4">
                    {isEditing && edit ? (
                      <div className="space-y-4">
                        <div className="field">
                          <label>Catégorie</label>

                          <select
                            value={edit.category}
                            onChange={(e) =>
                              setEdit({
                                ...edit,
                                category: e.target.value,
                              })
                            }
                          >
                            <option value="">Aucune catégorie</option>

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

                        <div className="field">
                          <label>Légende</label>

                          <input
                            value={edit.caption}
                            onChange={(e) =>
                              setEdit({
                                ...edit,
                                caption: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="field">
                          <label>Position</label>

                          <input
                            type="number"
                            value={edit.position}
                            onChange={(e) =>
                              setEdit({
                                ...edit,
                                position: e.target.value,
                              })
                            }
                          />
                        </div>

                        <label className="flex items-center gap-2 text-[13px]">
                          <input
                            type="checkbox"
                            checked={edit.published}
                            onChange={(e) =>
                              setEdit({
                                ...edit,
                                published: e.target.checked,
                              })
                            }
                          />

                          Publié sur le site
                        </label>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => saveEdit(item.id)}
                            disabled={saving}
                            className="btn btn-ink flex-1"
                          >
                            {saving ? "Enregistrement..." : "Enregistrer"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="btn flex-1"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="min-h-[76px]">
                          {item.category && (
                            <p className="text-[11.5px] font-bold uppercase tracking-wide text-goldDeep">
                              {CATEGORY_LABELS[item.category] ||
                                item.category}
                            </p>
                          )}

                          <h3 className="mt-1.5 line-clamp-2 text-[14px] font-semibold">
                            {item.caption || "Sans légende"}
                          </h3>

                          <p className="mt-1 text-[12px] text-inkSoft">
                            Position : {item.position ?? index}
                          </p>
                        </div>

                        {/* PUBLICATION */}
                        <label className="mt-3 flex items-center gap-2 border-t border-ink/10 pt-3 text-[12.5px]">
                          <input
                            type="checkbox"
                            checked={item.published}
                            onChange={(e) =>
                              toggle(item.id, e.target.checked)
                            }
                          />

                          {item.published
                            ? "Publié sur le site"
                            : "Masqué du site"}
                        </label>

                        {/* ORDRE */}
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveItem(index, "up")}
                            disabled={index === 0}
                            className="btn flex-1 text-[12px]"
                          >
                            ↑ Monter
                          </button>

                          <button
                            type="button"
                            onClick={() => moveItem(index, "down")}
                            disabled={index === items.length - 1}
                            className="btn flex-1 text-[12px]"
                          >
                            ↓ Descendre
                          </button>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="btn btn-ink flex-1 text-[12px]"
                          >
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            className="btn flex-1 text-[12px] font-semibold text-alert"
                          >
                            Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
