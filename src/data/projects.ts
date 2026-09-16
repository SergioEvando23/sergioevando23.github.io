import type { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'frontend-platform',
    title: 'Frontend — React + TypeScript',
    description: 'Interfaces performáticas, acessíveis e preparadas para escala.',
    stack: ['React', 'Next.js', 'TypeScript'],
  },
  {
    id: 'mobile-platform',
    title: 'Mobile — Flutter + Dart',
    description: 'Experiências mobile consistentes para Android e iOS.',
    stack: ['Flutter', 'Dart', 'Design Systems'],
  },
  {
    id: 'backend-platform',
    title: 'Backend — Node.js + APIs',
    description: 'APIs confiáveis, integrações e arquitetura orientada a produto.',
    stack: ['Node.js', 'REST', 'Cloud'],
  },
];
