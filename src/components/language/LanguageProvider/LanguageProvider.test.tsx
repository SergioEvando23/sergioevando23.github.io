import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { LanguageProvider, useLanguage } from './LanguageProvider';

function Probe() {
  const { language, translations, setLanguage, toggleLanguage } = useLanguage();

  return (
    <div>
      <span data-testid="language">{language}</span>
      <span>{translations.hero.viewProjects}</span>
      <button onClick={() => setLanguage('english')} type="button">
        EN
      </button>
      <button onClick={() => setLanguage('portuguese')} type="button">
        PT
      </button>
      <button onClick={toggleLanguage} type="button">
        toggle
      </button>
    </div>
  );
}

function renderProvider() {
  return render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  );
}

describe('LanguageProvider', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
    vi.restoreAllMocks();
  });

  it('uses portuguese as fallback when navigator language is portuguese', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('pt-BR');

    renderProvider();

    expect(screen.getByTestId('language')).toHaveTextContent('portuguese');
  });

  it('detects english for non-portuguese navigator language', async () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('en-US');

    renderProvider();

    await waitFor(() => expect(screen.getByTestId('language')).toHaveTextContent('english'));
  });

  it('restores persisted preference and rejects invalid stored values', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'english');
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('language')).toHaveTextContent('english'));
  });

  it('falls back when stored value is invalid', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('pt-PT');
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'invalid');

    renderProvider();

    expect(screen.getByTestId('language')).toHaveTextContent('portuguese');
  });

  it('persists changes and updates html lang without reload', async () => {
    const user = userEvent.setup();
    renderProvider();

    await user.click(screen.getByRole('button', { name: 'EN' }));

    await waitFor(() =>
      expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('english'),
    );
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByText('View projects')).toBeInTheDocument();
  });
});
