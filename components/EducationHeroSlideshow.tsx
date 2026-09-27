"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = {
  url: string;
  alt: string;
};

export default function EducationHeroSlideshow({
  slides,
}: {
  slides: Slide[];
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-l bg-[radial-gradient(120%_140%_at_15%_0%,#2A5E56_0%,#0E2622_65%,#081815_100%)]">
        <span className="font-serif text-3xl text-paper/80">
          AgroFarms237
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-l border border-paper/10 bg-ink">
      {slides.map((slide, index) => (
        <div
          key={`${slide.url}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.url}
            alt={slide.alt}
            fill
            unoptimized
            priority={index === 0}
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        </div>
      ))}

      {/* INDICATEURS */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              aria-label={`Afficher l’image ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === active
                  ? "w-8 bg-gold"
                  : "w-1.5 bg-paper/60 hover:bg-paper"
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute left-5 top-5 z-10 rounded-full bg-ink/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-paper backdrop-blur">
        AgroFarms237
      </div>
    </div>
  );
}
