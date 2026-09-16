import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { curriculos } from '@/config/curriculos';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import Home from './page';

function renderHome(initial = 'portugues') {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, initial);

  return render(
    <ThemeProvider>
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe('Home i18n integration', () => {
  it('shows both resume links with correct paths and download names in portuguese', () => {
    renderHome();

    const portugueseResume = screen.getByRole('link', {
      name: 'Baixar curriculo PT',
    });
    const englishResume = screen.getByRole('link', {
      name: 'Baixar curriculo EN',
    });

    expect(portugueseResume).toHaveAttribute('href', curriculos.portugues.href);
    expect(portugueseResume).toHaveAttribute('download', curriculos.portugues.fileName);
    expect(englishResume).toHaveAttribute('href', curriculos.ingles.href);
    expect(englishResume).toHaveAttribute('download', curriculos.ingles.fileName);
  });

  it('updates header hero sections footer and keeps carousel state after language change', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getAllByRole('button', { name: 'Proximo slide' })[0]);
    expect(screen.getAllByText('Mobile - Flutter + Dart')[0]).toBeVisible();

    await user.click(
      screen.getAllByRole('button', { name: 'Alterar idioma para ingles' })[0],
    );

    expect(screen.getAllByRole('link', { name: 'Projects' })[0]).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Fullstack Web & Mobile Software Engineer',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Technologies and technical focus',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved\./)).toBeInTheDocument();
    expect(screen.getAllByText('Mobile - Flutter + Dart')[0]).toBeVisible();
    expect(screen.getByRole('link', { name: 'Download resume PT' })).toHaveAttribute(
      'href',
      curriculos.portugues.href,
    );
    expect(screen.getByRole('link', { name: 'Download resume EN' })).toHaveAttribute(
      'href',
      curriculos.ingles.href,
    );
  });
});
