import { useCallback, useEffect, useState } from 'react';
import { hasFirebaseConfig } from '@/lib/firebase/client';
import { listPublicStudyProjects } from '@/services/firebase/studyProjects';
import type { StudyProject } from '@/types/firebase/studyProject';

export function useStudyProjects() {
  const [projects, setProjects] = useState<StudyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    if (!hasFirebaseConfig()) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setProjects(await listPublicStudyProjects());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [load]);

  return { projects, loading, error, retry: load };
}
