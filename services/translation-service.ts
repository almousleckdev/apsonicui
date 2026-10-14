import { apiClient } from './api-client';

export interface BatchTranslationRequest {
  texts: string[];
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface NewsTranslationInput {
  title: string;
  summary: string;
  contentHtml: string;
  sourceLanguage?: string;
}

export interface NewsTranslationOutput {
  titleFr: string;
  titleZh: string;
  summaryFr: string;
  summaryZh: string;
  contentHtmlFr: string;
  contentHtmlZh: string;
}

/**
 * Service to handle client-side and admin batch translations using the DeepL backend endpoint.
 */
export const translationService = {
  /**
   * Translate an array of text strings using the DeepL API endpoint.
   */
  async translateBatch(texts: string[], targetLang: string, sourceLang = 'en'): Promise<string[]> {
    if (!texts || texts.length === 0) return [];

    try {
      const response = await apiClient<string[]>('/admin/translate/batch', {
        method: 'POST',
        body: JSON.stringify({
          texts,
          targetLanguage: targetLang.toUpperCase(),
          sourceLanguage: sourceLang.toUpperCase(),
        }),
      });
      return response.data || texts;
    } catch (err) {
      console.warn('Batch translation failed, falling back to original texts:', err);
      return texts;
    }
  },

  /**
   * Auto-translates a news article title, summary, and rich content into FR and ZH.
   */
  async translateNewsContent(input: NewsTranslationInput): Promise<NewsTranslationOutput> {
    const { title, summary, contentHtml, sourceLanguage = 'en' } = input;

    // 1. Translate Title & Summary in batch
    const textsToTranslate = [title, summary].filter((t) => t && t.trim().length > 0);
    let translatedTitleFr = title;
    let translatedTitleZh = title;
    let translatedSummaryFr = summary;
    let translatedSummaryZh = summary;

    if (textsToTranslate.length > 0) {
      const [frResults, zhResults] = await Promise.all([
        this.translateBatch(textsToTranslate, 'FR', sourceLanguage),
        this.translateBatch(textsToTranslate, 'ZH', sourceLanguage),
      ]);

      if (frResults.length >= 2) {
        translatedTitleFr = frResults[0];
        translatedSummaryFr = frResults[1];
      } else if (frResults.length === 1) {
        translatedTitleFr = frResults[0];
      }

      if (zhResults.length >= 2) {
        translatedTitleZh = zhResults[0];
        translatedSummaryZh = zhResults[1];
      } else if (zhResults.length === 1) {
        translatedTitleZh = zhResults[0];
      }
    }

    // 2. Translate HTML content lines
    const [contentHtmlFr, contentHtmlZh] = await Promise.all([
      translateHtmlContent(contentHtml, sourceLanguage, 'FR'),
      translateHtmlContent(contentHtml, sourceLanguage, 'ZH'),
    ]);

    return {
      titleFr: translatedTitleFr,
      titleZh: translatedTitleZh,
      summaryFr: translatedSummaryFr,
      summaryZh: translatedSummaryZh,
      contentHtmlFr,
      contentHtmlZh,
    };
  },
};

/**
 * Translates text blocks inside HTML while preserving HTML tags.
 */
async function translateHtmlContent(html: string, fromLang: string, toLang: string): Promise<string> {
  if (!html || !html.trim()) return '';

  const cleanText = html.replace(/<[^>]*>/g, (tag) => `\n${tag}\n`);
  const lines = cleanText.split('\n');
  const translatedLines = await Promise.all(
    lines.map(async (line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('<')) {
        return line;
      }
      try {
        const res = await translationService.translateBatch([trimmed], toLang, fromLang);
        return res[0] || line;
      } catch {
        return line;
      }
    })
  );

  return translatedLines.join('');
}
