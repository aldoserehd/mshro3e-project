import 'server-only';
import { seedCustomers, customerByUid } from '@/data/seed';

export interface UserFilters {
  search?: string;
  banned?: 'all' | 'active' | 'banned';
}

export async function listUsers(filters: UserFilters = {}) {
  let out = seedCustomers.slice();
  if (filters.banned === 'active') out = out.filter((u) => !u.banned);
  if (filters.banned === 'banned') out = out.filter((u) => !!u.banned);
  if (filters.search) {
    const q = filters.search.trim().toLowerCase();
    out = out.filter(
      (u) =>
        (u.displayName ?? '').toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q) ||
        (u.phone ?? '').includes(q),
    );
  }
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}

export async function getUser(uid: string) {
  return customerByUid(uid) ?? null;
}

// TODO: real Firestore writes once env wired
export async function banUser(_uid: string) {
  return { ok: true };
}
export async function unbanUser(_uid: string) {
  return { ok: true };
}
