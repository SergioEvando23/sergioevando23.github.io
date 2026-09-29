import type { TranslatedContent } from '@/i18n';

export interface ExperienceItem {
  id: string;
  translationKey: keyof TranslatedContent['experience']['items'];
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
