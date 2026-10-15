import { isBlankText, type ContentLang } from '@/lib/i18n/translation-copy';
import type { NewsItem, NewsLanguageStatus } from '@/lib/types/news';

/**
 * The language versions of an article that have been written, so the list can show what is still untranslated. A
 * language counts when it has a title and, where the body was loaded too (the list does not carry it), a body.
 */
export function newsLanguages(item: Pick<NewsItem, 'titleEn' | 'titleFr' | 'titleZh' | 'contentHtmlEn' | 'contentHtmlFr' | 'contentHtmlZh'>): NewsLanguageStatus {
  const written = (title?: string, body?: string) => !isBlankText(title) && (body === undefined || !isBlankText(body));
  return {
    en: written(item.titleEn, item.contentHtmlEn),
    fr: written(item.titleFr, item.contentHtmlFr),
    zh: written(item.titleZh, item.contentHtmlZh),
  } satisfies Record<ContentLang, boolean>;
}
