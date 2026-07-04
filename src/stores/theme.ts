import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palette } from '../theme/ts';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (m) => set({ mode: m }),
    }),
    { name: '@mshro3e/theme', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

/**
 * Resolve the effective theme based on the user's mode preference + the OS
 * color scheme. Use this inside any screen that wants to react to dark mode.
 */
export function useEffectiveTheme(): EffectiveTheme {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme();
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  return system === 'dark' ? 'dark' : 'light';
}

export function backgroundFor(t: EffectiveTheme): string {
  return t === 'dark' ? palette.navy950 : palette.navy50;
}

export function surfaceFor(t: EffectiveTheme): string {
  return t === 'dark' ? palette.navy900 : palette.white;
}

export function textFor(t: EffectiveTheme): string {
  return t === 'dark' ? palette.white : palette.neutral900;
}
