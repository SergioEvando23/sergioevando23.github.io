export interface CloudinaryUploadImage {
  id: string;
  file: File;
  isCover: boolean;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

function config() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) throw new Error('cloudinary-not-configured');
  return { cloudName, uploadPreset };
}

export async function uploadStudyImagesToCloudinary(
  studyId: string,
  images: CloudinaryUploadImage[],
) {
  const { cloudName, uploadPreset } = config();
  return Promise.all(
    images.map(async (image) => {
      if (!ALLOWED_IMAGE_TYPES.includes(image.file.type) || image.file.size === 0 || image.file.size > MAX_IMAGE_SIZE) {
        throw new Error('invalid-image');
      }
      const body = new FormData();
      body.append('file', image.file);
      body.append('upload_preset', uploadPreset);
      body.append('folder', `portfolio/projects/${studyId}`);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body });
      if (!response.ok) throw new Error('cloudinary-upload-failed');
      const payload = (await response.json()) as CloudinaryUploadResponse;
      if (!payload.secure_url) throw new Error('cloudinary-invalid-response');
      return { publicPath: payload.secure_url, repositoryPath: payload.secure_url };
    }),
  );
}
