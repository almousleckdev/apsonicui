import type { Metadata } from 'next';
import type { Locale, PageDocument, PageMeta } from './types';

/** Page meta for a language, falling back to English field by field. */
export function resolveMeta(doc: PageDocument, locale: Locale): PageMeta {
  const en = doc.meta.en ?? {};
  const own = doc.meta[locale] ?? {};
  return {
    title: own.title || en.title,
    seoTitle: own.seoTitle || en.seoTitle,
    seoDescription: own.seoDescription || en.seoDescription,
    ogTitle: own.ogTitle || en.ogTitle,
    ogDescription: own.ogDescription || en.ogDescription,
  };
}

/** Search and social metadata for a published page. */
export function buildPageMetadata(doc: PageDocument, locale: Locale): Metadata {
  const meta = resolveMeta(doc, locale);
  const title = meta.seoTitle || meta.title;
  const description = meta.seoDescription;
  return {
    title,
    description,
    alternates: doc.seo.canonicalUrl ? { canonical: doc.seo.canonicalUrl } : undefined,
    robots: doc.seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: meta.ogTitle || title,
      description: meta.ogDescription || description,
      images: doc.seo.ogImage ? [doc.seo.ogImage] : undefined,
      type: 'website',
    },
  };
}
