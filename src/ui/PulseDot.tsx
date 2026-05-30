import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { palette } from '../theme/ts';

interface Props {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const PulseDot: React.FC<Props> = ({ size = 8, color = palette.navy500, style }) => {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.6, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [scale, opacity]);

  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Animated.View style={[styles.ring, { backgroundColor: color, borderRadius: size }, ring]} />
      <View style={[styles.dot, { width: size, height: size, borderRadius: size, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: '100%', height: '100%' },
  dot: {},
});

export default PulseDot;
