import React from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import RatingDots from '../../ui/RatingDots';
import Avatar from '../../ui/Avatar';
import { useService } from '../../data/hooks';
import { vendorById } from '../../data/seed';
import { palette, semantic, radius, spacing, shadowStyle, formatPrice, pickLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

export default function ServiceDetailScreen({ route, navigation }: RootStackScreenProps<'ServiceDetail'>) {
  const { serviceId } = route.params;
  const { data: service } = useService(serviceId);
  const { width } = useWindowDimensions();

  if (!service) {
    return (
      <Screen>
        <View style={styles.notFound}>
          <Text variant="body">{i18n.t('common.notFound')}</Text>
        </View>
      </Screen>
    );
  }
  const vendor = vendorById(service.vendorId);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={{ uri: service.images[0] }}
            style={{ width, height: width * 0.6 }}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.backBtn}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={palette.navy900}
              onPress={() => navigation.goBack()}
              suppressHighlighting
            />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text variant="pageTitle" style={{ flex: 1 }} numberOfLines={2}>
              {pickLocale(service.title)}
            </Text>
            <Text variant="pageTitle" color={palette.navy900}>
              {formatPrice(service.price, service.currency)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.chip}>
              <Ionicons name="time-outline" size={14} color={palette.navy700} />
              <Text variant="label" color={palette.navy700} style={{ marginStart: 4 }}>
                {service.durationMinutes} {i18n.t('common.min')}
              </Text>
            </View>
            {vendor && (
              <View style={styles.chip}>
                <Ionicons name="star" size={14} color="#F0B400" />
                <Text variant="label" color={palette.navy700} style={{ marginStart: 4 }}>
                  {vendor.rating.toFixed(1)} · {vendor.reviewCount}
                </Text>
              </View>
            )}
          </View>

          {service.description && (
            <View style={{ marginTop: spacing.s4 }}>
              <Text variant="sectionTitle" style={{ marginBottom: spacing.s2 }}>
                {i18n.t('service.about')}
              </Text>
              <Text variant="body" color={palette.neutral900}>
                {pickLocale(service.description)}
              </Text>
            </View>
          )}

          {vendor && (
            <Card style={[styles.vendorCard, { marginTop: spacing.s5 }]}>
              <Avatar
                source={vendor.logoImage}
                name={pickLocale(vendor.name)}
                size={48}
              />
              <View style={{ flex: 1, marginStart: spacing.s3 }}>
                <Text variant="cardTitle">{pickLocale(vendor.name)}</Text>
                <Text variant="caption" color={palette.neutral500}>
                  {vendor.address ? pickLocale(vendor.address) : ''}
                </Text>
              </View>
              <Ionicons name="chevron-back" size={18} color={palette.neutral500} style={{ transform: [{ scaleX: -1 }] }} />
            </Card>
          )}
        </View>
      </ScrollView>

      <View style={styles.bookBar}>
        <View>
          <Text variant="caption" color={palette.neutral500}>
            {i18n.t('service.total')}
          </Text>
          <Text variant="pageTitle">{formatPrice(service.price, service.currency)}</Text>
        </View>
        {/* TODO Phase 1: replace booking CTA with WhatsApp deep-link to vendor */}
        <Button
          title={i18n.t('service.bookNow')}
          onPress={() => navigation.goBack()}
          style={{ minWidth: 160 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backBtn: {
    position: 'absolute', top: spacing.s5, start: spacing.s4,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(2),
  },
  body: { padding: spacing.s5 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.s3 },
  metaRow: { flexDirection: 'row', gap: spacing.s2, marginTop: spacing.s3 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: palette.navy100, paddingHorizontal: spacing.s3, paddingVertical: 6,
    borderRadius: 999,
  },
  vendorCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.s3 },
  bookBar: {
    position: 'absolute', start: 0, end: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: semantic.surface,
    paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s5,
    borderTopWidth: 1, borderTopColor: palette.neutral200,
    gap: spacing.s4,
  },
});
