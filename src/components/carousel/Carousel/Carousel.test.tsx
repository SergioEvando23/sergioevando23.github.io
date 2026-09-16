import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { carouselItems } from '@/data/carousel';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first slide', () => {
    render(<Carousel items={carouselItems} />);

    expect(screen.getByText('Frontend — React + TypeScript')).toBeVisible();
  });

  it('goes to next and previous slides', async () => {
    const user = userEvent.setup();
    render(<Carousel items={carouselItems} />);

    await user.click(screen.getByRole('button', { name: 'Próximo slide' }));
    expect(screen.getByText('Mobile — Flutter + Dart')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Slide anterior' }));
    expect(screen.getByText('Frontend — React + TypeScript')).toBeVisible();
  });

  it('supports indicators and callback', async () => {
    const user = userEvent.setup();
    const onSlideChange = vi.fn();

    render(<Carousel items={carouselItems} onSlideChange={onSlideChange} />);

    await user.click(screen.getByRole('tab', { name: 'Ir para slide 3' }));

    expect(screen.getByText('Backend — Node.js + APIs')).toBeVisible();
    expect(onSlideChange).toHaveBeenCalledWith(2);
  });

  it('supports keyboard navigation', () => {
    render(<Carousel items={carouselItems} />);
    const carousel = screen.getByRole('region', {
      name: 'Carrossel de destaques',
    });

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(screen.getByText('Mobile — Flutter + Dart')).toBeVisible();

    fireEvent.keyDown(carousel, { key: 'Home' });
    expect(screen.getByText('Frontend — React + TypeScript')).toBeVisible();

    fireEvent.keyDown(carousel, { key: 'End' });
    expect(screen.getByText('Backend — Node.js + APIs')).toBeVisible();
  });

  it('respects non-loop behavior', async () => {
    const user = userEvent.setup();
    render(<Carousel items={carouselItems} loop={false} />);

    expect(screen.getByRole('button', { name: 'Slide anterior' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Próximo slide' }));
    await user.click(screen.getByRole('button', { name: 'Próximo slide' }));

    expect(screen.getByRole('button', { name: 'Próximo slide' })).toBeDisabled();
  });

  it('supports autoplay and pause on hover or focus', async () => {
    vi.useFakeTimers();
    render(<Carousel autoPlay interval={1000} items={carouselItems} />);
    const carousel = screen.getByRole('region', {
      name: 'Carrossel de destaques',
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Mobile — Flutter + Dart')).toBeVisible();

    fireEvent.mouseEnter(carousel);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Mobile — Flutter + Dart')).toBeVisible();

    fireEvent.mouseLeave(carousel);
    fireEvent.focus(carousel);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Mobile — Flutter + Dart')).toBeVisible();
  });

  it('handles empty and single item lists', () => {
    const { rerender } = render(<Carousel items={[]} />);

    expect(screen.getByText('Nenhum slide cadastrado.')).toBeInTheDocument();

    rerender(<Carousel items={[carouselItems[0]]} />);

    expect(
      screen.queryByRole('button', { name: 'Próximo slide' }),
    ).not.toBeInTheDocument();
  });

  it('renders all size variants and material icons', () => {
    const { rerender } = render(<Carousel items={carouselItems} size="small" />);
    expect(screen.getByLabelText('Carrossel de destaques')).toHaveAttribute(
      'data-carousel-size',
      'small',
    );

    rerender(<Carousel items={carouselItems} size="medium" />);
    expect(screen.getByLabelText('Carrossel de destaques')).toHaveAttribute(
      'data-carousel-size',
      'medium',
    );

    rerender(<Carousel items={carouselItems} size="large" />);
    expect(screen.getByLabelText('Carrossel de destaques')).toHaveAttribute(
      'data-carousel-size',
      'large',
    );
    expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
  });

  it('preserves slide while parent re-renders for theme changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Carousel items={carouselItems} />);

    await user.click(screen.getByRole('button', { name: 'Próximo slide' }));
    rerender(<Carousel items={carouselItems} className="theme-changed" />);

    expect(screen.getByText('Mobile — Flutter + Dart')).toBeVisible();
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

    render(<Carousel autoPlay interval={1000} items={carouselItems} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Frontend — React + TypeScript')).toBeVisible();
  });
});
