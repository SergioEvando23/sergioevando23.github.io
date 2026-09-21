import type { Idioma } from '@/i18n/dicionario';

export const curriculos = {
  portugues: {
    href: '/documents/CurriculoSérgioCosta.pdf',
    fileName: 'CurriculoSérgioCosta.pdf',
  },
  ingles: {
    href: '/documents/SérgioCostaResume.pdf',
    fileName: 'SérgioCostaResume.pdf',
  },
} as const satisfies Record<Idioma, { href: string; fileName: string }>;
