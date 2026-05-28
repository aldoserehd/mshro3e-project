import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { palette, spacing } from '../theme/ts';

export interface RatingDotsProps {
  /** 0..5. Fractional supported. */
  value: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
}

/**
 * Rating display. Navy-600 fill star + numeric (Western digits per brief §9).
 * Dots vs stars: brief says "rating dot" — we render a small star icon for legibility.
 */
export const RatingDots: React.FC<RatingDotsProps> = ({
  value,
  size = 14,
  showNumber = true,
  reviewCount,
}) => {
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size} color={palette.navy600} />
      {showNumber && (
        <Text variant="label" weight="600" style={styles.value} forceLtr>
          {value.toFixed(1)}
        </Text>
      )}
      {reviewCount != null && (
        <Text variant="caption" color={palette.neutral500} style={styles.count} forceLtr>
          ({reviewCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  value: { marginStart: spacing.s1 },
  count: { marginStart: spacing.s1 },
});

export default RatingDots;
