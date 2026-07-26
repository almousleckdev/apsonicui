"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { DEFAULT_FEATURED_MODELS } from "@/lib/data/featured-models";
import { useCarousel } from "@/hooks/useCarousel";
import { ENTERPRISE_EASE } from "@/lib/constants/animations";
import { cn } from "@/lib/utils";

interface RecommendedModelsProps {
  className?: string;
}

export const RecommendedModels: React.FC<RecommendedModelsProps> = ({ className }) => {
  const locale = useLocale();
  const models = DEFAULT_FEATURED_MODELS;

  const { currentIndex, goToSlide, nextSlide, prevSlide, pause, resume } = useCarousel({
    itemsCount: models.length,
    autoPlay: true,
    interval: 8000,
  });

  const [selectedColorImages, setSelectedColorImages] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev

  const currentModel = models[currentIndex];
  const activeImage = selectedColorImages[currentModel.id] || currentModel.image;

  const handleColorSelect = (image: string) => {
    setSelectedColorImages((prev) => ({
      ...prev,
      [currentModel.id]: image,
    }));
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

  // Slide left/right transitions for bike image
  const bikeVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 180 : -180,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const, // premium easeOutQuart
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -180 : 180,
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  // Slide up/down transitions for model names
  const nameVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -20 : 20,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section
      className={cn("w-full py-20 bg-white overflow-hidden select-none border-b border-zinc-100", className)}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-6">
          <span className="font-extrabold text-xs uppercase tracking-[0.25em] text-brand-green">
            {locale === "zh" ? "车型推荐" : "Recommended Models"}
          </span>
        </div>

        {/* Model Name Banner */}
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

        {/* Bike Slide Container */}
        <div className="relative w-full max-w-[1100px] mx-auto flex items-center justify-between gap-4 h-[260px] sm:h-[400px] lg:h-[480px]">
          
          {/* Prev Slide button (Desktop Only) */}
          <button
            onClick={handlePrev}
            className="hidden md:flex w-12 h-12 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer shadow-sm z-20 shrink-0"
            aria-label="Previous model"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Bike Images with custom watermark backgrounds */}
          <Link
            href={currentModel.href || "/products"}
            className="flex-1 h-full relative flex items-center justify-center cursor-pointer z-10 overflow-visible"
          >
            {/* Background Branding watermark */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.04] sm:opacity-[0.06] select-none">
              <div className="relative w-full h-full transform scale-110 sm:scale-125">
                <Image
                  src="/images/brand/ALOBA底图 (1).png"
                  alt=""
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Layered Bike image with framer motion slide */}
            <div className="relative w-[90%] h-[90%] z-10 flex items-center justify-center overflow-visible">
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={`${currentModel.id}_${activeImage}`}
                  custom={direction}
                  variants={bikeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={activeImage}
                    alt={currentModel.name}
                    fill
                    className="object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:drop-shadow-[0_20px_32px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Link>

          {/* Next Slide button (Desktop Only) */}
          <button
            onClick={handleNext}
            className="hidden md:flex w-12 h-12 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 hover:scale-105 active:scale-95 items-center justify-center transition-all cursor-pointer shadow-sm z-20 shrink-0"
            aria-label="Next model"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden justify-center gap-4 mt-6 mb-4">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 flex items-center justify-center active:bg-zinc-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-zinc-200 bg-white text-zinc-800 flex items-center justify-center active:bg-zinc-50 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel indicators (dots according to active bike) */}
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
                {/* Background dot */}
                <span className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
                  isActive ? "bg-transparent" : "bg-zinc-300 hover:bg-zinc-400"
                )} />
                {/* Stretching active dot */}
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

        {/* Color selectors */}
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
                  <span
                    className="w-4 h-4 rounded-full shadow-inner block"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* View All Button */}
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
