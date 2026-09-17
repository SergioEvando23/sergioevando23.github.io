import type { StudyPayload } from '@/services/firebase/studyRestTypes';

export type StudyFormErrors = Partial<Record<keyof StudyPayload | 'githubToken', string>>;

export const STUDY_CATEGORIES = ['frontend', 'backend', 'mobile', 'fullstack'] as const;
export const STUDY_KINDS = ['course-project', 'personal-project', 'experiment'] as const;

export function slugifyStudyId(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function emptyStudyPayload(): StudyPayload {
  return {
    id: '',
    repository: '',
    title: '',
    description: '',
    focus: '',
    technologies: [],
    category: STUDY_CATEGORIES[0],
    kind: STUDY_KINDS[0],
    startedAt: '',
    completedAt: '',
    date: '',
    githubUrl: '',
    portfolioEligible: true,
    coverImage: '',
    images: [],
  };
}

function isGithubUrl(value: string) {
  try {
    const url = new URL(value);
    return url.hostname === 'github.com' || url.hostname.endsWith('.github.com');
  } catch {
    return false;
  }
}

export function validateStudyPayload(study: StudyPayload) {
  const errors: StudyFormErrors = {};
  const requiredFields: Array<keyof StudyPayload> = [
    'id',
    'repository',
    'title',
    'description',
    'focus',
    'category',
    'kind',
    'date',
    'githubUrl',
  ];

  requiredFields.forEach((field) => {
    if (!study[field] || String(study[field]).trim().length === 0) {
      errors[field] = 'Campo obrigatorio.';
    }
  });

  if (study.id && study.id !== slugifyStudyId(study.id)) {
    errors.id = 'Use um slug seguro, como shopping-cart.';
  }

  if (study.githubUrl && !isGithubUrl(study.githubUrl)) {
    errors.githubUrl = 'Informe uma URL valida do GitHub.';
  }

  if (study.technologies.length === 0) {
    errors.technologies = 'Adicione pelo menos uma tecnologia.';
  }

  return errors;
}

export function hasStudyErrors(errors: StudyFormErrors) {
  return Object.keys(errors).length > 0;
}
