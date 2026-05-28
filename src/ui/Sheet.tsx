import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { palette, motion, radius, semantic, shadowStyle, spacing } from '../theme/ts';

const { height: SCREEN_H } = Dimensions.get('window');

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** Heights from BOTTOM of screen. Default: peek 120, half 50%, full 92%. */
  snapPoints?: [number, number, number];
  /** Index of initial snap point. */
  initialSnap?: 0 | 1 | 2;
  children?: React.ReactNode;
}

/**
 * Bottom sheet with 3 snap points (brief §4.4):
 *   peek 120px / half 50% / full 92%
 * Drag with Gesture.Pan + withSpring to nearest snap.
 * Backdrop opacity interpolated from translateY.
 */
export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  snapPoints,
  initialSnap = 0,
  children,
}) => {
  const sp = snapPoints ?? [120, SCREEN_H * 0.5, SCREEN_H * 0.92];

  // translateY of the sheet (sheet rendered as absolute full-screen, animates from bottom).
  // We track its "visible height". 0 = hidden, sp[i] = visible.
  const visibleH = useSharedValue(0);

  const snapTo = (h: number) => {
    'worklet';
    visibleH.value = withSpring(h, motion.spring.sheet);
  };

  useEffect(() => {
    if (open) {
      visibleH.value = withSpring(sp[initialSnap], motion.spring.sheet);
    } else {
      visibleH.value = withTiming(0, { duration: motion.timing.base });
    }
  }, [open, initialSnap, sp, visibleH]);

  const closeFromJs = () => onClose();

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const next = visibleH.value - e.translationY;
      visibleH.value = Math.max(0, Math.min(sp[2], next));
    })
    .onEnd((e) => {
      const v = visibleH.value;
      const velocity = -e.velocityY; // positive when moving up
      // pick nearest snap, biased by velocity
      const target = pickSnap(v + velocity * 0.15, sp);
      if (target < sp[0] * 0.5) {
        visibleH.value = withTiming(0, { duration: motion.timing.base });
        runOnJS(closeFromJs)();
      } else {
        visibleH.value = withSpring(target, motion.spring.sheet);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    height: visibleH.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(visibleH.value, [0, sp[1]], [0, 0.5], 'clamp'),
  }));

  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(visibleH.value, [sp[0], sp[1]], [0.6, 1], 'clamp'),
  }));

  if (!open && visibleH.value === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={open ? 'auto' : 'none'}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: palette.navy950 }, backdropStyle]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <GestureDetector gesture={pan}>
          <View style={styles.handleArea}>
            <Animated.View style={[styles.handle, handleStyle]} />
          </View>
        </GestureDetector>
        <View style={{ flex: 1 }}>{children}</View>
      </Animated.View>
    </View>
  );
};

function pickSnap(value: number, sp: number[]): number {
  'worklet';
  let nearest = sp[0];
  let best = Math.abs(value - sp[0]);
  for (let i = 1; i < sp.length; i++) {
    const d = Math.abs(value - sp[i]);
    if (d < best) {
      best = d;
      nearest = sp[i];
    }
  }
  return nearest;
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: semantic.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
    ...shadowStyle(3),
  },
  handleArea: {
    alignItems: 'center',
    paddingVertical: spacing.s3,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: palette.navy200,
  },
});

export default Sheet;
