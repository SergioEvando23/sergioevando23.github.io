import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';

export default function ExperienciaPage() {
  return (
    <>
      <Header />
      <main>
        <Container className="py-16 sm:py-20">
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 shadow-[var(--shadow-card)]">
            <h1 className="text-4xl font-black text-text">Experiência</h1>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
