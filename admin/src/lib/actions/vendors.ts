'use server';

/**
 * Owner-admin vendor moderation — real Firestore writes via the Admin SDK
 * (bypasses security rules). These replace the old no-op stubs so verify /
 * approve / suspend / activate / reject actually persist and reflect in the
 * mobile app (which only shows vendors with status === 'active').
 */
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import { COL } from '@shared/firestore-paths';
import type { VendorStatus } from '@shared/types';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function patchVendor(id: string, patch: Record<string, unknown>): Promise<ActionResult> {
  try {
    await adminDb().collection(COL.vendors).doc(id).set(
      { ...patch, updatedAt: Date.now() },
      { merge: true },
    );
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Write failed' };
  }
  revalidatePath('/vendors');
  revalidatePath('/vendors/pending');
  revalidatePath(`/vendors/${id}`);
  return { ok: true };
}

const setStatus = (id: string, status: VendorStatus, extra: Record<string, unknown> = {}) =>
  patchVendor(id, { status, ...extra });

/** Approve a pending vendor: make it active AND verified. */
export async function approveVendor(id: string): Promise<ActionResult> {
  return setStatus(id, 'active', { verifiedAt: Date.now() });
}

/** Mark a vendor verified (keeps current status). */
export async function verifyVendor(id: string): Promise<ActionResult> {
  return patchVendor(id, { verifiedAt: Date.now() });
}

/** Suspend an active vendor (hidden from the app). */
export async function suspendVendor(id: string): Promise<ActionResult> {
  return setStatus(id, 'suspended');
}

/** Re-activate a suspended vendor. */
export async function activateVendor(id: string): Promise<ActionResult> {
  return setStatus(id, 'active');
}

/** Reject a pending application. */
export async function rejectVendor(id: string): Promise<ActionResult> {
  return setStatus(id, 'rejected');
}

/**
 * Activate / change a vendor's paid subscription tier.
 *
 * This is the manual payment flow: the vendor pays a KNET payment link
 * (MyFatoorah / Tap / UPayments) → the owner confirms the payment → sets the
 * tier + term here. `months` extends from today (or from the current expiry
 * if still in the future). Pass `tier: null` to drop back to Free.
 */
export async function setVendorTier(
  id: string,
  tier: 'basic' | 'pro' | 'managed' | null,
  months: 1 | 3 = 1,
): Promise<ActionResult> {
  if (tier === null) {
    const res = await patchVendor(id, { tier: null, subscriptionUntil: null });
    if (res.ok) revalidatePath('/subscriptions');
    return res;
  }
  try {
    const ref = adminDb().collection(COL.vendors).doc(id);
    const snap = await ref.get();
    const current = (snap.data()?.subscriptionUntil as number | undefined) ?? 0;
    const base = current > Date.now() ? current : Date.now();
    const until = base + months * 30 * 24 * 60 * 60 * 1000;
    await ref.set({ tier, subscriptionUntil: until, updatedAt: Date.now() }, { merge: true });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Write failed' };
  }
  revalidatePath('/subscriptions');
  revalidatePath(`/vendors/${id}`);
  return { ok: true };
}
