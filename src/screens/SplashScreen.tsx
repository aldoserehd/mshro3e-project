import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';
import Text from '../ui/Text';
import { RootStackScreenProps } from '../navigation/types';
import { palette, spacing } from '../theme/ts';

export const ONBOARDED_KEY = '@mshro3e/onboarded';

/**
 * Polished splash screen. Brief brand fade, then routes:
 * first launch → Onboarding; otherwise → MainTabs (browsing never requires
 * an account — sign-in is only asked for at the moment of ordering).
 */
export default function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(1.05, { duration: 320 }),
      withTiming(1, { duration: 220 }),
    );
    let cancelled = false;
    const t = setTimeout(async () => {
      let onboarded = false;
      try {
        onboarded = (await AsyncStorage.getItem(ONBOARDED_KEY)) === '1';
      } catch {
        // storage unavailable — treat as returning user
        onboarded = true;
      }
      if (!cancelled) navigation.replace(onboarded ? 'MainTabs' : 'Onboarding');
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [navigation, opacity, scale]);

  const brand = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[palette.navy900, palette.navy950]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.center, brand]}>
        <View style={styles.mark}>
          <Image source={require('../assets/brand-mark.png')} style={styles.markImg} resizeMode="contain" />
        </View>
        <Text variant="pageTitle" color={palette.white} weight="700" style={{ marginTop: spacing.s4 }}>
          {i18n.t('app.name')}
        </Text>
        <Text variant="body" color={palette.navy300} style={{ marginTop: spacing.s1 }}>
          {i18n.t('app.tagline')}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  mark: {
    width: 92,
    height: 92,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markImg: { width: 64, height: 64 },
});
