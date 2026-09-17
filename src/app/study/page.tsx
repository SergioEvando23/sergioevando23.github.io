import { StudyGallery } from '@/components/gallery';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function StudyPage() {
  return (
    <>
      <Header />
      <main>
        <StudyGallery />
      </main>
      <Footer />
    </>
  );
}
