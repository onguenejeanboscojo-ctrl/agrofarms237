"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Module = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  lessonCount: number;
};

type Props = {
  modules: Module[];
};

export default function EducationModulesHeroSlideshow({
  modules,
}: Props) {
  const [active, setActive] = useState(0);

  const slides = modules.filter(
    (module) =>
      module.image_url &&
      module.image_url.trim() !== ""
  );

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActive((current) => {
        if (current >= slides.length - 1) {
          return 0;
        }

        return current + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[30px] bg-ink text-paper">
        <div className="text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            AgroFarms237
          </span>

          <p className="mt-3 font-serif text-2xl font-semibold">
            Nos formations agricoles
          </p>
        </div>
      </div>
    );
  }

  const currentModule = slides[active] || slides[0];

  return (
    <div className="relative min-h-[480px] overflow-hidden rounded-[30px] bg-ink md:min-h-[520px]">
      {slides.map((module, index) => (
        <div
          key={module.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={module.image_url as string}
            alt={module.title}
            fill
            priority={index === 0}
            unoptimized
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#061512]/90 via-[#061512]/15 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061512]/65 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-9">
        <div className="max-w-[650px]">
          <span className="mb-3 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            <span className="h-px w-7 bg-gold" />
            Formation AgroFarms237
          </span>

          <h2 className="font-serif text-[clamp(32px,5vw,54px)] font-semibold leading-[1.02] text-white">
            {currentModule.title}
          </h2>

          {currentModule.description && (
            <p className="mt-4 max-w-[560px] text-[14px] leading-6 text-white/80 md:text-[15px]">
              {currentModule.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md">
              {currentModule.lessonCount} cours
            </span>

            <Link
              href={`/espace-education/${currentModule.slug}`}
              className="inline-flex items-center rounded-full bg-gold px-5 py-2.5 text-[12px] font-bold text-ink transition hover:scale-[1.02] hover:bg-gold/90"
            >
              Découvrir les cours
              <span className="ml-2 text-base">→</span>
            </Link>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-7 flex items-center gap-2">
            {slides.map((module, index) => (
              <button
                key={module.id}
                type="button"
                aria-label={`Afficher ${module.title}`}
                onClick={() => setActive(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === active
                    ? "w-10 bg-gold"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80 backdrop-blur-md md:right-7 md:top-7">
        {String(active + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </div>

      <div className="absolute left-5 top-5 z-10 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80 backdrop-blur-md md:left-7 md:top-7">
        AgroFarms237
      </div>
    </div>
  );
}
