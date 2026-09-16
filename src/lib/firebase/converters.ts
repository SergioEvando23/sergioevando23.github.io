import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import type { AdminDocument } from '@/types/firebase/admin';
import type { StudyProject } from '@/types/firebase/studyProject';

export const adminConverter: FirestoreDataConverter<AdminDocument> = {
  toFirestore: (admin) => admin,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ) => snapshot.data(options) as AdminDocument,
};

export const studyProjectConverter: FirestoreDataConverter<StudyProject> = {
  toFirestore: (project) => project,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ) => snapshot.data(options) as StudyProject,
};
