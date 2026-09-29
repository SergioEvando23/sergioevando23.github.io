import type { TranslatedContent } from '@/i18n';

export interface SkillGroup {
  id: string;
  translationKey: keyof TranslatedContent['skills']['groups'];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    translationKey: 'frontend',
  },
  {
    id: 'mobile',
    translationKey: 'mobile',
  },
  {
    id: 'backend',
    translationKey: 'backend',
  },
  {
    id: 'observabilidade',
    translationKey: 'observabilidade',
  },
  {
    id: 'testes',
    translationKey: 'testes',
  },
];
