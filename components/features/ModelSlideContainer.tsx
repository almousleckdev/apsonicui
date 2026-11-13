"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCrossfadeLayers } from "@/hooks/useCrossfadeLayers";
import { bypassImageOptimizer } from "@/lib/media/safe-path";
import type { HomeFeaturedModelItem } from "@/lib/types/homepage";

interface ModelSlideContainerProps {
  currentModel: Pick<HomeFeaturedModelItem, 'id' | 'name' | 'href'>;
  activeImage: string;
  /** Pictures that may be shown next (the next colour, the next model): loaded in advance so the swap is instant. */
  preloadImages: string[];
  background: string;
  preloadBackgrounds: string[];
  onPrev: () => void;
  onNext: () => void;
}

// One easing and one duration for everything: a slow, soft dissolve with the new picture settling in from slightly larger.
const FADE =
  "transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none will-change-[opacity,transform]";

export const ModelSlideContainer: React.FC<ModelSlideContainerProps> = ({
  currentModel,
  activeImage,
  preloadImages,
  background,
  preloadBackgrounds,
  onPrev,
  onNext,
}) => {
  const bikes = useCrossfadeLayers(activeImage, preloadImages);
  const backgrounds = useCrossfadeLayers(background, preloadBackgrounds);

  return (
    <div className="relative w-full max-w-[1100px] mx-auto flex items-center justify-between gap-4 h-[260px] sm:h-[400px] lg:h-[480px]">
      <button
        onClick={onPrev}
        className="hidden md:flex w-12 h-12 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer shadow-sm z-20 shrink-0"
        aria-label="Previous model"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <Link
        href={currentModel.href || "/products"}
        className="flex-1 h-full relative flex items-center justify-center cursor-pointer z-10 overflow-visible"
      >
        {/* Background pictures: faint, cross-faded, never removed from the page. */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {backgrounds.mounted.map((src) => {
            const isShown = src === backgrounds.shown;
            return (
              <div
                key={src}
                data-layer="background"
                data-shown={isShown}
                className={`absolute inset-0 ${FADE} ${isShown ? "opacity-[0.14] sm:opacity-[0.18]" : "opacity-0"}`}
              >
                <div className="relative w-full h-full transform scale-110 sm:scale-125">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-contain"
                    unoptimized={bypassImageOptimizer(src)}
                    onLoad={() => backgrounds.markLoaded(src)}
                    onError={() => backgrounds.markLoaded(src)}
                    ref={(el) => {
                      if (el?.complete) backgrounds.markLoaded(src);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* A soft, fixed shadow under the bike. It does not animate, so the fade stays smooth (no filter on the picture). */}
        <div className="pointer-events-none absolute bottom-[9%] left-1/2 z-0 h-5 w-[55%] -translate-x-1/2 rounded-full bg-black/10 blur-2xl" />

        <div className="relative w-[90%] h-[90%] z-10 flex items-center justify-center overflow-visible">
          {bikes.mounted.map((src) => {
            const isShown = src === bikes.shown;
            return (
              <div
                key={src}
                data-layer="bike"
                data-shown={isShown}
                aria-hidden={!isShown}
                className={`absolute inset-0 ${FADE} ${isShown ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"}`}
              >
                <Image
                  src={src}
                  alt={isShown ? currentModel.name : ""}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                  onLoad={() => bikes.markLoaded(src)}
                  onError={() => bikes.markLoaded(src)}
                  ref={(el) => {
                    if (el?.complete) bikes.markLoaded(src);
                  }}
                />
              </div>
            );
          })}
        </div>
      </Link>

      <button
        onClick={onNext}
        className="hidden md:flex w-12 h-12 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer shadow-sm z-20 shrink-0"
        aria-label="Next model"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
