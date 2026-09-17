import type { ConteudoTraduzido } from '@/i18n/dicionario';

export interface NavigationItem {
  href: string;
  translationKey: keyof ConteudoTraduzido['navigation'];
}

export const navigationItems: NavigationItem[] = [
  { translationKey: 'projects', href: '/#projetos' },
  { translationKey: 'studies', href: '/study' },
  { translationKey: 'technologies', href: '/#tecnologias' },
  { translationKey: 'experience', href: '/#experiencia' },
  { translationKey: 'contact', href: '/#contato' },
];
