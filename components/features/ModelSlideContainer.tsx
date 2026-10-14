"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HomeFeaturedModelItem } from "@/lib/types/homepage";

interface ModelSlideContainerProps {
  currentModel: Pick<HomeFeaturedModelItem, 'id' | 'name' | 'image' | 'watermark' | 'href'>;
  activeImage: string;
  direction: number;
  onPrev: () => void;
  onNext: () => void;
}

export const ModelSlideContainer: React.FC<ModelSlideContainerProps> = ({
  currentModel,
  activeImage,
  direction,
  onPrev,
  onNext,
}) => {
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
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -180 : 180,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  const isRemoteUpload =
    activeImage?.startsWith("http://") ||
    activeImage?.startsWith("https://") ||
    activeImage?.startsWith("/uploads") ||
    activeImage?.startsWith("data:");

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
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.04] sm:opacity-[0.06] select-none">
          <div className="relative w-full h-full transform scale-110 sm:scale-125">
            <Image src="/images/brand/ALOBA底图 (1).png" alt="" fill className="object-contain" priority />
          </div>
        </div>

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
                loading="eager"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </motion.div>
          </AnimatePresence>
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
