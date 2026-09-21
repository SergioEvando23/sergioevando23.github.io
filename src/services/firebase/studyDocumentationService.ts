import {
  STUDY_DOCUMENTATION_AUTHOR,
  type StudyDocumentation,
  type StudyDocumentationInput,
} from '@/types/firebase/studyDocumentation';

const DEFAULT_REALTIME_DATABASE_URL =
  'https://Sérgioevando23-default-rtdb.firebaseio.com';
const databaseUrl =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? DEFAULT_REALTIME_DATABASE_URL;
const SERVER_TIMESTAMP = { '.sv': 'timestamp' } as const;

type PersistedStudyDocumentation = Omit<StudyDocumentation, 'id'>;

function documentationUrl(id?: string, token?: string) {
  const normalizedPath = id
    ? `/studyDocumentations/${encodeURIComponent(id)}.json`
    : '/studyDocumentations.json';
  const url = new URL(`${databaseUrl}${normalizedPath}`);

  if (token) {
    url.searchParams.set('auth', token);
  }

  return url.toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeDocumentationInput(input: StudyDocumentationInput) {
  const tags = Array.from(
    new Set(input.tags.map((tag) => tag.trim()).filter(Boolean)),
  );

  return {
    title: input.title.trim(),
    tags,
    content: input.content.trim(),
  };
}

function validateDocumentationInput(input: StudyDocumentationInput) {
  const sanitized = sanitizeDocumentationInput(input);

  if (!sanitized.title) {
    throw new Error('documentation-title-required');
  }

  if (!sanitized.content) {
    throw new Error('documentation-content-required');
  }

  if (sanitized.tags.length === 0) {
    throw new Error('documentation-tags-required');
  }

  return sanitized;
}

function validateToken(token: string) {
  if (!token.trim()) {
    throw new Error('documentation-token-required');
  }
}

function serializeDocumentation(input: StudyDocumentationInput) {
  const sanitized = validateDocumentationInput(input);

  return {
    ...sanitized,
    author: STUDY_DOCUMENTATION_AUTHOR,
    updatedAt: SERVER_TIMESTAMP,
  };
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function readNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === 'number' ? value : 0;
}

function readStringArray(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (isRecord(value)) {
    return Object.values(value).filter(
      (item): item is string => typeof item === 'string',
    );
  }

  return [];
}

export function normalizeStudyDocumentation(
  id: string,
  value: unknown,
): StudyDocumentation | null {
  if (!isRecord(value)) {
    return null;
  }

  const author = readString(value, 'author');

  if (author !== STUDY_DOCUMENTATION_AUTHOR) {
    return null;
  }

  const documentation = {
    id,
    title: readString(value, 'title'),
    tags: readStringArray(value, 'tags'),
    updatedAt: readNumber(value, 'updatedAt'),
    author,
    content: readString(value, 'content'),
  };

  if (!documentation.title || !documentation.content || documentation.tags.length === 0) {
    return null;
  }

  return documentation;
}

async function parseResponse(response: Response) {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (response.ok) {
    return payload;
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('documentation-unauthorized');
  }

  throw new Error(`documentation-request-failed-${response.status}`);
}

function sortByUpdatedAt(documentations: StudyDocumentation[]) {
  return [...documentations].sort((left, right) => right.updatedAt - left.updatedAt);
}

export async function getAllDocumentations() {
  const response = await fetch(documentationUrl(), { cache: 'no-store' });
  const payload = await parseResponse(response);

  if (payload === null) {
    return [];
  }

  if (!isRecord(payload)) {
    throw new Error('invalid-study-documentations-payload');
  }

  return sortByUpdatedAt(
    Object.entries(payload)
      .map(([id, value]) => normalizeStudyDocumentation(id, value))
      .filter((documentation): documentation is StudyDocumentation =>
        Boolean(documentation),
      ),
  );
}

export async function getDocumentationById(id: string) {
  const response = await fetch(documentationUrl(id), { cache: 'no-store' });
  const payload = await parseResponse(response);
  return normalizeStudyDocumentation(id, payload);
}

export async function createDocumentation(
  data: StudyDocumentationInput,
  token: string,
) {
  validateToken(token);

  const response = await fetch(documentationUrl(undefined, token), {
    body: JSON.stringify(serializeDocumentation(data)),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
  const payload = await parseResponse(response);

  if (!isRecord(payload) || typeof payload.name !== 'string' || !payload.name) {
    throw new Error('invalid-study-documentation-create-response');
  }

  return payload.name;
}

export async function updateDocumentation(
  id: string,
  data: StudyDocumentationInput,
  token: string,
) {
  validateToken(token);

  const response = await fetch(documentationUrl(id, token), {
    body: JSON.stringify(serializeDocumentation(data)),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH',
  });

  await parseResponse(response);
}

export async function deleteDocumentation(id: string, token: string) {
  validateToken(token);

  const response = await fetch(documentationUrl(id, token), {
    method: 'DELETE',
  });

  await parseResponse(response);
}

export function toDocumentationInput(
  documentation: Pick<PersistedStudyDocumentation, 'title' | 'tags' | 'content'>,
): StudyDocumentationInput {
  return sanitizeDocumentationInput(documentation);
}
