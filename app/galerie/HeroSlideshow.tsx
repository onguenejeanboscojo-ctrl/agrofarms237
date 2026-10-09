"use client";

import { useEffect, useState } from "react";

type Slide = {
  id: string;
  url: string;
  caption?: string | null;
};

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#10271F]" aria-label="Diaporama des photos de la galerie">
      {slides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.url}
          alt={slide.caption || "Photographie de la galerie AgroFarms237"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-in-out ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          aria-hidden={index !== activeIndex}
        />
      ))}
    </div>
  );
}
