import { describe, expect, it, vi } from 'vitest';

const { getAuth, signInWithPopup, signInWithRedirect, signOut, setCustomParameters } =
  vi.hoisted(() => ({
    getAuth: vi.fn(),
    signInWithPopup: vi.fn(),
    signInWithRedirect: vi.fn(),
    signOut: vi.fn(),
    setCustomParameters: vi.fn(),
  }));

vi.mock('firebase/auth', () => ({
  getAuth,
  GoogleAuthProvider: class {
    setCustomParameters = setCustomParameters;
  },
  signInWithPopup,
  signInWithRedirect,
  signOut,
}));
vi.mock('./client', () => ({ getFirebaseApp: vi.fn(() => 'firebase-app') }));

import {
  createGoogleProvider,
  getFirebaseAuth,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  signOutFromFirebase,
} from './auth';

describe('Firebase auth helpers', () => {
  it('creates an account-selection Google provider', () => {
    expect(createGoogleProvider()).toBeInstanceOf(Object);
    expect(setCustomParameters).toHaveBeenCalledWith({ prompt: 'select_account' });
  });

  it('delegates authentication operations to Firebase', async () => {
    const auth = { currentUser: null };
    getAuth.mockReturnValue(auth);
    signInWithPopup.mockResolvedValue('popup-result');
    signInWithRedirect.mockResolvedValue('redirect-result');
    signOut.mockResolvedValue(undefined);

    expect(getFirebaseAuth()).toBe(auth);
    await expect(signInWithGooglePopup()).resolves.toBe('popup-result');
    await expect(signInWithGoogleRedirect()).resolves.toBe('redirect-result');
    await expect(signOutFromFirebase()).resolves.toBeUndefined();
    expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(Object));
    expect(signInWithRedirect).toHaveBeenCalledWith(auth, expect.any(Object));
    expect(signOut).toHaveBeenCalledWith(auth);
  });
});
