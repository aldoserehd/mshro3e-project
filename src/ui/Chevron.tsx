import React from 'react';
import { I18nManager, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from '../theme/ts';

/**
 * Smart auto-mirror chevron. Pass `direction: 'back'` for the
 * "go back / previous" arrow and `'forward'` for the "next / drill in"
 * arrow — the icon name flips based on I18nManager.isRTL so the visual
 * direction is always correct. No `scaleX:-1` hacks needed.
 */
export interface ChevronProps {
  direction?: 'back' | 'forward';
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Chevron: React.FC<ChevronProps> = ({
  direction = 'forward',
  size = 18,
  color = palette.navy900,
  style,
}) => {
  const isRtl = I18nManager.isRTL;
  // In LTR: back → ←, forward → →
  // In RTL: back → →, forward → ←
  const backName: keyof typeof Ionicons.glyphMap = isRtl ? 'chevron-forward' : 'chevron-back';
  const forwardName: keyof typeof Ionicons.glyphMap = isRtl ? 'chevron-back' : 'chevron-forward';
  const name = direction === 'back' ? backName : forwardName;
  return <Ionicons name={name} size={size} color={color} style={style} />;
};

/** Arrow variant (filled arrow vs chevron). Same direction logic. */
export const Arrow: React.FC<ChevronProps> = ({
  direction = 'back',
  size = 20,
  color = palette.navy900,
  style,
}) => {
  const isRtl = I18nManager.isRTL;
  const backName: keyof typeof Ionicons.glyphMap = isRtl ? 'arrow-forward' : 'arrow-back';
  const forwardName: keyof typeof Ionicons.glyphMap = isRtl ? 'arrow-back' : 'arrow-forward';
  const name = direction === 'back' ? backName : forwardName;
  return <Ionicons name={name} size={size} color={color} style={style} />;
};

export default Chevron;
