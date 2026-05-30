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

import AppNavigator from './src/navigation/AppNavigator';
import { palette, semantic } from './src/theme/ts';
import { useLocaleStore } from './src/stores/locale';

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

  const ready = manropeLoaded && interLoaded && tajawalLoaded && arabicLoaded;

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
