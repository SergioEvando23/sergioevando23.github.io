import { cn } from '@/lib/cn';

interface CarouselIndicatorsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  texts: {
    selectSlide: string;
    currentSlide: string;
    goToSlide: (slide: number) => string;
  };
}

export function CarouselIndicators({
  count,
  activeIndex,
  onSelect,
  texts,
}: CarouselIndicatorsProps) {
  if (count <= 1) {
    return null;
  }

  return (
    <div
      aria-label={texts.selectSlide}
      className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2"
      role="tablist"
    >
      {Array.from({ length: count }, (_, index) => {
        const selected = index === activeIndex;

        return (
          <button
            aria-label={texts.goToSlide(index + 1)}
            aria-selected={selected}
            className={cn(
              'h-3 rounded-[var(--radius-full)] border border-border bg-overlay transition-all duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent',
              selected ? 'w-8 border-primary bg-primary' : 'w-3 hover:border-primary',
            )}
            key={index}
            onClick={() => onSelect(index)}
            role="tab"
            type="button"
          >
            <span className="sr-only">
              {selected ? texts.currentSlide : texts.selectSlide}
            </span>
          </button>
        );
      })}
    </div>
  );
}
