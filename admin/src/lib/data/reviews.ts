import 'server-only';
import type { Review } from '@shared/types';
import { seedReviews } from '@/data/seed';

export async function listReviews(opts: { flaggedOnly?: boolean } = {}): Promise<Review[]> {
  let out = seedReviews.slice();
  if (opts.flaggedOnly) out = out.filter((r) => r.flagged);
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}

// TODO: real writes
export async function unflagReview(_id: string) {
  return { ok: true };
}
export async function hideReview(_id: string) {
  return { ok: true };
}
