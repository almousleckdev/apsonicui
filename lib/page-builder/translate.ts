import { isBlankText, type ContentLang } from '@/lib/i18n/translation-copy';
import { updateSection } from './document';
import type { FieldDef, PageDocument } from './types';

type Content = Record<string, unknown>;

export interface FillResult {
  content: Content;
  /** How many empty texts received a copy. */
  count: number;
}

/**
 * Copies the text written in one language into every translated field that is still empty in another. Nothing that is
 * already written is replaced, so it is safe to use at any time. Lists (buttons, cards, questions...) are followed
 * into each item. The input is not modified.
 */
export function fillEmptyTranslations(content: Content, fields: FieldDef[], from: ContentLang, to: ContentLang): FillResult {
  if (from === to) return { content, count: 0 };
  let count = 0;

  const fillObject = (values: Content, defs: FieldDef[]): Content => {
    const next: Content = { ...values };
    for (const field of defs) {
      const value = values[field.name];
      if (field.kind === 'LIST' && Array.isArray(value)) {
        next[field.name] = value.map((item) => (item && typeof item === 'object' ? fillObject(item as Content, field.itemFields ?? []) : item));
      } else if (field.localized && value && typeof value === 'object') {
        const texts = value as Partial<Record<ContentLang, string>>;
        if (!isBlankText(texts[from]) && isBlankText(texts[to])) {
          next[field.name] = { ...texts, [to]: texts[from] };
          count++;
        }
      }
    }
    return next;
  };

  const filled = fillObject(content, fields);
  return { content: count > 0 ? filled : content, count };
}

/** {@link fillEmptyTranslations} applied to one section of a document. */
export function fillSectionTranslations(doc: PageDocument, sectionId: string, fields: FieldDef[], from: ContentLang, to: ContentLang): PageDocument {
  return updateSection(doc, sectionId, (section) => ({ ...section, content: fillEmptyTranslations(section.content, fields, from, to).content }));
}
