import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { radius, spacing } from '../theme/ts';
import { useColors, type Colors } from '../theme/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'leading' | 'trailing';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const HEIGHT: Record<ButtonSize, number> = { sm: 36, md: 48, lg: 56 };
const HPAD: Record<ButtonSize, number> = { sm: spacing.s3, md: spacing.s5, lg: spacing.s5 };

/**
 * Primary button micro-interaction (brief §5.2):
 *   - 150ms background interpolate navy-900 → navy-700
 *   - scale 0.98 on pressIn
 *   - haptic medium on release
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  icon,
  iconPosition = 'leading',
  fullWidth,
  style,
}) => {
  const c = useColors();
  const pressed = useSharedValue(0);

  const interp = getInterpColors(variant, c);
  const bgInterp = useAnimatedStyle(() => {
    if (!interp) return {};
    return {
      backgroundColor: pressed.value > 0 ? interp.pressed : interp.rest,
    };
  });

  const scaleInterp = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.02 }],
  }));

  const { textColor, borderColor } = palettesFor(variant, c);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPressIn={() => {
        if (isDisabled) return;
        pressed.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 160 });
      }}
      onPress={() => {
        if (isDisabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress?.();
      }}
      style={[{ borderRadius: radius.md }, fullWidth && { width: '100%' }, style]}
    >
      <Animated.View
        style={[
          styles.base,
          {
            height: HEIGHT[size],
            paddingHorizontal: HPAD[size],
            borderRadius: radius.md,
            borderColor,
            borderWidth: variant === 'secondary' ? 1 : 0,
            opacity: isDisabled ? 0.55 : 1,
          },
          bgInterp,
          scaleInterp,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <View style={styles.row}>
            {icon && iconPosition === 'leading' && (
              <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={textColor} style={styles.iconLeading} />
            )}
            {title && (
              <Text variant="button" color={textColor} weight="600">
                {title}
              </Text>
            )}
            {icon && iconPosition === 'trailing' && (
              <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={textColor} style={styles.iconTrailing} />
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

function palettesFor(v: ButtonVariant, c: Colors): { textColor: string; borderColor: string } {
  switch (v) {
    case 'primary':
      return { textColor: c.textOnBrand, borderColor: 'transparent' };
    case 'secondary':
      return { textColor: c.brandText, borderColor: c.borderStrong };
    case 'ghost':
      return { textColor: c.brandText, borderColor: 'transparent' };
    case 'destructive':
      return { textColor: '#fff', borderColor: 'transparent' };
  }
}

function getInterpColors(v: ButtonVariant, c: Colors): { rest: string; pressed: string } | null {
  switch (v) {
    case 'primary':
      return { rest: c.brand, pressed: c.brandDark };
    case 'secondary':
      return { rest: c.surface, pressed: c.surfaceAlt };
    case 'ghost':
      return { rest: 'transparent', pressed: c.brandFill };
    case 'destructive':
      return { rest: c.danger, pressed: c.isDark ? '#cc4d4d' : '#8C2A2A' };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeading: {
    marginEnd: spacing.s2,
  },
  iconTrailing: {
    marginStart: spacing.s2,
  },
});

export default Button;
