const DEFAULT_OWNER = 'SergioEvando23';
const DEFAULT_REPO = 'sergioevando23.github.io';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER ?? DEFAULT_OWNER;
const repo = process.env.NEXT_PUBLIC_GITHUB_REPO ?? DEFAULT_REPO;

export interface SelectedStudyImage {
  id: string;
  file: File;
  previewUrl: string;
  isCover: boolean;
}

export interface GithubUploadResult {
  publicPath: string;
  repositoryPath: string;
}

interface GithubContentResponse {
  sha?: string;
}

function githubContentsUrl(path: string) {
  return `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}`;
}

function assertImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('invalid-image-type');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('image-too-large');
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(String(reader.result)));
    reader.addEventListener('error', () => reject(new Error('file-read-failed')));
    reader.readAsDataURL(file);
  });
}

async function fileToBase64(file: File) {
  const dataUrl = await readFileAsDataUrl(file);
  return dataUrl.split(',')[1] ?? '';
}

async function convertToWebpWhenSupported(file: File) {
  if (
    file.type === 'image/webp' ||
    typeof createImageBitmap === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');

  if (!context) {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', 0.86);
  });

  if (!blob) {
    return file;
  }

  return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
    type: 'image/webp',
  });
}

async function getExistingSha(path: string, token: string) {
  const response = await fetch(githubContentsUrl(path), {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`github-sha-failed-${response.status}`);
  }

  const payload = (await response.json()) as GithubContentResponse;
  return payload.sha;
}

async function putGithubFile(path: string, file: File, token: string) {
  const sha = await getExistingSha(path, token);
  const webpFile = await convertToWebpWhenSupported(file);
  const content = await fileToBase64(webpFile);
  const response = await fetch(githubContentsUrl(path), {
    body: JSON.stringify({
      branch: 'main',
      content,
      message: `chore(study): upload ${path}`,
      ...(sha ? { sha } : {}),
    }),
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`github-upload-failed-${response.status}`);
  }
}

export function publicStudyImagePath(studyId: string, index: number, isCover: boolean) {
  const fileName = isCover ? 'cover.webp' : `${String(index).padStart(2, '0')}.webp`;
  return `/images/studies/${studyId}/${fileName}`;
}

export async function uploadStudyImagesToGithub(
  studyId: string,
  images: SelectedStudyImage[],
  token: string,
) {
  if (images.length === 0) {
    return [];
  }

  const ordered = [...images].sort((left, right) =>
    left.isCover === right.isCover ? 0 : left.isCover ? -1 : 1,
  );
  const results: GithubUploadResult[] = [];

  for (const [index, image] of ordered.entries()) {
    assertImageFile(image.file);
    const publicPath = publicStudyImagePath(studyId, index, image.isCover);
    const repositoryPath = `public${publicPath}`;
    await putGithubFile(repositoryPath, image.file, token);
    results.push({ publicPath, repositoryPath });
  }

  return results;
}
