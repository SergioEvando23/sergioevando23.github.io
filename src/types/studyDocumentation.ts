import type { ConteudoTraduzido } from '@/i18n/dicionario';

export type StudyDocumentationCategory =
  | 'all'
  | 'aiLlms'
  | 'development'
  | 'architecture'
  | 'career'
  | 'bestPractices'
  | 'others';

export type StudyDocumentationTranslationKey =
  keyof ConteudoTraduzido['studyDocumentations']['items'];

export interface StudyDocumentation {
  id: string;
  category: Exclude<StudyDocumentationCategory, 'all'>;
  tags: string[];
  date: string;
  readTimeMinutes: number;
  author: string;
  icon: 'brain' | 'code' | 'layers' | 'chart' | 'document' | 'terminal' | 'book' | 'people';
  translationKey: StudyDocumentationTranslationKey;
}
