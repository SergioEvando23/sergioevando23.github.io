'use client';

import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CodeIcon from '@mui/icons-material/Code';
import InsightsIcon from '@mui/icons-material/Insights';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/components/language';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';
import { experienceItems } from '@/data/experience';

export default function ExperienciaPage() {
  const { textos } = useLanguage();
  const highlights = [
    { title: '4+ anos de experiência', description: 'Construindo produtos reais', Icon: AddBusinessOutlinedIcon },
    { title: 'Web & Mobile', description: 'Do frontend ao backend', Icon: CodeIcon },
    { title: 'Produtos de alta escala', description: 'Performance, qualidade e impacto', Icon: InsightsIcon },
  ];

  return (
    <>
      <Header />
      <main>
        <Container className="max-w-5xl py-16 sm:py-20">
          <div className="mb-5 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)]">
            <h1 className="text-4xl font-black text-text sm:text-5xl">
              {textos.navigation.experience}
            </h1>
          </div>
          <div className="mb-8 grid gap-3 border border-border bg-surface/80 p-4 shadow-[var(--shadow-card)] sm:grid-cols-3 sm:rounded-[var(--radius-xl)]">
            {highlights.map(({ title, description, Icon }) => {
              return <div className="flex items-center gap-3 p-3" key={title}><span className="grid h-11 w-11 place-items-center rounded-[var(--radius-full)] bg-primary/15 text-primary"><Icon aria-hidden="true" /></span><div><p className="font-bold text-text">{title}</p><p className="text-sm text-text-muted">{description}</p></div></div>;
            })}
          </div>
          <div className="relative space-y-6 border-l border-primary/40 pl-7 sm:pl-10">
            {experienceItems.map((item) => {
              const experience = textos.experience.items[item.translationKey];
              return (
                <article className="relative rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)]" key={item.id}>
                  <span className="absolute -left-[2.35rem] top-7 flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] border border-primary bg-surface text-primary sm:-left-[3.1rem]">
                    <AddBusinessOutlinedIcon aria-hidden="true" fontSize="small" />
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
