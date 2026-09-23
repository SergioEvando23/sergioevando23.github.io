import type { StudyProject } from '@/types/firebase/studyProject';

export const DEFAULT_PROJECT_IFRAME_SANDBOX = [
  'allow-scripts',
  'allow-same-origin',
  'allow-forms',
] as const;

export function isValidProjectUrl(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function createProjectPreview(
  demoUrl: string | undefined,
  current?: StudyProject['preview'],
): NonNullable<StudyProject['preview']> {
  return {
    enabled: isValidProjectUrl(demoUrl),
    type: 'iframe',
    ...(current?.sandbox?.length ? { sandbox: current.sandbox } : {}),
    ...(typeof current?.allowFullscreen === 'boolean'
      ? { allowFullscreen: current.allowFullscreen }
      : {}),
  };
}

export function canRunProject(project: StudyProject) {
  return project.preview?.enabled === true &&
    project.preview.type === 'iframe' &&
    isValidProjectUrl(project.demoUrl);
}

export function getProjectIframeSandbox(project: StudyProject) {
  return (project.preview?.sandbox?.length
    ? project.preview.sandbox
    : DEFAULT_PROJECT_IFRAME_SANDBOX
  ).join(' ');
}
