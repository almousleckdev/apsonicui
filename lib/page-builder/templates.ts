import { createSection, emptyDocument } from './document';
import type { PageDocument, SectionDefinition } from './types';

/**
 * Starting points offered when a page is created. A template is only a list of section types: each section is
 * created from the backend's defaults and left empty for the editor to fill in, so nothing placeholder-like can
 * ever be published by accident (required fields block publishing).
 */
export interface PageTemplate {
  id: string;
  label: string;
  description: string;
  sections: string[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  { id: 'blank', label: 'Blank page', description: 'Start from nothing and add the sections you need.', sections: [] },
  { id: 'simple', label: 'Simple page', description: 'A banner followed by text. Good for policies and short notices.', sections: ['hero', 'rich-text'] },
  { id: 'about', label: 'About us', description: 'Tell your story with text, pictures and key figures.', sections: ['hero', 'text-image', 'stats', 'cta-banner'] },
  { id: 'landing', label: 'Landing page', description: 'Present a campaign or product line and drive visitors to act.', sections: ['hero', 'feature-grid', 'product-showcase', 'cta-banner'] },
  { id: 'contact', label: 'Contact page', description: 'Contact details, dealer locations and common questions.', sections: ['hero', 'contact', 'dealers', 'faq'] },
];

/** Builds the starting document; section types the server does not know are skipped rather than failing. */
export function buildTemplateDocument(template: PageTemplate, title: string, definitions: Map<string, SectionDefinition>): PageDocument {
  const doc = emptyDocument(title);
  doc.sections = template.sections.flatMap((type) => {
    const definition = definitions.get(type);
    return definition ? [createSection(definition)] : [];
  });
  return doc;
}
