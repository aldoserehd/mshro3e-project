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
import { palette, radius, semantic, spacing } from '../theme/ts';

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
  const pressed = useSharedValue(0);

  const bgInterp = useAnimatedStyle(() => {
    const colors = getInterpColors(variant);
    if (!colors) return {};
    return {
      backgroundColor: pressed.value > 0 ? colors.pressed : colors.rest,
    };
  });

  const scaleInterp = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.02 }],
  }));

  const { textColor, borderColor } = palettesFor(variant);
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

function palettesFor(v: ButtonVariant): { textColor: string; borderColor: string } {
  switch (v) {
    case 'primary':
      return { textColor: palette.white, borderColor: 'transparent' };
    case 'secondary':
      return { textColor: semantic.brand, borderColor: semantic.borderStrong };
    case 'ghost':
      return { textColor: semantic.brand, borderColor: 'transparent' };
    case 'destructive':
      return { textColor: palette.white, borderColor: 'transparent' };
  }
}

function getInterpColors(v: ButtonVariant): { rest: string; pressed: string } | null {
  switch (v) {
    case 'primary':
      return { rest: palette.brand, pressed: palette.brandDark };
    case 'secondary':
      return { rest: palette.white, pressed: palette.navy50 };
    case 'ghost':
      return { rest: 'transparent', pressed: palette.navy100 };
    case 'destructive':
      return { rest: '#B43A3A', pressed: '#8C2A2A' };
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
