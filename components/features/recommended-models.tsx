"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { DEFAULT_FEATURED_MODELS } from "@/lib/data/featured-models";
import { useCarousel } from "@/hooks/useCarousel";
import { ModelSlideContainer } from "./ModelSlideContainer";
import { cn } from "@/lib/utils";
import { HomeFeaturedModelItem } from "@/lib/types/homepage";
import { isSafeImagePath } from "@/lib/media/safe-path";

const AUTOPLAY_MS = 10_000;

interface RecommendedModelsProps {
  className?: string;
  initialConfig?: HomeFeaturedModelItem[];
}

export const RecommendedModels: React.FC<RecommendedModelsProps> = ({ className, initialConfig }) => {
  const locale = useLocale();
  // A model the editor has added but not yet given a picture cannot be shown.
  const withPicture = initialConfig?.filter((m) => m.image);
  const models = withPicture && withPicture.length > 0 ? withPicture : DEFAULT_FEATURED_MODELS;

  // Index and pause state come from the shared hook; the timing is done below so a tick can step through the colours.
  const { currentIndex, nextSlide, prevSlide, pause, resume, isPaused } = useCarousel({
    itemsCount: models.length,
    autoPlay: false,
  });

  const [selectedColorImages, setSelectedColorImages] = useState<Record<string, string>>({});

  const currentModel = models[currentIndex] || models[0];
  const activeImage = selectedColorImages[currentModel.id] || currentModel.image;

  // Each model has its own background; empty means none. Only safe site paths are used.
  const backgroundOf = (model: HomeFeaturedModelItem) => (isSafeImagePath(model.background) ? model.background! : "");

  const handleColorSelect = (image: string) => {
    setSelectedColorImages((prev) => ({ ...prev, [currentModel.id]: image }));
  };

  // A model always opens on its own first picture, never on a colour chosen the last time it was shown.
  const resetModelColor = (modelId: string) =>
    setSelectedColorImages((prev) => {
      if (!(modelId in prev)) return prev;
      const rest = { ...prev };
      delete rest[modelId];
      return rest;
    });

  const handleNext = () => {
    resetModelColor(models[(currentIndex + 1) % models.length].id);
    nextSlide();
  };

  const handlePrev = () => {
    resetModelColor(models[(currentIndex - 1 + models.length) % models.length].id);
    prevSlide();
  };

  // What the autoplay shows after this picture: the next colour of this model, or the first picture of the next model.
  // A colour the editor has added but not yet given a picture cannot be shown.
  const colors = (currentModel.colors ?? []).filter((c) => c.image);
  const colorAt = colors.findIndex((c) => c.image === activeImage);
  const nextColorImage = colors.length > 0 && colorAt < colors.length - 1 ? colors[colorAt + 1].image : undefined;
  const nextModel = models[(currentIndex + 1) % models.length];
  const upcomingImage = nextColorImage ?? nextModel.image;
  const isSingleStill = models.length <= 1 && colors.length <= 1;

  // Every 10 seconds the picture changes together with its colour dot. Any change (arrow, colour dot, autoplay)
  // restarts the 10 seconds; hovering the section pauses it.
  useEffect(() => {
    if (isPaused || isSingleStill) return;
    const timer = setTimeout(() => (nextColorImage ? handleColorSelect(nextColorImage) : handleNext()), AUTOPLAY_MS);
    return () => clearTimeout(timer);
    // handleNext / handleColorSelect only close over the values listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, isSingleStill, currentIndex, activeImage, nextColorImage]);

  if (!currentModel) return null;

  return (
    <section
      className={cn("w-full py-20 bg-white overflow-hidden select-none border-b border-zinc-100", className)}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {locale === "zh" ? "车型推荐" : "Recommended Models"}
          </span>
        </div>

        {/* Every model name stays in the page and only fades, so the name changes together with the picture. */}
        <div className="text-center mb-8 h-16 relative flex items-center justify-center overflow-hidden">
          {models.map((model) => {
            const isActive = model.id === currentModel.id;
            return (
              <h3
                key={model.id}
                aria-hidden={!isActive}
                data-active={isActive}
                className={cn(
                  "absolute text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 uppercase transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isActive ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
                )}
              >
                {model.name}
              </h3>
            );
          })}
        </div>

        <ModelSlideContainer
          currentModel={currentModel}
          activeImage={activeImage}
          preloadImages={[upcomingImage, ...colors.map((c) => c.image)]}
          background={backgroundOf(currentModel)}
          preloadBackgrounds={[backgroundOf(nextModel)]}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="flex md:hidden justify-center gap-4 mt-6 mb-4">
          <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 flex items-center justify-center active:bg-zinc-50 transition-colors cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={handleNext} className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 flex items-center justify-center active:bg-zinc-50 transition-colors cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {colors.length > 0 && (
          <div className="flex justify-center gap-3.5 mb-10 mt-8">
            {colors.map((color) => {
              const isSelected = activeImage === color.image;
              return (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color.image)}
                  className={cn(
                    "relative p-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer border border-transparent",
                    isSelected && "border-zinc-500 scale-110"
                  )}
                  aria-label={`Select ${color.name}`}
                >
                  <span className="w-4 h-4 rounded-full shadow-inner block" style={{ backgroundColor: color.hex }} />
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-200 hover:border-brand-green hover:text-brand-green bg-white text-zinc-600 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            {locale === "zh" ? "查看全部车型" : "All Models"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
