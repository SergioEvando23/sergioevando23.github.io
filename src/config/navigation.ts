import type { TranslatedContent } from '@/i18n';

export interface NavigationItem {
  href: string;
  translationKey: keyof TranslatedContent['navigation'];
}

export const navigationItems: NavigationItem[] = [
  { translationKey: 'about', href: '/' },
  { translationKey: 'studies', href: '/study' },
  { translationKey: 'education', href: '/education' },
  { translationKey: 'experience', href: '/experience' },
];
