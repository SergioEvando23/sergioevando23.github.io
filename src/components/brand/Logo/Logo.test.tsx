import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders the shared SC. brand mark', () => {
    render(<LanguageProvider><Logo /></LanguageProvider>);

    const point = screen.getByText('.');
    expect(point.parentElement).toHaveClass('text-xl', 'font-black', 'text-text');
    expect(point).toHaveClass('text-primary');
  });
});
