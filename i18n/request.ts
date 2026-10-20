import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, AppLocale } from '../lib/i18n/locales';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as AppLocale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
