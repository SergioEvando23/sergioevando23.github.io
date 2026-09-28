'use client';

import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CodeIcon from '@mui/icons-material/Code';
import InsightsIcon from '@mui/icons-material/Insights';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/components/language';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';

const professionalExperiences = [
  { role: 'Engenheiro de Software Fullstack Web & Mobile', company: 'XP Inc.', period: 'Set. 2022 — Atual', current: true, description: 'Atuação no desenvolvimento e manutenção de aplicações web escaláveis com React e TypeScript, além de aplicações mobile com Flutter.', responsibilities: ['Decisões arquiteturais e adoção de micro-frontends', 'Testes automatizados unitários, integração e E2E', 'Code reviews, mentoria e onboarding de engenheiros', 'Incidentes em produção e melhoria da estabilidade', 'Monitoramento com Dynatrace e releases com feature flags'], technologies: ['React', 'TypeScript', 'Flutter', 'Dart', 'Node.js', 'CI/CD', 'Playwright'] },
  { role: 'Desenvolvedor Frontend & Mobile', company: 'Eduardo Costa Software Solutions', period: '2021', description: 'Desenvolvimento e evolução de aplicações frontend com foco em interfaces modernas, performance e boa experiência do usuário.', responsibilities: ['Aplicações frontend com React e TypeScript', 'Componentes reutilizáveis e escalabilidade', 'Integração com APIs REST e times backend', 'Correção de bugs e otimizações de performance'], technologies: ['React', 'React Native', 'JavaScript', 'Styled Components', 'REST APIs'] },
];

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
            {professionalExperiences.map((experience) => {
              return (
                <article className="relative rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 shadow-[var(--shadow-card)]" key={experience.company}>
                  <span className="absolute -left-[2.35rem] top-7 flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] border border-primary bg-surface text-primary sm:-left-[3.1rem]">
                    <AddBusinessOutlinedIcon aria-hidden="true" fontSize="small" />
                  </span>
                  <h2 className="text-xl font-black text-text">{experience.role}</h2>
                  <p className="mt-1 font-semibold text-primary">{experience.company}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-muted"><span>{experience.period} · Brasil</span>{experience.current ? <span className="inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-400"><span className="h-2 w-2 rounded-[var(--radius-full)] bg-emerald-400" />Atual</span> : null}</div>
                  <p className="mt-3 text-sm leading-6 text-text-muted">{experience.description}</p>
                  <h3 className="mt-4 text-sm font-bold text-text">Principais responsabilidades e resultados</h3>
                  <ul className="mt-2 space-y-2 text-sm text-text-muted">{experience.responsibilities.map((responsibility) => <li className="flex gap-2" key={responsibility}><span className="text-primary">✦</span>{responsibility}</li>)}</ul>
                  <div className="mt-4 border-t border-border pt-3"><p className="mb-2 text-xs font-bold text-text-muted">Tecnologias</p><div className="flex flex-wrap gap-2">{experience.technologies.map((technology) => <Tag key={technology} variant="primary">{technology}</Tag>)}</div></div>
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
