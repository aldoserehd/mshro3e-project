import { create } from 'zustand';
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
 * Global locale store. Updates i18n.locale + bumps a version
 * that App.tsx watches with a `key` to force re-render the
 * whole tree on language switch.
 */
export const useLocaleStore = create<LocaleState>((set) => ({
  locale: initialLocale,
  setLocale: (l) => {
    i18n.locale = l;
    setCurrentLocale(l);
    set({ locale: l });
  },
}));
