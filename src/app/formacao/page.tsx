'use client';

import { useState } from 'react';
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';

const formations = [
  {
    title: 'Engenharia de Software',
    institution: 'Estácio',
    period: 'Out. 2025 — Set. 2029',
    description: 'Bacharelado em Engenharia de Software, conectando fundamentos de computação e sistemas à prática profissional.',
    tags: ['Engenharia de Software', 'Arquitetura', 'Banco de Dados', 'Desenvolvimento de Sistemas'],
    status: 'Em andamento',
    active: true,
  },
  {
    title: 'Desenvolvimento Web Full Stack',
    institution: 'Trybe',
    period: 'Out. 2021 — Out. 2022',
    description: 'Formação intensiva em desenvolvimento web full stack, com projetos práticos e foco em empregabilidade no mercado de tecnologia.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Banco de Dados'],
    status: 'Concluído',
    active: false,
  },
];

const certificates = [
  { title: 'Javascript com Testing Driven Development', category: 'Frontend', tags: ['JavaScript', 'Testes', 'Frontend'], Icon: WorkspacePremiumOutlinedIcon },
  { title: 'Inteligência artificial do zero ao avançado', category: 'Arquitetura', tags: ['IA', 'Arquitetura', 'Automação'], Icon: MenuBookOutlinedIcon },
  { title: 'Módulo - Desenvolvimento web back-end', category: 'Backend', tags: ['Node.js', 'Backend', 'APIs'], Icon: ArchitectureOutlinedIcon },
  { title: 'Módulo - Fundamentos do Desenvolvimento Web', category: 'Frontend', tags: ['HTML', 'CSS', 'JavaScript'], Icon: CodeOutlinedIcon },
];

const filters = ['Todos', 'Frontend', 'Mobile', 'Arquitetura'];

export default function FormacaoPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const visibleCertificates = activeFilter === 'Todos'
    ? certificates
    : certificates.filter((certificate) => certificate.category === activeFilter);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-var(--header-height))]" id="inicio">
        <Container className="py-5 sm:py-7">
          <div className="mx-auto max-w-[1000px]">
            <section className="rounded-[12px] border border-transparent bg-surface/85 px-6 py-5 shadow-[var(--shadow-card)] sm:px-7">
              <h1 className="text-3xl font-black tracking-[-0.03em] text-text sm:text-[34px]">Formação</h1>
            </section>

            <section className="mt-6" aria-labelledby="academic-title">
              <h2 className="text-lg font-black text-text" id="academic-title">Formação acadêmica</h2>
              <div className="relative mt-3 space-y-3 border-l border-primary/35 pl-7 sm:pl-8">
                {formations.map((formation) => (
                  <article className="relative rounded-[10px] border border-transparent bg-surface/90 px-5 py-4 shadow-[var(--shadow-card)]" key={formation.title}>
                    <span className="absolute -left-[2.45rem] top-3 h-5 w-5 rounded-full border-[3px] border-primary bg-surface shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]" />
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[9px] bg-primary/15 text-primary"><SchoolOutlinedIcon aria-hidden="true" sx={{ fontSize: 19 }} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div><h3 className="text-sm font-black text-text">{formation.title}</h3><p className="mt-0.5 text-xs font-semibold text-text-muted">{formation.institution}</p></div>
                          <span className={formation.active ? 'inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary' : 'inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-400'}><span className={formation.active ? 'h-1.5 w-1.5 rounded-full bg-primary' : 'h-1.5 w-1.5 rounded-full bg-emerald-400'} />{formation.status}</span>
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-text-muted sm:grid-cols-[210px_1fr]">
                          <span className="inline-flex items-center gap-1"><CalendarMonthOutlinedIcon aria-hidden="true" sx={{ fontSize: 14 }} />{formation.period}</span>
                          <p className="leading-5">{formation.description}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">{formation.tags.map((tag) => <Tag className="px-2 py-0.5 text-[10px]" key={tag}>{tag}</Tag>)}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="mt-6" aria-labelledby="certificates-title">
              <h2 className="text-lg font-black text-text" id="certificates-title">Certificados</h2>
              <div aria-label="Filtrar certificados" className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                {filters.map((filter) => <button className={activeFilter === filter ? 'shrink-0 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground' : 'shrink-0 rounded-full border border-border bg-surface-secondary px-3 py-1 text-[10px] font-semibold text-text-muted'} key={filter} onClick={() => setActiveFilter(filter)} type="button">{filter}</button>)}
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]" role="list">
                {visibleCertificates.map((certificate) => {
                  const Icon = certificate.Icon;
                  return <article className="min-w-[285px] flex-1 rounded-[10px] border border-transparent bg-surface/90 p-4 shadow-[var(--shadow-card)] sm:min-w-[300px]" key={certificate.title} role="listitem">
                    <div className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-[8px] bg-primary/15 text-primary"><Icon aria-hidden="true" sx={{ fontSize: 18 }} /></span><span className="inline-flex items-center gap-1 text-[10px] text-text-muted"><CalendarMonthOutlinedIcon aria-hidden="true" sx={{ fontSize: 13 }} />LinkedIn</span></div>
                    <h3 className="mt-3 text-sm font-black text-text">{certificate.title}</h3><p className="mt-0.5 text-xs font-semibold text-text-muted">Certificação listada no perfil</p>
                    <p className="mt-3 text-xs leading-5 text-text-muted">Formação complementar registrada no export do perfil profissional.</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{certificate.tags.map((tag) => <Tag className="px-2 py-0.5 text-[10px]" key={tag}>{tag}</Tag>)}</div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><CheckCircleIcon aria-hidden="true" sx={{ fontSize: 15 }} />Certificado registrado</span>
                  </article>;
                })}
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
