import React, { useMemo, useState } from 'react';
import { Alert, I18nManager, Linking, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Logo from '../../ui/Logo';
import PressableScale from '../../ui/PressableScale';
import { LoadingState } from '../../ui/EmptyState';
import BackButton from '../../ui/BackButton';
import { Chevron } from '../../ui/Chevron';
import { useService, useServices, useVendor } from '../../data/hooks';
import { logLead, makeRef } from '../../data/leads';
import { useUserStore } from '../../stores/user';
import { useFavoritesStore } from '../../stores/favorites';
import { useColors } from '../../theme/colors';
import { radius, spacing, shadowStyle, formatPrice, pickLocale, getCurrentLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

import type { DeliveryOption } from '@shared/types';

const ALL_DELIVERY_OPTIONS: { key: DeliveryOption; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'vendorDelivery', icon: 'bicycle-outline' },
  { key: 'pickup', icon: 'bag-handle-outline' },
  { key: 'customerArranges', icon: 'car-outline' },
];

export default function ProductDetailScreen({ route, navigation }: RootStackScreenProps<'ServiceDetail'>) {
  const { serviceId } = route.params;
  const { data: product, loading } = useService(serviceId);
  const { data: vendor } = useVendor(product?.vendorId);
  const { data: vendorProducts } = useServices(product?.vendorId);
  const { width } = useWindowDimensions();
  const c = useColors();

  const [activeImg, setActiveImg] = useState(0);
  const [delivery, setDelivery] = useState<DeliveryOption | null>(null);

  // Only the methods this vendor actually offers. Legacy vendors without the
  // field fall back to the full set (they can narrow it from their portal).
  const deliveryOptions = useMemo(() => {
    const offered = vendor?.deliveryOptions;
    if (!offered || offered.length === 0) return ALL_DELIVERY_OPTIONS;
    return ALL_DELIVERY_OPTIONS.filter((o) => offered.includes(o.key));
  }, [vendor?.deliveryOptions]);
  const selectedDelivery = delivery ?? deliveryOptions[0]?.key ?? null;

  const uid = useUserStore((s) => s.user?.uid);
  const isFav = useFavoritesStore((s) => (product ? s.productIds.has(product.id) : false));
  const toggleProduct = useFavoritesStore((s) => s.toggleProduct);

  const more = useMemo(
    () => (product ? vendorProducts.filter((p) => p.id !== product.id).slice(0, 6) : []),
    [vendorProducts, product],
  );

  if (!product) {
    return (
      <Screen>
        <View style={[styles.detailHeader, { borderBottomColor: c.border }]}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
        {loading ? (
          <LoadingState label={i18n.t('common.loading')} />
        ) : (
          <View style={styles.center}>
            <Ionicons name="cube-outline" size={44} color={c.textMuted} />
            <Text variant="body" color={c.textMuted} style={{ marginTop: spacing.s3 }}>
              {i18n.t('common.notFound')}
            </Text>
          </View>
        )}
      </Screen>
    );
  }

  const priceStr = formatPrice(product.price, product.currency);
  const prepHours = Math.round((product.durationMinutes ?? 0) / 60);
  const images = product.images?.length ? product.images : [''];

  const onOrder = () => {
    // Ordering requires an account — guests browse, members order.
    if (!uid) {
      const ar = getCurrentLocale() === 'ar';
      Alert.alert(
        ar ? 'سجّل دخولك أول' : 'Sign in first',
        ar ? 'عشان تطلب وتتابع طلباتك في «طلباتي»، سجّل دخولك أو أنشئ حساب — ياخذ ثواني.' : 'To order and track it in "My requests", sign in or create an account — takes seconds.',
        [
          { text: ar ? 'مو الحين' : 'Not now', style: 'cancel' },
          { text: ar ? 'تسجيل الدخول' : 'Sign in', onPress: () => navigation.navigate('SignIn') },
        ],
      );
      return;
    }
    const phone = (vendor?.whatsapp ?? vendor?.phone ?? '').replace(/[^\d]/g, '');
    if (!phone) {
      const ar = getCurrentLocale() === 'ar';
      Alert.alert(
        ar ? 'لا يوجد رقم واتساب' : 'No WhatsApp number',
        ar ? 'هذا المحل لم يضف رقم تواصل بعد.' : "This shop hasn't added a contact number yet.",
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const ref = makeRef();
    const deliveryLabel = selectedDelivery ? i18n.t(`product.delivery.${selectedDelivery}`) : '';
    const message = i18n.t('contact.taggedMessage', {
      product: pickLocale(product.title),
      price: priceStr,
      delivery: deliveryLabel,
      ref,
    });
    // Fire-and-forget attribution write — must not block reaching the vendor.
    if (vendor) {
      logLead({
        vendorId: vendor.id,
        productId: product.id,
        productTitle: pickLocale(product.title),
        customerUid: uid,
        note: deliveryLabel,
        ref,
      });
    }
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`).catch(() => {});
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* ── Hero gallery ── */}
        <View>
          <Image
            source={{ uri: images[activeImg] }}
            style={{ width, height: width * 0.92, backgroundColor: c.surfaceSunken }}
            contentFit="cover"
            transition={180}
          />
          <BackButton
            variant="overlay"
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', left: spacing.s4, top: spacing.s4 }}
          />
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              toggleProduct(product.id);
            }}
            style={[styles.fab, { right: spacing.s4, top: spacing.s4, backgroundColor: c.glass }]}
            hitSlop={8}
          >
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? c.danger : c.text} />
          </Pressable>
        </View>

        {/* thumbnails */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbRow}
          >
            {images.map((uri, i) => (
              <Pressable key={i} onPress={() => setActiveImg(i)}>
                <Image
                  source={{ uri }}
                  style={[
                    styles.thumb,
                    { backgroundColor: c.surfaceSunken, borderColor: i === activeImg ? c.brand : 'transparent' },
                  ]}
                  contentFit="cover"
                />
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View style={styles.body}>
          {/* ── Title + price ── */}
          <View style={styles.titleRow}>
            <Text variant="pageTitle" style={{ flex: 1 }} numberOfLines={2}>
              {pickLocale(product.title)}
            </Text>
            <Text variant="pageTitle" color={c.brandText} forceLtr>{priceStr}</Text>
          </View>

          {/* ── Vendor trust card ── */}
          {vendor && (
            <PressableScale onPress={() => navigation.navigate('VendorProfile', { vendorId: vendor.id })}>
              <View style={[styles.vendorCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                <Logo name={vendor.name.en} size={46} uri={vendor.logoImage} />
                <View style={{ flex: 1, marginStart: spacing.s3 }}>
                  <View style={styles.vendorNameRow}>
                    <Text variant="cardTitle" numberOfLines={1}>{pickLocale(vendor.name)}</Text>
                    {vendor.verifiedAt && (
                      <Ionicons name="checkmark-circle" size={15} color={c.brandText} style={{ marginStart: 4 }} />
                    )}
                  </View>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#F5A623" />
                    <Text variant="caption" color={c.textMuted} style={{ marginStart: 4 }}>
                      {(vendor.rating ?? 0).toFixed(1)} · {vendor.reviewCount ?? 0}
                    </Text>
                    {vendor.address && (
                      <Text variant="caption" color={c.textMuted} numberOfLines={1} style={{ marginStart: 8, flexShrink: 1 }}>
                        · {pickLocale(vendor.address)}
                      </Text>
                    )}
                  </View>
                </View>
                <Chevron direction="forward" size={18} color={c.textMuted} />
              </View>
            </PressableScale>
          )}

          {/* ── Description ── */}
          {product.description && (
            <>
              <Text variant="sectionTitle" weight="700" style={styles.h}>{i18n.t('product.detailsTitle')}</Text>
              <Text variant="body" color={c.textMuted}>{pickLocale(product.description)}</Text>
            </>
          )}

          {/* ── Prep time — only when the vendor actually set one ── */}
          {prepHours > 0 && (
            <View style={[styles.prepRow, { backgroundColor: c.surfaceAlt }]}>
              <Ionicons name="time-outline" size={18} color={c.brandText} />
              <Text variant="label" weight="600" style={{ marginStart: spacing.s2 }}>
                {i18n.t('product.prepTime')}: {i18n.t('product.hours', { n: String(prepHours) })}
              </Text>
            </View>
          )}

          {/* ── Delivery & pickup — only the methods this vendor offers ── */}
          <Text variant="sectionTitle" weight="700" style={styles.h}>{i18n.t('product.deliveryTitle')}</Text>
          <View style={{ gap: spacing.s2 }}>
            {deliveryOptions.map(({ key, icon }) => {
              const selected = selectedDelivery === key;
              return (
                <Pressable key={key} onPress={() => setDelivery(key)}>
                  <View
                    style={[
                      styles.radioRow,
                      {
                        backgroundColor: selected ? c.brandFill : c.surface,
                        borderColor: selected ? c.brand : c.border,
                      },
                    ]}
                  >
                    <Ionicons name={icon} size={20} color={selected ? c.brandText : c.textMuted} />
                    <Text
                      variant="body"
                      weight={selected ? '600' : '400'}
                      color={selected ? c.brandText : c.text}
                      style={{ flex: 1, marginStart: spacing.s3 }}
                    >
                      {i18n.t(`product.delivery.${key}`)}
                    </Text>
                    <Ionicons
                      name={selected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={selected ? c.brand : c.borderStrong}
                    />
                  </View>
                </Pressable>
              );
            })}
            <Text variant="caption" color={c.textMuted}>
              {getCurrentLocale() === 'ar'
                ? 'التفاصيل النهائية للتوصيل تتفق عليها مع البائع في واتساب.'
                : 'Final delivery details are agreed with the vendor on WhatsApp.'}
            </Text>
          </View>

          {/* ── More from vendor ── */}
          {more.length > 0 && (
            <>
              <View style={styles.moreHead}>
                <Text variant="sectionTitle" weight="700">{i18n.t('vendor.moreFromVendor')}</Text>
                {vendor && (
                  <Pressable onPress={() => navigation.navigate('VendorProfile', { vendorId: vendor.id })} hitSlop={8}>
                    <Text variant="label" weight="600" color={c.brandText}>{i18n.t('common.seeAll')}</Text>
                  </Pressable>
                )}
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.s3 }}>
                {more.map((p) => (
                  <PressableScale key={p.id} onPress={() => navigation.replace('ServiceDetail', { serviceId: p.id })}>
                    <View style={{ width: 132 }}>
                      <Image
                        source={{ uri: p.images?.[0] }}
                        style={[styles.moreImg, { backgroundColor: c.surfaceSunken }]}
                        contentFit="cover"
                      />
                      <Text variant="label" numberOfLines={1} style={{ marginTop: 6 }}>{pickLocale(p.title)}</Text>
                      <Text variant="cardTitle" weight="700" color={c.brandText} forceLtr>
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

      {/* ── Sticky footer CTA ── */}
      <View style={[styles.footer, { backgroundColor: c.surface, borderTopColor: c.border }]}>
        <PressableScale onPress={onOrder} style={{ flex: 1 }}>
          <View style={[styles.waBtn, { backgroundColor: c.whatsapp }]}>
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            <Text variant="button" weight="700" color="#fff" style={{ marginStart: spacing.s2 }}>
              {i18n.t('product.orderWhatsapp')}
            </Text>
          </View>
        </PressableScale>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  detailHeader: {
    // Back button stays on the visual LEFT under forced-RTL.
    height: 52, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center',
    paddingHorizontal: spacing.s4, borderBottomWidth: 1,
  },
  headerBack: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  fab: {
    position: 'absolute',
    width: 40, height: 40, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(2),
  },
  thumbRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s3, gap: spacing.s2 },
  thumb: { width: 60, height: 60, borderRadius: radius.md, borderWidth: 2 },
  body: { padding: spacing.s5 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.s3 },
  vendorCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.s3, marginTop: spacing.s4,
    borderRadius: radius.lg, borderWidth: 1,
  },
  vendorNameRow: { flexDirection: 'row', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  h: { marginTop: spacing.s5, marginBottom: spacing.s2 },
  prepRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: radius.md, paddingHorizontal: spacing.s3, paddingVertical: spacing.s2,
    alignSelf: 'flex-start', marginTop: spacing.s4,
  },
  radioRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.s4, height: 56,
    borderRadius: radius.lg, borderWidth: 1.5,
  },
  moreHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: spacing.s6, marginBottom: spacing.s3,
  },
  moreImg: { width: 132, height: 132, borderRadius: radius.lg },
  footer: {
    position: 'absolute', start: 0, end: 0, bottom: 0,
    flexDirection: 'row',
    paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s6,
    borderTopWidth: 1,
  },
  waBtn: {
    height: 56, borderRadius: radius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
});
