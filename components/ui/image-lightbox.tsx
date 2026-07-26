"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onChangeIndex: (index: number) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onChangeIndex,
}) => {
  // Prevent body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keypress listener for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images]);

  const handleNext = () => {
    if (images.length === 0) return;
    const nextIdx = (currentIndex + 1) % images.length;
    onChangeIndex(nextIdx);
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    onChangeIndex(prevIdx);
  };

  const activeSrc = images[currentIndex] || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-between bg-black/95 p-4 md:p-10"
        >
          {/* Backdrop Close Click */}
          <div className="absolute inset-0 z-0 cursor-zoom-out" onClick={onClose} />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 hover:bg-white/10 rounded-full transition-colors z-[110] cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Navigation Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="relative z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-all cursor-pointer backdrop-blur-md"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Image Display */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full h-[70vh] flex items-center justify-center z-5 pointer-events-none select-none max-w-4xl mx-auto"
          >
            <Image
              src={activeSrc}
              alt={`Gallery Image ${currentIndex + 1}`}
              fill
              className="object-contain p-2"
              sizes="90vw"
            />
          </motion.div>

          {/* Right Navigation Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="relative z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 transition-all cursor-pointer backdrop-blur-md"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Index Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-white/10 border border-white/5 text-[10px] font-black tracking-widest text-white/70 uppercase">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
