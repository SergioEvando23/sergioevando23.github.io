import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dictionary } from '@/i18n';
import {
  ENTRY_CHOICE_STORAGE_KEY,
  ENTRY_CHOICE_TTL_MS,
  WelcomeGate,
} from './WelcomeGate';

const mocks = vi.hoisted(() => ({
  descriptionOverride: null as string | null,
  language: 'portuguese' as 'portuguese' | 'english',
  pathname: '/',
  auth: {
    authError: null as string | null,
    loading: false,
    signInWithGoogle: vi.fn<() => Promise<void>>(),
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock('@/components/language', () => ({
  LanguageSwitcher: () => <span>Language switcher</span>,
  useLanguage: () => {
    const translations = dictionary[mocks.language];

    return {
      language: mocks.language,
      translations: mocks.descriptionOverride
        ? {
            ...translations,
            brand: { ...translations.brand, description: mocks.descriptionOverride },
          }
        : translations,
    };
  },
}));

vi.mock('@/components/theme', () => ({
  ThemeSwitcher: () => <span>Theme switcher</span>,
}));

vi.mock('@/components/brand/Logo', () => ({
  Logo: () => <span>SC</span>,
}));

vi.mock('../AuthProvider', () => ({
  useAuth: () => mocks.auth,
}));

function renderGate() {
  return render(
    <WelcomeGate>
      <main>Portfolio content</main>
    </WelcomeGate>,
  );
}

describe('WelcomeGate branch coverage', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.descriptionOverride = null;
    mocks.language = 'portuguese';
    mocks.pathname = '/';
    mocks.auth.authError = null;
    mocks.auth.loading = false;
    mocks.auth.signInWithGoogle.mockReset();
  });

  it('accepts Google persistence and discards malformed storage', async () => {
    localStorage.setItem(
      ENTRY_CHOICE_STORAGE_KEY,
      JSON.stringify({ choice: 'google', expiresAt: Date.now() + ENTRY_CHOICE_TTL_MS }),
    );
    renderGate();
    expect(await screen.findByText('Portfolio content')).toBeInTheDocument();

    localStorage.clear();
    localStorage.setItem(ENTRY_CHOICE_STORAGE_KEY, '{invalid-json');
    renderGate();
    expect(await screen.findByText('Bem-vindo ao meu portfolio')).toBeInTheDocument();
    expect(localStorage.getItem(ENTRY_CHOICE_STORAGE_KEY)).toBeNull();
  });

  it('rejects persisted choices with invalid values', async () => {
    localStorage.setItem(
      ENTRY_CHOICE_STORAGE_KEY,
      JSON.stringify({ choice: 'admin', expiresAt: 'tomorrow' }),
    );
    renderGate();

    expect(await screen.findByText('Bem-vindo ao meu portfolio')).toBeInTheDocument();
    expect(localStorage.getItem(ENTRY_CHOICE_STORAGE_KEY)).toBeNull();
  });

  it('bypasses the welcome screen for the study administration route', async () => {
    mocks.pathname = '/study/admin';
    renderGate();

    expect(await screen.findByText('Portfolio content')).toBeInTheDocument();
  });

  it('persists a successful Google sign-in', async () => {
    const user = userEvent.setup();
    mocks.auth.signInWithGoogle.mockResolvedValue(undefined);
    renderGate();

    await user.click(await screen.findByRole('button', { name: 'Entrar com Google' }));

    expect(mocks.auth.signInWithGoogle).toHaveBeenCalledOnce();
    expect(await screen.findByText('Portfolio content')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(ENTRY_CHOICE_STORAGE_KEY) ?? '')).toMatchObject({
      choice: 'google',
    });
  });

  it('uses the English description limit', async () => {
    mocks.language = 'english';
    renderGate();

    expect(await screen.findByText(/production incidents\.\.\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View complete description' })).toBeInTheDocument();
  });

  it('omits the description action when no limit marker exists', async () => {
    mocks.descriptionOverride = 'A concise professional description.';
    renderGate();

    expect(await screen.findByText('A concise professional description....')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Visualizar descrição completa' })).toBeNull();
  });

  it('uses known and fallback authentication errors', async () => {
    mocks.auth.authError = 'network';
    const { rerender } = renderGate();
    expect(await screen.findByText('Falha de rede ao autenticar. Tente novamente.')).toBeInTheDocument();

    mocks.auth.authError = 'unexpected';
    rerender(
      <WelcomeGate>
        <main>Portfolio content</main>
      </WelcomeGate>,
    );

    expect(await screen.findByText('Nao foi possivel autenticar com Google.')).toBeInTheDocument();
  });
});
