export const SLUG_MAX_LENGTH = 80;

/** A page address suggested from a title: lowercase words joined by single hyphens, accents removed. */
export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, '');
}

/** Same shape the backend accepts (it additionally refuses reserved words and taken addresses). */
export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= SLUG_MAX_LENGTH && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}
