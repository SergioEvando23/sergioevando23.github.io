import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { getFirebaseStorage } from '@/lib/firebase/storage';
import type { StudyProjectImage } from '@/types/firebase/studyProject';

export interface LocalProjectImage {
  id: string;
  file: File;
  alt: string;
  previewUrl: string;
}

export const MAX_PROJECT_IMAGES = 3;
export const MAX_PROJECT_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_PROJECT_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export function isAllowedProjectImage(file: File) {
  return (
    ALLOWED_PROJECT_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_PROJECT_IMAGE_TYPES)[number],
    ) && file.size <= MAX_PROJECT_IMAGE_SIZE
  );
}

function getExtension(file: File) {
  if (file.type === 'image/png') {
    return 'png';
  }

  if (file.type === 'image/webp') {
    return 'webp';
  }

  return 'jpg';
}

export async function uploadProjectImages(
  projectId: string,
  images: LocalProjectImage[],
  onProgress?: (current: number, total: number) => void,
) {
  const uploaded: StudyProjectImage[] = [];

  for (const [index, image] of images.entries()) {
    onProgress?.(index + 1, images.length);
    const storagePath = `study-projects/${projectId}/${image.id}.${getExtension(
      image.file,
    )}`;
    const imageRef = ref(getFirebaseStorage(), storagePath);
    await new Promise<void>((resolve, reject) => {
      const task = uploadBytesResumable(imageRef, image.file, {
        contentType: image.file.type,
      });

      task.on(
        'state_changed',
        undefined,
        reject,
        () => resolve(),
      );
    });

    uploaded.push({
      id: image.id,
      url: await getDownloadURL(imageRef),
      storagePath,
      alt: image.alt,
      order: index,
      isCover: index === 0,
    });
  }

  return uploaded;
}

export async function deleteUploadedProjectImages(images: StudyProjectImage[]) {
  await Promise.allSettled(
    images.map((image) => deleteObject(ref(getFirebaseStorage(), image.storagePath))),
  );
}
