import { describe, expect, it, vi } from 'vitest';

const { deleteObject, getDownloadURL, ref, uploadBytesResumable, getFirebaseStorage } = vi.hoisted(
  () => ({
    deleteObject: vi.fn(),
    getDownloadURL: vi.fn(),
    ref: vi.fn(),
    uploadBytesResumable: vi.fn(),
    getFirebaseStorage: vi.fn(() => 'storage'),
  }),
);

vi.mock('firebase/storage', () => ({
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
}));
vi.mock('@/lib/firebase/storage', () => ({ getFirebaseStorage }));

import {
  deleteUploadedProjectImages,
  isAllowedProjectImage,
  uploadProjectImages,
} from './projectImages';

function image(name: string, type = 'image/png') {
  return new File(['image'], name, { type });
}

describe('projectImages', () => {
  it('accepts supported image files up to 5 MB only', () => {
    expect(isAllowedProjectImage(image('cover.png'))).toBe(true);
    expect(isAllowedProjectImage(image('cover.gif', 'image/gif'))).toBe(false);
    expect(
      isAllowedProjectImage(new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.png')),
    ).toBe(false);
  });

  it('uploads images, reports progress and returns project image metadata', async () => {
    const imageRef = { path: 'study-projects/study-id/cover.png' };
    ref.mockReturnValue(imageRef);
    getDownloadURL.mockResolvedValue('https://example.com/cover.png');
    uploadBytesResumable.mockReturnValue({
      on: (_event: string, _progress: undefined, _reject: unknown, resolve: () => void) => resolve(),
    });
    const progress = vi.fn();

    const uploaded = await uploadProjectImages(
      'study-id',
      [{ id: 'cover', file: image('cover.png'), alt: 'Cover', previewUrl: 'blob:cover' }],
      progress,
    );

    expect(progress).toHaveBeenCalledWith(1, 1);
    expect(ref).toHaveBeenCalledWith('storage', 'study-projects/study-id/cover.png');
    expect(uploadBytesResumable).toHaveBeenCalledWith(imageRef, expect.any(File), {
      contentType: 'image/png',
    });
    expect(uploaded).toEqual([
      {
        id: 'cover',
        url: 'https://example.com/cover.png',
        storagePath: 'study-projects/study-id/cover.png',
        alt: 'Cover',
        order: 0,
        isCover: true,
      },
    ]);
  });

  it('attempts to delete every uploaded image even when one deletion fails', async () => {
    ref.mockImplementation((_storage, path) => ({ path }));
    deleteObject.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('unavailable'));

    await expect(
      deleteUploadedProjectImages([
        { id: 'cover', url: 'cover', storagePath: 'cover.png', alt: 'Cover', order: 0, isCover: true },
        { id: 'detail', url: 'detail', storagePath: 'detail.webp', alt: 'Detail', order: 1, isCover: false },
      ]),
    ).resolves.toBeUndefined();
    expect(deleteObject).toHaveBeenCalledTimes(2);
  });
});
