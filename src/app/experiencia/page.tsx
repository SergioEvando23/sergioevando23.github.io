'use client';

import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CodeIcon from '@mui/icons-material/Code';
import InsightsIcon from '@mui/icons-material/Insights';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { experienceDictionary } from './dicionario';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/components/language';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';

const highlightIcons = [AddBusinessOutlinedIcon, CodeIcon, InsightsIcon];

export default function ExperienciaPage() {
  const { idioma } = useLanguage();
  const textos = experienceDictionary[idioma];

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-var(--header-height))]">
        <Container className="py-4 sm:py-5">
          <section className="rounded-[13px] border border-transparent bg-surface/85 px-5 py-4 shadow-[var(--shadow-card)] sm:px-6 sm:py-4.5">
            <h1 className="text-3xl font-black tracking-[-0.03em] text-text sm:text-[34px]">{textos.title}</h1>
          </section>

          <section aria-label={textos.title} className="mt-4 grid overflow-hidden rounded-[10px] border border-transparent bg-surface/85 shadow-[var(--shadow-card)] sm:grid-cols-3">
            {textos.highlights.map((highlight, index) => {
              const Icon = highlightIcons[index] ?? AddBusinessOutlinedIcon;
              return <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:border-r sm:border-b-0 last:border-r-0 last:border-b-0" key={highlight.title}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/20 text-primary"><Icon aria-hidden="true" sx={{ fontSize: 18 }} /></span><div><p className="text-sm font-bold text-text">{highlight.title}</p><p className="mt-0.5 text-xs text-text-muted">{highlight.subtitle}</p></div></div>;
            })}
          </section>

          <section aria-label={textos.title} className="relative mt-3 space-y-3 border-l border-primary/35 pl-7 sm:ml-3 sm:pl-7">
            {textos.experiences.map((experience) => (
              <article className="relative rounded-[10px] border border-transparent bg-surface/90 px-5 py-3.5 shadow-[var(--shadow-card)]" key={experience.company}>
                <span aria-hidden="true" className="absolute -left-[2.42rem] top-1 h-5 w-5 rounded-full border-[3px] border-primary bg-surface shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]" />
                <h2 className="text-lg font-black leading-6 text-text">{experience.role}</h2><p className="mt-0.5 text-xs font-semibold text-text-muted">{experience.company}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted"><span className="inline-flex items-center gap-1"><CalendarMonthOutlinedIcon aria-hidden="true" sx={{ fontSize: 12 }} />{experience.period}</span>{experience.current ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{textos.current}</span> : null}<span className="inline-flex items-center gap-1"><LocationOnOutlinedIcon aria-hidden="true" sx={{ fontSize: 12 }} />{textos.remoteBrazil}</span></div>
                <p className="mt-2.5 max-w-[54rem] text-sm leading-5 text-text-muted">{experience.description}</p><h3 className="mt-3 text-sm font-bold text-text">{textos.responsibilitiesTitle}</h3>
                <ul className="mt-1.5 space-y-1 text-xs leading-5 text-text-muted">{experience.responsibilities.map((responsibility) => <li className="flex gap-2" key={responsibility}><span className="font-black text-primary">✦</span><span>{responsibility}</span></li>)}</ul>
                <div className="mt-2 border-t border-border pt-2"><p className="mb-1.5 text-[13px] font-bold text-text-muted">{textos.technologiesTitle}</p><div className="flex flex-wrap gap-1.5">{experience.technologies.map((technology) => <Tag className="px-2 py-0.5 text-[13px]" key={technology} variant="primary">{technology}</Tag>)}</div></div>
              </article>
            ))}
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
