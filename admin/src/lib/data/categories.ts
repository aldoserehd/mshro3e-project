import 'server-only';
import type { Category } from '@shared/types';
import { seedCategories } from '@/data/seed';

export async function listCategories(): Promise<Category[]> {
  return seedCategories.slice().sort((a, b) => a.order - b.order);
}

// TODO: real Firestore CRUD once env wired
export async function createCategory(_input: Omit<Category, 'id' | 'order'>) {
  return { ok: true };
}
export async function updateCategory(_id: string, _patch: Partial<Category>) {
  return { ok: true };
}
export async function deleteCategory(_id: string) {
  return { ok: true };
}
export async function reorderCategory(_id: string, _direction: 'up' | 'down') {
  return { ok: true };
}
