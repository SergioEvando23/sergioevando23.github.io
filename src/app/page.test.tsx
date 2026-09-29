import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '@/components/auth';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { resumes } from '@/config/resumes';
import { LANGUAGE_STORAGE_KEY } from '@/i18n/config';
import Home from './page';

function renderHome(initial = 'portuguese') {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, initial);

  return render(
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Home />
        </AuthProvider>
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

    expect(portugueseResume).toHaveAttribute('href', resumes.portuguese.href);
    expect(portugueseResume).toHaveAttribute('download', resumes.portuguese.fileName);
    expect(englishResume).toHaveAttribute('href', resumes.english.href);
    expect(englishResume).toHaveAttribute('download', resumes.english.fileName);
  });

  it('renders the study gallery navigation and documentation links', () => {
    renderHome();

    expect(screen.getAllByRole('link', { name: 'Galeria de projetos' })).toHaveLength(2);

    const documentationLinks = screen.getAllByRole('link', {
      name: 'Leia documentações de estudos',
    });

    expect(documentationLinks).toHaveLength(3);
    documentationLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/study/documentations');
    });
  });

  it('updates header hero sections footer and keeps carousel state after language change', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getAllByRole('button', { name: 'Proximo slide' })[0]);
    expect(screen.getAllByText('Mobile - Flutter + Dart')[0]).toBeVisible();

    await user.click(
      screen.getAllByRole('button', { name: 'Alterar idioma para ingles' })[0],
    );

    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getAllByRole('link', { name: 'Education' })[0]).toHaveAttribute(
      'href',
      '/education',
    );
    expect(screen.getAllByRole('link', { name: 'Experience' })[0]).toHaveAttribute(
      'href',
      '/experience',
    );
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
      resumes.portuguese.href,
    );
    expect(screen.getByRole('link', { name: 'Download resume EN' })).toHaveAttribute(
      'href',
      resumes.english.href,
    );
  });
});
