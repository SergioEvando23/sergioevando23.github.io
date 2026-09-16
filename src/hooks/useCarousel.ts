'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CarouselImage } from '@/types/carousel';

interface UseCarouselOptions {
  items: CarouselImage[];
  initialIndex?: number;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
  pauseOnHover?: boolean;
  onSlideChange?: (index: number) => void;
}

export function useCarousel({
  items,
  initialIndex = 0,
  autoPlay = false,
  interval = 5000,
  loop = true,
  pauseOnHover = true,
  onSlideChange,
}: UseCarouselOptions) {
  const itemCount = items.length;
  const [activeIndex, setActiveIndex] = useState(() =>
    itemCount > 0 ? Math.min(Math.max(initialIndex, 0), itemCount - 1) : 0,
  );
  const [isPaused, setIsPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
  }, []);

  const updateIndex = useCallback(
    (nextIndex: number) => {
      if (itemCount === 0) {
        return;
      }

      let normalizedIndex = nextIndex;

      if (loop) {
        normalizedIndex = (nextIndex + itemCount) % itemCount;
      } else {
        normalizedIndex = Math.min(Math.max(nextIndex, 0), itemCount - 1);
      }

      setActiveIndex((currentIndex) => {
        if (currentIndex === normalizedIndex) {
          return currentIndex;
        }

        onSlideChange?.(normalizedIndex);
        return normalizedIndex;
      });
    },
    [itemCount, loop, onSlideChange],
  );

  const goTo = useCallback((index: number) => updateIndex(index), [updateIndex]);
  const next = useCallback(() => updateIndex(activeIndex + 1), [activeIndex, updateIndex]);
  const previous = useCallback(
    () => updateIndex(activeIndex - 1),
    [activeIndex, updateIndex],
  );
  const first = useCallback(() => updateIndex(0), [updateIndex]);
  const last = useCallback(() => updateIndex(itemCount - 1), [itemCount, updateIndex]);

  useEffect(() => {
    if (
      !autoPlay ||
      isPaused ||
      itemCount <= 1 ||
      prefersReducedMotion.current ||
      interval <= 0
    ) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      updateIndex(activeIndex + 1);
    }, interval);

    return () => window.clearInterval(timerId);
  }, [activeIndex, autoPlay, interval, isPaused, itemCount, updateIndex]);

  const canGoPrevious = loop || activeIndex > 0;
  const canGoNext = loop || activeIndex < itemCount - 1;

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  const onPointerDown = (event: React.PointerEvent) => {
    pointerStart.current = event.clientX;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (pointerStart.current === null) {
      return;
    }

    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;

    if (Math.abs(distance) < 48) {
      return;
    }

    if (distance < 0) {
      next();
    } else {
      previous();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      first();
    }

    if (event.key === 'End') {
      event.preventDefault();
      last();
    }
  };

  return {
    activeIndex,
    canGoNext,
    canGoPrevious,
    goTo,
    next,
    previous,
    pause,
    resume,
    isPaused,
    eventHandlers: {
      onMouseEnter: pauseOnHover ? pause : undefined,
      onMouseLeave: pauseOnHover ? resume : undefined,
      onFocusCapture: pause,
      onBlurCapture: resume,
      onPointerDown,
      onPointerUp,
      onKeyDown,
    },
  };
}
