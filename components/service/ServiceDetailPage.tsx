"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Play, Image as ImageIcon, Calendar, FileText, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { VideoPlayer } from "@/components/ui/video-player";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import type { CategoryData } from "@/lib/data/service-detail-data";
import { cn } from "@/lib/utils";

interface ServiceDetailPageProps {
  title: string;
  data: Record<string, CategoryData>;
  heroImage: string;
  heroColor?: string;
  accentColor?: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  title,
  data,
  heroImage,
  heroColor = "#09090b", // zinc-950
  accentColor = "#1fa84f", // brand green
}) => {
  const t = useTranslations("serviceDetail");
  const categories = Object.keys(data);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [hasScrolledForTab, setHasScrolledForTab] = useState<boolean>(false);

  const currentData = data[selectedCategory];
  const { isVisible: isHeaderVisible } = useScrollDirection();
  
  const sectionAnchorRef = useRef<HTMLDivElement>(null);

  // Resolve category hero background image dynamically
  const activeHeroImage =
    currentData.manuals[0]?.imageUrl || currentData.images[0] || heroImage;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Scroll to section start on category change to prevent manuals from being hidden
  useEffect(() => {
    if (hasScrolledForTab && sectionAnchorRef.current) {
      const headerOffset = isHeaderVisible ? 160 : 80; // account for navbar + category bar height
      const elementPosition = sectionAnchorRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setHasScrolledForTab(true);
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-zinc-50 select-none pb-24">
      
      {/* 1. Cinematic Hero Section */}
      <div className="relative min-h-[50vh] sm:h-[60vh] w-full overflow-hidden flex items-center bg-zinc-950 py-16">
        {/* Glowing Ambient Light */}
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 75% 50%, ${accentColor}30, transparent 50%), ${heroColor}`,
          }}
        />

        {/* Dynamic Background Image overlay with crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHeroImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.18, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={activeHeroImage}
              alt={title}
              fill
              className="object-contain translate-x-1/4 translate-y-12"
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent z-5" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col justify-between h-full pt-10">
          {/* Back button */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-10 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            {t("back")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider mb-6"
              style={{
                backgroundColor: `${accentColor}1A`,
                borderColor: `${accentColor}30`,
                color: accentColor,
              }}
            >
              {t("tag")}
            </div>
            <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
              {title}
            </h1>
            <p className="text-zinc-400 max-w-md mt-4 text-xs sm:text-sm leading-relaxed font-semibold">
              {t("desc")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Anchor point to scroll window on category tab switches */}
      <div ref={sectionAnchorRef} className="w-full h-px" />

      {/* 2. Category Nav Tabs - sticky with dynamic top offset relative to header direction */}
      {categories.length > 1 && (
        <div
          className={cn(
            "sticky transition-all duration-300 z-40 bg-white/95 border-b border-zinc-200/50 backdrop-blur-md shadow-sm",
            isHeaderVisible ? "top-20" : "top-0"
          )}
        >
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 sm:gap-12 overflow-x-auto no-scrollbar justify-start sm:justify-center">
              {categories.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    "px-1 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all relative cursor-pointer whitespace-nowrap",
                    selectedCategory === key ? "text-brand-green" : "text-zinc-400 hover:text-zinc-900"
                  )}
                >
                  {data[key].title}
                  {selectedCategory === key && (
                    <motion.div
                      layoutId="activeSubTab"
                      className="absolute bottom-0 inset-x-0 h-[3px] bg-brand-green rounded-full shadow-[0_0_8px_rgba(31,168,79,0.4)]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Wrapper */}
      <div key={selectedCategory} className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-24">
        
        {/* PDF Manuals Section */}
        <div>
          <div className="flex items-center gap-3.5 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-wide">
                {t("manuals")}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentData.manuals.map((manual, idx) => (
              <motion.div
                key={manual.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 transition-all bg-white border border-zinc-100 hover:border-zinc-200/80 shadow-sm hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => openLightbox(idx)}
                    className="relative aspect-[4/3] w-full mb-6 rounded-2xl overflow-hidden bg-zinc-50/50 flex items-center justify-center p-6 cursor-zoom-in border border-zinc-100/50"
                  >
                    <Image
                      src={manual.imageUrl}
                      alt={manual.title}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2 group-hover:text-brand-green transition-colors">
                    {manual.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed text-xs font-semibold mb-6">
                    {manual.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-zinc-100/80 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-widest flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {t("updated")} {manual.updated}
                    </span>
                  </div>
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => window.open(manual.pdfUrl, "_blank")}
                    className="rounded-xl px-4 h-9 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t("download")}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Assembly Guides */}
        {currentData.videos && currentData.videos.length > 0 && (
          <div>
            <div className="flex items-center gap-3.5 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-wide">
                  {t("videos")}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentData.videos.map((video) => (
                <div key={video.id}>
                  <VideoPlayer
                    youtubeId={video.youtubeId}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    description={video.description}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Structural / Exploded View Diagrams */}
        {currentData.images && currentData.images.length > 0 && (
          <div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div className="max-w-md">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">
                    {t("gallery")}
                  </h2>
                </div>
                <p className="text-zinc-500 text-xs font-semibold leading-relaxed">
                  {t("galleryDesc")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {currentData.images.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => openLightbox(idx)}
                  className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-zinc-200/50 flex items-center justify-center p-6 cursor-zoom-in group shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Image
                    src={img}
                    alt={`${currentData.title} Details ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 200px"
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-extrabold uppercase tracking-widest bg-zinc-900/90 px-3.5 py-1.5 rounded-full border border-zinc-800 backdrop-blur-sm">
                      {t("inspect")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={currentData.images}
        currentIndex={lightboxIndex}
        onChangeIndex={setLightboxIndex}
      />
    </main>
  );
};
