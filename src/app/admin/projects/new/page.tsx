'use client';

import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/components/auth';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { useLanguage } from '@/components/language';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NewStudyProjectPage() {
  const { textos } = useLanguage();
  const { isAdmin, adminLoading, loading } = useAuth();

  if (loading || adminLoading) {
    return (
      <>
        <Header />
        <main className="py-20">
          <Container>
            <p className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
              {textos.admin.checkingAccess}
            </p>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="py-20">
          <Container className="flex flex-col gap-5">
            <h1 className="text-3xl font-black text-text">
              {textos.admin.accessDeniedTitle}
            </h1>
            <p className="max-w-2xl leading-7 text-text-muted">
              {textos.admin.accessDeniedDescription}
            </p>
            <Button
              href="/"
              leftIcon={<ArrowBackIcon aria-hidden="true" />}
              variant="secondary"
            >
              {textos.common.previous}
            </Button>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="py-12">
        <Container className="flex flex-col gap-8">
          <Link
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
            href="/"
          >
            <ArrowBackIcon aria-hidden="true" fontSize="small" />
            {textos.common.previous}
          </Link>
          <ProjectForm />
        </Container>
      </main>
      <Footer />
    </>
  );
}
