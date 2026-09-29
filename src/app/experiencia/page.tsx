'use client';

import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CodeIcon from '@mui/icons-material/Code';
import InsightsIcon from '@mui/icons-material/Insights';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/components/language';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';

const experiences = [
  {
    role: 'Engenheiro de Software Fullstack Web & Mobile',
    company: 'XP Inc.',
    period: 'Set. 2022 — atual',
    current: true,
    description: 'Atuação no desenvolvimento de produtos financeiros de alta escala, contribuindo em toda a jornada de engenharia, do desenho à operação em produção, com foco em performance, qualidade e experiência do usuário.',
    responsibilities: ['Participação em decisões de arquitetura e migrações de monólito para microfrontends.', 'Desenvolvimento de aplicações web com React e TypeScript, com foco em escalabilidade e manutenibilidade.', 'Desenvolvimento de aplicações mobile com Flutter.', 'Implementação e manutenção de pipelines de CI/CD, testes unitários e testes E2E (Playwright).', 'Atuação na resposta a incidentes em produção e participação em war rooms.', 'Desenvolvimento de agentes de IA para modernização de código legado e aumento de produtividade.'],
    technologies: ['⚛ React', 'TS TypeScript', '◢ Flutter', '◆ Dart', '⬡ Node.js', '⚙ CI/CD', '🎭 Playwright'],
  },
  {
    role: 'Desenvolvedor Frontend & Mobile',
    company: 'Eduardo Costa Software Solutions',
    period: '2022 · 6 meses',
    description: 'Desenvolvimento de aplicações web e mobile, com foco em interfaces modernas, performance e boa experiência do usuário.',
    responsibilities: ['Desenvolvimento de interfaces web com React.', 'Desenvolvimento de aplicações mobile com React Native.', 'Implementação de interfaces com Styled Components.', 'Integração com APIs REST e consumo de serviços externos.'],
    technologies: ['⚛ React', '⚛ React Native', 'JS JavaScript', '● Styled Components', '🔗 REST APIs'],
  },
];

const highlights = [
  { title: '4+ anos de experiência', subtitle: 'Construindo produtos reais', Icon: AddBusinessOutlinedIcon },
  { title: 'Web & Mobile', subtitle: 'Do frontend ao backend', Icon: CodeIcon },
  { title: 'Produtos de alta escala', subtitle: 'Performance, qualidade e impacto', Icon: InsightsIcon },
];

export default function ExperienciaPage() {
  const { textos } = useLanguage();

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-var(--header-height))]">
        <Container className="py-4 sm:py-5">
          <section className="rounded-[13px] border border-transparent bg-surface/85 px-5 py-4 shadow-[var(--shadow-card)] sm:px-6 sm:py-4.5">
            <h1 className="text-3xl font-black tracking-[-0.03em] text-text sm:text-[34px]">{textos.navigation.experience}</h1>
          </section>

          <section aria-label="Destaques profissionais" className="mt-4 grid overflow-hidden rounded-[10px] border border-transparent bg-surface/85 shadow-[var(--shadow-card)] sm:grid-cols-3">
            {highlights.map(({ title, subtitle, Icon }) => (
              <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:border-r sm:border-b-0 last:border-r-0 last:border-b-0" key={title}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/20 text-primary"><Icon aria-hidden="true" sx={{ fontSize: 18 }} /></span>
                <div><p className="text-sm font-bold text-text">{title}</p><p className="mt-0.5 text-xs text-text-muted">{subtitle}</p></div>
              </div>
            ))}
          </section>

          <section aria-label="Histórico profissional" className="relative mt-3 space-y-3 border-l border-primary/35 pl-7 sm:ml-3 sm:pl-7">
            {experiences.map((experience) => (
              <article className="relative rounded-[10px] border border-transparent bg-surface/90 px-5 py-3.5 shadow-[var(--shadow-card)]" key={experience.company}>
                <span aria-hidden="true" className="absolute -left-[2.42rem] top-1 h-5 w-5 rounded-full border-[3px] border-primary bg-surface shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]" />
                <h2 className="text-lg font-black leading-6 text-text">{experience.role}</h2>
                <p className="mt-0.5 text-xs font-semibold text-text-muted">{experience.company}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1"><CalendarMonthOutlinedIcon aria-hidden="true" sx={{ fontSize: 12 }} />{experience.period}</span>
                  {experience.current ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Atual</span> : null}
                  <span className="inline-flex items-center gap-1"><LocationOnOutlinedIcon aria-hidden="true" sx={{ fontSize: 12 }} />Remoto · Brasil</span>
                </div>
                <p className="mt-2.5 max-w-[54rem] text-sm leading-5 text-text-muted">{experience.description}</p>
                <h3 className="mt-3 text-sm font-bold text-text">Principais responsabilidades e resultados</h3>
                <ul className="mt-1.5 space-y-1 text-xs leading-5 text-text-muted">
                  {experience.responsibilities.map((responsibility) => <li className="flex gap-2" key={responsibility}><span className="font-black text-primary">✦</span><span>{responsibility}</span></li>)}
                </ul>
                <div className="mt-2 border-t border-border pt-2">
                  <p className="mb-1.5 text-[13px] font-bold text-text-muted">Tecnologias</p>
                  <div className="flex flex-wrap gap-1.5">{experience.technologies.map((technology) => <Tag className="px-2 py-0.5 text-[13px]" key={technology} variant="primary">{technology}</Tag>)}</div>
                </div>
              </article>
            ))}
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
