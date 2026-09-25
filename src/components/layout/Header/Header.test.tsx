import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

const { authState } = vi.hoisted(() => ({
  authState: {
    user: null as null | { email: string; emailVerified: boolean; photoURL?: string | null },
    isAuthenticated: false,
    isAdmin: false,
    adminLoading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  },
}));

vi.mock('@/components/auth', () => ({
  UserAvatar: ({ email }: { email: string | null }) => <span>{email}</span>,
  useAuth: () => authState,
}));
vi.mock('@/components/brand/Logo', () => ({ Logo: () => <span>Logo</span> }));
vi.mock('@/components/language', () => ({
  LanguageSwitcher: () => <span>Language</span>,
  useLanguage: () => ({
    textos: {
      brand: { homeLabel: 'Home' },
      accessibility: {
        mainNavigation: 'Main navigation',
        openGithub: 'Open GitHub',
        openLinkedin: 'Open LinkedIn',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
      },
      auth: { signIn: 'Sign in', signOut: 'Sign out' },
      admin: { insertProjects: 'Insert projects' },
      navigation: new Proxy({}, { get: (_target, key) => String(key) }),
      studyMenu: { gallery: 'Gallery', documentations: 'Documentations' },
    },
  }),
}));
vi.mock('@/components/theme', () => ({ ThemeSwitcher: () => <span>Theme</span> }));
vi.mock('@/components/ui/Container', () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/ui/IconButton', () => ({
  IconButton: ({ label, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
  }) => (
    <button aria-label={label} {...props}>
      {children}
    </button>
  ),
}));

describe('Header', () => {
  afterEach(() => {
    authState.user = null;
    authState.isAuthenticated = false;
    authState.isAdmin = false;
    authState.adminLoading = false;
    vi.clearAllMocks();
  });

  it('opens and closes the mobile navigation and starts Google sign-in', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
    expect(document.querySelector('#mobile-navigation')).toHaveClass('block');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('#mobile-navigation')).toHaveClass('hidden');

    await user.click(screen.getAllByRole('button', { name: 'Sign in' })[0]);
    expect(authState.signInWithGoogle).toHaveBeenCalledOnce();
  });

  it('shows authenticated admin controls and opens social links', async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    authState.user = { email: 'sergioevandocosta@gmail.com', emailVerified: true };
    authState.isAuthenticated = true;
    authState.isAdmin = true;
    render(<Header />);

    expect(screen.getByText('sergioevandocosta@gmail.com')).toBeInTheDocument();
    expect(screen.getAllByText('Insert projects').length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole('button', { name: 'Sign out' })[0]);
    await user.click(screen.getAllByRole('button', { name: 'Open GitHub' })[0]);
    expect(authState.signOut).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalled();
  });
});
