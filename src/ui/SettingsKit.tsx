import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import BackButton from './BackButton';
import { Chevron } from './Chevron';
import { radius, spacing } from '../theme/ts';
import { useColors } from '../theme/colors';

/**
 * Shared building blocks for Account / Settings screens — Stitch "Kuwaiti
 * Artisans" visual language: cards with an in-card uppercase header strip,
 * rows with brand-tinted icon tiles, selectable option cards, and a top bar
 * whose back button is ALWAYS on the visual left.
 */

/**
 * Top bar with the back button ALWAYS on the physical left.
 * Uses absolute positioning (not row direction tricks) — flex row order
 * proved unreliable across RTL configurations on Android.
 */
export const TopBar: React.FC<{ title: string; onBack?: () => void; trailing?: React.ReactNode }> = ({
  title,
  onBack,
  trailing,
}) => {
  const c = useColors();
  return (
    <View style={[styles.topBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
      <Text variant="cardTitle" weight="700" numberOfLines={1} style={styles.topBarTitle}>
        {title}
      </Text>
      {onBack ? (
        <View style={styles.topBarLeft} pointerEvents="box-none">
          <BackButton onPress={onBack} />
        </View>
      ) : null}
      {trailing ? (
        <View style={styles.topBarRight} pointerEvents="box-none">
          {trailing}
        </View>
      ) : null}
    </View>
  );
};

/** Grouped card with an optional uppercase header strip (Stitch style). */
export const RowGroup: React.FC<{ title?: string; children: React.ReactNode; style?: ViewStyle }> = ({
  title,
  children,
  style,
}) => {
  const c = useColors();
  return (
    <View style={[styles.group, { backgroundColor: c.surface, borderColor: c.border }, style]}>
      {title ? (
        <View style={[styles.groupHead, { backgroundColor: c.surfaceAlt, borderBottomColor: c.border }]}>
          <Text variant="microcopy" weight="700" color={c.brandText} style={{ letterSpacing: 1.5 }}>
            {title}
          </Text>
        </View>
      ) : null}
      {children}
    </View>
  );
};

export interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  /** Value text shown before the chevron (e.g. current language). */
  value?: string;
  onPress?: () => void;
  /** Custom trailing node — replaces value+chevron (e.g. a Switch). */
  trailing?: React.ReactNode;
  destructive?: boolean;
  first?: boolean;
  /** 'tile' = 44px brand-tinted icon tile (activity rows); 'plain' = muted icon. */
  variant?: 'tile' | 'plain';
}

export const Row: React.FC<RowProps> = ({
  icon,
  label,
  sub,
  value,
  onPress,
  trailing,
  destructive,
  first,
  variant = 'plain',
}) => {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        variant === 'tile' && styles.rowTall,
        !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border },
        pressed && onPress ? { backgroundColor: c.surfaceAlt } : null,
      ]}
    >
      {variant === 'tile' ? (
        <View style={[styles.iconTile, { backgroundColor: destructive ? c.dangerFill : c.brandFill }]}>
          <Ionicons name={icon} size={20} color={destructive ? c.danger : c.brandText} />
        </View>
      ) : (
        <Ionicons name={icon} size={21} color={destructive ? c.danger : c.textMuted} style={{ width: 28 }} />
      )}
      <View style={{ flex: 1, marginStart: spacing.s3 }}>
        <Text variant="body" weight={variant === 'tile' ? '600' : '500'} color={destructive ? c.danger : c.text} numberOfLines={1}>
          {label}
        </Text>
        {sub ? (
          <Text variant="caption" color={c.textMuted} numberOfLines={2}>
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

/** Section card with a leading icon circle + headline (Stitch settings style). */
export const SectionCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ icon, title, children, style }) => {
  const c = useColors();
  return (
    <View style={[styles.sectionCard, { backgroundColor: c.surface, borderColor: c.border }, style]}>
      <View style={styles.sectionHead}>
        <View style={[styles.sectionIcon, { backgroundColor: c.brandFill }]}>
          <Ionicons name={icon} size={19} color={c.brandText} />
        </View>
        <Text variant="cardTitle" weight="700">{title}</Text>
      </View>
      {children}
    </View>
  );
};

/** Selectable option card (language / theme choices). */
export const OptionCard: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
  sub?: string;
}> = ({ label, selected, onPress, sub }) => {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: selected ? c.brandFill : c.surfaceSunken,
          borderColor: selected ? c.brand : 'transparent',
        },
      ]}
    >
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={19}
        color={selected ? c.brandText : c.borderStrong}
      />
      <View style={{ flex: 1, marginStart: spacing.s2 }}>
        <Text variant="label" weight={selected ? '700' : '500'} color={selected ? c.brandText : c.text} numberOfLines={1}>
          {label}
        </Text>
        {sub ? (
          <Text variant="microcopy" color={c.textMuted} numberOfLines={1}>
            {sub}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 56,
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  topBarTitle: { textAlign: 'center', marginHorizontal: 56 },
  // Physical corners — App.tsx disables RTL left/right swapping.
  topBarLeft: { position: 'absolute', left: spacing.s4, top: 0, bottom: 0, justifyContent: 'center' },
  topBarRight: { position: 'absolute', right: spacing.s4, top: 0, bottom: 0, justifyContent: 'center' },
  group: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  groupHead: {
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s3,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s2,
  },
  rowTall: { minHeight: 64, paddingVertical: spacing.s3 },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.s4 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.s3, marginBottom: spacing.s4 },
  sectionIcon: { width: 38, height: 38, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 130,
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s3,
    paddingVertical: spacing.s3,
  },
});
