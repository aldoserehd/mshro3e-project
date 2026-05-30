import React, { useEffect } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { palette, shadowStyle } from '../theme/ts';
import { useFavoritesStore } from '../stores/favorites';

interface Props {
  productId?: string;
  vendorId?: string;
  size?: number;
  style?: ViewStyle;
  variant?: 'overlay' | 'inline'; // overlay = floats on image with white bg; inline = transparent
}

/**
 * Heart button wired to the favorites store. Scales + haptic on tap,
 * fills navy-900 when favorited, outline otherwise.
 */
export const HeartButton: React.FC<Props> = ({ productId, vendorId, size = 28, style, variant = 'overlay' }) => {
  const isFav = useFavoritesStore((s) => {
    if (productId) return s.productIds.has(productId);
    if (vendorId) return s.vendorIds.has(vendorId);
    return false;
  });
  const toggleProduct = useFavoritesStore((s) => s.toggleProduct);
  const toggleVendor = useFavoritesStore((s) => s.toggleVendor);

  const scale = useSharedValue(1);
  useEffect(() => {
    // brief pulse when state changes
    scale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 240 }),
      withSpring(1, { damping: 14, stiffness: 220 }),
    );
  }, [isFav, scale]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (productId) toggleProduct(productId);
    else if (vendorId) toggleVendor(vendorId);
  };

  const iconSize = Math.round(size * 0.52);

  return (
    <Pressable onPress={onPress} hitSlop={10} style={[styles.wrap, { width: size, height: size }, variant === 'overlay' && styles.overlay, style]}>
      <Animated.View style={animStyle}>
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={iconSize}
          color={isFav ? '#E11D48' : palette.navy900}
        />
      </Animated.View>
    </Pressable>
  );
};

export default HeartButton;

const styles = StyleSheet.create({
  wrap: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    ...shadowStyle(1),
  },
});
