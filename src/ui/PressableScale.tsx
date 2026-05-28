import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { motion } from '../theme/ts';

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale to shrink to on press. Default 0.97 per brief micro-interaction §1. */
  pressedScale?: number;
  haptic?: 'light' | 'medium' | 'none';
  children?: React.ReactNode;
}

/**
 * Wraps children with the card-press micro-interaction:
 *   - Reanimated shared scale, spring 0.97 on pressIn (damping 18, stiffness 300)
 *   - Light haptic on press
 */
export const PressableScale: React.FC<PressableScaleProps> = ({
  style,
  pressedScale = 0.97,
  haptic = 'light',
  onPressIn,
  onPressOut,
  children,
  ...rest
}) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={(e) => {
        scale.value = withSpring(pressedScale, motion.spring.snappy);
        if (haptic === 'light') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        } else if (haptic === 'medium') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, motion.spring.snappy);
        onPressOut?.(e);
      }}
      {...rest}
    >
      <Animated.View style={[animStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
};

export default PressableScale;
