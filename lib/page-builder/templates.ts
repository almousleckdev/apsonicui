import { createSection, emptyDocument } from './document';
import type { AdminKey } from '@/lib/i18n/admin/catalog';
import type { FieldDef, PageDocument, SectionDefinition } from './types';

/**
 * Starting points offered when a page is created. A template is only a list of section types: each section is
 * created from the backend's defaults and left empty for the editor to fill in, so nothing placeholder-like can
 * ever be published by accident (required fields block publishing). Names and descriptions live in the admin
 * catalog (templates.<id>).
 */
export interface PageTemplate {
  id: string;
  label: AdminKey;
  description: AdminKey;
  sections: string[];
}

const template = (id: 'blank' | 'simple' | 'about' | 'landing' | 'contact', sections: string[]): PageTemplate => ({
  id,
  label: `templates.${id}.label`,
  description: `templates.${id}.text`,
  sections,
});

export const PAGE_TEMPLATES: PageTemplate[] = [
  template('blank', []),
  template('simple', ['hero', 'rich-text']),
  template('about', ['hero', 'text-image', 'stats', 'cta-banner']),
  template('landing', ['hero', 'feature-grid', 'product-showcase', 'cta-banner']),
  template('contact', ['hero', 'contact', 'dealers', 'faq']),
];

/** Builds the starting document; section types the server does not know are skipped rather than failing. */
export function buildTemplateDocument(template: PageTemplate, title: string, definitions: Map<string, SectionDefinition>, styleFields: FieldDef[] = []): PageDocument {
  const doc = emptyDocument(title);
  doc.sections = template.sections.flatMap((type) => {
    const definition = definitions.get(type);
    return definition ? [createSection(definition, undefined, styleFields)] : [];
  });
  return doc;
}
