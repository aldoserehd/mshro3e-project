import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Text from './Text';
import { palette, rtl, spacing } from '../theme/ts';

export interface HeaderProps {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
  tinted?: boolean;
  style?: ViewStyle;
}

/**
 * Lightweight in-screen header (headers in stack/tab are hidden — screens render
 * their own per brief expectation).
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  right,
  transparent,
  tinted,
  style,
}) => {
  const isRtl = rtl();
  // RTL: brief §9 — chevron-back/forward mirror. Use 'chevron-forward' as back
  // when RTL (visually back), 'chevron-back' otherwise.
  const backIcon = isRtl ? 'chevron-forward' : 'chevron-back';

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: transparent ? 'transparent' : tinted ? palette.navy900 : 'transparent',
        },
        style,
      ]}
    >
      <View style={styles.side}>
        {onBack && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onBack();
            }}
            hitSlop={12}
            style={styles.iconButton}
          >
            <Ionicons name={backIcon} size={22} color={tinted ? palette.white : palette.navy900} />
          </Pressable>
        )}
      </View>
      <View style={styles.center}>
        {title && (
          <Text variant="cardTitle" weight="600" color={tinted ? palette.white : palette.navy900}>
            {title}
          </Text>
        )}
      </View>
      <View style={[styles.side, styles.sideEnd]}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s4,
  },
  side: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideEnd: { alignItems: 'flex-end' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
