'use client';

import type { ComponentType } from 'react';
import { AlignLeft, Award, Columns2, Film, Images, LayoutGrid, Layers, MapPin, Megaphone, MessageSquareQuote, Newspaper, Phone, Rows3, Wrench, Image as ImageIcon, BarChart3, HelpCircle, type LucideIcon } from 'lucide-react';
import type { SectionProps } from './shared';
import { Hero } from './sections/Hero';
import { RichText } from './sections/RichText';
import { TextImage } from './sections/TextImage';
import { Gallery } from './sections/Gallery';
import { Video } from './sections/Video';
import { FeatureGrid } from './sections/FeatureGrid';
import { Stats } from './sections/Stats';
import { ProductShowcase } from './sections/ProductShowcase';
import { ServiceShowcase } from './sections/ServiceShowcase';
import { CtaBanner } from './sections/CtaBanner';
import { Testimonials } from './sections/Testimonials';
import { NewsList } from './sections/NewsList';
import { Faq } from './sections/Faq';
import { Dealers } from './sections/Dealers';
import { ContactBlock } from './sections/ContactBlock';
import { Spacer } from './sections/Spacer';

/**
 * Presentation side of the section registry: which component draws a section type and which icon the editor shows.
 * The fields, limits and defaults of each type live on the backend and arrive from /admin/pages/section-types.
 * Adding a section type = a backend definition + one entry here.
 */
export interface SectionPresentation {
  Component: ComponentType<SectionProps>;
  Icon: LucideIcon;
}

export const SECTION_REGISTRY: Record<string, SectionPresentation> = {
  hero: { Component: Hero, Icon: ImageIcon },
  'rich-text': { Component: RichText, Icon: AlignLeft },
  'text-image': { Component: TextImage, Icon: Columns2 },
  gallery: { Component: Gallery, Icon: Images },
  video: { Component: Video, Icon: Film },
  'feature-grid': { Component: FeatureGrid, Icon: LayoutGrid },
  stats: { Component: Stats, Icon: BarChart3 },
  'product-showcase': { Component: ProductShowcase, Icon: Layers },
  'service-showcase': { Component: ServiceShowcase, Icon: Wrench },
  'cta-banner': { Component: CtaBanner, Icon: Megaphone },
  testimonials: { Component: Testimonials, Icon: MessageSquareQuote },
  'news-list': { Component: NewsList, Icon: Newspaper },
  faq: { Component: Faq, Icon: HelpCircle },
  dealers: { Component: Dealers, Icon: MapPin },
  contact: { Component: ContactBlock, Icon: Phone },
  spacer: { Component: Spacer, Icon: Rows3 },
};

export const FALLBACK_ICON: LucideIcon = Award;

/** The editor icon for a section type. A component (not a lookup function) so callers never build components while rendering. */
export function SectionIcon({ type, className }: { type: string; className?: string }) {
  const Icon = SECTION_REGISTRY[type]?.Icon ?? FALLBACK_ICON;
  return <Icon className={className} aria-hidden />;
}
