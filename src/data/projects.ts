import type { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'frontend-platform',
    translationKey: 'frontendPlatform',
    stack: ['React', 'Next.js', 'TypeScript'],
  },
  {
    id: 'mobile-platform',
    translationKey: 'mobilePlatform',
    stack: ['Flutter', 'Dart', 'Design Systems'],
  },
  {
    id: 'backend-platform',
    translationKey: 'backendPlatform',
    stack: ['Node.js', 'REST', 'Cloud'],
  },
];
