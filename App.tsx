import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { I18nManager, StatusBar, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts as useManrope, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts as useInter } from '@expo-google-fonts/inter';
import { IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium, IBMPlexSansArabic_600SemiBold, IBMPlexSansArabic_700Bold, useFonts as useIBMArabic } from '@expo-google-fonts/ibm-plex-sans-arabic';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import AppNavigator from './src/navigation/AppNavigator';
import { useColors } from './src/theme/colors';
import { useLocaleStore } from './src/stores/locale';
import { useUserStore } from './src/stores/user';
import { firebaseAuth, firebaseDb } from './shared/firebase';
import { COL } from './shared/firestore-paths';

// Force Arabic RTL on first launch. Persists across app reloads.
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}
// `left`/`right` styles mean PHYSICAL left/right — never auto-swapped in RTL.
// (Android otherwise flips them, which pushed back buttons to the top-right
// and right-aligned LTR content like phone numbers.) Use start/end for
// direction-aware layout.
I18nManager.swapLeftAndRightInRTL(false);

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
  const [arabicLoaded] = useIBMArabic({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });

  const fontsReady = manropeLoaded && interLoaded && arabicLoaded;
  const [authReady, setAuthReady] = useState(false);

  // Firebase Auth listener — hydrates the user store from Firestore on sign-in,
  // clears it on sign-out. Marks authReady once the first event lands.
  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | null = null;
    // Safety net: never block the splash longer than 3s on the auth listener.
    // If Firebase init hangs or fails silently we still want the app to boot.
    const safety = setTimeout(() => {
      if (!cancelled) setAuthReady(true);
    }, 3000);
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
      clearTimeout(safety);
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
  const c = useColors();

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: c.bg }]}>
      <SafeAreaProvider>
        <StatusBar barStyle={c.isDark ? 'light-content' : 'dark-content'} backgroundColor={c.bg} />
        {/* `key` forces a full re-render when locale flips, so every i18n.t() call picks up the new strings. */}
        <AppNavigator key={locale} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
