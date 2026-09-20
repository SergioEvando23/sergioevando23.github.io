import { Suspense } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { StudyDocumentationsAdminPage } from '@/components/study/StudyDocumentations/StudyDocumentationsAdminPage';

export default function StudyDocumentationsAdminRoute() {
  return (
    <>
      <Header />
      <main>
        <Suspense>
          <StudyDocumentationsAdminPage />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
