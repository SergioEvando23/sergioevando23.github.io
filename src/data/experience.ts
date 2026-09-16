import type { ConteudoTraduzido } from '@/i18n/dicionario';

export interface ExperienceItem {
  id: string;
  translationKey: keyof ConteudoTraduzido['experience']['items'];
}

export const experienceItems: ExperienceItem[] = [
  {
    id: 'product-engineering',
    translationKey: 'productEngineering',
  },
  {
    id: 'design-systems',
    translationKey: 'designSystems',
  },
];
