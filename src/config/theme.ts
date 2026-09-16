import type { CarouselSize } from '@/types/carousel';

export const THEME_STORAGE_KEY = 'sergio-costa-theme';

export const carouselSizes: Record<CarouselSize, { width: number; height: number }> = {
  small: {
    width: 420,
    height: 240,
  },
  medium: {
    width: 720,
    height: 360,
  },
  large: {
    width: 1120,
    height: 520,
  },
};
