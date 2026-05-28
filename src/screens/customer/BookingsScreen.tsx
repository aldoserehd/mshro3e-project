import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import PressableScale from '../../ui/PressableScale';
import { useBookings } from '../../data/hooks';
import { vendorById, serviceById } from '../../data/seed';
import { palette, semantic, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { Booking } from '@shared/types';
import type { MainTabsScreenProps } from '../../navigation/types';

const statusColor = (s: Booking['status']) => {
  switch (s) {
    case 'confirmed':
    case 'completed':
      return { bg: '#E8F3EC', fg: '#2E7D45' };
    case 'pending':
      return { bg: '#FFF4E0', fg: '#B8730A' };
    case 'in_progress':
      return { bg: palette.navy100, fg: palette.navy900 };
    default:
      return { bg: '#FBE9E9', fg: '#B91C1C' };
  }
};

export default function BookingsScreen({ navigation }: MainTabsScreenProps<'Bookings'>) {
  const { data: bookings } = useBookings('me');

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="pageTitle">{i18n.t('bookings.title')}</Text>
        <Text variant="body" color={palette.neutral500}>
          {i18n.t('bookings.subtitle')}
        </Text>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.s3 }} />}
        renderItem={({ item }) => {
          const v = vendorById(item.vendorId);
          const s = serviceById(item.serviceId);
          const c = statusColor(item.status);
          const date = new Intl.DateTimeFormat('ar-KW', {
            calendar: 'gregory',
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(item.startAt));
          return (
            <PressableScale
              onPress={() =>
                navigation.navigate('VendorProfile', { vendorId: item.vendorId })
              }
            >
              <Card style={styles.card}>
                <View style={styles.cardHead}>
                  <Text variant="cardTitle" numberOfLines={1} style={{ flex: 1 }}>
                    {v ? pickLocale(v.name) : '—'}
                  </Text>
                  <View style={[styles.pill, { backgroundColor: c.bg }]}>
                    <Text variant="label" color={c.fg}>
                      {i18n.t(`bookings.status.${item.status}`)}
                    </Text>
                  </View>
                </View>
                <Text variant="body" color={palette.neutral500} numberOfLines={1}>
                  {s ? pickLocale(s.title) : ''}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={14} color={palette.neutral500} />
                  <Text variant="caption" color={palette.neutral500} style={{ marginStart: 4 }}>
                    {date}
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text variant="cardTitle">{formatPrice(item.totalPrice, item.currency)}</Text>
                </View>
              </Card>
            </PressableScale>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={56} color={palette.navy300} />
            <Text variant="cardTitle" style={{ marginTop: spacing.s4 }}>
              {i18n.t('bookings.empty.title')}
            </Text>
            <Text variant="body" color={palette.neutral500} align="center">
              {i18n.t('bookings.empty.subtitle')}
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s4,
    paddingBottom: spacing.s3,
    gap: spacing.s1,
  },
  list: {
    paddingHorizontal: spacing.s5,
    paddingBottom: spacing.s8,
    flexGrow: 1,
  },
  card: { padding: spacing.s4, gap: spacing.s2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.s3 },
  pill: { paddingHorizontal: spacing.s3, paddingVertical: 4, borderRadius: 999 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.s2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.s7, gap: spacing.s2 },
});
