export class FirebaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseConfigError';
  }
}

export function getAuthErrorKey(error: unknown) {
  if (!(error instanceof Error) || !('code' in error)) {
    return 'unknown';
  }

  const code = String((error as { code: unknown }).code);

  if (code.includes('popup-closed') || code.includes('cancelled-popup-request')) {
    return 'popupClosed';
  }

  if (code.includes('popup-blocked')) {
    return 'popupBlocked';
  }

  if (code.includes('network')) {
    return 'network';
  }

  if (code.includes('unauthorized-domain')) {
    return 'unauthorizedDomain';
  }

  return 'unknown';
}
