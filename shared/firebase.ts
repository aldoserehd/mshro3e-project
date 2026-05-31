/**
 * Firebase client init. Lazy-loaded singletons.
 *
 * Reads config from `shared/firebase.config.ts` (gitignored).
 * If that file is missing, the app boots in "offline scaffolding" mode
 * and throws clearly when any Firebase API is touched.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

let _config: { apiKey: string; authDomain: string; projectId: string; storageBucket: string; messagingSenderId: string; appId: string } | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  _config = require('./firebase.config').firebaseConfig;
  if (_config?.apiKey === 'REPLACE_ME') _config = null;
} catch {
  _config = null;
}

const requireConfig = () => {
  if (!_config) {
    throw new Error(
      '[firebase] No real config found. Copy shared/firebase.config.example.ts to shared/firebase.config.ts and paste the values from Firebase Console.'
    );
  }
  return _config;
};

let _app: FirebaseApp | null = null;
export const firebaseApp = (): FirebaseApp => {
  if (_app) return _app;
  _app = getApps().length ? getApps()[0] : initializeApp(requireConfig());
  return _app;
};

// `getReactNativePersistence` is exported from `firebase/auth` but its type isn't
// in the v11 .d.ts. Use a typed require so TS doesn't choke.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (storage: unknown) => unknown;
};

let _auth: Auth | null = null;
export const firebaseAuth = (): Auth => {
  if (_auth) return _auth;
  const app = firebaseApp();
  try {
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage) as never,
    });
  } catch {
    // Auth is already initialized (hot reload), fall back to getAuth.
    _auth = getAuth(app);
  }
  return _auth;
};

let _db: Firestore | null = null;
export const firebaseDb = (): Firestore => (_db ??= getFirestore(firebaseApp()));

let _storage: FirebaseStorage | null = null;
export const firebaseStorage = (): FirebaseStorage => (_storage ??= getStorage(firebaseApp()));

export const isFirebaseConfigured = (): boolean => _config !== null;
