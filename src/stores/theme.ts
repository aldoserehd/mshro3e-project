import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

/**
 * Theme mode store. Actual dark palette wiring is TODO — for now this just
 * holds the user's preference so the toggle UI can render correctly.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  setMode: (m) => set({ mode: m }),
}));
