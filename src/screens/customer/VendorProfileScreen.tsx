import React from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../ui/Logo';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import PressableScale from '../../ui/PressableScale';
import { LoadingState } from '../../ui/EmptyState';
import { useVendor, useServices } from '../../data/hooks';
import { useColors } from '../../theme/colors';
import { radius, shadowStyle, spacing, formatPrice, pickLocale, getCurrentLocale } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import type { RootStackScreenProps } from '../../navigation/types';
import { BRAND } from '../../brand';

const cleanPhone = (raw: string) => raw.replace(/[^\d]/g, '');

export default function VendorProfileScreen({ route, navigation }: RootStackScreenProps<'VendorProfile'>) {
  const { vendorId } = route.params;
  const { data: vendor, loading } = useVendor(vendorId);
  const { data: allProducts } = useServices();
  const { locale } = useLocaleStore();
  const c = useColors();
  const { width } = useWindowDimensions();
  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;

  if (!vendor) {
    const arx = getCurrentLocale() === 'ar';
    return (
      <Screen>
        <View style={[styles.fallbackHeader, { borderBottomColor: c.border }]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={[styles.coverBtn, { position: 'relative', top: 0, backgroundColor: c.surfaceAlt }]}>
            <Ionicons name="chevron-back" size={20} color={c.text} style={{ transform: [{ scaleX: -1 }] }} />
          </Pressable>
        </View>
        {loading ? (
          <LoadingState label={arx ? 'جاري التحميل…' : 'Loading…'} />
        ) : (
          <View style={styles.fallbackBody}>
            <Ionicons name="storefront-outline" size={44} color={c.textMuted} />
            <Text variant="body" color={c.textMuted} style={{ marginTop: spacing.s3 }}>
              {arx ? 'لم نعثر على هذا المحل.' : 'This shop could not be found.'}
            </Text>
          </View>
        )}
      </Screen>
    );
  }

  const products = allProducts.filter((p) => p.vendorId === vendor.id);
  const isPro = vendor.tier === 'pro' || vendor.tier === 'managed';
  const ar = getCurrentLocale() === 'ar';

  const openWhatsapp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const ph = cleanPhone(vendor.whatsapp ?? vendor.phone ?? '');
    const url = ph ? `https://wa.me/${ph}` : 'https://wa.me/';
    Linking.openURL(url).catch(() => {});
  };
  const callPhone = () => { if (vendor.phone) Linking.openURL(`tel:${vendor.phone}`).catch(() => {}); };
  const onShare = () => {
    Haptics.selectionAsync().catch(() => {});
    const name = pickLocale(vendor.name);
    const message = ar
      ? `شوف ${name} على ${BRAND.ar} 👀`
      : `Check out ${name} on ${BRAND.en} 👀`;
    Share.share({ message }).catch(() => {});
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={[styles.cover, { width, backgroundColor: c.surfaceSunken }]}>
          {vendor.coverImage && (
            <Image source={{ uri: vendor.coverImage }} style={StyleSheet.absoluteFill} contentFit="cover" />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(10,16,32,0.55)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          />
          <Pressable onPress={() => navigation.goBack()} style={[styles.coverBtn, { start: spacing.s4, backgroundColor: c.glass }]}>
            <Ionicons name="chevron-back" size={20} color={c.text} style={{ transform: [{ scaleX: -1 }] }} />
          </Pressable>
          <Pressable onPress={onShare} hitSlop={8} style={[styles.coverBtn, { end: spacing.s4, backgroundColor: c.glass }]}>
            <Ionicons name="share-outline" size={20} color={c.text} />
          </Pressable>
        </View>

        {/* Identity */}
        <View style={styles.identityWrap}>
          <View style={[styles.logoRing, { backgroundColor: c.surface }]}>
            <Logo name={vendor.name.en} size={84} uri={vendor.logoImage} zoom={vendor.logoZoom ?? 1} />
          </View>
          <View style={styles.nameRow}>
            <Text variant="pageTitle" weight="700">{pickLocale(vendor.name)}</Text>
            {vendor.verifiedAt && <Ionicons name="checkmark-circle" size={18} color={c.brandText} />}
            {isPro && (
              <View style={[styles.tierPill, { backgroundColor: c.brand }]}>
                <Text variant="microcopy" color="#fff" weight="600">{vendor.tier === 'managed' ? 'Managed' : 'Pro'}</Text>
              </View>
            )}
          </View>
          {vendor.address && (
            <Text variant="caption" color={c.textMuted}>
              <Ionicons name="location" size={12} color={c.textMuted} /> {pickLocale(vendor.address)}
            </Text>
          )}
          {/* Accepting orders pill */}
          <View style={[styles.acceptPill, { backgroundColor: c.isDark ? 'rgba(37,211,102,0.16)' : '#E8F8EE' }]}>
            <View style={styles.dot} />
            <Text variant="microcopy" weight="600" color={c.whatsappDark}>
              {ar ? 'يستقبل الطلبات' : 'Accepting orders'}
            </Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={[styles.statsRow, { backgroundColor: c.surface, borderColor: c.border }]}>
          {[
            { v: (vendor.rating ?? 0).toFixed(1), l: ar ? 'تقييم' : 'Rating' },
            { v: String(products.length), l: ar ? 'منتج' : 'Products' },
            { v: String(vendor.reviewCount ?? 0), l: ar ? 'مراجعة' : 'Reviews' },
          ].map((s, i) => (
            <React.Fragment key={s.l}>
              {i > 0 && <View style={[styles.statDiv, { backgroundColor: c.border }]} />}
              <View style={styles.stat}>
                <Text variant="cardTitle" weight="700">{s.v}</Text>
                <Text variant="microcopy" color={c.textMuted}>{s.l}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Contact actions */}
        <View style={styles.actionsRow}>
          <ActionBtn icon="logo-whatsapp" label="WhatsApp" onPress={openWhatsapp} primary />
          <ActionBtn icon="chatbubble-ellipses-outline" label={ar ? 'محادثة' : 'Chat'} onPress={() => navigation.navigate('Chat', { vendorId: vendor.id })} />
          <ActionBtn icon="call-outline" label={ar ? 'اتصال' : 'Call'} onPress={callPhone} />
        </View>

        {/* Bio */}
        {vendor.bio && (
          <Card style={styles.bioCard}>
            <Text variant="body" color={c.textMuted}>{pickLocale(vendor.bio)}</Text>
          </Card>
        )}

        {/* Info card */}
        <Card style={styles.infoCard} padding="none">
          <InfoRow icon="time-outline" label={ar ? 'ساعات العمل' : 'Hours'} value={ar ? '10 ص — 10 م يومياً' : '10 AM — 10 PM daily'} />
          <Divider />
          <InfoRow icon="call-outline" label={ar ? 'الهاتف' : 'Phone'} value={vendor.phone ?? '—'} mono />
          {vendor.whatsapp && (<><Divider /><InfoRow icon="logo-whatsapp" label="WhatsApp" value={vendor.whatsapp} mono /></>)}
          {isPro && (<><Divider /><InfoRow icon="globe-outline" label={ar ? 'الموقع' : 'Website'} value={BRAND.storeUrl(vendor.handle ?? vendor.slug)} /></>)}
          <Divider />
          <InfoRow icon="card-outline" label={ar ? 'الدفع' : 'Payment'} value={ar ? 'بالتنسيق مع البائع مباشرة' : 'Arrange directly with the vendor'} />
        </Card>

        {/* Products */}
        <View style={styles.productsHead}>
          <Text variant="sectionTitle" weight="700">{ar ? 'المنتجات' : 'Products'}</Text>
          <Text variant="label" weight="600" color={c.brandText}>{products.length}</Text>
        </View>
        <View style={styles.grid}>
          {products.map((p) => (
            <PressableScale key={p.id} onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}>
              <View style={{ width: tileWidth, marginBottom: spacing.s4 }}>
                <Image source={{ uri: p.images?.[0] }} style={[styles.tileImg, { backgroundColor: c.surfaceSunken }]} contentFit="cover" />
                <Text variant="label" weight="600" numberOfLines={1} style={{ marginTop: 8 }}>{pickLocale(p.title)}</Text>
                <Text variant="cardTitle" color={c.brandText} weight="700" forceLtr>{formatPrice(p.price, p.currency)}</Text>
              </View>
            </PressableScale>
          ))}
        </View>
      </ScrollView>

      {/* Floating WhatsApp */}
      <Pressable onPress={openWhatsapp} style={[styles.fab, { backgroundColor: c.whatsapp }]}>
        <Ionicons name="logo-whatsapp" size={28} color="#fff" />
      </Pressable>
    </Screen>
  );
}

const ActionBtn: React.FC<{
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  label: string; onPress: () => void; primary?: boolean;
}> = ({ icon, label, onPress, primary }) => {
  const c = useColors();
  return (
    <PressableScale onPress={onPress} style={{ flex: 1 }}>
      <View style={[
        styles.actionBtn,
        { backgroundColor: primary ? c.brand : c.surface, borderColor: primary ? c.brand : c.border },
      ]}>
        <Ionicons name={icon} size={20} color={primary ? '#fff' : c.text} />
        <Text variant="label" weight="600" color={primary ? '#fff' : c.text} style={{ marginTop: 4 }}>{label}</Text>
      </View>
    </PressableScale>
  );
};

const InfoRow: React.FC<{
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  label: string; value: string; mono?: boolean;
}> = ({ icon, label, value, mono }) => {
  const c = useColors();
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: c.brandFill }]}>
        <Ionicons name={icon} size={16} color={c.brandText} />
      </View>
      <View style={{ flex: 1, marginStart: spacing.s3 }}>
        <Text variant="caption" color={c.textMuted}>{label}</Text>
        <Text variant="body" weight={mono ? '500' : '400'} style={mono ? { letterSpacing: 0.3 } : undefined} forceLtr={mono}>{value}</Text>
      </View>
    </View>
  );
};

const Divider = () => {
  const c = useColors();
  return <View style={[styles.divider, { backgroundColor: c.border }]} />;
};

const styles = StyleSheet.create({
  fallbackHeader: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s4, borderBottomWidth: 1 },
  fallbackBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cover: { height: 200, position: 'relative' },
  coverBtn: {
    position: 'absolute', top: spacing.s5,
    width: 40, height: 40, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center', ...shadowStyle(2),
  },
  identityWrap: { alignItems: 'center', paddingHorizontal: spacing.s5, marginTop: -42, gap: 4 },
  logoRing: { width: 92, height: 92, borderRadius: 999, padding: 4, ...shadowStyle(2) },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.s3 },
  tierPill: { paddingHorizontal: spacing.s2, paddingVertical: 2, borderRadius: 999, marginStart: spacing.s1 },
  acceptPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.s3, height: 28, borderRadius: 999, marginTop: spacing.s2,
  },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#25D366' },
  statsRow: {
    flexDirection: 'row', borderRadius: radius.lg,
    marginHorizontal: spacing.s5, marginTop: spacing.s4,
    paddingVertical: spacing.s4, borderWidth: 1,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, marginVertical: 4 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: spacing.s5, marginTop: spacing.s4, gap: spacing.s2 },
  actionBtn: {
    paddingVertical: spacing.s3, borderWidth: 1, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  bioCard: { margin: spacing.s5, marginBottom: 0, padding: spacing.s4 },
  infoCard: { margin: spacing.s5, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s4, paddingVertical: spacing.s3 },
  infoIcon: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, marginStart: 60 },
  productsHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, marginTop: spacing.s4, marginBottom: spacing.s3,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: spacing.s5 },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg },
  fab: {
    position: 'absolute', end: spacing.s5, bottom: spacing.s6,
    width: 56, height: 56, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center', ...shadowStyle(3),
  },
});
