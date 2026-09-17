import { afterEach, describe, expect, it, vi } from 'vitest';
import { listPublicStudyProjectsFromRest } from './realtimeStudyProjects';

describe('listPublicStudyProjectsFromRest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads eligible studies from the Realtime Database REST endpoint', async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        older: {
          id: 'older',
          repository: 'older',
          title: 'Older study',
          description: 'Older description',
          focus: 'Frontend',
          technologies: ['React'],
          category: 'frontend',
          kind: 'study',
          startedAt: '2026-01-01',
          completedAt: '2026-01-02',
          date: '2026-01-02',
          githubUrl: 'https://github.com/SergioEvando23/older',
          portfolioEligible: true,
          images: [
            {
              id: 'cover',
              url: 'https://example.com/older.png',
              storagePath: 'study/older/cover.png',
              alt: 'Older cover',
              order: 0,
              isCover: true,
            },
          ],
          createdBy: 'admin',
        },
        hidden: {
          id: 'hidden',
          date: '2026-01-03',
          portfolioEligible: false,
        },
        newer: {
          id: 'newer',
          repository: 'newer',
          title: 'Newer study',
          description: 'Newer description',
          focus: 'Backend',
          technologies: ['Firebase', 'REST'],
          category: 'backend',
          kind: 'study',
          startedAt: '2026-02-01',
          completedAt: '2026-02-02',
          date: '2026-02-02',
          githubUrl: 'https://github.com/SergioEvando23/newer',
          portfolioEligible: true,
          images: {
            cover: {
              id: 'cover',
              url: 'https://example.com/newer.png',
              storagePath: 'study/newer/cover.png',
              alt: 'Newer cover',
              order: 0,
              isCover: true,
            },
          },
          createdBy: 'admin',
        },
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const projects = await listPublicStudyProjectsFromRest();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://sergioevando23-default-rtdb.firebaseio.com/study.json',
    );
    expect(projects.map((project) => project.id)).toEqual(['newer', 'older']);
    expect(projects[0]?.technologies).toEqual(['Firebase', 'REST']);
    expect(projects[0]?.images[0]?.url).toBe('https://example.com/newer.png');
  });

  it('returns an empty list when the REST endpoint has no studies', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(null)));

    await expect(listPublicStudyProjectsFromRest()).resolves.toEqual([]);
  });
});
