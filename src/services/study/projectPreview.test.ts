import { describe, expect, it } from 'vitest';
import { canRunProject, isValidProjectUrl } from './projectPreview';
import type { StudyProject } from '@/types/firebase/studyProject';

const project = (overrides: Partial<StudyProject> = {}): StudyProject => ({
  id: 'project-a', repository: 'example/repository', title: 'Project A', description: 'Description',
  focus: 'Learning', technologies: ['TypeScript'], category: 'frontend', kind: 'study',
  startedAt: '', completedAt: '', date: '2026-01-01', githubUrl: 'https://github.com/example/repository',
  portfolioEligible: true, galleryImages: [], createdAt: null, updatedAt: null, createdBy: 'admin',
  ...overrides,
});

describe('project preview contract', () => {
  it('enables any valid project based solely on preview data', () => {
    expect(canRunProject(project({ demoUrl: 'https://example.com/app', preview: { enabled: true, type: 'iframe' } }))).toBe(true);
    expect(canRunProject(project({ id: 'project-b', title: 'Project B', technologies: ['Anything'], demoUrl: 'https://another.example/app', preview: { enabled: true, type: 'iframe' } }))).toBe(true);
  });

  it('does not enable projects without a valid enabled preview', () => {
    expect(canRunProject(project())).toBe(false);
    expect(canRunProject(project({ demoUrl: 'https://example.com', preview: { enabled: false, type: 'iframe' } }))).toBe(false);
    expect(canRunProject(project({ demoUrl: 'javascript:alert(1)', preview: { enabled: true, type: 'iframe' } }))).toBe(false);
    expect(isValidProjectUrl('data:text/html,test')).toBe(false);
  });
});
