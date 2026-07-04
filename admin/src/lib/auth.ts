/**
 * Server-side session resolution for the OWNER ADMIN.
 *
 * The cookie is a SIGNED Firebase session cookie minted by POST /api/session
 * after verifying the owner's ID token against OWNER_UIDS. We verify it here
 * with the Admin SDK on every request — it can no longer be forged by
 * hand-writing a base64 payload (the old demo behaviour).
 */

import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth, isOwnerUid } from '@/lib/firebase-admin';
import type { UserRole } from '@shared/types';

export const SESSION_COOKIE = '__mshro3e_session';

export interface AdminSession {
  uid: string;
  role: UserRole;
  displayName?: string;
  email?: string;
  /** True when this uid appears in the OWNER_UIDS env list. */
  isOwner: boolean;
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(raw);
    if (!isOwnerUid(decoded.uid)) return null;
    return {
      uid: decoded.uid,
      role: 'owner',
      displayName: (decoded.name as string | undefined) ?? decoded.email ?? undefined,
      email: decoded.email ?? undefined,
      isOwner: true,
    };
  } catch {
    return null;
  }
}

/** Gate for owner-admin server actions — throws unless a verified owner. */
export async function requireOwner(): Promise<AdminSession> {
  const s = await getSession();
  if (!s) throw new Error('UNAUTHENTICATED');
  if (!s.isOwner) throw new Error('FORBIDDEN');
  return s;
}
