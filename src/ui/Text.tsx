import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { font, type FontRole, rtl, semantic, palette } from '../theme/ts';

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
  const isRtl = rtl();
  const ar = isArabic ?? isRtl;
  const base = font(variant, ar);
  const composed: TextStyle = {
    ...base,
    color: color ?? semantic.text,
  };
  if (weight) composed.fontWeight = weight;
  if (align) composed.textAlign = align;
  else if (forceLtr) composed.textAlign = 'left';
  return (
    <RNText style={[composed, style]} allowFontScaling {...rest}>
      {children}
    </RNText>
  );
};

/** Helper sub-component for the muted variant. */
export const MutedText: React.FC<TextProps> = (props) => (
  <Text color={palette.neutral500} {...props} />
);

const _styles = StyleSheet.create({});

export default Text;
