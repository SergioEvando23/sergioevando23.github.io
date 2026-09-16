import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { carouselItems } from '@/data/carousel';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { dicionario } from '@/i18n/dicionario';
import type { CarouselImage } from '@/types/carousel';
import { Carousel } from './Carousel';

const translatedItems: CarouselImage[] = carouselItems.map((item) => ({
  ...item,
  ...dicionario.portugues.carousel.items[item.translationKey],
}));

function renderCarousel(ui: React.ReactElement) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, 'portugues');

  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Carousel', () => {
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('renders the first slide', () => {
    renderCarousel(<Carousel items={translatedItems} />);

    expect(screen.getByText('Frontend - React + TypeScript')).toBeVisible();
  });

  it('goes to next and previous slides', async () => {
    const user = userEvent.setup();
    renderCarousel(<Carousel items={translatedItems} />);

    await user.click(screen.getByRole('button', { name: 'Proximo slide' }));
    expect(screen.getByText('Mobile - Flutter + Dart')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Slide anterior' }));
    expect(screen.getByText('Frontend - React + TypeScript')).toBeVisible();
  });

  it('supports indicators and callback', async () => {
    const user = userEvent.setup();
    const onSlideChange = vi.fn();

    renderCarousel(<Carousel items={translatedItems} onSlideChange={onSlideChange} />);

    await user.click(screen.getByRole('tab', { name: 'Ir para o slide 3' }));

    expect(screen.getByText('Backend - Node.js + APIs')).toBeVisible();
    expect(onSlideChange).toHaveBeenCalledWith(2);
  });

  it('supports keyboard navigation', () => {
    renderCarousel(<Carousel items={translatedItems} />);
    const carousel = screen.getByRole('region', {
      name: 'Carrossel de destaques',
    });

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(screen.getByText('Mobile - Flutter + Dart')).toBeVisible();

    fireEvent.keyDown(carousel, { key: 'Home' });
    expect(screen.getByText('Frontend - React + TypeScript')).toBeVisible();

    fireEvent.keyDown(carousel, { key: 'End' });
    expect(screen.getByText('Backend - Node.js + APIs')).toBeVisible();
  });

  it('respects non-loop behavior', async () => {
    const user = userEvent.setup();
    renderCarousel(<Carousel items={translatedItems} loop={false} />);

    expect(screen.getByRole('button', { name: 'Slide anterior' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Proximo slide' }));
    await user.click(screen.getByRole('button', { name: 'Proximo slide' }));

    expect(screen.getByRole('button', { name: 'Proximo slide' })).toBeDisabled();
  });

  it('supports autoplay and pause on hover or focus', () => {
    vi.useFakeTimers();
    renderCarousel(<Carousel autoPlay interval={1000} items={translatedItems} />);
    const carousel = screen.getByRole('region', {
      name: 'Carrossel de destaques',
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Mobile - Flutter + Dart')).toBeVisible();

    fireEvent.mouseEnter(carousel);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Mobile - Flutter + Dart')).toBeVisible();

    fireEvent.mouseLeave(carousel);
    fireEvent.focus(carousel);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Mobile - Flutter + Dart')).toBeVisible();
  });

  it('handles empty and single item lists', () => {
    const { rerender } = renderCarousel(<Carousel items={[]} />);

    expect(screen.getByText('Nenhum slide cadastrado.')).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <Carousel items={[translatedItems[0]]} />
      </LanguageProvider>,
    );

    expect(
      screen.queryByRole('button', { name: 'Proximo slide' }),
    ).not.toBeInTheDocument();
  });

  it('renders all size variants and material icons', () => {
    const { rerender } = renderCarousel(
      <Carousel items={translatedItems} size="small" />,
    );
    expect(screen.getByLabelText('Carrossel de destaques')).toHaveAttribute(
      'data-carousel-size',
      'small',
    );

    rerender(
      <LanguageProvider>
        <Carousel items={translatedItems} size="medium" />
      </LanguageProvider>,
    );
    expect(screen.getByLabelText('Carrossel de destaques')).toHaveAttribute(
      'data-carousel-size',
      'medium',
    );

    rerender(
      <LanguageProvider>
        <Carousel items={translatedItems} size="large" />
      </LanguageProvider>,
    );
    expect(screen.getByLabelText('Carrossel de destaques')).toHaveAttribute(
      'data-carousel-size',
      'large',
    );
    expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
  });

  it('preserves slide while parent re-renders for theme changes', async () => {
    const user = userEvent.setup();
    const { rerender } = renderCarousel(<Carousel items={translatedItems} />);

    await user.click(screen.getByRole('button', { name: 'Proximo slide' }));
    rerender(
      <LanguageProvider>
        <Carousel items={translatedItems} className="theme-changed" />
      </LanguageProvider>,
    );

    expect(screen.getByText('Mobile - Flutter + Dart')).toBeVisible();
  });

  it('does not autoplay when reduced motion is preferred', () => {
    vi.useFakeTimers();
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderCarousel(<Carousel autoPlay interval={1000} items={translatedItems} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Frontend - React + TypeScript')).toBeVisible();
  });
});
