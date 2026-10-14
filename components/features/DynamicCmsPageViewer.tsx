'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { CmsPageDto, CmsPageSectionDto, Locale } from '@/lib/types/cms-page';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface DynamicCmsPageViewerProps {
  page: CmsPageDto;
}

export const DynamicCmsPageViewer: React.FC<DynamicCmsPageViewerProps> = ({ page }) => {
  const locale = useLocale() as Locale;
  const sections = page.sections || [];

  return (
    <div className="w-full bg-white flex flex-col min-h-screen">
      {/* Dynamic Sections */}
      {sections.map((section, idx) => (
        <CmsSectionRenderer key={section.id || idx} section={section} locale={locale} />
      ))}
    </div>
  );
};

const CmsSectionRenderer: React.FC<{ section: CmsPageSectionDto; locale: Locale }> = ({ section, locale }) => {
  const config = section.configuration || {};
  const translations = config.translations || {};
  const t = translations[locale] || {};

  switch (section.sectionType) {
    case 'HERO':
      return (
        <section className="relative w-full h-[70vh] min-h-[500px] flex items-center bg-zinc-950 overflow-hidden">
          {config.backgroundImage && (
            config.backgroundImage.match(/\.(mp4|webm)$/i) ? (
              <video src={config.backgroundImage} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <Image src={config.backgroundImage} alt="Hero" fill className="object-cover opacity-60" />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-20">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4 drop-shadow-md">
              {t.title}
            </h1>
            {t.subtitle && (
              <p className="text-lg md:text-xl text-zinc-300 font-medium max-w-2xl mb-8 drop-shadow">
                {t.subtitle}
              </p>
            )}
            {config.ctaLink && t.ctaText && (
              <Link href={config.ctaLink} className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-wide text-sm transition-transform hover:scale-105">
                {t.ctaText} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>
      );

    case 'IMAGE_TEXT':
      const isLeft = config.layout !== 'text-left';
      return (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
              <div className={`relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-zinc-100 ${isLeft ? 'order-1' : 'order-1 lg:order-2'}`}>
                {config.image && (
                  <Image src={config.image} alt={t.title || 'Section Image'} fill className="object-cover" />
                )}
              </div>
              <div className={`flex flex-col justify-center ${isLeft ? 'order-2' : 'order-2 lg:order-1'}`}>
                <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-6 uppercase tracking-tight">
                  {t.title}
                </h2>
                <div className="prose prose-zinc prose-lg">
                  <p className="text-zinc-600 font-medium leading-relaxed">{t.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );

    case 'RICH_TEXT':
      return (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="prose prose-zinc prose-lg max-w-none text-zinc-800" dangerouslySetInnerHTML={{ __html: t.content || '' }} />
          </div>
        </section>
      );

    case 'VIDEO':
      return (
        <section className="py-24 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
            {t.title && <h2 className="text-3xl font-black text-white mb-10 uppercase tracking-wide">{t.title}</h2>}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl border border-zinc-800 group">
              {config.videoUrl && (
                <video src={config.videoUrl} poster={config.thumbnail} controls className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
};
