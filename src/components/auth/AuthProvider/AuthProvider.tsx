'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  getFirebaseAuth,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  signOutFromFirebase,
} from '@/lib/firebase/auth';
import { hasFirebaseConfig } from '@/lib/firebase/client';
import { getAuthErrorKey } from '@/lib/firebase/errors';
import { useAdminStatus } from '@/hooks/useAdminStatus';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isAdmin, loading: adminLoading } = useAdminStatus(user);

  useEffect(() => {
    if (!hasFirebaseConfig()) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      setAuthError(null);
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);

    if (!hasFirebaseConfig()) {
      setAuthError('missingConfig');
      return;
    }

    try {
      await signInWithGooglePopup();
    } catch (error) {
      const key = getAuthErrorKey(error);
      setAuthError(key);

      if (key === 'popupBlocked') {
        await signInWithGoogleRedirect();
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);

    if (!hasFirebaseConfig()) {
      setUser(null);
      return;
    }

    await signOutFromFirebase();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin,
      adminLoading,
      authError,
      signInWithGoogle,
      signOut,
    }),
    [adminLoading, authError, isAdmin, loading, signInWithGoogle, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
