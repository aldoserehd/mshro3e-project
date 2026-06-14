import React, { useEffect, useMemo } from 'react';
import { I18nManager, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Text from './Text';
import PulseDot from './PulseDot';
import { palette, radius, spacing } from '../theme/ts';

/**
 * Shared navy hero header used across Home, Categories, Category, VendorProfile cover-fallback, etc.
 * - Navy gradient with optional animated sweep glow + drifting dot pattern
 * - Optional leading/trailing slots (back, menu, mail, share)
 * - Optional title/subtitle and a slot for a search bar / extra content
 * - Respects bottom border radius for the smooth hero shape
 */
export interface NavyHeroProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  searchSlot?: React.ReactNode;
  sweepGlow?: boolean;
  pattern?: 'dots' | 'grid' | 'none';
  pulseDot?: boolean;
  minHeight?: number;
  paddingBottom?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const NavyHero: React.FC<NavyHeroProps> = ({
  title,
  subtitle,
  eyebrow,
  leading,
  trailing,
  searchSlot,
  sweepGlow = true,
  pattern = 'dots',
  pulseDot = false,
  minHeight,
  paddingBottom = spacing.s6,
  style,
  children,
}) => {
  return (
    <View style={[styles.wrap, { paddingBottom, minHeight }, style]}>
      <LinearGradient
        colors={[palette.navy900, palette.navy800, palette.navy900]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {pattern === 'dots' && <DriftingDots />}
      {pattern === 'grid' && <GridPattern />}
      {sweepGlow && <SweepGlow />}

      {(leading || trailing || pulseDot) && (
        <View style={styles.topRow}>
          <View style={styles.side}>{leading}</View>
          {pulseDot && (
            <View style={styles.pulse}>
              <PulseDot size={6} color={palette.navy300} />
            </View>
          )}
          <View style={styles.side}>{trailing}</View>
        </View>
      )}

      {eyebrow && (
        <Text
          variant="caption"
          color={palette.navy300}
          weight="600"
          style={styles.eyebrow}
        >
          {eyebrow}
        </Text>
      )}

      {title && (
        <Text
          variant="hero"
          color="#fff"
          weight="700"
          style={styles.title}
        >
          {title}
        </Text>
      )}

      {subtitle && (
        <Text variant="body" color={palette.navy300} style={styles.subtitle}>
          {subtitle}
        </Text>
      )}

      {searchSlot && <View style={styles.searchSlot}>{searchSlot}</View>}

      {children}
    </View>
  );
};

// ───── Drifting dot pattern (slow vertical drift) ─────
const DriftingDots: React.FC = () => {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [y]);

  const dots = useMemo(() => {
    const arr: { left: number; top: number; size: number; alpha: number }[] = [];
    // A deterministic scatter (no Math.random in render).
    for (let i = 0; i < 70; i++) {
      arr.push({
        left: (i * 37) % 380,
        top: ((i * 53) % 200) + 10,
        size: i % 5 === 0 ? 4 : 3,
        alpha: i % 7 === 0 ? 0.14 : 0.07,
      });
    }
    return arr;
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      {dots.map((d, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            borderRadius: 999,
            backgroundColor: `rgba(255,255,255,${d.alpha})`,
          }}
        />
      ))}
    </Animated.View>
  );
};

// ───── Static faint grid pattern ─────
const GridPattern: React.FC = () => {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    lines.push(
      <View
        key={`v${i}`}
        style={{
          position: 'absolute',
          left: i * 36,
          top: 0,
          bottom: 0,
          width: 1,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      />,
    );
  }
  for (let i = 0; i < 8; i++) {
    lines.push(
      <View
        key={`h${i}`}
        style={{
          position: 'absolute',
          top: i * 36,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      />,
    );
  }
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {lines}
    </View>
  );
};

// ───── Animated diagonal sweep glow ─────
const SweepGlow: React.FC = () => {
  const x = useSharedValue(-1);
  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-1, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [x]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 180 }, { rotate: '12deg' }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.sweep, style]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.10)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s3,
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
    overflow: 'hidden',
  },
  topRow: {
    // Force visual LTR (leading=left, trailing=right) even under forced-RTL,
    // so the back button always sits on the left.
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.s4,
  },
  side: { minWidth: 40, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', top: 12, alignSelf: 'center' },
  eyebrow: { letterSpacing: 1 },
  title: { fontSize: 28, lineHeight: 34, marginTop: 4 },
  subtitle: { marginTop: 4 },
  searchSlot: { marginTop: spacing.s4 },
  sweep: {
    position: 'absolute',
    top: -60,
    bottom: -60,
    width: 220,
    left: '40%',
  },
});

export default NavyHero;
