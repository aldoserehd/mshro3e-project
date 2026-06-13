import React from 'react';
import { I18nManager, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/colors';
import { shadowStyle } from '../theme/ts';

/**
 * THE back button — one style everywhere.
 * variant 'light'  → for screens with surface backgrounds
 * variant 'overlay'→ glassy circle for use over images / navy heroes
 * Chevron flips automatically for RTL.
 */
export const BackButton: React.FC<{
  onPress: () => void;
  variant?: 'light' | 'overlay';
  style?: ViewStyle;
}> = ({ onPress, variant = 'light', style }) => {
  const c = useColors();
  const overlay = variant === 'overlay';
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      style={[
        styles.btn,
        overlay
          ? { backgroundColor: 'rgba(0,26,65,0.45)', borderColor: 'rgba(255,255,255,0.25)' }
          : { backgroundColor: c.surface, borderColor: c.border, ...shadowStyle(1) },
        style,
      ]}
    >
      <Ionicons
        name="chevron-back"
        size={22}
        color={overlay ? '#fff' : c.text}
        style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }], marginStart: -2 }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackButton;
