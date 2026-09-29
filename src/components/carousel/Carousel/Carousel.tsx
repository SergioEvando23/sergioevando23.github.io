'use client';

import { useLanguage } from '@/components/language';
import { carouselSizes } from '@/config/theme';
import { useCarousel } from '@/hooks/useCarousel';
import { cn } from '@/lib/cn';
import type { CarouselProps } from '@/types/carousel';
import { CarouselControls } from '../CarouselControls';
import { CarouselIndicators } from '../CarouselIndicators';
import { CarouselSlide } from '../CarouselSlide';
import { getCarouselFrameStyle } from './styles';

export function Carousel({
  items,
  size = 'medium',
  initialIndex = 0,
  autoPlay = false,
  interval = 5000,
  loop = true,
  showControls = true,
  showIndicators = true,
  pauseOnHover = true,
  className,
  ariaLabel,
  onSlideChange,
}: CarouselProps) {
  const { translations } = useLanguage();
  const dimensions = carouselSizes[size];
  const label = ariaLabel ?? translations.carousel.defaultLabel;
  const carousel = useCarousel({
    items,
    initialIndex,
    autoPlay,
    interval,
    loop,
    pauseOnHover,
    onSlideChange,
  });

  if (items.length === 0) {
    return (
      <section
        aria-label={label}
        className={cn(
          'flex min-h-56 w-full items-center justify-center rounded-[var(--radius-xl)] border border-border bg-surface-secondary p-6 text-center text-text-muted',
          className,
        )}
      >
        {translations.carousel.empty}
      </section>
    );
  }

  return (
    <section
      aria-label={label}
      className={cn('w-full', className)}
      data-carousel
      data-carousel-size={size}
      tabIndex={0}
      {...carousel.eventHandlers}
    >
      <div
        className="group relative mx-auto w-full overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-card)]"
        style={getCarouselFrameStyle(size)}
      >
        <div aria-live="polite" className="sr-only">
          {translations.carousel.slidePosition(carousel.activeIndex + 1, items.length)}:{' '}
          {items[carousel.activeIndex]?.title}
        </div>
        {items.map((item, index) => (
          <CarouselSlide
            active={index === carousel.activeIndex}
            height={dimensions.height}
            item={item}
            key={item.id}
            priority={index === 0}
            sizes={`(max-width: 640px) 100vw, ${dimensions.width}px`}
            width={dimensions.width}
          />
        ))}
        {showControls && items.length > 1 ? (
          <CarouselControls
            autoPlay={autoPlay}
            canGoNext={carousel.canGoNext}
            canGoPrevious={carousel.canGoPrevious}
            isPaused={carousel.isPaused}
            onNext={carousel.next}
            onPause={carousel.pause}
            onPrevious={carousel.previous}
            onResume={carousel.resume}
            texts={{
              nextSlide: translations.carousel.nextSlide,
              pause: translations.carousel.pause,
              previousSlide: translations.carousel.previousSlide,
              resume: translations.carousel.resume,
            }}
          />
        ) : null}
        {showIndicators ? (
          <CarouselIndicators
            activeIndex={carousel.activeIndex}
            count={items.length}
            onSelect={carousel.goTo}
            texts={{
              currentSlide: translations.carousel.currentSlide,
              goToSlide: translations.carousel.goToSlide,
              selectSlide: translations.carousel.selectSlide,
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
