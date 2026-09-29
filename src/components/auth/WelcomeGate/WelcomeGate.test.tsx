import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { AuthProvider } from '@/components/auth';
import { LanguageProvider } from '@/components/language';
import { ThemeProvider } from '@/components/theme';
import {
  WelcomeGate,
  ENTRY_CHOICE_STORAGE_KEY,
  ENTRY_CHOICE_TTL_MS,
} from './WelcomeGate';

vi.mock('@/lib/firebase/client', () => ({
  hasFirebaseConfig: () => false,
}));

function renderGate() {
  localStorage.setItem('Sérgio-portfolio-language', 'portuguese');

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
    expect(screen.getByText(/incidentes em produção\.\.\./)).toBeInTheDocument();
    expect(screen.getByText('React.js')).toBeInTheDocument();
    expect(screen.getByText('ReactNative')).toBeInTheDocument();
    expect(screen.getByText('Flutter')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('expands the professional description on request', async () => {
    const user = userEvent.setup();
    renderGate();

    await user.click(
      await screen.findByRole('button', { name: 'Visualizar descrição completa' }),
    );

    expect(screen.getByRole('button', { name: 'Mostrar menos' })).toBeInTheDocument();
    expect(screen.getByText(/Atualmente, curso Engenharia de Software/)).toBeInTheDocument();
  });

  it('continues as visitor and stores the entry choice', async () => {
    const user = userEvent.setup();
    renderGate();

    await user.click(
      await screen.findByRole('button', { name: 'Continuar como visitante' }),
    );

    expect(JSON.parse(localStorage.getItem(ENTRY_CHOICE_STORAGE_KEY) ?? '')).toEqual({
      choice: 'visitor',
      expiresAt: expect.any(Number),
    });
    expect(screen.getByText('Portfolio content')).toBeInTheDocument();
  });

  it('asks for a new choice after 48 hours', async () => {
    localStorage.setItem(
      ENTRY_CHOICE_STORAGE_KEY,
      JSON.stringify({ choice: 'visitor', expiresAt: Date.now() - 1 }),
    );
    renderGate();

    expect(
      await screen.findByRole('heading', {
        name: 'Bem-vindo ao meu portfolio',
      }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(ENTRY_CHOICE_STORAGE_KEY)).toBeNull();
  });

  it('keeps a choice valid for up to 48 hours', async () => {
    localStorage.setItem(
      ENTRY_CHOICE_STORAGE_KEY,
      JSON.stringify({ choice: 'visitor', expiresAt: Date.now() + ENTRY_CHOICE_TTL_MS }),
    );
    renderGate();

    expect(await screen.findByText('Portfolio content')).toBeInTheDocument();
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
