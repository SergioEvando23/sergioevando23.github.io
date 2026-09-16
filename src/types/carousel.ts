import type { ConteudoTraduzido } from '@/i18n/dicionario';

export type CarouselSize = 'small' | 'medium' | 'large';
export type CarouselTranslationKey = keyof ConteudoTraduzido['carousel']['items'];

export interface CarouselImage {
  id: string;
  src: string;
  darkSrc?: string;
  lightSrc?: string;
  alt: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface CarouselDataItem {
  id: string;
  src: string;
  darkSrc?: string;
  lightSrc?: string;
  href?: string;
  translationKey: CarouselTranslationKey;
}

export interface CarouselProps {
  items: CarouselImage[];
  size?: CarouselSize;
  initialIndex?: number;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  ariaLabel?: string;
  onSlideChange?: (index: number) => void;
}
