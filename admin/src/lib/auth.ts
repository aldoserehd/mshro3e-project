/**
 * Server-side session resolution.
 *
 * Real implementation: verify Firebase ID token cookie via firebase-admin.
 * Stub implementation (current): decode a base64 JSON payload from cookie
 * `__mshro3e_session` containing `{ uid, role, displayName?, email? }`.
 *
 * Once FIREBASE_ADMIN_SERVICE_ACCOUNT env is wired we'll switch to
 * `adminAuth().verifySessionCookie(...)`.
 */

import 'server-only';
import { cookies } from 'next/headers';
import type { UserRole } from '@shared/types';

export const SESSION_COOKIE = '__mshro3e_session';

export interface AdminSession {
  uid: string;
  role: UserRole;
  displayName?: string;
  email?: string;
  /** True when this uid appears in OWNER_UIDS env list. */
  isOwner: boolean;
}

const OWNER_UIDS = (process.env.OWNER_UIDS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const isOwnerUid = (uid: string) => OWNER_UIDS.length === 0 || OWNER_UIDS.includes(uid);

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as {
      uid?: string;
      role?: UserRole;
      displayName?: string;
      email?: string;
    };
    if (!decoded.uid || !decoded.role) return null;
    // TODO: real Firebase verify once env is wired.
    return {
      uid: decoded.uid,
      role: decoded.role,
      displayName: decoded.displayName,
      email: decoded.email,
      isOwner: decoded.role === 'owner' && isOwnerUid(decoded.uid),
    };
  } catch {
    return null;
  }
}

/** Encode a session payload to base64 JSON for the dev login flow. */
export function encodeSession(payload: {
  uid: string;
  role: UserRole;
  displayName?: string;
  email?: string;
}): string {
  return Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64');
}

export async function requireOwnerOrVendor(): Promise<AdminSession> {
  const s = await getSession();
  if (!s) throw new Error('UNAUTHENTICATED');
  if (s.role === 'customer') throw new Error('FORBIDDEN');
  // TODO: scope queries to vendorId when role === 'vendor' in next pass.
  return s;
}
