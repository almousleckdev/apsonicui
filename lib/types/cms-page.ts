export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type SectionType = 'HERO' | 'RICH_TEXT' | 'IMAGE_TEXT' | 'TEXT_IMAGE' | 'VIDEO' | 'GALLERY' | 'CTA' | 'CARDS';
export type Locale = 'en' | 'fr' | 'zh';

export interface CmsPageTranslationDto {
  title: string;
  navLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
}

/** Per-locale copy of a section. Which keys are used depends on the section type. */
export interface SectionTranslation {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  content?: string;
  description?: string;
  [key: string]: string | undefined;
}

/** Section configuration as authored in the page builder (stored as JSON on the backend). */
export interface BaseSectionConfig {
  backgroundImage?: string;
  image?: string;
  videoUrl?: string;
  thumbnail?: string;
  ctaLink?: string;
  layout?: string;
  translations?: Record<string, SectionTranslation>;
}

export interface CmsPageSectionDto {
  id?: number;
  sectionType: SectionType;
  sectionOrder: number;
  configuration: BaseSectionConfig;
}

export interface CmsPageDto {
  id: number;
  slug: string;
  status: PageStatus;
  navVisibility: boolean;
  navPosition?: string;
  navOrder: number;
  translations: Record<string, CmsPageTranslationDto>;
  sections: CmsPageSectionDto[];
  /** The page as it was when last published; what the public site renders. */
  publishedSnapshot?: CmsPageDto;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Public navigation entry (backend NavigationItemDto). `labels` is keyed by locale. */
export interface NavigationItem {
  slug: string;
  labels: Record<string, string>;
  navPosition?: string;
  navOrder?: number;
}

export interface CmsPageRequest {
  slug: string;
  status: PageStatus;
  navVisibility: boolean;
  navPosition?: string;
  navOrder: number;
  translations: Record<string, CmsPageTranslationDto>;
  sections: CmsPageSectionDto[];
}

/** Display title for admin screens: English translation, then any translation, then the slug. */
export function getPageTitle(page: Pick<CmsPageDto, 'slug' | 'translations'>): string {
  const translations = page.translations ?? {};
  return translations.en?.title || Object.values(translations).find((t) => t?.title)?.title || page.slug;
}
