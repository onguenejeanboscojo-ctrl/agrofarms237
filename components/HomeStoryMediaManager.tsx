"use client";

import { useEffect, useState } from "react";

type StoryMedia = {
  id: string;
  url: string;
  storage_path: string;
  created_at: string;
};

export default function HomeStoryMediaManager() {
  const [media, setMedia] = useState<StoryMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadMedia() {
    try {
      setLoading(true);

      const response = await fetch("/api/home-story-media", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de charger la photo.");
      }

      setMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function uploadPhoto(file: File) {
    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/home-story-media", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Échec de l'envoi.");
      }

      setMessage("Photo ajoutée avec succès.");
      await loadMedia();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setUploading(false);
    }
  }

  async function deletePhoto(id: string) {
    const confirmed = window.confirm(
      "Supprimer cette photo de « Notre histoire » ?"
    );

    if (!confirmed) return;

    try {
      setMessage("");

      const response = await fetch(
        `/api/home-story-media/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Échec de la suppression.");
      }

      setMessage("Photo supprimée.");
      await loadMedia();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    }
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">
          Notre histoire
        </span>

        <h2 className="mt-2 font-serif text-2xl font-semibold text-black">
          Photo de la section
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
          Cette photo est utilisée uniquement dans la section
          « Notre histoire » de la page d’accueil.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed border-black/10 p-8 text-center text-sm text-black/50">
          Chargement…
        </div>
      ) : (
        <>
          {media.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-black/10 bg-[#f8f6f0]"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.url}
                      alt="Notre histoire"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4">
                    <span className="text-sm font-medium text-black">
                      Photo actuelle
                    </span>

                    <button
                      type="button"
                      onClick={() => deletePhoto(item.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-black/15 bg-[#faf9f5] p-8 text-center">
              <p className="text-sm text-black/50">
                Aucune photo n’est encore définie pour cette section.
              </p>
            </div>
          )}

          <div className="mt-6">
            <label
              className={`inline-flex cursor-pointer items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 ${
                uploading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {uploading
                ? "Envoi en cours…"
                : media.length > 0
                ? "Ajouter / remplacer la photo"
                : "Ajouter une photo"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    uploadPhoto(file);
                  }

                  event.currentTarget.value = "";
                }}
              />
            </label>

            <p className="mt-2 text-xs text-black/45">
              JPG, PNG ou WebP — 25 Mo maximum.
            </p>
          </div>
        </>
      )}

      {message && (
        <div className="mt-5 rounded-lg border border-black/10 bg-[#faf9f5] px-4 py-3 text-sm text-black/70">
          {message}
        </div>
      )}
    </section>
  );
}
