export type SectionType =
  | 'HEADER'
  | 'PARAGRAPH'
  | 'IMAGE'
  | 'VIDEO'
  | 'QUOTE'
  | 'CALLOUT'
  | 'LINK_BUTTON';

export interface NewsSectionItem {
  id?: number;
  sectionType: SectionType;
  headingLevel?: 'H1' | 'H2' | 'H3';
  contentEn?: string;
  contentFr?: string;
  contentZh?: string;
  mediaUrl?: string;
  mediaCaptionEn?: string;
  mediaCaptionFr?: string;
  mediaCaptionZh?: string;
  mediaAltText?: string;
  linkUrl?: string;
  linkTextEn?: string;
  linkTextFr?: string;
  linkTextZh?: string;
  sectionOrder?: number;
}

export interface NewsContentBlock {
  type: 'paragraph' | 'image' | 'video' | string;
  content: string;
  caption?: string;
}

export interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  titleEn?: string;
  titleFr?: string;
  titleZh?: string;
  excerpt: string;
  summaryEn?: string;
  summaryFr?: string;
  summaryZh?: string;
  contentHtml?: string;
  contentHtmlEn?: string;
  contentHtmlFr?: string;
  contentHtmlZh?: string;
  date: string;
  category: string;
  thumbnail: string;
  authorName: string;
  authorRole?: string;
  authorImage?: string;
  viewsCount?: number;
  readTimeMinutes?: number;
  published?: boolean;
  sections?: NewsSectionItem[];
  content?: NewsContentBlock[];
}

/** Which languages an article has been written in (title and body both present). */
export type NewsLanguageStatus = Record<'en' | 'fr' | 'zh', boolean>;

export interface CreateNewsPayload {
  slug?: string;
  titleEn: string;
  titleFr?: string;
  titleZh?: string;
  summaryEn?: string;
  summaryFr?: string;
  summaryZh?: string;
  contentHtmlEn?: string;
  contentHtmlFr?: string;
  contentHtmlZh?: string;
  coverImageUrl?: string;
  category: string;
  authorName?: string;
  authorRole?: string;
  authorAvatarUrl?: string;
  published?: boolean;
  readTimeMinutes?: number;
  sections?: NewsSectionItem[];
}

/** Article as returned by the backend (NewsResponse / NewsDetailResponse). Every localized field may be absent. */
export interface BackendNewsItem {
  id: number | string;
  slug: string;
  title?: string;
  titleEn?: string;
  titleFr?: string;
  titleZh?: string;
  summary?: string;
  summaryEn?: string;
  summaryFr?: string;
  summaryZh?: string;
  contentHtml?: string;
  contentHtmlEn?: string;
  contentHtmlFr?: string;
  contentHtmlZh?: string;
  coverImageUrl?: string;
  category?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatarUrl?: string;
  publishedAt?: string;
  createdAt?: string;
  published?: boolean;
  viewsCount?: number;
  readTimeMinutes?: number;
  sections?: NewsSectionItem[];
  content?: NewsContentBlock[];
}
