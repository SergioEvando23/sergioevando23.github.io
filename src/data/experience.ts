import type { ConteudoTraduzido } from '@/i18n/dicionario';

export interface ExperienceItem {
  id: string;
  translationKey: keyof ConteudoTraduzido['experience']['items'];
}

export const experienceItems: ExperienceItem[] = [
  {
    id: 'product-engineering',
    translationKey: 'mfeEngineering',
  },
  {
    id: 'design-systems',
    translationKey: 'componentzation',
  },
  {
    id: 'monolithic-services',
    translationKey: 'monolithicServices',
  },
];
