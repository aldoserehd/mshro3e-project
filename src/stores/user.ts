import { create } from 'zustand';

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  preferredCategoryIds: string[];
  /** When user signs up, this becomes true so we can route past auth. */
  isAuthenticated: boolean;
}

interface UserState {
  user: UserProfile | null;
  signUp: (input: Pick<UserProfile, 'name' | 'email' | 'phone'> & { password: string }) => void;
  signIn: (identifier: string, password: string) => void;
  signOut: () => void;
  setPreferredCategories: (ids: string[]) => void;
}

/**
 * Local-only user store for the demo flow.
 * Real Firebase auth will replace `signUp` / `signIn` later.
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  signUp: ({ name, email, phone }) =>
    set({
      user: {
        uid: `demo-${Date.now()}`,
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
        name: 'فهد المهاجري',
        email: identifier.includes('@') ? identifier : 'fahad@mshro3e.kw',
        phone: identifier.startsWith('+') ? identifier : '+965 5000 1234',
        preferredCategoryIds: [],
        isAuthenticated: true,
      },
    }),
  signOut: () => set({ user: null }),
  setPreferredCategories: (ids) =>
    set((s) => (s.user ? { user: { ...s.user, preferredCategoryIds: ids } } : s)),
}));
