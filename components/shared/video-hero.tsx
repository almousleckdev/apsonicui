"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { homepageService } from "@/services/homepage-service";
import { HomeHeroConfig, DEFAULT_HOMEPAGE_CONFIG } from "@/lib/types/homepage";

interface VideoHeroProps {
  initialConfig?: HomeHeroConfig;
}

export const VideoHero: React.FC<VideoHeroProps> = ({
  initialConfig = DEFAULT_HOMEPAGE_CONFIG.hero,
}) => {
  const heroConfig = initialConfig;
  const [currentIndex, setCurrentIndex] = useState(0);
  const locale = useLocale() as "zh" | "en" | "fr";

  const videos = heroConfig.videos && heroConfig.videos.length > 0 ? heroConfig.videos : ["/videos/hero2.mp4", "/videos/723_1770449481.mp4"];
  const interval = heroConfig.interval || 8000;

  const currentTagline =
    (locale === "zh" && heroConfig.taglineZh) ||
    (locale === "fr" && heroConfig.taglineFr) ||
    heroConfig.taglineEn ||
    (locale === "zh" ? "探索品牌" : "Discover Apsonic");

  const currentTitle =
    (locale === "zh" && heroConfig.titleZh) ||
    (locale === "fr" && heroConfig.titleFr) ||
    heroConfig.titleEn ||
    "Good Quality, Good Life";

  const currentSubtitle =
    (locale === "zh" && heroConfig.subtitleZh) ||
    (locale === "fr" && heroConfig.subtitleFr) ||
    heroConfig.subtitleEn ||
    "APSONIC Motorcycles - Built for Africa's Rugged Roads";

  useEffect(() => {
    if (videos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, interval);

    return () => clearInterval(timer);
  }, [videos, interval]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {videos[currentIndex] && (
            videos[currentIndex].match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i) || videos[currentIndex].startsWith('data:image') ? (
              <img
                src={videos[currentIndex]}
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={videos[currentIndex]}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )
          )}
          {/* Gradients overlay for visual contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/40" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Content (100% Original Exact Design) */}
      <div className="absolute inset-0 flex flex-col justify-end pb-32 sm:pb-40 px-6 sm:px-12 md:px-16 max-w-[1360px] mx-auto w-full z-10 select-none pointer-events-none">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-brand-green text-xs font-black uppercase tracking-[0.25em] mb-3"
        >
          {currentTagline}
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 uppercase drop-shadow-md"
        >
          {currentTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-sm sm:text-lg md:text-xl text-zinc-300 max-w-xl font-medium leading-relaxed drop-shadow"
        >
          {currentSubtitle}
        </motion.p>
      </div>

      {/* Progress Slide Indicators (100% Original Exact Design) */}
      {videos.length > 1 && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative h-1 w-16 overflow-hidden rounded-full bg-white/20 transition-all hover:bg-white/40 cursor-pointer"
              aria-label={`Go to video ${index + 1}`}
            >
              {index === currentIndex && (
                <motion.div
                  layoutId="active-hero-progress"
                  className="absolute inset-y-0 left-0 bg-brand-green"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: interval / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
