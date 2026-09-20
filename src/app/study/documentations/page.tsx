import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { StudyDocumentationsPage } from '@/components/study/StudyDocumentations';

export default function StudyDocumentationsRoute() {
  return (
    <>
      <Header />
      <StudyDocumentationsPage />
      <Footer />
    </>
  );
}
