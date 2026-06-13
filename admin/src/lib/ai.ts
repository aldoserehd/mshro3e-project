/**
 * Shared AI plumbing for the two paid AI routes (api/ai/describe,
 * api/ai/storefront). Keeps the request/response contracts of each route
 * identical while centralizing the security-sensitive bits:
 *
 *   - Anthropic client factory (+ 503 guard when no key)
 *   - Firebase ID-token verification
 *   - tier resolution (active paid tier vs free)
 *   - ATOMIC monthly quota via a Firestore transaction (no read-modify-write
 *     race — concurrent requests can never over-spend the tier allowance)
 *   - a cheap per-uid rate-limit guard (min seconds between calls)
 *   - input length caps (defends the prompt + token budget)
 *
 * Server-only. Never import from a client component.
 */
import 'server-only';
import Anthropic from '@anthropic-ai/sdk';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { COL } from '@shared/firestore-paths';

/** Monthly AI generations per tier — the upsell ladder. */
export const QUOTA: Record<string, number> = { free: 5, basic: 30, pro: 200, managed: 500 };

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
/** Minimum gap between two AI calls for the same key (anti-hammer / cost guard). */
const RATE_LIMIT_MS = 4_000;

/** Server-only collection holding per-key AI quota counters. */
export const AI_USAGE_COL = 'aiUsage';

/** Hard caps on free-form vendor input. Generous, but bounds the token budget. */
export const MAX_FIELD_LEN = 400;
export const MAX_TOTAL_LEN = 1_200;

export const AI_DEFAULT_MODEL = 'claude-opus-4-8';
export const aiModel = (): string => process.env.AI_MODEL || AI_DEFAULT_MODEL;

/** True when the server is configured to make AI calls at all. */
export const aiConfigured = (): boolean => Boolean(process.env.ANTHROPIC_API_KEY);

/** Single Anthropic client (reads ANTHROPIC_API_KEY from the env). */
let _client: Anthropic | null = null;
export const anthropic = (): Anthropic => {
  if (!_client) _client = new Anthropic();
  return _client;
};

/** Trim + collapse + hard-cap a single user-supplied field. */
export const clampField = (s: unknown, max = MAX_FIELD_LEN): string =>
  typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '';

/** Verify the Bearer Firebase ID token. Returns the uid, or null if invalid. */
export async function verifyBearer(authHeader: string | null): Promise<string | null> {
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!idToken) return null;
  try {
    adminDb(); // ensure the admin app is initialized before getAuth()
    const decoded = await getAuth().verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    return null;
  }
}

/**
 * Resolve the active billing tier for a uid by reading the vendor doc they own.
 * Falls back to 'free' when there's no vendor doc, no tier, or the
 * subscription has lapsed. `vendorId` short-circuits the ownerUid query when
 * the caller already has it (the describe route).
 */
export async function resolveTier(uid: string, vendorId?: string): Promise<string> {
  try {
    let data: FirebaseFirestore.DocumentData | undefined;
    if (vendorId) {
      data = (await adminDb().collection(COL.vendors).doc(vendorId).get()).data();
      if (data?.ownerUid !== uid) data = undefined; // not theirs → free
    } else {
      const snap = await adminDb()
        .collection(COL.vendors)
        .where('ownerUid', '==', uid)
        .limit(1)
        .get();
      data = snap.docs[0]?.data();
    }
    if (data?.tier && (data.subscriptionUntil ?? 0) > Date.now()) return data.tier as string;
  } catch {
    /* default free */
  }
  return 'free';
}

export type QuotaResult =
  | { ok: true; used: number; limit: number; tier: string }
  | { ok: false; reason: 'quota_exceeded' | 'rate_limited'; limit: number; tier: string; retryAfterMs?: number };

/**
 * Atomically claim one unit of monthly quota for `key`, inside a Firestore
 * transaction so concurrent requests cannot over-spend. Also enforces a
 * per-key minimum gap between calls. The counter is only incremented on a
 * successful claim — the AI call happens AFTER this returns ok:true, and the
 * unit is refunded via `refundQuota` if the model call itself fails.
 */
export async function claimQuota(key: string, tier: string): Promise<QuotaResult> {
  const limit = QUOTA[tier] ?? QUOTA.free;
  const ref = adminDb().collection(AI_USAGE_COL).doc(key);
  const now = Date.now();

  return adminDb().runTransaction(async (tx): Promise<QuotaResult> => {
    const snap = await tx.get(ref);
    const cur = snap.data() ?? {};
    let count: number = typeof cur.count === 'number' ? cur.count : 0;
    let resetAt: number = typeof cur.resetAt === 'number' ? cur.resetAt : 0;
    const lastAt: number = typeof cur.lastAt === 'number' ? cur.lastAt : 0;

    // rate-limit guard
    if (now - lastAt < RATE_LIMIT_MS) {
      return { ok: false, reason: 'rate_limited', limit, tier, retryAfterMs: RATE_LIMIT_MS - (now - lastAt) };
    }

    // monthly window roll-over
    if (resetAt < now) {
      count = 0;
      resetAt = now + MONTH_MS;
    }

    if (count >= limit) {
      return { ok: false, reason: 'quota_exceeded', limit, tier };
    }

    const used = count + 1;
    tx.set(ref, { count: used, resetAt, lastAt: now, updatedAt: now }, { merge: true });
    return { ok: true, used, limit, tier };
  });
}

/**
 * Refund one quota unit (best-effort) when the model call fails after a
 * successful claim, so a transient AI error doesn't burn the vendor's quota.
 * Never lets the window roll back below zero.
 */
export async function refundQuota(key: string): Promise<void> {
  try {
    const ref = adminDb().collection(AI_USAGE_COL).doc(key);
    await adminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const count = (snap.data()?.count as number | undefined) ?? 0;
      if (count > 0) tx.update(ref, { count: FieldValue.increment(-1) });
    });
  } catch {
    /* best-effort */
  }
}
