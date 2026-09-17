import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createStudy,
  deleteStudy,
  listPublicStudyProjectsFromRest,
  updateStudy,
} from './firebaseStudyRestService';
import type { StudyPayload } from './studyRestTypes';

const study: StudyPayload = {
  id: 'shopping-cart',
  repository: 'project-trybe-shopping-cart',
  title: 'Shopping Cart',
  description: 'Cart study',
  focus: 'Frontend',
  technologies: ['JavaScript', 'REST'],
  category: 'frontend',
  kind: 'course-project',
  startedAt: '2022-01-14',
  completedAt: '2022-01-14',
  date: '2022-01-14',
  githubUrl: 'https://github.com/SergioEvando23/project-trybe-shopping-cart',
  portfolioEligible: true,
  coverImage: '/images/studies/shopping-cart/cover.webp',
  images: ['/images/studies/shopping-cart/cover.webp'],
};

describe('firebaseStudyRestService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads eligible studies from the Realtime Database REST endpoint', async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        hidden: { ...study, id: 'hidden', portfolioEligible: false },
        'shopping-cart': study,
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const projects = await listPublicStudyProjectsFromRest();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://sergioevando23-default-rtdb.firebaseio.com/study.json',
      { cache: 'no-store' },
    );
    expect(projects).toHaveLength(1);
    expect(projects[0]?.id).toBe('shopping-cart');
    expect(projects[0]?.galleryImages[0]?.url).toBe(study.coverImage);
  });

  it('creates studies with PUT and the Firebase ID token', async () => {
    const fetchMock = vi.fn(async () => Response.json(study));
    vi.stubGlobal('fetch', fetchMock);

    await createStudy(study, 'firebase-token');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://sergioevando23-default-rtdb.firebaseio.com/study/shopping-cart.json?auth=firebase-token',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('edits studies with PATCH and deletes with DELETE', async () => {
    const fetchMock = vi.fn(async () => Response.json(study));
    vi.stubGlobal('fetch', fetchMock);

    await updateStudy(study, 'firebase-token');
    await deleteStudy(study.id, 'firebase-token');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://sergioevando23-default-rtdb.firebaseio.com/study/shopping-cart.json?auth=firebase-token',
      expect.objectContaining({ method: 'PATCH' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://sergioevando23-default-rtdb.firebaseio.com/study/shopping-cart.json?auth=firebase-token',
      { method: 'DELETE' },
    );
  });

  it('returns an empty list when the REST endpoint has no studies', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(null)));

    await expect(listPublicStudyProjectsFromRest()).resolves.toEqual([]);
  });
});
