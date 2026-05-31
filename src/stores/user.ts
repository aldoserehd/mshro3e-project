import { create } from 'zustand';

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  preferredCategoryIds: string[];
  /** When user logs in, this becomes true so we can route past auth. */
  isAuthenticated: boolean;
}

interface UserState {
  user: UserProfile | null;
  /** Local mirror after a successful Firebase Auth signUp. */
  signUp: (input: Pick<UserProfile, 'name' | 'email' | 'phone'> & { password?: string; uid?: string }) => void;
  /** Local mirror after a successful Firebase Auth signIn. */
  signIn: (identifier: string, password?: string) => void;
  /** Hydrate the store from a Firestore users/{uid} doc (called by the auth listener). */
  hydrate: (profile: UserProfile) => void;
  signOut: () => void;
  setPreferredCategories: (ids: string[]) => void;
}

/**
 * Local user store. Firebase Auth is the source of truth — this store mirrors
 * the signed-in user so screens can render synchronously without re-querying.
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  signUp: ({ name, email, phone, uid }) =>
    set({
      user: {
        uid: uid ?? `demo-${Date.now()}`,
        name,
        email,
        phone,
        preferredCategoryIds: [],
        isAuthenticated: true,
      },
    }),
  signIn: (identifier) =>
    set({
      user: {
        uid: `demo-${Date.now()}`,
        name: '',
        email: identifier.includes('@') ? identifier : '',
        phone: identifier.startsWith('+') ? identifier : '',
        preferredCategoryIds: [],
        isAuthenticated: true,
      },
    }),
  hydrate: (profile) => set({ user: profile }),
  signOut: () => set({ user: null }),
  setPreferredCategories: (ids) =>
    set((s) => (s.user ? { user: { ...s.user, preferredCategoryIds: ids } } : s)),
}));
