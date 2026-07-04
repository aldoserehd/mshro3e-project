import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth, isOwnerUid } from '@/lib/firebase-admin';
import { SESSION_COOKIE } from '@/lib/auth';

/**
 * Owner-admin session endpoint.
 *
 * POST { idToken } — the client signs in with Firebase (email/password),
 * sends the fresh ID token here; we verify it, require the uid to be in
 * OWNER_UIDS, then mint a SIGNED Firebase session cookie (httpOnly). This
 * replaces the old demo flow where the browser fabricated an unsigned
 * base64 "session" — that allowed anyone to forge owner access.
 *
 * DELETE — sign out (clears the cookie).
 */

const SESSION_DAYS = 5;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { idToken?: unknown };
  const idToken = typeof body.idToken === 'string' ? body.idToken : '';
  if (!idToken) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  try {
    const decoded = await adminAuth().verifyIdToken(idToken);
    if (!isOwnerUid(decoded.uid)) {
      // Authenticated, but not an owner — no admin session for you.
      return NextResponse.json({ error: 'not_owner' }, { status: 403 });
    }
    const expiresIn = SESSION_DAYS * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });
    const store = await cookies();
    store.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }
}

export async function DELETE() {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return NextResponse.json({ ok: true });
}
