import type { Language } from '@/i18n';

export const resumes = {
  portuguese: {
    href: '/documents/CurriculoSergioCosta.pdf',
    fileName: 'CurriculoSergioCosta.pdf',
  },
  english: {
    href: '/documents/SergioCostaResume.pdf',
    fileName: 'SergioCostaResume.pdf',
  },
} as const satisfies Record<Language, { href: string; fileName: string }>;
