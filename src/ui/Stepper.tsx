import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Text from './Text';
import { font, type FontRole, semantic } from '../theme/ts';

export interface StepperProps {
  /** The current numeric value. Animates on change. */
  value: number;
  /** Number of digit slots to pre-render. Defaults to value.toString().length. */
  width?: number;
  variant?: FontRole;
  color?: string;
  prefix?: string;
  suffix?: string;
  style?: ViewStyle;
}

/**
 * Number ticker (brief §5.6). Each digit on a vertical strip — animates to the
 * target digit with withTiming, 600ms, easing cubic-out.
 */
export const Stepper: React.FC<StepperProps> = ({
  value,
  variant = 'cardTitle',
  color,
  prefix,
  suffix,
  style,
}) => {
  const text = String(Math.max(0, Math.round(value)));
  const digits = text.split('');

  return (
    <View style={[styles.row, style]}>
      {prefix && (
        <Text variant={variant} color={color} weight="700" forceLtr>
          {prefix}
        </Text>
      )}
      <View style={[styles.row, { direction: 'ltr' }]}>
        {digits.map((d, i) => (
          <Digit key={`${i}-${digits.length}`} digit={parseInt(d, 10)} variant={variant} color={color} />
        ))}
      </View>
      {suffix && (
        <Text variant={variant} color={color} weight="700" forceLtr>
          {suffix}
        </Text>
      )}
    </View>
  );
};

interface DigitProps {
  digit: number;
  variant: FontRole;
  color?: string;
}

const Digit: React.FC<DigitProps> = ({ digit, variant, color }) => {
  const f = font(variant, false);
  const lineH = (f.lineHeight as number) ?? 22;
  const offset = useSharedValue(-digit * lineH);

  useEffect(() => {
    offset.value = withTiming(-digit * lineH, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [digit, lineH, offset]);

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    <View style={{ height: lineH, overflow: 'hidden' }}>
      <Animated.View style={stripStyle}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Text
            key={i}
            variant={variant}
            color={color ?? semantic.text}
            weight="700"
            forceLtr
            style={{ height: lineH, textAlign: 'center', width: lineH * 0.6 }}
          >
            {i}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default Stepper;
