import { afterEach, describe, expect, it, vi } from 'vitest';

const { getApps, initializeApp } = vi.hoisted(() => ({
  getApps: vi.fn(),
  initializeApp: vi.fn(),
}));

vi.mock('firebase/app', () => ({ getApps, initializeApp }));

import { getFirebaseApp, hasFirebaseConfig } from './client';
import { FirebaseConfigError } from './errors';

const config = {
  NEXT_PUBLIC_FIREBASE_API_KEY: 'api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'example',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'example.appspot.com',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'app-id',
};

describe('Firebase client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('reuses the initialized Firebase app', () => {
    const app = { name: 'existing-app' };
    getApps.mockReturnValue([app]);

    expect(getFirebaseApp()).toBe(app);
    expect(initializeApp).not.toHaveBeenCalled();
  });

  it('initializes Firebase from complete public configuration', () => {
    Object.entries(config).forEach(([name, value]) => vi.stubEnv(name, value));
    getApps.mockReturnValue([]);
    const app = { name: 'new-app' };
    initializeApp.mockReturnValue(app);

    expect(hasFirebaseConfig()).toBe(true);
    expect(getFirebaseApp()).toBe(app);
    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: config.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: config.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: config.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: config.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  });

  it('reports the missing public Firebase configuration', () => {
    Object.keys(config).forEach((name) => vi.stubEnv(name, ''));
    getApps.mockReturnValue([]);

    expect(hasFirebaseConfig()).toBe(false);
    expect(() => getFirebaseApp()).toThrow(FirebaseConfigError);
    expect(() => getFirebaseApp()).toThrow('apiKey');
  });
});
