import React from 'react';
import type { CmsPageSectionDto } from '@/lib/types/cms-page';
import { HeroSection } from './sections/HeroSection';
import { RichTextSection } from './sections/RichTextSection';
import { ImageTextSection } from './sections/ImageTextSection';

interface SectionRendererProps {
  section: CmsPageSectionDto;
  locale: 'en' | 'fr' | 'zh';
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ section, locale }) => {
  const { sectionType, configuration } = section;

  switch (sectionType) {
    case 'HERO':
      return <HeroSection config={configuration} locale={locale} />;
    case 'RICH_TEXT':
      return <RichTextSection config={configuration} locale={locale} />;
    case 'IMAGE_TEXT':
      return <ImageTextSection config={configuration} locale={locale} imagePosition="left" />;
    case 'TEXT_IMAGE':
      return <ImageTextSection config={configuration} locale={locale} imagePosition="right" />;
    default:
      return (
        <div className="py-20 text-center bg-gray-50 border border-dashed border-gray-300">
          <p className="text-gray-500">Section Type "{sectionType}" is not yet implemented.</p>
        </div>
      );
  }
};
