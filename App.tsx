import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { I18nManager, StatusBar, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts as useManrope, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts as useInter } from '@expo-google-fonts/inter';
import { Tajawal_400Regular, Tajawal_500Medium, Tajawal_700Bold, useFonts as useTajawal } from '@expo-google-fonts/tajawal';
import { IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium, IBMPlexSansArabic_600SemiBold, IBMPlexSansArabic_700Bold, useFonts as useIBMArabic } from '@expo-google-fonts/ibm-plex-sans-arabic';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import AppNavigator from './src/navigation/AppNavigator';
import { palette, semantic } from './src/theme/ts';
import { useLocaleStore } from './src/stores/locale';
import { useUserStore } from './src/stores/user';
import { firebaseAuth, firebaseDb } from './shared/firebase';
import { COL } from './shared/firestore-paths';

// Force Arabic RTL on first launch. Persists across app reloads.
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [manropeLoaded] = useManrope({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [tajawalLoaded] = useTajawal({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });
  const [arabicLoaded] = useIBMArabic({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  const fontsReady = manropeLoaded && interLoaded && tajawalLoaded && arabicLoaded;
  const [authReady, setAuthReady] = useState(false);

  // Firebase Auth listener — hydrates the user store from Firestore on sign-in,
  // clears it on sign-out. Marks authReady once the first event lands.
  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | null = null;
    try {
      unsub = onAuthStateChanged(firebaseAuth(), async (fbUser) => {
        if (cancelled) return;
        if (!fbUser) {
          useUserStore.getState().signOut();
          setAuthReady(true);
          return;
        }
        try {
          const snap = await getDoc(doc(firebaseDb(), COL.users, fbUser.uid));
          if (cancelled) return;
          if (snap.exists()) {
            const data = snap.data() as {
              name?: string;
              email?: string;
              phone?: string;
              preferredCategoryIds?: string[];
            };
            useUserStore.getState().hydrate({
              uid: fbUser.uid,
              name: data.name ?? fbUser.displayName ?? '',
              email: data.email ?? fbUser.email ?? '',
              phone: data.phone ?? '',
              preferredCategoryIds: data.preferredCategoryIds ?? [],
              isAuthenticated: true,
            });
          } else {
            useUserStore.getState().hydrate({
              uid: fbUser.uid,
              name: fbUser.displayName ?? '',
              email: fbUser.email ?? '',
              phone: '',
              preferredCategoryIds: [],
              isAuthenticated: true,
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[auth] hydrate failed:', e);
          useUserStore.getState().hydrate({
            uid: fbUser.uid,
            name: fbUser.displayName ?? '',
            email: fbUser.email ?? '',
            phone: '',
            preferredCategoryIds: [],
            isAuthenticated: true,
          });
        } finally {
          if (!cancelled) setAuthReady(true);
        }
      });
    } catch (e) {
      // Firebase not configured — skip auth and let the app boot anyway.
      // eslint-disable-next-line no-console
      console.warn('[auth] listener init failed:', e);
      setAuthReady(true);
    }
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, []);

  const ready = fontsReady && authReady;

  const onReady = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  const locale = useLocaleStore((s) => s.locale);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor={semantic.bg} />
        {/* `key` forces a full re-render when locale flips, so every i18n.t() call picks up the new strings. */}
        <AppNavigator key={locale} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.bg },
});
