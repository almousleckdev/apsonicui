import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n/locales';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Prefix navigation routes
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames. 
  // Exclude static assets/APIs.
  matcher: [
    // Match root path
    '/',
    
    // Match locales pathnames
    '/(en|fr|zh)/:path*',
    
    // Exclude static assets and API routes
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
