/**
 * Only site-relative paths are rendered as images from CMS data: an arbitrary external host would make next/image
 * throw, and odd schemes (javascript:, data:) must never reach a src attribute.
 */
export function isSafeImagePath(src?: string): boolean {
  const value = (src ?? '').trim();
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('..') && !/[<>"]/.test(value);
}
