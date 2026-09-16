import Image from 'next/image';
import Link from 'next/link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useLanguage } from '@/components/language';
import type { CarouselImage } from '@/types/carousel';
import { cn } from '@/lib/cn';

interface CarouselSlideProps {
  item: CarouselImage;
  active: boolean;
  priority?: boolean;
  sizes: string;
  width: number;
  height: number;
}

export function CarouselSlide({
  item,
  active,
  priority = false,
  sizes,
  width,
  height,
}: CarouselSlideProps) {
  const { textos } = useLanguage();

  return (
    <article
      aria-hidden={!active}
      className={cn(
        'absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none',
        active ? 'z-10 opacity-100' : 'z-0 opacity-0',
      )}
      inert={!active ? true : undefined}
    >
      <Image
        alt={item.alt}
        className="h-full w-full object-cover"
        fill
        priority={priority}
        sizes={sizes}
        src={item.src}
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-5 sm:p-7">
        {item.title ? (
          <h3 className="max-w-2xl text-2xl font-bold text-text sm:text-3xl">
            {item.title}
          </h3>
        ) : null}
        {item.description ? (
          <p className="max-w-2xl text-sm leading-6 text-text-muted sm:text-base">
            {item.description}
          </p>
        ) : null}
        {item.href ? (
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            href={item.href}
          >
            {textos.carousel.openProject}
            <OpenInNewIcon aria-hidden="true" fontSize="small" />
          </Link>
        ) : null}
      </div>
      <span className="sr-only">{textos.carousel.dimensions(width, height)}</span>
    </article>
  );
}
