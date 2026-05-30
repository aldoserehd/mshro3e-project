import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../ui/Logo';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import PressableScale from '../../ui/PressableScale';
import { useVendor, useServices } from '../../data/hooks';
import { palette, radius, semantic, shadowStyle, spacing, formatPrice, pickLocale } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import type { RootStackScreenProps } from '../../navigation/types';

const cleanPhone = (raw: string) => raw.replace(/[^\d]/g, '');

export default function VendorProfileScreen({ route, navigation }: RootStackScreenProps<'VendorProfile'>) {
  const { vendorId } = route.params;
  const { data: vendor } = useVendor(vendorId);
  const { data: allProducts } = useServices();
  const { locale } = useLocaleStore();
  const { width } = useWindowDimensions();
  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;

  if (!vendor) return null;

  const products = allProducts.filter((p) => p.vendorId === vendor.id);
  const isPro = vendor.tier === 'pro' || vendor.tier === 'managed';

  const openWhatsapp = () => {
    const ph = cleanPhone(vendor.whatsapp ?? vendor.phone ?? '');
    if (!ph) return;
    Linking.openURL(`https://wa.me/${ph}`).catch(() => {});
  };

  const callPhone = () => {
    if (!vendor.phone) return;
    Linking.openURL(`tel:${vendor.phone}`).catch(() => {});
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={[styles.cover, { width }]}>
          <Image
            source={vendor.coverImage ? { uri: vendor.coverImage } : undefined}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(10,16,32,0.55)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={palette.navy900} style={{ transform: [{ scaleX: -1 }] }} />
          </Pressable>
          <Pressable style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color={palette.navy900} />
          </Pressable>
        </View>

        {/* Identity */}
        <View style={styles.identityWrap}>
          <View style={styles.logoRing}>
            <Logo name={vendor.name.en} size={88} />
          </View>
          <View style={styles.nameRow}>
            <Text variant="pageTitle" weight="700">{pickLocale(vendor.name)}</Text>
            {vendor.verifiedAt && (
              <Ionicons name="checkmark-circle" size={18} color={palette.navy600} />
            )}
            {isPro && (
              <View style={styles.tierPill}>
                <Text variant="microcopy" color="#fff" weight="600">
                  {vendor.tier === 'managed' ? 'Managed' : 'Pro'}
                </Text>
              </View>
            )}
          </View>
          {vendor.address && (
            <Text variant="caption" color={palette.neutral500}>
              <Ionicons name="location" size={12} color={palette.neutral500} /> {pickLocale(vendor.address)}
            </Text>
          )}
        </View>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text variant="cardTitle" weight="700">{vendor.rating.toFixed(1)}</Text>
            <Text variant="microcopy" color={palette.neutral500}>{locale === 'ar' ? 'تقييم' : 'Rating'}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text variant="cardTitle" weight="700">{products.length}</Text>
            <Text variant="microcopy" color={palette.neutral500}>{locale === 'ar' ? 'منتج' : 'Products'}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text variant="cardTitle" weight="700">{vendor.reviewCount}</Text>
            <Text variant="microcopy" color={palette.neutral500}>{locale === 'ar' ? 'مراجعة' : 'Reviews'}</Text>
          </View>
        </View>

        {/* Contact actions */}
        <View style={styles.actionsRow}>
          <ActionBtn icon="logo-whatsapp" label="WhatsApp" onPress={openWhatsapp} primary />
          <ActionBtn
            icon="chatbubble-ellipses-outline"
            label={locale === 'ar' ? 'محادثة' : 'Chat'}
            onPress={() => navigation.navigate('Chat', { vendorId: vendor.id })}
          />
          <ActionBtn
            icon="call-outline"
            label={locale === 'ar' ? 'اتصال' : 'Call'}
            onPress={callPhone}
          />
        </View>

        {/* Bio */}
        {vendor.bio && (
          <Card style={styles.bioCard}>
            <Text variant="body" color={palette.neutral900}>{pickLocale(vendor.bio)}</Text>
          </Card>
        )}

        {/* Info card */}
        <Card style={styles.infoCard}>
          <InfoRow icon="time-outline" label={locale === 'ar' ? 'ساعات العمل' : 'Hours'} value={locale === 'ar' ? '10 ص — 10 م يومياً' : '10 AM — 10 PM daily'} />
          <Divider />
          <InfoRow icon="call-outline" label={locale === 'ar' ? 'الهاتف' : 'Phone'} value={vendor.phone ?? '—'} mono />
          {vendor.whatsapp && (
            <>
              <Divider />
              <InfoRow icon="logo-whatsapp" label="WhatsApp" value={vendor.whatsapp} mono />
            </>
          )}
          {isPro && (
            <>
              <Divider />
              <InfoRow icon="globe-outline" label={locale === 'ar' ? 'الموقع الإلكتروني' : 'Website'} value={`mshro3e.com/@${vendor.handle ?? vendor.slug}`} />
            </>
          )}
          <Divider />
          <InfoRow icon="card-outline" label={locale === 'ar' ? 'الدفع' : 'Payment'} value={
            isPro
              ? (locale === 'ar' ? 'KNET · Apple Pay (عبر البائع)' : 'KNET · Apple Pay (vendor handled)')
              : (locale === 'ar' ? 'بالتنسيق مع البائع مباشرة' : 'Arrange directly with the vendor')
          } />
        </Card>

        {/* Products */}
        <View style={styles.productsHead}>
          <Text variant="sectionTitle">{locale === 'ar' ? 'المنتجات' : 'Products'}</Text>
          <Text variant="label" color={palette.navy600}>{products.length}</Text>
        </View>
        <View style={styles.grid}>
          {products.map((p) => (
            <PressableScale
              key={p.id}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}
            >
              <View style={{ width: tileWidth, marginBottom: spacing.s4 }}>
                <View style={styles.tileImgWrap}>
                  <Image source={{ uri: p.images[0] }} style={styles.tileImg} contentFit="cover" />
                </View>
                <Text variant="label" weight="600" numberOfLines={1} style={{ marginTop: 8 }}>
                  {pickLocale(p.title)}
                </Text>
                <Text variant="cardTitle" color={palette.navy900} weight="700">
                  {formatPrice(p.price, p.currency)}
                </Text>
              </View>
            </PressableScale>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const ActionBtn: React.FC<{
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  primary?: boolean;
}> = ({ icon, label, onPress, primary }) => (
  <PressableScale onPress={onPress}>
    <View style={[styles.actionBtn, primary && styles.actionBtnPrimary]}>
      <Ionicons name={icon} size={20} color={primary ? '#fff' : palette.navy900} />
      <Text variant="label" weight="600" color={primary ? '#fff' : palette.navy900} style={{ marginTop: 4 }}>
        {label}
      </Text>
    </View>
  </PressableScale>
);

const InfoRow: React.FC<{
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
}> = ({ icon, label, value, mono }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={16} color={palette.navy700} />
    </View>
    <View style={{ flex: 1, marginStart: spacing.s3 }}>
      <Text variant="caption" color={palette.neutral500}>{label}</Text>
      <Text variant="body" weight={mono ? '500' : '400'} style={mono ? { letterSpacing: 0.3 } : undefined}>
        {value}
      </Text>
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  cover: {
    height: 220,
    backgroundColor: palette.navy200,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute', top: spacing.s5, end: spacing.s4,
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(2),
  },
  shareBtn: {
    position: 'absolute', top: spacing.s5, start: spacing.s4,
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(2),
  },
  identityWrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.s5,
    marginTop: -42,
    gap: 4,
  },
  logoRing: {
    width: 96, height: 96, borderRadius: 999,
    backgroundColor: '#fff',
    padding: 4,
    ...shadowStyle(2),
  },
  logo: { width: '100%', height: '100%', borderRadius: 999, backgroundColor: palette.navy100 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.s3 },
  tierPill: {
    backgroundColor: palette.navy900,
    paddingHorizontal: spacing.s2, paddingVertical: 2,
    borderRadius: 999,
    marginStart: spacing.s1,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: semantic.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.s5,
    marginTop: spacing.s4,
    paddingVertical: spacing.s4,
    borderWidth: 1, borderColor: palette.navy100,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, backgroundColor: palette.navy100, marginVertical: 4 },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.s5,
    marginTop: spacing.s4,
    gap: spacing.s2,
  },
  actionBtn: {
    flex: 1, paddingVertical: spacing.s3,
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.navy200,
    borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
    minWidth: 90,
  },
  actionBtnPrimary: {
    backgroundColor: palette.navy900,
    borderColor: palette.navy900,
  },
  bioCard: {
    margin: spacing.s5,
    marginBottom: 0,
    padding: spacing.s4,
  },
  infoCard: {
    margin: spacing.s5,
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3,
  },
  infoIcon: {
    width: 32, height: 32, borderRadius: 999,
    backgroundColor: palette.navy100,
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: palette.navy100, marginStart: 60 },
  productsHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
    marginTop: spacing.s4,
    marginBottom: spacing.s3,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
  },
  tileImgWrap: { position: 'relative' },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg, backgroundColor: palette.navy100 },
});
