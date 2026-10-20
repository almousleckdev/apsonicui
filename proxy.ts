import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n/locales';
import { buildContentSecurityPolicy, generateNonce } from './lib/security/csp';

// Page-builder preview routes: /preview/... or /{locale}/preview/...
const PREVIEW_PATH = /^\/(?:(?:en|fr|zh)\/)?preview\//;

// Admin routes: /admin/... or /{locale}/admin/...
const ADMIN_PATH = /^\/(?:(?:en|fr|zh)\/)?admin(?:\/|$)/;

const handleI18nRouting = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Prefix navigation routes
  localePrefix: 'as-needed'
});

export default function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildContentSecurityPolicy(nonce, process.env.NODE_ENV !== 'production', {
    allowSelfFraming: PREVIEW_PATH.test(request.nextUrl.pathname),
    frameSelf: ADMIN_PATH.test(request.nextUrl.pathname),
  });

  // Next.js reads the nonce from the request's CSP header and stamps it onto its own scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = handleI18nRouting(new NextRequest(request, { headers: requestHeaders }));
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

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
