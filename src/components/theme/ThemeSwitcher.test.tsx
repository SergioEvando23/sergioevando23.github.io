import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { THEME_STORAGE_KEY } from '@/config/theme';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { ThemeProvider } from './ThemeProvider';
import { ThemeSwitcher } from './ThemeSwitcher';

function renderThemeSwitcher() {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, 'portugues');

  return render(
    <ThemeProvider>
      <LanguageProvider>
        <ThemeSwitcher />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe('ThemeSwitcher', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders accessible labels', () => {
    renderThemeSwitcher();

    expect(screen.getByRole('radio', { name: 'Tema Claro' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Tema Escuro' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Tema Sistema' })).toBeInTheDocument();
  });

  it('selects and persists dark theme', async () => {
    const user = userEvent.setup();
    renderThemeSwitcher();

    await user.click(screen.getByRole('radio', { name: 'Tema Escuro' }));

    await waitFor(() => expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark'));
    expect(document.documentElement).toHaveClass('dark');
  });

  it('selects light and system themes', async () => {
    const user = userEvent.setup();
    renderThemeSwitcher();

    await user.click(screen.getByRole('radio', { name: 'Tema Claro' }));
    await waitFor(() => expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light'));
    expect(document.documentElement).not.toHaveClass('dark');

    await user.click(screen.getByRole('radio', { name: 'Tema Sistema' }));
    await waitFor(() => expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system'));
  });

  it('supports keyboard navigation through controls', async () => {
    const user = userEvent.setup();
    renderThemeSwitcher();

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Tema Claro' })).toHaveFocus();
  });
});
