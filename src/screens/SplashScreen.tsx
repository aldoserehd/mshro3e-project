import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../locales/i18n';
import Text from '../ui/Text';
import { RootStackScreenProps } from '../navigation/types';
import { palette, spacing } from '../theme/ts';
import { useUserStore } from '../stores/user';

/**
 * Polished splash screen. No artificial delay — fades in app brand briefly
 * then navigates to Onboarding.
 */
export default function SplashScreen({ navigation }: RootStackScreenProps<'Splash'>) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(1.05, { duration: 320 }),
      withTiming(1, { duration: 220 }),
    );
    const t = setTimeout(() => {
      // Route based on Firebase Auth state (hydrated by App.tsx auth listener).
      // To revert to the dev bypass, swap the line below for: navigation.replace('MainTabs');
      if (user) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('SignIn');
      }
    }, 700);
    return () => clearTimeout(t);
  }, [navigation, opacity, scale, user]);

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
          <Text variant="hero" color={palette.white} weight="700">
            م
          </Text>
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
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
