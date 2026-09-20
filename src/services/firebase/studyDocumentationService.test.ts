import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createDocumentation,
  deleteDocumentation,
  getAllDocumentations,
  getDocumentationById,
  updateDocumentation,
} from './studyDocumentationService';

const firebaseDocumentation = {
  title: 'Tokens em LLMs',
  tags: ['IA & LLMs', 'Eficiência'],
  updatedAt: 200,
  author: 'Sérgio Costa',
  content: '# Tokens\n\nConteudo',
};

describe('studyDocumentationService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lists and sorts documentations from Realtime Database REST', async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        older: { ...firebaseDocumentation, updatedAt: 100, title: 'Older' },
        newer: firebaseDocumentation,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const documentations = await getAllDocumentations();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://sergioevando23-default-rtdb.firebaseio.com/studyDocumentations.json',
      { cache: 'no-store' },
    );
    expect(documentations.map((documentation) => documentation.id)).toEqual([
      'newer',
      'older',
    ]);
  });

  it('loads a single documentation by id', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(firebaseDocumentation)));

    await expect(getDocumentationById('doc-1')).resolves.toMatchObject({
      id: 'doc-1',
      title: 'Tokens em LLMs',
    });
  });

  it('returns an empty list for a null response', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(null)));

    await expect(getAllDocumentations()).resolves.toEqual([]);
  });

  it('creates with POST, Firebase token, fixed author and server timestamp', async () => {
    const fetchMock = vi.fn(async () => Response.json({ name: '-firebase-id' }));
    vi.stubGlobal('fetch', fetchMock);

    const id = await createDocumentation(
      {
        title: ' Tokens em LLMs ',
        tags: ['IA & LLMs', 'IA & LLMs', '  ', 'Eficiência'],
        content: ' # Tokens ',
      },
      'firebase-token',
    );

    expect(id).toBe('-firebase-id');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://sergioevando23-default-rtdb.firebaseio.com/studyDocumentations.json?auth=firebase-token',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'Tokens em LLMs',
          tags: ['IA & LLMs', 'Eficiência'],
          content: '# Tokens',
          author: 'Sérgio Costa',
          updatedAt: { '.sv': 'timestamp' },
        }),
      }),
    );
  });

  it('updates with PATCH and deletes with DELETE', async () => {
    const fetchMock = vi.fn(async () => Response.json({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    await updateDocumentation(
      'doc-1',
      { title: 'Title', tags: ['React'], content: 'Content' },
      'firebase-token',
    );
    await deleteDocumentation('doc-1', 'firebase-token');

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://sergioevando23-default-rtdb.firebaseio.com/studyDocumentations/doc-1.json?auth=firebase-token',
      expect.objectContaining({ method: 'PATCH' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://sergioevando23-default-rtdb.firebaseio.com/studyDocumentations/doc-1.json?auth=firebase-token',
      { method: 'DELETE' },
    );
  });

  it('rejects unauthorized responses and invalid create payloads', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{}', { status: 403 })),
    );

    await expect(getAllDocumentations()).rejects.toThrow('documentation-unauthorized');
  });

  it('rejects invalid inputs and missing tokens before writing', async () => {
    await expect(
      createDocumentation({ title: '', tags: ['React'], content: 'Content' }, 'token'),
    ).rejects.toThrow('documentation-title-required');
    await expect(
      createDocumentation({ title: 'Title', tags: [], content: 'Content' }, 'token'),
    ).rejects.toThrow('documentation-tags-required');
    await expect(
      createDocumentation({ title: 'Title', tags: ['React'], content: '' }, 'token'),
    ).rejects.toThrow('documentation-content-required');
    await expect(
      createDocumentation({ title: 'Title', tags: ['React'], content: 'Content' }, ''),
    ).rejects.toThrow('documentation-token-required');
  });

  it('rejects invalid Firebase create response', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ id: 'wrong' })));

    await expect(
      createDocumentation(
        { title: 'Title', tags: ['React'], content: 'Content' },
        'firebase-token',
      ),
    ).rejects.toThrow('invalid-study-documentation-create-response');
  });
});
