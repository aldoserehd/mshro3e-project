import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Notification preferences (persisted). Read by the Settings and
 * Notifications screens; consumed by push delivery once notifications ship.
 */
export interface NotifPrefs {
  push: boolean;
  orderUpdates: boolean;
  promos: boolean;
  vendorAlerts: boolean;
}

interface PrefsState extends NotifPrefs {
  setPref: <K extends keyof NotifPrefs>(key: K, value: boolean) => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      push: true,
      orderUpdates: true,
      promos: false,
      vendorAlerts: true,
      setPref: (key, value) => set({ [key]: value } as Partial<NotifPrefs>),
    }),
    { name: '@mshro3e/prefs', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
