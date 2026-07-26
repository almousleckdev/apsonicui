import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseCarouselOptions {
  itemsCount: number;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
}

export interface UseCarouselReturn {
  currentIndex: number;
  isPaused: boolean;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  pause: () => void;
  resume: () => void;
}

export function useCarousel({
  itemsCount,
  autoPlay = true,
  interval = 5000,
  loop = true,
}: UseCarouselOptions): UseCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < itemsCount) {
        setCurrentIndex(index);
      }
    },
    [itemsCount]
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev + 1) % itemsCount;
      }
      return Math.min(prev + 1, itemsCount - 1);
    });
  }, [itemsCount, loop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (loop) {
        return (prev - 1 + itemsCount) % itemsCount;
      }
      return Math.max(prev - 1, 0);
    });
  }, [itemsCount, loop]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (!autoPlay || itemsCount <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPlay, interval, itemsCount, isPaused, nextSlide, currentIndex]);

  return {
    currentIndex,
    isPaused,
    goToSlide,
    nextSlide,
    prevSlide,
    pause,
    resume,
  };
}
