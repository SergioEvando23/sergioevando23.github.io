import { describe, expect, it } from 'vitest';
import { FirebaseConfigError, getAuthErrorKey } from './errors';

describe('Firebase errors', () => {
  it.each([
    ['auth/popup-closed-by-user', 'popupClosed'],
    ['auth/cancelled-popup-request', 'popupClosed'],
    ['auth/popup-blocked', 'popupBlocked'],
    ['auth/network-request-failed', 'network'],
    ['auth/unauthorized-domain', 'unauthorizedDomain'],
    ['auth/other', 'unknown'],
  ])('maps %s to %s', (code, expected) => {
    expect(getAuthErrorKey(Object.assign(new Error('failed'), { code }))).toBe(expected);
  });

  it('handles unknown values and identifies configuration errors', () => {
    expect(getAuthErrorKey({ code: 'auth/network-request-failed' })).toBe('unknown');
    const error = new FirebaseConfigError('missing config');
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('FirebaseConfigError');
  });
});
