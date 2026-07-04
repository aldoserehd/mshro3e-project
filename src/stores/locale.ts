import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';
import { setCurrentLocale } from '../theme/ts';

export type AppLocale = 'ar' | 'en';

interface LocaleState {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
}

const initialLocale: AppLocale = (i18n.locale?.startsWith('ar') ? 'ar' : 'en') as AppLocale;
// Sync module-level locale immediately so pickLocale/formatPrice see the right value
// even before the first setLocale call.
setCurrentLocale(initialLocale);

/**
 * Global locale store (persisted). Updates i18n.locale; App.tsx watches
 * `locale` with a `key` to force re-render the whole tree on language switch.
 */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: initialLocale,
      setLocale: (l) => {
        i18n.locale = l;
        setCurrentLocale(l);
        set({ locale: l });
      },
    }),
    {
      name: '@mshro3e/locale',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ locale: s.locale }),
      onRehydrateStorage: () => (state) => {
        // Re-sync i18n + module-level locale with the persisted choice.
        if (state?.locale) {
          i18n.locale = state.locale;
          setCurrentLocale(state.locale);
        }
      },
    },
  ),
);
