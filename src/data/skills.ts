import type { ConteudoTraduzido } from '@/i18n/dicionario';

export interface SkillGroup {
  id: string;
  translationKey: keyof ConteudoTraduzido['skills']['groups'];
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
