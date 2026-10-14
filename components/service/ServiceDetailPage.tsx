'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Play, Calendar, FileText, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { VideoPlayer } from '@/components/ui/video-player';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import type { CategoryData } from '@/lib/data/service-detail-data';
import { ServiceCategoryTabs } from './ServiceCategoryTabs';

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
  heroColor = '#09090b',
  accentColor = '#1fa84f',
}) => {
  const t = useTranslations('serviceDetail');
  const categories = Object.keys(data);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const hasScrolledForTab = useRef(false); // skip the scroll on first render, scroll on later tab changes

  const currentData = data[selectedCategory];
  const { isVisible: isHeaderVisible } = useScrollDirection();
  const sectionAnchorRef = useRef<HTMLDivElement>(null);

  const activeHeroImage =
    currentData.manuals[0]?.imageUrl || currentData.images[0] || heroImage;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    if (hasScrolledForTab.current && sectionAnchorRef.current) {
      const headerOffset = isHeaderVisible ? 160 : 80;
      const elementPosition = sectionAnchorRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    hasScrolledForTab.current = true;
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-zinc-50 select-none pb-24 font-sans">
      {/* 1. Cinematic Hero Section */}
      <div className="relative min-h-[50vh] sm:h-[60vh] w-full overflow-hidden flex items-center bg-zinc-950 py-16">
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 75% 50%, ${accentColor}30, transparent 50%), ${heroColor}`,
          }}
        />

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
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest mb-10 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            {t('back')}
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
              {t('tag')}
            </div>
            <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
              {title}
            </h1>
            <p className="text-zinc-400 max-w-md mt-4 text-xs sm:text-sm leading-relaxed font-semibold">
              {t('desc')}
            </p>
          </motion.div>
        </div>
      </div>

      <div ref={sectionAnchorRef} className="w-full h-px" />

      {/* 2. Category Nav Tabs */}
      <ServiceCategoryTabs
        categories={categories}
        data={data}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isHeaderVisible={isHeaderVisible}
      />

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
                {t('manuals')}
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
                    className="relative h-44 w-full rounded-2xl overflow-hidden mb-6 bg-zinc-100 cursor-pointer"
                  >
                    <Image
                      src={manual.imageUrl}
                      alt={manual.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    PDF Manual • {manual.size}
                  </span>
                  <h3 className="text-base font-extrabold text-zinc-900 group-hover:text-brand-green transition-colors">
                    {manual.title}
                  </h3>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {manual.updated}
                  </span>
                  <a
                    href={manual.pdfUrl}
                    download
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold shadow-md hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Tutorials Section */}
        {currentData.videos && currentData.videos.length > 0 && (
          <div>
            <div className="flex items-center gap-3.5 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                <Play className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-wide">
                Video Guides
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentData.videos.map((vid) => (
                <div key={vid.id} className="rounded-3xl overflow-hidden bg-white border border-zinc-100 shadow-sm p-4">
                  <VideoPlayer youtubeId={vid.youtubeId} thumbnail={vid.thumbnail} title={vid.title} />
                  <div className="p-4">
                    <h4 className="font-extrabold text-sm text-zinc-900">{vid.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{vid.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Lightbox */}
        <ImageLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={currentData.images}
          currentIndex={lightboxIndex}
          onChangeIndex={setLightboxIndex}
        />
      </div>
    </main>
  );
};
