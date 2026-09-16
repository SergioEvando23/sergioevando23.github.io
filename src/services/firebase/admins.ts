import { doc, getDoc } from 'firebase/firestore';
import { adminConverter } from '@/lib/firebase/converters';
import { getFirebaseFirestore } from '@/lib/firebase/firestore';

export const ADMIN_EMAIL = 'sergioevandocosta@gmail.com';

export async function getAdminDocument(uid: string) {
  const adminRef = doc(getFirebaseFirestore(), 'admins', uid).withConverter(
    adminConverter,
  );
  const snapshot = await getDoc(adminRef);

  return snapshot.exists() ? snapshot.data() : null;
}
