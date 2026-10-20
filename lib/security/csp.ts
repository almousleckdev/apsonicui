/**
 * Content-Security-Policy for HTML documents. Scripts are allowed only via a per-request nonce
 * ('strict-dynamic' lets those trusted scripts load their own chunks), so injected markup cannot execute.
 * Third parties listed here are exactly the ones the site uses: Mapbox, YouTube/Google Maps embeds,
 * Nominatim and GeoJSON from GitHub, and the image hosts configured in next.config.ts.
 */
export function buildContentSecurityPolicy(nonce: string, isDev: boolean, options: { allowSelfFraming?: boolean; frameSelf?: boolean } = {}): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(isDev ? ["'unsafe-eval'"] : [])],
    // Inline styles are required by framer-motion, Tiptap and Mapbox GL; scripts are the sensitive part.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://images.unsplash.com',
      'https://cdn.apsonic.africa',
      'https://*.mapbox.com',
    ],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://*.mapbox.com',
      'https://raw.githubusercontent.com',
      'https://nominatim.openstreetmap.org',
      ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : []),
    ],
    'media-src': ["'self'", 'blob:', 'data:'],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:'],
    // Only admin pages may frame this origin (the page builder canvas); the public site never does.
    'frame-src': [
      ...(options.frameSelf ? ["'self'"] : []),
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://maps.google.com',
      'https://www.google.com',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    // Only the page-builder preview may be framed, and only by this same origin (the builder's canvas).
    'frame-ancestors': [options.allowSelfFraming ? "'self'" : "'none'"],
  };

  const policy = Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(' ')}`)
    .join('; ');
  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}

export function generateNonce(): string {
  return btoa(crypto.randomUUID());
}
