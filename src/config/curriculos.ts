import type { Idioma } from '@/i18n';

export const curriculos = {
  portugues: {
    href: '/documents/CurriculoSergioCosta.pdf',
    fileName: 'CurriculoSergioCosta.pdf',
  },
  ingles: {
    href: '/documents/SergioCostaResume.pdf',
    fileName: 'SergioCostaResume.pdf',
  },
} as const satisfies Record<Idioma, { href: string; fileName: string }>;
