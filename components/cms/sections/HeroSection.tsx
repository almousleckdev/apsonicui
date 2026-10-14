import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  config: any;
  locale: 'en' | 'fr' | 'zh';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, locale }) => {
  const heading = config.heading?.[locale] || '';
  const subheading = config.subheading?.[locale] || '';
  const ctaText = config.ctaText?.[locale] || '';
  const ctaLink = config.ctaLink || '';
  const bgImage = config.backgroundImageUrl || '/images/hero-bg-default.jpg';

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-10 bg-black/50" />
      
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6">
        {heading && (
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            {heading}
          </h1>
        )}
        {subheading && (
          <p className="text-lg md:text-xl text-gray-200">
            {subheading}
          </p>
        )}
        {ctaText && ctaLink && (
          <div className="pt-4">
            <Link 
              href={ctaLink}
              className="inline-block px-8 py-4 bg-apsonic-accent text-white font-semibold rounded hover:bg-red-700 transition-colors"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
