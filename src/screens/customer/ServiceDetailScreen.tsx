import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Avatar from '../../ui/Avatar';
import PressableScale from '../../ui/PressableScale';
import ContactSheet from '../../ui/ContactSheet';
import { useService } from '../../data/hooks';
import { vendorById, servicesForVendor } from '../../data/seed';
import { palette, semantic, radius, spacing, shadowStyle, formatPrice, pickLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

export default function ProductDetailScreen({ route, navigation }: RootStackScreenProps<'ServiceDetail'>) {
  const { serviceId } = route.params;
  const { data: product } = useService(serviceId);
  const { width } = useWindowDimensions();
  const [showContact, setShowContact] = useState(false);

  if (!product) {
    return (
      <Screen>
        <View style={styles.notFound}>
          <Text variant="body">{i18n.t('common.notFound')}</Text>
        </View>
      </Screen>
    );
  }

  const vendor = vendorById(product.vendorId);
  const more = vendor ? servicesForVendor(vendor.id).filter((s) => s.id !== product.id).slice(0, 6) : [];
  const prepHours = Math.round(product.durationMinutes / 60);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: product.images[0] }} style={{ width, height: width * 0.95 }} contentFit="cover" />
          <Pressable onPress={() => navigation.goBack()} style={[styles.iconBtn, { top: spacing.s5, end: spacing.s4 }]}>
            <Ionicons name="arrow-back" size={20} color={palette.navy900} style={{ transform: [{ scaleX: -1 }] }} />
          </Pressable>
          <Pressable style={[styles.iconBtn, { top: spacing.s5, start: spacing.s4 }]}>
            <Ionicons name="heart-outline" size={20} color={palette.navy900} />
          </Pressable>
        </View>

        <View style={styles.body}>
          {vendor && (
            <Card style={styles.vendorCard}>
              <Avatar source={vendor.logoImage} name={pickLocale(vendor.name)} size={44} />
              <View style={{ flex: 1, marginStart: spacing.s3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text variant="cardTitle" numberOfLines={1}>{pickLocale(vendor.name)}</Text>
                  {vendor.verifiedAt && (
                    <Ionicons name="checkmark-circle" size={14} color={palette.navy600} />
                  )}
                </View>
                <Text variant="caption" color={palette.neutral500}>
                  {vendor.address ? pickLocale(vendor.address) : ''}
                </Text>
              </View>
              <View style={styles.fastPill}>
                <Ionicons name="flash" size={12} color="#2E7D45" />
                <Text variant="microcopy" color="#2E7D45" style={{ marginStart: 4 }}>
                  {i18n.t('vendor.fastDelivery')}
                </Text>
              </View>
            </Card>
          )}

          <View style={styles.titleRow}>
            <Text variant="pageTitle" style={{ flex: 1 }} numberOfLines={2}>
              {pickLocale(product.title)}
            </Text>
            <Text variant="pageTitle" color={palette.navy900}>
              {formatPrice(product.price, product.currency)}
            </Text>
          </View>

          {product.description && (
            <Text variant="body" color={palette.neutral900} style={{ marginTop: spacing.s3 }}>
              {pickLocale(product.description)}
            </Text>
          )}

          {prepHours > 0 && (
            <View style={styles.metaRow}>
              <View style={styles.metaPill}>
                <Ionicons name="resize-outline" size={14} color={palette.navy700} />
                <Text variant="label" color={palette.navy700} style={{ marginStart: 4 }}>
                  {i18n.t('product.sizeFor', { n: '10' })}
                </Text>
              </View>
              <View style={styles.metaPill}>
                <Ionicons name="time-outline" size={14} color={palette.navy700} />
                <Text variant="label" color={palette.navy700} style={{ marginStart: 4 }}>
                  {i18n.t('product.hours', { n: String(prepHours) })}
                </Text>
              </View>
            </View>
          )}

          {more.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text variant="sectionTitle">{i18n.t('vendor.moreFromVendor')}</Text>
                {vendor && (
                  <Pressable onPress={() => navigation.navigate('VendorProfile', { vendorId: vendor.id })}>
                    <Text variant="label" color={palette.navy600}>{i18n.t('common.seeAll')}</Text>
                  </Pressable>
                )}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.s3 }}>
                {more.map((p) => (
                  <PressableScale key={p.id} onPress={() => navigation.replace('ServiceDetail', { serviceId: p.id })}>
                    <View style={styles.moreTile}>
                      <Image source={{ uri: p.images[0] }} style={styles.moreImg} contentFit="cover" />
                      <Text variant="label" numberOfLines={1} style={{ marginTop: 6 }}>
                        {pickLocale(p.title)}
                      </Text>
                      <Text variant="cardTitle" color={palette.navy900}>
                        {formatPrice(p.price, p.currency)}
                      </Text>
                    </View>
                  </PressableScale>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={i18n.t('product.contactWhatsapp')}
          onPress={() => setShowContact(true)}
          icon="logo-whatsapp"
          style={{ flex: 1 }}
        />
        <View style={{ width: spacing.s2 }} />
        <Button
          title={i18n.t('product.messageInApp')}
          variant="ghost"
          onPress={() => setShowContact(true)}
          style={{ flex: 1 }}
        />
      </View>

      {vendor && (
        <ContactSheet
          visible={showContact}
          onClose={() => setShowContact(false)}
          product={product}
          vendor={vendor}
          onMessageInApp={() => navigation.navigate('Chat', { vendorId: vendor.id, productId: product.id })}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconBtn: {
    position: 'absolute',
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(2),
  },
  body: { padding: spacing.s5 },
  vendorCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.s3, marginBottom: spacing.s4 },
  fastPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F3EC',
    paddingHorizontal: spacing.s2, paddingVertical: 4,
    borderRadius: 999,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.s3 },
  metaRow: { flexDirection: 'row', gap: spacing.s2, marginTop: spacing.s4 },
  metaPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: palette.navy100,
    paddingHorizontal: spacing.s3, paddingVertical: 6,
    borderRadius: 999,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.s5, marginBottom: spacing.s3,
  },
  moreTile: { width: 130, gap: 4 },
  moreImg: { width: 130, height: 130, borderRadius: radius.lg, backgroundColor: palette.navy100 },
  footer: {
    position: 'absolute', start: 0, end: 0, bottom: 0,
    flexDirection: 'row',
    paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s5,
    backgroundColor: semantic.surface,
    borderTopWidth: 1, borderTopColor: palette.neutral200,
  },
});
