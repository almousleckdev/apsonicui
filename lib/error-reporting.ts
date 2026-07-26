// Single extension point for error reporting. Today this only logs (to the
// console in development, silently in production - matching prior behavior
// at each call site). Wiring in a real service (Sentry, Bugsnag, ...) later
// is a one-file change here instead of touching every call site below.
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('[reportError]', error, context);
  }
  // No-op in production until a real error-tracking SDK is wired in here.
}
