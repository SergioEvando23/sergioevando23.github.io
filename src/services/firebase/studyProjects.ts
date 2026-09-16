import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { studyProjectConverter } from '@/lib/firebase/converters';
import { getFirebaseFirestore } from '@/lib/firebase/firestore';
import type {
  StudyProject,
  StudyProjectImage,
  StudyProjectInput,
} from '@/types/firebase/studyProject';

const STUDY_PROJECTS_COLLECTION = 'studyProjects';

export function studyProjectDoc(projectId: string) {
  return doc(
    getFirebaseFirestore(),
    STUDY_PROJECTS_COLLECTION,
    projectId,
  ).withConverter(studyProjectConverter);
}

export async function studyProjectExists(projectId: string) {
  const snapshot = await getDoc(studyProjectDoc(projectId));
  return snapshot.exists();
}

export async function createStudyProject(
  input: StudyProjectInput,
  images: StudyProjectImage[],
  createdBy: string,
) {
  const now = serverTimestamp();
  await setDoc(studyProjectDoc(input.id), {
    ...input,
    images,
    createdAt: now,
    updatedAt: now,
    createdBy,
  });
}

export async function listPublicStudyProjects() {
  const projectsRef = collection(
    getFirebaseFirestore(),
    STUDY_PROJECTS_COLLECTION,
  ).withConverter(studyProjectConverter);
  const projectsQuery = query(
    projectsRef,
    where('portfolioEligible', '==', true),
    orderBy('date', 'desc'),
    limit(24),
  );
  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs.map((docSnapshot) => docSnapshot.data() as StudyProject);
}
