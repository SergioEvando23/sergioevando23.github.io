import { useState } from 'react';
import { useAuth } from '@/components/auth';
import {
  deleteUploadedProjectImages,
  uploadProjectImages,
  type LocalProjectImage,
} from '@/services/firebase/projectImages';
import {
  createStudyProject,
  studyProjectExists,
} from '@/services/firebase/studyProjects';
import type { StudyProjectInput } from '@/types/firebase/studyProject';

export function useCreateStudyProject() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  async function create(
    input: StudyProjectInput,
    images: LocalProjectImage[],
    progressLabel: (current: number, total: number) => string,
  ) {
    if (!user) {
      throw new Error('unauthenticated');
    }

    setLoading(true);
    setProgress(null);
    const uploaded = await uploadProjectImages(input.id, images, (current, total) => {
      setProgress(progressLabel(current, total));
    });

    try {
      if (await studyProjectExists(input.id)) {
        throw new Error('duplicate-id');
      }

      await createStudyProject(input, uploaded, user.uid);
    } catch (error) {
      await deleteUploadedProjectImages(uploaded);
      throw error;
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  return { create, loading, progress };
}
