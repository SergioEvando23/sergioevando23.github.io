'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';
import LoginIcon from '@mui/icons-material/Login';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import { LanguageSwitcher, useLanguage } from '@/components/language';
import { ThemeSwitcher } from '@/components/theme';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useAuth } from '../AuthProvider';

export const ENTRY_CHOICE_STORAGE_KEY = 'Sérgio-portfolio-entry-choice';
export type EntryChoice = 'google' | 'visitor';

function isEntryChoice(value: unknown): value is EntryChoice {
  return value === 'google' || value === 'visitor';
}

export function WelcomeGate({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<EntryChoice | null>(null);
  const [mounted, setMounted] = useState(false);
  const { textos } = useLanguage();
  const { signInWithGoogle, authError, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = localStorage.getItem(ENTRY_CHOICE_STORAGE_KEY);
      setChoice(isEntryChoice(stored) ? stored : null);
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const continueAsVisitor = () => {
    localStorage.setItem(ENTRY_CHOICE_STORAGE_KEY, 'visitor');
    setChoice('visitor');
  };

  const signIn = async () => {
    try {
      await signInWithGoogle();
      localStorage.setItem(ENTRY_CHOICE_STORAGE_KEY, 'google');
      setChoice('google');
    } catch {
      localStorage.removeItem(ENTRY_CHOICE_STORAGE_KEY);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background" aria-busy="true">
        <span className="sr-only">{textos.common.loading}</span>
      </main>
    );
  }

  if (choice) {
    return (
      <div className="animate-[fade-in_var(--transition-normal)_ease-out]">
        {children}
      </div>
    );
  }

  if (pathname === '/study/admin') {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <Container className="flex min-h-screen flex-col py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-primary text-lg font-black text-primary-foreground shadow-[var(--shadow-glow)]">
              {textos.brand.initials}
            </div>
            <div>
              <p className="text-sm font-bold">{textos.brand.name}</p>
              <p className="text-xs text-text-muted">{textos.brand.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_0.85fr]">
          <div className="flex max-w-3xl flex-col gap-6">
            <span className="w-fit rounded-[var(--radius-full)] border border-border bg-surface-secondary px-4 py-2 text-sm font-semibold text-accent">
              {textos.brand.role}
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-black leading-tight text-text sm:text-6xl">
                {textos.auth.welcomeTitle}
              </h1>
              <p className="max-w-2xl text-xl font-semibold text-primary">
                {textos.auth.welcomeSubtitle}
              </p>
              <p className="max-w-2xl text-base leading-7 text-text-muted">
                {textos.auth.optionalLogin}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                leftIcon={<GoogleIcon aria-hidden="true" />}
                loading={loading}
                onClick={signIn}
                size="large"
              >
                {textos.auth.signInWithGoogle}
              </Button>
              <Button
                leftIcon={<PersonOutlineIcon aria-hidden="true" />}
                onClick={continueAsVisitor}
                size="large"
                variant="secondary"
              >
                {textos.auth.continueAsVisitor}
              </Button>
            </div>

            {authError ? (
              <p className="max-w-2xl rounded-[var(--radius-md)] border border-error/40 bg-surface-secondary px-4 py-3 text-sm font-semibold text-error">
                {authError === 'missingConfig'
                  ? textos.auth.missingConfig
                  : (textos.auth.errors[authError as keyof typeof textos.auth.errors] ??
                    textos.auth.errors.unknown)}
              </p>
            ) : null}
          </div>

          <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)] backdrop-blur">
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-6">
              <div className="mb-8 flex items-center justify-between">
                <LoginIcon aria-hidden="true" className="text-primary" />
                <span className="text-xs font-bold uppercase text-text-muted">
                  {textos.brand.initials}
                </span>
              </div>
              <p className="text-2xl font-black text-text">{textos.brand.name}</p>
              <p className="mt-3 leading-7 text-text-muted">{textos.brand.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <span className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-muted">
                  React
                </span>
                <span className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-muted">
                  TypeScript
                </span>
                <span className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-muted">
                  Firebase
                </span>
                <span className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-muted">
                  Mobile
                </span>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
