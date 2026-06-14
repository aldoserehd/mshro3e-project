import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Text from './Text';
import { spacing } from '../theme/ts';
import { useColors } from '../theme/colors';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional trailing action (e.g. "See all"). */
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/**
 * The app's section-header signature: a brand accent bar + title (+ optional
 * subtitle), with an optional trailing text action. One component for every
 * section heading so spacing, the accent bar, and rhythm stay consistent.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const c = useColors();
  return (
    <View style={[styles.head, style]}>
      <View style={styles.titleRow}>
        <View style={[styles.accentBar, { backgroundColor: c.brand }]} />
        <View style={{ flexShrink: 1 }}>
          <Text variant="sectionTitle" weight="700" numberOfLines={1}>{title}</Text>
          {subtitle ? (
            <Text variant="caption" color={c.textMuted} style={{ marginTop: 1 }} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="label" weight="600" color={c.brandText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
    marginTop: spacing.s6,
    marginBottom: spacing.s3,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  accentBar: { width: 4, height: 22, borderRadius: 999, marginEnd: spacing.s2 },
});
