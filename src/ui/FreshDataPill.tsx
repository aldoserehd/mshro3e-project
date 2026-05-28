import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Text from './Text';
import { useElapsedTime } from '../lib/useElapsedTime';
import { palette, radius, rtl, spacing } from '../theme/ts';

export interface FreshDataPillProps {
  /** Epoch ms timestamp of the last update. */
  updatedAt: number;
  style?: ViewStyle;
}

/**
 * Live "fresh data" pill (brief §8.3): small navy-500 dot with infinite
 * scale 1→1.4→1 over 1.6s + relative timestamp re-rendered every 30s.
 */
export const FreshDataPill: React.FC<FreshDataPillProps> = ({ updatedAt, style }) => {
  const scale = useSharedValue(1);
  const label = useElapsedTime(updatedAt, rtl() ? 'ar' : 'en');

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [scale]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.row, style]}>
      <View style={styles.dotOuter}>
        <Animated.View style={[styles.dot, dotStyle]} />
      </View>
      <Text variant="microcopy" color={palette.navy500} weight="500" style={styles.label}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dotOuter: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: palette.navy500,
  },
  label: { marginStart: spacing.s1 },
});

export default FreshDataPill;
