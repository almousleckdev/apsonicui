export const locales = ['en', 'fr', 'zh'] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = 'en';
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export function isSupportedLocale(value: string | undefined): value is AppLocale {
  return !!value && (locales as readonly string[]).includes(value);
}
