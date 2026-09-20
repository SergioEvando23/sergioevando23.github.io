export const STUDY_DOCUMENTATION_AUTHOR = 'Sérgio Costa' as const;

export interface StudyDocumentation {
  id: string;
  title: string;
  tags: string[];
  updatedAt: number;
  author: typeof STUDY_DOCUMENTATION_AUTHOR;
  content: string;
}

export interface StudyDocumentationInput {
  title: string;
  tags: string[];
  content: string;
}
