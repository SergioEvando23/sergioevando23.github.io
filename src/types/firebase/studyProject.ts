import type { Timestamp } from 'firebase/firestore';

export type StudyProjectTimestamp = Timestamp | string | number | null;

export interface StudyProjectPreview {
  enabled: boolean;
  type: 'iframe';
  sandbox?: string[];
  allowFullscreen?: boolean;
}

export interface StudyProjectInput {
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
  demoUrl?: string;
  preview?: StudyProjectPreview;
  coverImage?: string;
  images?: string[];
}

export interface StudyProjectImage {
  id: string;
  url: string;
  storagePath: string;
  alt: string;
  order: number;
  isCover: boolean;
}

export interface StudyProject extends StudyProjectInput {
  galleryImages: StudyProjectImage[];
  createdAt: StudyProjectTimestamp;
  updatedAt: StudyProjectTimestamp;
  createdBy: string;
}

export type StudyProjectFormInput = StudyProjectInput;
