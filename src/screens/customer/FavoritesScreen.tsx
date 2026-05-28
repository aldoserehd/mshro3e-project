import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import { palette, spacing } from '../../theme/ts';
import type { MainTabsScreenProps } from '../../navigation/types';

// Phase 1 will rebuild this with save-to-occasion chips per design brief.
export default function FavoritesScreen(_: MainTabsScreenProps<'Favorites'>) {
  return (
    <Screen>
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={56} color={palette.navy300} />
        <Text variant="cardTitle" style={{ marginTop: spacing.s4 }}>
          المفضلة قريباً
        </Text>
        <Text variant="body" color={palette.neutral500} align="center">
          احفظ المنتجات والمحلات اللي تحبها في مكان واحد.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.s7,
    gap: spacing.s2,
  },
});
