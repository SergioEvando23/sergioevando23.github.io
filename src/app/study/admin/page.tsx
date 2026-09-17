import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { StudyAdminPage } from '@/components/study/StudyAdmin/StudyAdminPage';

export default function StudyAdminRoute() {
  return (
    <>
      <Header />
      <main>
        <StudyAdminPage />
      </main>
      <Footer />
    </>
  );
}
