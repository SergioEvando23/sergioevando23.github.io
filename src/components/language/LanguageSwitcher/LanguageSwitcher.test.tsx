import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import { LanguageProvider } from '../LanguageProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

function renderSwitcher(initial = 'portugues') {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, initial);

  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  );
}

describe('LanguageSwitcher', () => {
  it('renders PT and EN with accessible labels', () => {
    renderSwitcher();

    expect(
      screen.getByRole('button', { name: 'Alterar idioma para portugues' }),
    ).toHaveTextContent('PT');
    expect(
      screen.getByRole('button', { name: 'Alterar idioma para ingles' }),
    ).toHaveTextContent('EN');
  });

  it('sets aria-pressed for the active language', async () => {
    renderSwitcher('ingles');

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Change language to English' }),
      ).toHaveAttribute('aria-pressed', 'true'),
    );
    expect(
      screen.getByRole('button', { name: 'Change language to Portuguese' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('changes language by click and keyboard', async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await user.click(screen.getByRole('button', { name: 'Alterar idioma para ingles' }));
    expect(
      screen.getByRole('button', { name: 'Change language to English' }),
    ).toHaveAttribute('aria-pressed', 'true');

    screen.getByRole('button', { name: 'Change language to Portuguese' }).focus();
    await user.keyboard('{Enter}');
    expect(document.documentElement.lang).toBe('pt-BR');
  });
});
