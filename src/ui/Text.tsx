import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { font, type FontRole, getCurrentLocale } from '../theme/ts';
import { useColors } from '../theme/colors';

export interface TextProps extends RNTextProps {
  variant?: FontRole;
  color?: string;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
  isArabic?: boolean;
  /** Pass true to disable RTL-aware textAlign (useful for prices stuck LTR). */
  forceLtr?: boolean;
}

/**
 * Typed text component. All UI text in the app goes through this so font,
 * line-height, and RTL handling stay consistent.
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  weight,
  align,
  isArabic,
  forceLtr,
  style,
  children,
  ...rest
}) => {
  const ar = isArabic ?? getCurrentLocale() === 'ar';
  // Weight is baked into the resolved font FILE — never set fontWeight next
  // to a custom fontFamily (Android falls back to the system font).
  const base = font(variant, ar, weight);
  const c = useColors();
  const composed: TextStyle = {
    ...base,
    color: color ?? c.text,
  };
  if (align) composed.textAlign = align;
  else if (forceLtr) composed.textAlign = 'left';
  return (
    <RNText style={[composed, style]} allowFontScaling {...rest}>
      {children}
    </RNText>
  );
};

/** Helper sub-component for the muted variant. */
export const MutedText: React.FC<TextProps> = (props) => {
  const c = useColors();
  return <Text color={c.textMuted} {...props} />;
};

const _styles = StyleSheet.create({});

export default Text;
