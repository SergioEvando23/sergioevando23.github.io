'use client';

import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/components/language';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';
import { experienceItems } from '@/data/experience';

export default function ExperienciaPage() {
  const { textos } = useLanguage();

  return (
    <>
      <Header />
      <main>
        <Container className="max-w-5xl py-16 sm:py-20">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              {textos.navigation.experience}
            </p>
            <h1 className="mt-4 text-4xl font-black text-text sm:text-5xl">
              {textos.navigation.experience}
            </h1>
            <p className="mt-4 text-lg leading-8 text-text-muted">{textos.brand.description}</p>
          </div>
          <div className="relative space-y-6 border-l border-primary/40 pl-7 sm:pl-10">
            {experienceItems.map((item) => {
              const experience = textos.experience.items[item.translationKey];
              return (
                <article className="relative rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)]" key={item.id}>
                  <span className="absolute -left-[2.35rem] top-7 flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] border border-primary bg-surface text-primary sm:-left-[3.1rem]">
                    <WorkOutlineIcon aria-hidden="true" fontSize="small" />
                  </span>
                  <h2 className="text-2xl font-black text-text">{experience.title}</h2>
                  <p className="mt-3 leading-7 text-text-muted">{experience.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
