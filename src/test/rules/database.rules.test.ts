import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { get, ref, remove, serverTimestamp, set, update } from 'firebase/database';

let testEnv: RulesTestEnvironment;

const adminUid = 'admin-user';
const regularUid = 'regular-user';
const adminEmail = 'sergioevandocosta@gmail.com';
const rulesDescribe =
  process.env.FIREBASE_EMULATOR_HUB || process.env.FIREBASE_DATABASE_EMULATOR_HOST
    ? describe
    : describe.skip;

function documentationData(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Otimização de tokens em LLMs',
    tags: ['IA & LLMs'],
    updatedAt: serverTimestamp(),
    author: 'Sérgio Costa',
    content: '# Conteudo\n\nTexto.',
    ...overrides,
  };
}

function persistedDocumentationData(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Otimização de tokens em LLMs',
    tags: ['IA & LLMs'],
    updatedAt: 1789873200000,
    author: 'Sérgio Costa',
    content: '# Conteudo\n\nTexto.',
    ...overrides,
  };
}

function studyData(overrides: Record<string, unknown> = {}) {
  return {
    id: 'firebase-study',
    repository: 'firebase-study',
    title: 'Firebase Study',
    description: 'Study project',
    focus: 'Rules',
    technologies: ['Firebase'],
    category: 'backend',
    kind: 'study',
    startedAt: '2026-01-01',
    completedAt: '2026-01-02',
    date: '2026-01-02',
    githubUrl: 'https://github.com/SergioEvando23/firebase-study',
    portfolioEligible: true,
    coverImage: '/images/studies/firebase-study/cover.webp',
    images: ['/images/studies/firebase-study/cover.webp'],
    ...overrides,
  };
}

function adminDatabase(emailVerified = true) {
  return testEnv
    .authenticatedContext(adminUid, {
      email: adminEmail,
      email_verified: emailVerified,
    })
    .database();
}

rulesDescribe('Realtime Database rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'sergio-portfolio-rtdb-test',
      database: {
        rules: readFileSync('database.rules.json', 'utf8'),
        host: '127.0.0.1',
        port: 9000,
      },
    });

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await set(
        ref(context.database(), 'studyDocumentations/public-doc'),
        persistedDocumentationData(),
      );
      await set(ref(context.database(), 'study/firebase-study'), studyData());
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it('allows public reads for study documentations', async () => {
    const db = testEnv.unauthenticatedContext().database();

    await assertSucceeds(get(ref(db, 'studyDocumentations/public-doc')));
  });

  it('blocks public create, edit and delete operations', async () => {
    const db = testEnv.unauthenticatedContext().database();

    await assertFails(set(ref(db, 'studyDocumentations/new-doc'), documentationData()));
    await assertFails(update(ref(db, 'studyDocumentations/public-doc'), { title: 'Novo' }));
    await assertFails(remove(ref(db, 'studyDocumentations/public-doc')));
  });

  it('blocks regular authenticated users from writing', async () => {
    const db = testEnv
      .authenticatedContext(regularUid, {
        email: 'user@example.com',
        email_verified: true,
      })
      .database();

    await assertFails(set(ref(db, 'studyDocumentations/regular-doc'), documentationData()));
  });

  it('allows the verified administrator to create, edit and delete documentations', async () => {
    const db = adminDatabase();

    await assertSucceeds(set(ref(db, 'studyDocumentations/admin-doc'), documentationData()));
    await assertSucceeds(
      update(ref(db, 'studyDocumentations/admin-doc'), {
        title: 'Documento editado',
        updatedAt: serverTimestamp(),
      }),
    );
    await assertSucceeds(remove(ref(db, 'studyDocumentations/admin-doc')));
  });

  it('blocks the administrator email when it is not verified', async () => {
    const db = adminDatabase(false);

    await assertFails(
      set(ref(db, 'studyDocumentations/unverified-doc'), documentationData()),
    );
  });

  it('rejects invalid documentation payloads', async () => {
    const db = adminDatabase();

    await assertFails(
      set(ref(db, 'studyDocumentations/wrong-author'), documentationData({ author: 'Outro' })),
    );
    await assertFails(
      set(ref(db, 'studyDocumentations/no-title'), documentationData({ title: '' })),
    );
    await assertFails(
      set(ref(db, 'studyDocumentations/no-content'), documentationData({ content: '' })),
    );
    await assertFails(
      set(ref(db, 'studyDocumentations/no-tags'), documentationData({ tags: [] })),
    );
    await assertFails(
      set(
        ref(db, 'studyDocumentations/unknown-field'),
        documentationData({ extra: 'forbidden' }),
      ),
    );
    await assertFails(
      set(ref(db, 'studyDocumentations/old-timestamp'), {
        ...documentationData(),
        updatedAt: 1789873200000,
      }),
    );
  });

  it('keeps the existing study rules working', async () => {
    const publicDb = testEnv.unauthenticatedContext().database();
    const adminDb = adminDatabase();
    const regularDb = testEnv
      .authenticatedContext(regularUid, {
        email: 'user@example.com',
        email_verified: true,
      })
      .database();

    await assertSucceeds(get(ref(publicDb, 'study/firebase-study')));
    await assertSucceeds(
      set(ref(adminDb, 'study/firebase-study-admin'), {
        ...studyData({ id: 'firebase-study-admin' }),
      }),
    );
    await assertFails(
      set(ref(regularDb, 'study/firebase-study-regular'), {
        ...studyData({ id: 'firebase-study-regular' }),
      }),
    );
  });

  it('has a test environment', () => {
    expect(testEnv).toBeDefined();
  });
});
