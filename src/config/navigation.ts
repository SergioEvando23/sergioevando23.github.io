import type { ConteudoTraduzido } from '@/i18n/dicionario';

export interface NavigationItem {
  href: string;
  translationKey: keyof ConteudoTraduzido['navigation'];
}

export const navigationItems: NavigationItem[] = [
  { translationKey: 'about', href: '/' },
  { translationKey: 'studies', href: '/study' },
  { translationKey: 'education', href: '/formacao' },
  { translationKey: 'experience', href: '/#experiencia' },
];
