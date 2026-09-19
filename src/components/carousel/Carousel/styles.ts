import type { CSSProperties } from 'react';
import type { CarouselSize } from '@/types/carousel';
import { carouselSizes } from '@/config/theme';

export function getCarouselFrameStyle(size: CarouselSize): CSSProperties {
  const dimensions = carouselSizes[size];

  return {
    maxWidth: dimensions.width,
    aspectRatio: `${dimensions.width} / ${dimensions.height}`,
  };
}
