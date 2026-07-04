import React from 'react';
import { I18nManager, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import BackButton from './BackButton';
import { Chevron } from './Chevron';
import { radius, spacing } from '../theme/ts';
import { useColors } from '../theme/colors';

/**
 * Shared building blocks for Account / Settings style screens —
 * the iOS-Settings grouped-list pattern: section labels, grouped cards,
 * rows with colored icon squircles, hairline separators, chevrons.
 */

/** Top bar with the back button ALWAYS on the visual left (product decision). */
export const TopBar: React.FC<{ title: string; onBack?: () => void; trailing?: React.ReactNode }> = ({
  title,
  onBack,
  trailing,
}) => {
  const c = useColors();
  return (
    <View style={[styles.topBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
      {onBack ? <BackButton onPress={onBack} /> : <View style={{ width: 40 }} />}
      <Text variant="cardTitle" weight="700" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }}>
        {title}
      </Text>
      {trailing ?? <View style={{ width: 40 }} />}
    </View>
  );
};

/** Small uppercase-ish section label above a group. */
export const SectionLabel: React.FC<{ children: string }> = ({ children }) => {
  const c = useColors();
  return (
    <Text variant="microcopy" weight="700" color={c.textMuted} style={styles.sectionLabel}>
      {children}
    </Text>
  );
};

/** Grouped card that wraps rows. */
export const RowGroup: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => {
  const c = useColors();
  return (
    <View style={[styles.group, { backgroundColor: c.surface, borderColor: c.border }, style]}>
      {children}
    </View>
  );
};

export interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  /** Squircle background color (pass a saturated tone; icon renders white). */
  tint: string;
  label: string;
  sub?: string;
  /** Value text shown before the chevron (e.g. current language). */
  value?: string;
  onPress?: () => void;
  /** Custom trailing node — replaces value+chevron (e.g. a Switch or Segmented). */
  trailing?: React.ReactNode;
  destructive?: boolean;
  first?: boolean;
}

export const Row: React.FC<RowProps> = ({ icon, tint, label, sub, value, onPress, trailing, destructive, first }) => {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border },
        pressed && onPress ? { backgroundColor: c.surfaceAlt } : null,
      ]}
    >
      <View style={[styles.iconSq, { backgroundColor: destructive ? c.danger : tint }]}>
        <Ionicons name={icon} size={16} color="#fff" />
      </View>
      <View style={{ flex: 1, marginStart: spacing.s3 }}>
        <Text variant="body" weight="500" color={destructive ? c.danger : c.text} numberOfLines={1}>
          {label}
        </Text>
        {sub ? (
          <Text variant="caption" color={c.textMuted} numberOfLines={1}>
            {sub}
          </Text>
        ) : null}
      </View>
      {trailing ?? (
        <View style={styles.trailing}>
          {value ? (
            <Text variant="label" color={c.textMuted} numberOfLines={1} style={{ maxWidth: 120 }}>
              {value}
            </Text>
          ) : null}
          {onPress && !destructive ? <Chevron direction="forward" size={16} color={c.borderStrong} /> : null}
        </View>
      )}
    </Pressable>
  );
};

/** Compact segmented control (used for language / theme). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; icon?: keyof typeof Ionicons.glyphMap }[];
  value: T;
  onChange: (k: T) => void;
}) {
  const c = useColors();
  return (
    <View style={[styles.segment, { backgroundColor: c.surfaceSunken, borderColor: c.border }]}>
      {options.map((o) => {
        const on = value === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.segmentChip, on && { backgroundColor: c.brand }]}
          >
            {o.icon ? (
              <Ionicons name={o.icon} size={13} color={on ? '#fff' : c.textMuted} style={{ marginEnd: 4 }} />
            ) : null}
            <Text variant="microcopy" weight="700" color={on ? '#fff' : c.textMuted}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Row icon tints — consistent across Account + Settings. */
export const ROW_TINTS = {
  blue: '#415c9d',
  sky: '#3E86C6',
  green: '#2FA45C',
  orange: '#E8883A',
  purple: '#7A5CC6',
  teal: '#2E9E9B',
  pink: '#C65C8A',
  slate: '#6B7590',
} as const;

const styles = StyleSheet.create({
  topBar: {
    // Force the back button to the visual LEFT under forced-RTL.
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: spacing.s2,
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s3,
    borderBottomWidth: 1,
  },
  sectionLabel: {
    marginTop: spacing.s5,
    marginBottom: spacing.s2,
    marginStart: spacing.s2,
    letterSpacing: 0.8,
  },
  group: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s2,
  },
  iconSq: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  segment: { flexDirection: 'row', borderRadius: 999, borderWidth: 1, padding: 3 },
  segmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s3,
    paddingVertical: 6,
    borderRadius: 999,
  },
});
