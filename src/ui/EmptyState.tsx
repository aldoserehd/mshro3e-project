import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import Button from './Button';
import { spacing } from '../theme/ts';
import { useColors } from '../theme/colors';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  /** Optional action button under the message. */
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/**
 * Friendly empty state: tinted icon circle + title + optional subtitle/action.
 * Bilingual copy is passed in by the caller. Theme-aware.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'sparkles-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const c = useColors();
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.iconCircle, { backgroundColor: c.brandFill }]}>
        <Ionicons name={icon} size={34} color={c.brandText} />
      </View>
      <Text variant="cardTitle" weight="700" align="center" style={{ marginTop: spacing.s4 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: 4, maxWidth: 300 }}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} variant="secondary" size="md" onPress={onAction} style={{ marginTop: spacing.s4 }} />
      ) : null}
    </View>
  );
};

export interface LoadingStateProps {
  label?: string;
  style?: ViewStyle;
}

/** Centered spinner for data-loading screens. Theme-aware. */
export const LoadingState: React.FC<LoadingStateProps> = ({ label, style }) => {
  const c = useColors();
  return (
    <View style={[styles.wrap, style]}>
      <ActivityIndicator size="large" color={c.brand} />
      {label ? (
        <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: spacing.s3 }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.s7,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
