"use client";
import { useState } from "react";

// Carrousel navigable pour la section "Notre production" : contrairement au
// diaporama du hero (qui défile tout seul), ici c'est le visiteur qui clique
// sur les flèches pour voir les différentes photos.
export default function ProductCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-m">
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/55 text-paper hover:bg-ink/75"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/55 text-paper hover:bg-ink/75"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Aller à la photo ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-paper" : "bg-paper/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
