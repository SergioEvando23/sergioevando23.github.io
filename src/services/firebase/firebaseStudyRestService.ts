import type { StudyProject, StudyProjectImage } from '@/types/firebase/studyProject';
import type { StudyPayload } from './studyRestTypes';

const DEFAULT_REALTIME_DATABASE_URL =
  'https://Sérgioevando23-default-rtdb.firebaseio.com';

const databaseUrl =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? DEFAULT_REALTIME_DATABASE_URL;

function studyUrl(path = '', token?: string) {
  const normalizedPath = path ? `/study/${path}.json` : '/study.json';
  const url = new URL(`${databaseUrl}${normalizedPath}`);

  if (token) {
    url.searchParams.set('auth', token);
  }

  return url.toString();
}

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

function legacyImageObjects(value: unknown): StudyProjectImage[] {
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

function normalizeImagePaths(record: Record<string, unknown>) {
  const paths = readStringArray(record, 'images');
  const coverImage = readString(record, 'coverImage');
  const legacyImages = legacyImageObjects(record.images);

  if (paths.length > 0 || coverImage) {
    const uniquePaths = Array.from(new Set([coverImage, ...paths].filter(Boolean)));
    return {
      coverImage: coverImage || uniquePaths[0] || '',
      images: uniquePaths,
      galleryImages: uniquePaths.map((path, index) => ({
        id: index === 0 ? 'cover' : `image-${index + 1}`,
        url: path,
        storagePath: path,
        alt: '',
        order: index,
        isCover: path === (coverImage || uniquePaths[0]),
      })),
    };
  }

  return {
    coverImage: legacyImages.find((image) => image.isCover)?.url ?? legacyImages[0]?.url ?? '',
    images: legacyImages.map((image) => image.url),
    galleryImages: legacyImages,
  };
}

export function normalizeStudyProject(id: string, value: unknown): StudyProject | null {
  if (!isRecord(value)) {
    return null;
  }

  const projectId = readString(value, 'id') || id;

  if (projectId !== id) {
    return null;
  }

  const imageData = normalizeImagePaths(value);

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
    coverImage: imageData.coverImage,
    images: imageData.images,
    galleryImages: imageData.galleryImages,
    createdAt: null,
    updatedAt: null,
    createdBy: readString(value, 'createdBy'),
  };
}

export function serializeStudyPayload(study: StudyPayload): StudyPayload {
  return {
    ...study,
    id: study.id.trim(),
    repository: study.repository.trim(),
    title: study.title.trim(),
    description: study.description.trim(),
    focus: study.focus.trim(),
    technologies: study.technologies.map((technology) => technology.trim()).filter(Boolean),
    category: study.category.trim(),
    kind: study.kind.trim(),
    startedAt: study.startedAt.trim(),
    completedAt: study.completedAt.trim(),
    date: study.date.trim(),
    githubUrl: study.githubUrl.trim(),
    coverImage: study.coverImage?.trim(),
    images: study.images?.map((image) => image.trim()).filter(Boolean),
  };
}

async function parseResponse(response: Response) {
  if (response.ok) {
    return response.json() as Promise<unknown>;
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('unauthorized');
  }

  throw new Error(`request-failed-${response.status}`);
}

export async function listStudies() {
  const response = await fetch(studyUrl(), { cache: 'no-store' });
  const payload = await parseResponse(response);

  if (payload === null) {
    return [];
  }

  if (!isRecord(payload)) {
    throw new Error('invalid-study-payload');
  }

  return Object.entries(payload)
    .map(([id, value]) => normalizeStudyProject(id, value))
    .filter((project): project is StudyProject => Boolean(project))
    .sort((left, right) =>
      (right.completedAt || right.date || '').toString().localeCompare(
        (left.completedAt || left.date || '').toString(),
      ),
    );
}

export async function getStudy(id: string) {
  const response = await fetch(studyUrl(id), { cache: 'no-store' });
  const payload = await parseResponse(response);
  return normalizeStudyProject(id, payload);
}

export async function createStudy(study: StudyPayload, token: string) {
  const response = await fetch(studyUrl(study.id, token), {
    body: JSON.stringify(serializeStudyPayload(study)),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });

  await parseResponse(response);
}

export async function updateStudy(study: StudyPayload, token: string) {
  const response = await fetch(studyUrl(study.id, token), {
    body: JSON.stringify(serializeStudyPayload(study)),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
  });

  await parseResponse(response);
}

export async function deleteStudy(id: string, token: string) {
  const response = await fetch(studyUrl(id, token), { method: 'DELETE' });
  await parseResponse(response);
}

export async function listPublicStudyProjectsFromRest() {
  const studies = await listStudies();
  return studies.filter((study) => study.portfolioEligible);
}
