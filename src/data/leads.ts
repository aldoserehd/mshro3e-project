/**
 * Vendor attribution / lead tracking.
 *
 * We never handle payment or delivery — customers contact vendors over
 * WhatsApp. To prove the platform's value (and power the vendor dashboard's
 * "N customers reached you via Mshro3e"), every WhatsApp tap:
 *   1. opens wa.me with a TAGGED, pre-filled Arabic message that carries a
 *      short reference code (MSH-XXXX) so the vendor recognises the source, and
 *   2. writes a `leads/{id}` doc to Firestore.
 *
 * The write is best-effort: a failed log must never block the customer from
 * reaching the vendor, so callers fire-and-forget.
 */
import { addDoc, collection } from 'firebase/firestore';
import { firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';

export interface LeadInput {
  vendorId: string;
  productId: string;
  productTitle: string;
  /** Signed-in customer uid, if any (browsing is allowed without auth). */
  customerUid?: string;
  /** Free-text the customer added (area, date, qty…). */
  note?: string;
  ref: string;
}

/** MSH-7F3A style code. Short, uppercase, unambiguous. */
export function makeRef(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1
  let s = '';
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `MSH-${s}`;
}

/** Fire-and-forget. Returns the created id or null on failure. */
export async function logLead(input: LeadInput): Promise<string | null> {
  try {
    const ref = await addDoc(collection(firebaseDb(), COL.leads), {
      vendorId: input.vendorId,
      productId: input.productId,
      productTitle: input.productTitle,
      customerUid: input.customerUid ?? null,
      note: input.note ?? null,
      ref: input.ref,
      channel: 'whatsapp',
      status: 'new',
      // Epoch millis — the whole codebase (vendor portal, admin KPIs, the
      // Requests tab) sorts and windows on numeric createdAt.
      createdAt: Date.now(),
    });
    return ref.id;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[leads] failed to log lead:', e instanceof Error ? e.message : e);
    return null;
  }
}
