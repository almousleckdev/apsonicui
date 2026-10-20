/**
 * The site remembers the visitor's language in a cookie (next-intl) and, for an address without a language prefix,
 * follows it. The editor loads its canvas frame without a prefix for English, so it saves the language it is about
 * to show first; that way the frame never needs a redirect and always matches the language being edited.
 */
const COOKIE = 'NEXT_LOCALE';

export function readLocaleCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`))?.split('=')[1];
}

export function writeLocaleCookie(locale: string | undefined): void {
  if (typeof document === 'undefined') return;
  document.cookie = locale ? `${COOKIE}=${locale}; Path=/; SameSite=Lax` : `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
