/** Shapes of the page builder API (backend modules/page and modules/navigation). */

export type Locale = 'en' | 'fr' | 'zh';
export const LOCALES: Locale[] = ['en', 'fr', 'zh'];
export const LOCALE_LABELS: Record<Locale, string> = { en: 'English', fr: 'Français', zh: '中文' };

/** A translatable text value: {en, fr, zh}; missing languages fall back to English when rendered. */
export type LocalizedText = Partial<Record<Locale, string>>;

export type FieldKind = 'TEXT' | 'TEXTAREA' | 'RICHTEXT' | 'URL' | 'MEDIA' | 'ENUM' | 'COLOR' | 'NUMBER' | 'BOOLEAN' | 'LIST';

export interface FieldDef {
  name: string;
  kind: FieldKind;
  label: string;
  localized?: boolean;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  /** Friendly names for {@link options}, same order. */
  optionLabels?: string[];
  defaultValue?: string | number | boolean;
  itemFields?: FieldDef[];
  minItems?: number;
  maxItems?: number;
  help?: string;
  /** Editor grouping ("Picture", "Buttons"). */
  group?: string;
  /** Show only while a sibling field has one of these values ("*" = any non-empty value). */
  showWhenField?: string;
  showWhenValues?: string[];
}

export interface SectionDefinition {
  type: string;
  label: string;
  description: string;
  category: string;
  fields: FieldDef[];
  /** Which shared style fields apply (absent = all of them). */
  styleFieldNames?: string[] | null;
  /** Style values a new section of this type starts with. */
  styleDefaults?: Record<string, string>;
}

export interface SectionTypesResponse {
  sections: SectionDefinition[];
  styleFields: FieldDef[];
  locales: Locale[];
}

export type SectionSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface SectionStyle {
  background?: 'white' | 'light' | 'dark' | 'brand' | 'custom';
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundFixed?: boolean;
  backgroundOverlayColor?: string;
  backgroundOverlay?: number;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonShape?: 'pill' | 'rounded' | 'square';
  paddingTop?: SectionSize;
  paddingBottom?: SectionSize;
  width?: 'narrow' | 'normal' | 'wide';
  showOn?: 'all' | 'desktop' | 'mobile';
}

export type SectionContent = Record<string, unknown>;

export interface PageSection {
  id: string;
  type: string;
  hidden: boolean;
  style: SectionStyle;
  content: SectionContent;
}

export interface PageMeta {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface PageSeo {
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface PageDocument {
  schemaVersion: 1;
  meta: Partial<Record<Locale, PageMeta>>;
  seo: PageSeo;
  sections: PageSection[];
}

export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PageSummary {
  id: number;
  slug: string;
  title: string;
  status: PageStatus;
  hasUnpublishedChanges: boolean;
  version: number;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  publishedAt?: string;
}

export interface PageDetail extends PageSummary {
  publishedBy?: string;
  archivedAt?: string;
  document: PageDocument;
}

export interface DocumentIssue {
  path: string;
  code: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface ValidationReport {
  publishable: boolean;
  issues: DocumentIssue[];
  completeness: Record<Locale, { filled: number; total: number }>;
}

export interface RevisionSummary {
  number: number;
  kind: 'CREATE' | 'DRAFT' | 'PUBLISH' | 'ROLLBACK' | 'MIGRATION' | 'LEGACY';
  note?: string;
  createdBy?: string;
  savedAt: string;
}

export interface RevisionDetail extends RevisionSummary {
  document: PageDocument;
}

export interface PreviewLink {
  token: string;
  expiresAt: string;
}

/** What the public site receives: either a document or the slug to redirect to. */
export interface PublicPage {
  slug: string;
  redirectSlug?: string | null;
  title: string;
  document?: PageDocument | null;
  publishedAt?: string;
}

export interface PreviewPage {
  id: number;
  slug: string;
  title: string;
  status: PageStatus;
  document: PageDocument;
}
