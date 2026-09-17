import type { StudyProject } from '@/types/firebase/studyProject';

export interface StudyPayload {
  id: string;
  repository: string;
  title: string;
  description: string;
  focus: string;
  technologies: string[];
  category: string;
  kind: string;
  startedAt: string;
  completedAt: string;
  date: string;
  githubUrl: string;
  portfolioEligible: boolean;
  coverImage?: string;
  images?: string[];
}

export type StudyRecordMap = Record<string, StudyPayload>;

export interface StudyListResult {
  studies: StudyProject[];
  allStudies: StudyProject[];
}
