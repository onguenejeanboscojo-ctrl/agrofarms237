"use client";

import { useEffect, useState } from "react";

type HeroSlideshowProps = { images: string[] };

/** Diaporama en fondu enchaîné utilisé par le Hero et les sections photo. */
export default function HeroSlideshow({ images }: HeroSlideshowProps) {
  const validImages = Array.from(new Set(images.filter((src) => typeof src === "string" && src.trim().length > 0)));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (validImages.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % validImages.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [validImages.length, validImages.join("|")]);

  if (validImages.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-label="Diaporama photo">
      {validImages.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
