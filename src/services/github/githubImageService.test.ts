import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  publicStudyImagePath,
  uploadStudyImagesToGithub,
  type SelectedStudyImage,
} from './githubImageService';

describe('githubImageService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('builds predictable public image paths', () => {
    expect(publicStudyImagePath('shopping-cart', 0, true)).toBe(
      '/images/studies/shopping-cart/cover.webp',
    );
    expect(publicStudyImagePath('shopping-cart', 1, false)).toBe(
      '/images/studies/shopping-cart/01.webp',
    );
  });

  it('uploads images with the GitHub Contents API without persisting the token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(Response.json({ content: { path: 'file' } }));
    const file = new File(['image'], 'cover.webp', { type: 'image/webp' });
    const image: SelectedStudyImage = {
      id: 'cover',
      file,
      isCover: true,
      previewUrl: 'blob:test',
    };

    vi.stubGlobal('fetch', fetchMock);

    const result = await uploadStudyImagesToGithub(
      'shopping-cart',
      [image],
      'github-token',
    );

    expect(result[0]?.publicPath).toBe('/images/studies/shopping-cart/cover.webp');
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api.github.com/repos/SergioEvando23/sergioevando23.github.io/contents/public/images/studies/shopping-cart/cover.webp',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer github-token' }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.github.com/repos/SergioEvando23/sergioevando23.github.io/contents/public/images/studies/shopping-cart/cover.webp',
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(JSON.stringify(localStorage)).not.toContain('github-token');
    expect(JSON.stringify(sessionStorage)).not.toContain('github-token');
  });
});
