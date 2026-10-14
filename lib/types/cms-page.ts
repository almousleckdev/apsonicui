export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type SectionType = 'HERO' | 'RICH_TEXT' | 'IMAGE_TEXT' | 'VIDEO' | 'GALLERY' | 'CTA' | 'CARDS';
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
