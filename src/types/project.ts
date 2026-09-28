import type { ConteudoTraduzido } from '@/i18n';

export interface Project {
  id: string;
  translationKey: keyof ConteudoTraduzido['projects']['items'];
  stack: string[];
  href?: string;
}
