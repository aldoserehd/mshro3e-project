/**
 * Firebase client SDK (browser). Reads from NEXT_PUBLIC_* env vars.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const ready = Object.values(config).every(Boolean);

let _app: FirebaseApp | null = null;
const app = (): FirebaseApp => {
  if (!ready) throw new Error('Firebase env vars missing — see admin/.env.example');
  if (_app) return _app;
  _app = getApps().length ? getApps()[0] : initializeApp(config as Required<typeof config>);
  return _app;
};

let _auth: Auth | null = null;
export const authClient = (): Auth => (_auth ??= getAuth(app()));

let _db: Firestore | null = null;
export const dbClient = (): Firestore => (_db ??= getFirestore(app()));

let _storage: FirebaseStorage | null = null;
export const storageClient = (): FirebaseStorage => (_storage ??= getStorage(app()));

export const firebaseReady = ready;
