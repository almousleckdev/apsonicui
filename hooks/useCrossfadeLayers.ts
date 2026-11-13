import { useCallback, useState } from 'react';

/**
 * Keeps a stack of pictures that are cross-faded with CSS instead of being mounted and unmounted.
 *
 * - A picture that was shown once stays in the page (hidden), so a swap never inserts or removes anything while it
 *   animates, and going back to it is instant.
 * - `preload` pictures are added to the stack ahead of time, so they are downloaded before they are needed.
 * - `shown` only moves to the new picture once it has loaded, so the old one stays until then: never a blank gap.
 *
 * State is adjusted while rendering (React's documented way to derive state from props), not in effects.
 */
export function useCrossfadeLayers(active: string, preload: string[] = []) {
  const [mounted, setMounted] = useState<string[]>(() => (active ? [active] : []));
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const [shown, setShown] = useState(active);

  const missing = [active, ...preload].filter((src, i, all) => src && !mounted.includes(src) && all.indexOf(src) === i);
  if (missing.length > 0) setMounted([...mounted, ...missing]);

  // No picture at all (a model without a background) has nothing to wait for: the previous one fades out right away.
  if (shown !== active && (!active || loaded.has(active))) setShown(active);

  // Called on load and on error: a picture that failed must not freeze the carousel on the previous one.
  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));
  }, []);

  return { mounted, shown, markLoaded };
}
