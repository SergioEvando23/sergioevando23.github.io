import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import { AuthProvider } from '@/components/auth';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import { WelcomeGate, ENTRY_CHOICE_STORAGE_KEY } from './WelcomeGate';

function renderGate() {
  localStorage.setItem('sergio-portfolio-language', 'portugues');

  return render(
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <WelcomeGate>
            <main>Portfolio content</main>
          </WelcomeGate>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>,
  );
}

describe('WelcomeGate', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the exclusive welcome screen on first visit', async () => {
    renderGate();

    expect(
      await screen.findByRole('heading', {
        name: 'Bem-vindo ao meu portfolio',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Portfolio content')).not.toBeInTheDocument();
  });

  it('continues as visitor and stores the entry choice', async () => {
    const user = userEvent.setup();
    renderGate();

    await user.click(
      await screen.findByRole('button', { name: 'Continuar como visitante' }),
    );

    expect(localStorage.getItem(ENTRY_CHOICE_STORAGE_KEY)).toBe('visitor');
    expect(screen.getByText('Portfolio content')).toBeInTheDocument();
  });

  it('shows a translated authentication error when Firebase is not configured', async () => {
    const user = userEvent.setup();
    renderGate();

    await user.click(await screen.findByRole('button', { name: 'Entrar com Google' }));

    expect(
      await screen.findByText(/Firebase ainda nao foi configurado/),
    ).toBeInTheDocument();
  });
});
