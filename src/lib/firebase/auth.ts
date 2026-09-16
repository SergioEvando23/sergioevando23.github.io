import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type Auth,
} from 'firebase/auth';
import { getFirebaseApp } from './client';

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

export async function signInWithGooglePopup() {
  return signInWithPopup(getFirebaseAuth(), createGoogleProvider());
}

export async function signInWithGoogleRedirect() {
  return signInWithRedirect(getFirebaseAuth(), createGoogleProvider());
}

export async function signOutFromFirebase() {
  return firebaseSignOut(getFirebaseAuth());
}
