/**
 * Firebase Admin SDK (server-only). Used by Server Actions / Route Handlers.
 *
 * Reads FIREBASE_ADMIN_SERVICE_ACCOUNT env var (single-line JSON string).
 */

import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

let _app: App | null = null;

const adminApp = (): App => {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0]!;
    return _app;
  }
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT missing — see admin/.env.example');

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT is not valid JSON');
  }

  _app = initializeApp({
    credential: cert(parsed as Parameters<typeof cert>[0]),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  return _app;
};

export const adminAuth = (): Auth => getAuth(adminApp());
export const adminDb = (): Firestore => getFirestore(adminApp());
export const adminStorage = (): Storage => getStorage(adminApp());

export const isOwnerUid = (uid: string): boolean => {
  const list = (process.env.OWNER_UIDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return list.includes(uid);
};
