import type { TranslatedContent } from '@/i18n';

export type StudyDocumentationCategory =
  | 'all'
  | 'aiLlms'
  | 'development'
  | 'architecture'
  | 'career'
  | 'bestPractices'
  | 'others';

export type StudyDocumentationTranslationKey =
  keyof TranslatedContent['studyDocumentations']['items'];

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
