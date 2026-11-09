/**
 * Only site-relative paths are rendered as images from CMS data: an arbitrary external host would make next/image
 * throw, and odd schemes (javascript:, data:) must never reach a src attribute.
 */
export function isSafeImagePath(src?: string): boolean {
  const value = (src ?? '').trim();
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('..') && !/[<>"]/.test(value);
}

/**
 * Site-relative pictures go through the Next.js image optimiser, which serves a small resized WebP/AVIF instead of
 * the original file. Anything else (an external address, which may not be on the allow-list) is shown as it is.
 */
export function bypassImageOptimizer(src?: string): boolean {
  const value = (src ?? '').trim();
  return !(value.startsWith('/') && !value.startsWith('//'));
}
