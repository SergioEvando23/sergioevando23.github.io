import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

let testEnv: RulesTestEnvironment | undefined;

const adminUid = 'admin-user';
const regularUid = 'regular-user';
const adminEmail = 'sergioevandocosta@gmail.com';
const rulesDescribe =
  process.env.FIREBASE_EMULATOR_HUB || process.env.FIRESTORE_EMULATOR_HOST
    ? describe
    : describe.skip;

function projectData(createdBy: string, portfolioEligible = true) {
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
    portfolioEligible,
    images: [
      {
        id: 'cover',
        url: 'https://example.com/cover.png',
        storagePath: 'study-projects/firebase-study/cover.png',
        alt: 'Cover',
        order: 0,
        isCover: true,
      },
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy,
  };
}

rulesDescribe('Firestore rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'sergio-portfolio-test',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: '127.0.0.1',
        port: 8080,
      },
    });

    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'admins', adminUid), {
        email: adminEmail,
        active: true,
        createdAt: Timestamp.now(),
      });
      await setDoc(
        doc(context.firestore(), 'studyProjects', 'public-study'),
        projectData(adminUid, true),
      );
      await setDoc(
        doc(context.firestore(), 'studyProjects', 'private-study'),
        projectData(adminUid, false),
      );
    });
  });

  afterAll(async () => {
    await testEnv?.cleanup();
  });

  it('allows public reads only for portfolio eligible projects', async () => {
    expect(testEnv, 'Run rules tests with `npm run test:rules`.').toBeDefined();
    if (!testEnv) return;
    const db = testEnv.unauthenticatedContext().firestore();

    await assertSucceeds(getDoc(doc(db, 'studyProjects', 'public-study')));
    await assertFails(getDoc(doc(db, 'studyProjects', 'private-study')));
  });

  it('blocks regular users from creating projects', async () => {
    expect(testEnv, 'Run rules tests with `npm run test:rules`.').toBeDefined();
    if (!testEnv) return;
    const db = testEnv
      .authenticatedContext(regularUid, {
        email: 'user@example.com',
        email_verified: true,
      })
      .firestore();

    await assertFails(
      setDoc(doc(db, 'studyProjects', 'regular-study'), projectData(regularUid)),
    );
  });

  it('allows the verified active admin to create projects', async () => {
    expect(testEnv, 'Run rules tests with `npm run test:rules`.').toBeDefined();
    if (!testEnv) return;
    const db = testEnv
      .authenticatedContext(adminUid, {
        email: adminEmail,
        email_verified: true,
      })
      .firestore();

    await assertSucceeds(
      setDoc(doc(db, 'studyProjects', 'firebase-study'), projectData(adminUid)),
    );
  });

  it('blocks client writes to admins collection', async () => {
    expect(testEnv, 'Run rules tests with `npm run test:rules`.').toBeDefined();
    if (!testEnv) return;
    const db = testEnv
      .authenticatedContext(adminUid, {
        email: adminEmail,
        email_verified: true,
      })
      .firestore();

    await assertFails(
      setDoc(doc(db, 'admins', 'another-admin'), {
        email: adminEmail,
        active: true,
        createdAt: Timestamp.now(),
      }),
    );
  });

  it('blocks forged createdBy values', async () => {
    expect(testEnv, 'Run rules tests with `npm run test:rules`.').toBeDefined();
    if (!testEnv) return;
    const db = testEnv
      .authenticatedContext(adminUid, {
        email: adminEmail,
        email_verified: true,
      })
      .firestore();

    await assertFails(
      setDoc(doc(db, 'studyProjects', 'forged-study'), projectData('other-user')),
    );
  });

  it('has a test environment', () => {
    expect(testEnv).toBeDefined();
  });
});
