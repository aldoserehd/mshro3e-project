import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Text from './Text';
import { palette } from '../theme/ts';

interface Props {
  name: string;
  size?: number;
  bg?: string;
  fg?: string;
  style?: ViewStyle;
}

/**
 * Vendor "logo" rendered as initials in a navy circle.
 * Replaces external avatar-service URLs which cropped weirdly on iOS.
 * When real uploaded logos arrive, swap to <ExpoImage source={...} contentFit="contain" />.
 */
export const Logo: React.FC<Props> = ({ name, size = 48, bg, fg = palette.white, style }) => {
  const initials = (() => {
    // Prefer English-ish letters, fall back to first 2 chars
    const cleaned = (name ?? '').trim();
    if (!cleaned) return '·';
    const parts = cleaned.split(/\s+/).slice(0, 2);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  })();

  // Deterministic-ish navy shade based on name length so different vendors get
  // slightly different tones, keeping the palette consistent.
  const palettes = [palette.navy900, palette.navy800, palette.navy700, palette.navy600] as const;
  const tone = bg ?? palettes[(name?.length ?? 0) % palettes.length];

  const fontSize = Math.max(10, Math.round(size * 0.38));

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2, backgroundColor: tone }, style]}>
      <Text
        variant="cardTitle"
        weight="700"
        color={fg}
        style={{ fontSize, lineHeight: fontSize * 1.1, textAlign: 'center', includeFontPadding: false }}
      >
        {initials}
      </Text>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
