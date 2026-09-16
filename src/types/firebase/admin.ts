import type { Timestamp } from 'firebase/firestore';

export interface AdminDocument {
  email: string;
  active: boolean;
  createdAt: Timestamp;
}
