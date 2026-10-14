export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type SectionType = 'HERO' | 'RICH_TEXT' | 'IMAGE_TEXT' | 'TEXT_IMAGE' | 'VIDEO' | 'GALLERY' | 'CTA' | 'CARDS';
export type Locale = 'en' | 'fr' | 'zh';

export interface CmsPageTranslationDto {
  title: string;
  navLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BaseSectionConfig {
  [key: string]: any;
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
  publishedSnapshot?: any;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
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
