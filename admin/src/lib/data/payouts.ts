import 'server-only';
import { seedPayouts } from '@/data/seed';

export async function listPayouts(opts: { pendingOnly?: boolean } = {}) {
  let out = seedPayouts.slice();
  if (opts.pendingOnly) out = out.filter((p) => p.status === 'pending');
  out.sort((a, b) => b.requestedAt - a.requestedAt);
  return out;
}

// TODO: real writes
export async function approvePayout(_id: string) {
  return { ok: true };
}
export async function rejectPayout(_id: string) {
  return { ok: true };
}
