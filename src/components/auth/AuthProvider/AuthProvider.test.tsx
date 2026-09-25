import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  hasFirebaseConfig: vi.fn(),
  getFirebaseAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithGooglePopup: vi.fn(),
  signInWithGoogleRedirect: vi.fn(),
  signOutFromFirebase: vi.fn(),
  getAuthErrorKey: vi.fn(),
  useAdminStatus: vi.fn(() => ({ isAdmin: false, loading: false })),
}));

vi.mock('firebase/auth', () => ({ onAuthStateChanged: mocks.onAuthStateChanged }));
vi.mock('@/lib/firebase/client', () => ({ hasFirebaseConfig: mocks.hasFirebaseConfig }));
vi.mock('@/lib/firebase/auth', () => ({
  getFirebaseAuth: mocks.getFirebaseAuth,
  signInWithGooglePopup: mocks.signInWithGooglePopup,
  signInWithGoogleRedirect: mocks.signInWithGoogleRedirect,
  signOutFromFirebase: mocks.signOutFromFirebase,
}));
vi.mock('@/lib/firebase/errors', () => ({ getAuthErrorKey: mocks.getAuthErrorKey }));
vi.mock('@/hooks/useAdminStatus', () => ({ useAdminStatus: mocks.useAdminStatus }));

import { AuthProvider, useAuth } from './AuthProvider';

function Consumer() {
  const auth = useAuth();

  return (
    <>
      <span>{auth.loading ? 'loading' : auth.user?.email ?? 'anonymous'}</span>
      <span>{auth.authError ?? 'no-error'}</span>
      <button onClick={() => void auth.signInWithGoogle().catch(() => undefined)}>sign-in</button>
      <button onClick={() => void auth.signOut()}>sign-out</button>
    </>
  );
}

describe('AuthProvider', () => {
  afterEach(() => vi.clearAllMocks());

  it('finishes loading without Firebase and reports a missing-config sign-in', async () => {
    mocks.hasFirebaseConfig.mockReturnValue(false);
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText('anonymous')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'sign-in' }));
    expect(screen.getByText('missingConfig')).toBeInTheDocument();
  });

  it('subscribes to Firebase, falls back to redirect and signs out', async () => {
    const user = userEvent.setup();
    const unsubscribe = vi.fn();
    const firebaseUser = { email: 'admin@example.com' };
    mocks.hasFirebaseConfig.mockReturnValue(true);
    mocks.getFirebaseAuth.mockReturnValue('auth');
    mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(firebaseUser);
      return unsubscribe;
    });
    mocks.signInWithGooglePopup.mockRejectedValue(new Error('blocked'));
    mocks.getAuthErrorKey.mockReturnValue('popupBlocked');
    mocks.signInWithGoogleRedirect.mockResolvedValue(undefined);
    mocks.signOutFromFirebase.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText('admin@example.com')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'sign-in' }));
    await waitFor(() => expect(mocks.signInWithGoogleRedirect).toHaveBeenCalledOnce());
    await user.click(screen.getByRole('button', { name: 'sign-out' }));
    expect(mocks.signOutFromFirebase).toHaveBeenCalledOnce();
    expect(screen.getByText('anonymous')).toBeInTheDocument();
  });

  it('requires its context provider', () => {
    expect(() => render(<Consumer />)).toThrow('useAuth must be used within AuthProvider');
  });
});
