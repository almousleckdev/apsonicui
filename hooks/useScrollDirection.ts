import { useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

export interface UseScrollDirectionOptions {
  scrolledThreshold?: number;
  hideThreshold?: number;
  autoShowAfterIdleMs?: number;
}

export interface UseScrollDirectionResult {
  isScrolled: boolean;
  isVisible: boolean;
}

export function useScrollDirection({
  scrolledThreshold = 50,
  hideThreshold,
  autoShowAfterIdleMs,
}: UseScrollDirectionOptions = {}): UseScrollDirectionResult {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resolvedHideThreshold = hideThreshold ?? scrolledThreshold;
  const accumulatedRef = useRef(0);
  const directionRef = useRef<'up' | 'down' | null>(null);

  const { scrollY } = useScroll();

  const DIRECTION_CHANGE_THRESHOLD = 10;

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    setIsScrolled(latest > scrolledThreshold);

    if (diff !== 0) {
      const direction = diff > 0 ? 'down' : 'up';
      if (direction !== directionRef.current) {
        accumulatedRef.current = 0;
        directionRef.current = direction;
      }
      accumulatedRef.current += Math.abs(diff);

      if (accumulatedRef.current > DIRECTION_CHANGE_THRESHOLD) {
        if (direction === 'down' && latest > resolvedHideThreshold) {
          setIsVisible(false);
        } else if (direction === 'up') {
          setIsVisible(true);
        }
      }
    }

    if (autoShowAfterIdleMs != null) {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => setIsVisible(true), autoShowAfterIdleMs);
    }
  });

  return { isScrolled, isVisible };
}
