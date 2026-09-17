import type { StudyProject, StudyProjectImage } from '@/types/firebase/studyProject';

const DEFAULT_REALTIME_DATABASE_URL =
  'https://sergioevando23-default-rtdb.firebaseio.com';

const databaseUrl =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? DEFAULT_REALTIME_DATABASE_URL;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function readBoolean(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === 'boolean' ? value : false;
}

function readStringArray(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeImages(value: unknown): StudyProjectImage[] {
  const images = Array.isArray(value)
    ? value
    : isRecord(value)
      ? Object.values(value)
      : [];

  return images
    .filter(isRecord)
    .map((image, index) => {
      const orderValue = image.order;
      const order = typeof orderValue === 'number' ? orderValue : index;

      return {
        id: readString(image, 'id') || `image-${index + 1}`,
        url: readString(image, 'url'),
        storagePath: readString(image, 'storagePath'),
        alt: readString(image, 'alt'),
        order,
        isCover: readBoolean(image, 'isCover') || order === 0,
      };
    })
    .filter((image) => image.url)
    .sort((left, right) => left.order - right.order);
}

function normalizeProject(id: string, value: unknown): StudyProject | null {
  if (!isRecord(value)) {
    return null;
  }

  const projectId = readString(value, 'id');

  if (projectId && projectId !== id) {
    return null;
  }

  return {
    id,
    repository: readString(value, 'repository'),
    title: readString(value, 'title'),
    description: readString(value, 'description'),
    focus: readString(value, 'focus'),
    technologies: readStringArray(value, 'technologies'),
    category: readString(value, 'category'),
    kind: readString(value, 'kind'),
    startedAt: readString(value, 'startedAt'),
    completedAt: readString(value, 'completedAt'),
    date: readString(value, 'date'),
    githubUrl: readString(value, 'githubUrl'),
    portfolioEligible: readBoolean(value, 'portfolioEligible'),
    images: normalizeImages(value.images),
    createdAt: null,
    updatedAt: null,
    createdBy: readString(value, 'createdBy'),
  };
}

export async function listPublicStudyProjectsFromRest() {
  const response = await fetch(`${databaseUrl}/study.json`);

  if (!response.ok) {
    throw new Error(`Realtime Database request failed with ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (payload === null) {
    return [];
  }

  if (!isRecord(payload)) {
    throw new Error('Realtime Database study payload must be an object map.');
  }

  return Object.entries(payload)
    .map(([id, value]) => normalizeProject(id, value))
    .filter((project): project is StudyProject => Boolean(project?.portfolioEligible))
    .sort((left, right) => right.date.localeCompare(left.date));
}
