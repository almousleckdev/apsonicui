"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { DEFAULT_FEATURED_MODELS } from "@/lib/data/featured-models";
import { useCarousel } from "@/hooks/useCarousel";
import { ModelSlideContainer } from "./ModelSlideContainer";
import { cn } from "@/lib/utils";
import { HomeFeaturedModelItem } from "@/lib/types/homepage";

interface RecommendedModelsProps {
  className?: string;
  initialConfig?: HomeFeaturedModelItem[];
}

export const RecommendedModels: React.FC<RecommendedModelsProps> = ({ className, initialConfig }) => {
  const locale = useLocale();
  const models = initialConfig && initialConfig.length > 0 ? initialConfig : DEFAULT_FEATURED_MODELS;

  const { currentIndex, goToSlide, nextSlide, prevSlide, pause, resume } = useCarousel({
    itemsCount: models.length,
    autoPlay: true,
    interval: 8000,
  });

  const [selectedColorImages, setSelectedColorImages] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<number>(1);

  const currentModel = models[currentIndex] || models[0];
  const activeImage = selectedColorImages[currentModel.id] || currentModel.image;

  const handleColorSelect = (image: string) => {
    setSelectedColorImages((prev) => ({ ...prev, [currentModel.id]: image }));
  };

  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  const handleGoTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    goToSlide(index);
  };

  const nameVariants = {
    enter: (dir: number) => ({ y: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
    exit: (dir: number) => ({ y: dir > 0 ? -20 : 20, opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }),
  };

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

        <div className="text-center mb-8 h-16 relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.h3
              key={currentModel.id}
              custom={direction}
              variants={nameVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 uppercase absolute"
            >
              {currentModel.name}
            </motion.h3>
          </AnimatePresence>
        </div>

        <ModelSlideContainer
          currentModel={currentModel}
          activeImage={activeImage}
          direction={direction}
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

        <div className="flex justify-center gap-4 mt-4 mb-8 h-4 items-center">
          {models.map((model, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={model.id}
                onClick={() => handleGoTo(idx)}
                className="relative w-3.5 h-3.5 cursor-pointer outline-none flex items-center justify-center"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span className={cn("w-2 h-2 rounded-full transition-colors duration-300", isActive ? "bg-transparent" : "bg-zinc-300 hover:bg-zinc-400")} />
                {isActive && (
                  <motion.span
                    layoutId="activeModelDot"
                    className="absolute h-2 w-5 bg-brand-green rounded-full z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {currentModel.colors && currentModel.colors.length > 0 && (
          <div className="flex justify-center gap-3.5 mb-10 mt-4">
            {currentModel.colors.map((color) => {
              const isSelected = activeImage === color.image;
              return (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color.image)}
                  className={cn(
                    "relative p-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer border border-transparent",
                    isSelected && "border-zinc-400"
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
