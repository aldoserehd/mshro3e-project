import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Text from './Text';
import { palette, radius, spacing } from '../theme/ts';

export interface PillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Filter pill — filled active navy-900 / outline inactive navy-200.
 * Active pills can show an X to clear.
 */
export const Pill: React.FC<PillProps> = ({ label, active, onPress, onClose, icon }) => {
  const bg = active ? palette.navy900 : palette.white;
  const fg = active ? palette.white : palette.navy900;
  const borderColor = active ? palette.navy900 : palette.navy200;

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
        },
      ]}
    >
      <View style={styles.row}>
        {icon && <Ionicons name={icon} size={14} color={fg} style={styles.icon} />}
        <Text variant="label" color={fg} weight="500">
          {label}
        </Text>
        {active && onClose && (
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onClose();
            }}
            hitSlop={8}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={14} color={fg} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.s3,
    height: 32,
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginEnd: spacing.s1 },
  closeButton: { marginStart: spacing.s2 },
});

export default Pill;
