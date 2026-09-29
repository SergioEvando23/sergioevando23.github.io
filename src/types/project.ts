import type { TranslatedContent } from '@/i18n';

export interface Project {
  id: string;
  translationKey: keyof TranslatedContent['projects']['items'];
  stack: string[];
  href?: string;
}
