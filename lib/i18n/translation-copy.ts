/**
 * Helpers for the "copy from another language" buttons next to translated fields. Editors write a text once and then
 * copy it into the other languages as a starting point for the translation.
 */

export type ContentLang = 'en' | 'fr' | 'zh';
export const CONTENT_LANGS: readonly ContentLang[] = ['en', 'fr', 'zh'];

/** Each language written in itself, so the buttons read the same whatever the admin display mode is. */
export const LANGUAGE_NAMES: Record<ContentLang, string> = { en: 'English', fr: 'Français', zh: '中文' };

/** True for text with nothing a visitor would see: empty, spaces only, or HTML without text such as "<p></p>". */
export function isBlankText(value: unknown): boolean {
  if (typeof value !== 'string') return true;
  if (/<(img|video|iframe|hr)\b/i.test(value)) return false;
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').trim() === '';
}

export interface CopySource {
  lang: ContentLang;
  text: string;
}

/** The other languages that already have text, in the usual order, to copy from. */
export function copySources(current: ContentLang, values: Partial<Record<ContentLang, string | undefined>>): CopySource[] {
  return CONTENT_LANGS
    .filter((lang) => lang !== current && !isBlankText(values[lang]) && values[lang] !== values[current])
    .map((lang) => ({ lang, text: values[lang] as string }));
}
