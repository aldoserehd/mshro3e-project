/**
 * Firebase client init. Lazy-loaded singletons.
 *
 * Reads config from `shared/firebase.config.ts` (gitignored).
 * If that file is missing, the app boots in "offline scaffolding" mode
 * and throws clearly when any Firebase API is touched.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
// `getReactNativePersistence` is exported at runtime by `firebase/auth` but
// is not in the public TypeScript types in v11. Ignore for TS.
// @ts-expect-error see comment above
import { getReactNativePersistence } from 'firebase/auth';
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

let _auth: Auth | null = null;
export const firebaseAuth = (): Auth => {
  if (_auth) return _auth;
  const app = firebaseApp();
  try {
    // Prefer the RN-persistent variant so users stay signed in across launches.
    if (typeof getReactNativePersistence === 'function') {
      _auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      _auth = getAuth(app);
    }
  } catch {
    // Already initialized (e.g. fast refresh) or RN persistence unavailable.
    _auth = getAuth(app);
  }
  return _auth;
};

let _db: Firestore | null = null;
export const firebaseDb = (): Firestore => (_db ??= getFirestore(firebaseApp()));

let _storage: FirebaseStorage | null = null;
export const firebaseStorage = (): FirebaseStorage => (_storage ??= getStorage(firebaseApp()));

export const isFirebaseConfigured = (): boolean => _config !== null;
