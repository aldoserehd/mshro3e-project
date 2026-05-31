import React from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import Logo from '../../ui/Logo';
import { useCategories, useServices, useVendors } from '../../data/hooks';
import { palette, radius, semantic, shadowStyle, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { Service, Vendor, Category } from '@shared/types';
import { useLocaleStore } from '../../stores/locale';
import { MainTabsScreenProps } from '../../navigation/types';

export default function HomeScreen({ navigation }: MainTabsScreenProps<'Home'>) {
  const { data: categories } = useCategories();
  const { data: vendors } = useVendors();
  const { data: products } = useServices();
  const { width } = useWindowDimensions();
  const { locale } = useLocaleStore();
  const gridTile = (width - spacing.s5 * 2 - spacing.s3) / 2;

  // Live vendor lookup (Firestore) — replaces the stale seed helper.
  const vendorMap = React.useMemo(() => {
    const m: Record<string, Vendor> = {};
    for (const v of vendors) m[v.id] = v;
    return m;
  }, [vendors]);

  const today = products.slice(0, 8);
  const collection = products.slice(8, 12).length >= 2 ? products.slice(8, 12) : products.slice(0, 4);

  return (
    <Screen>
      {/* ── Top bar: location · brand · search ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.locationPill} hitSlop={8}>
          <Ionicons name="location" size={16} color={palette.brand} />
          <Text variant="label" weight="600" color={palette.neutral900} style={{ marginStart: 4 }}>
            {locale === 'ar' ? 'السالمية' : 'Salmiya'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={palette.neutral500} style={{ marginStart: 2 }} />
        </Pressable>
        <Text variant="cardTitle" weight="700" color={palette.brand}>Mshro3e</Text>
        <Pressable onPress={() => navigation.navigate('Search')} hitSlop={8} style={styles.iconBtn}>
          <Ionicons name="search" size={20} color={palette.neutral900} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Search field ── */}
        <Pressable onPress={() => navigation.navigate('Search')} style={styles.searchBar}>
          <Ionicons name="search" size={20} color={palette.neutral500} />
          <TextInput
            editable={false}
            placeholder={i18n.t('home.searchHint')}
            placeholderTextColor={palette.neutral500}
            style={styles.searchInput}
            pointerEvents="none"
          />
        </Pressable>

        {/* ── Category chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <View style={[styles.chip, styles.chipActive]}>
            <Text variant="label" weight="600" color="#fff">{locale === 'ar' ? 'الكل' : 'All'}</Text>
          </View>
          {categories.map((c) => (
            <PressableScale key={c.id} onPress={() => navigation.navigate('Category', { categoryId: c.id })}>
              <View style={styles.chip}>
                <Text style={styles.chipEmoji}>{c.emoji ?? '🏷️'}</Text>
                <Text variant="label" weight="600" color={palette.neutral900}>{pickLocale(c.name)}</Text>
              </View>
            </PressableScale>
          ))}
        </ScrollView>

        {/* ── Available Today ── */}
        <SectionHeader
          title={i18n.t('home.availableToday')}
          onSeeAll={() => navigation.navigate('Search')}
        />
        {today.length === 0 ? (
          <EmptyHint locale={locale} />
        ) : (
          <FlatList
            data={today}
            horizontal
            keyExtractor={(p) => p.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.todayRow}
            renderItem={({ item }) => (
              <TallProductCard
                product={item}
                vendor={vendorMap[item.vendorId]}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
              />
            )}
          />
        )}

        {/* ── Occasion collection ── */}
        <View style={styles.collectionHead}>
          <Text variant="sectionTitle" weight="700">{i18n.t('home.gatheringTonight')}</Text>
          <Text variant="body" color={palette.neutral500}>{i18n.t('home.gatheringSub')}</Text>
        </View>
        <View style={styles.grid}>
          {collection.map((p) => (
            <SquareProductCard
              key={p.id}
              product={p}
              width={gridTile}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

// ── components ──

const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void }> = ({ title, onSeeAll }) => (
  <View style={styles.sectionHead}>
    <Text variant="sectionTitle" weight="700">{title}</Text>
    {onSeeAll && (
      <Pressable onPress={onSeeAll} hitSlop={8}>
        <Text variant="label" weight="600" color={palette.brand}>{i18n.t('home.viewAll')}</Text>
      </Pressable>
    )}
  </View>
);

const TallProductCard: React.FC<{ product: Service; vendor?: Vendor; onPress: () => void }> = ({ product, vendor, onPress }) => (
  <PressableScale onPress={onPress}>
    <View style={styles.tallCard}>
      <View style={styles.tallImgWrap}>
        <Image source={{ uri: product.images[0] }} style={styles.tallImg} contentFit="cover" transition={150} />
        <View style={styles.priceBadge}>
          <Text variant="label" weight="700" color={palette.neutral900}>
            {formatPrice(product.price, product.currency)}
          </Text>
        </View>
      </View>
      <View style={styles.tallBody}>
        {vendor && (
          <View style={styles.vendorRow}>
            <Text variant="caption" color={palette.neutral500} numberOfLines={1} style={{ flexShrink: 1 }}>
              {pickLocale(vendor.name)}
            </Text>
            {vendor.verifiedAt && <Ionicons name="checkmark-circle" size={12} color={palette.brand} style={{ marginStart: 3 }} />}
          </View>
        )}
        <Text variant="cardTitle" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
      </View>
    </View>
  </PressableScale>
);

const SquareProductCard: React.FC<{ product: Service; width: number; onPress: () => void }> = ({ product, width, onPress }) => (
  <PressableScale onPress={onPress}>
    <View style={[styles.sqCard, { width }]}>
      <Image source={{ uri: product.images[0] }} style={styles.sqImg} contentFit="cover" transition={150} />
      <View style={{ padding: spacing.s3 }}>
        <Text variant="label" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
        <Text variant="cardTitle" weight="700" color={palette.brand} style={{ marginTop: 2 }}>
          {formatPrice(product.price, product.currency)}
        </Text>
      </View>
    </View>
  </PressableScale>
);

const EmptyHint: React.FC<{ locale: 'ar' | 'en' }> = ({ locale }) => (
  <View style={styles.empty}>
    <Ionicons name="storefront-outline" size={40} color={palette.navy300} />
    <Text variant="body" color={palette.neutral500} align="center" style={{ marginTop: spacing.s2 }}>
      {locale === 'ar' ? 'لا توجد منتجات بعد — حمّل البيانات من الإعدادات.' : 'No products yet — seed data from Settings.'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, paddingVertical: spacing.s3,
    backgroundColor: semantic.surface,
    borderBottomWidth: 1, borderBottomColor: palette.neutral200,
  },
  locationPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: palette.navy50,
    paddingHorizontal: spacing.s3, height: 34, borderRadius: 999,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 999,
    backgroundColor: palette.navy50,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingBottom: 130 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.neutral200,
    borderRadius: radius.lg,
    marginHorizontal: spacing.s5, marginTop: spacing.s4,
    paddingHorizontal: spacing.s4, height: 52, gap: spacing.s2,
    ...shadowStyle(1),
  },
  searchInput: { flex: 1, fontSize: 15, color: palette.neutral900, textAlign: 'right' },
  chipRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s4, gap: spacing.s2 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.neutral200,
    paddingHorizontal: spacing.s4, height: 38, borderRadius: 999,
  },
  chipActive: { backgroundColor: palette.brand, borderColor: palette.brand },
  chipEmoji: { fontSize: 15, marginEnd: 5, lineHeight: 20 },
  sectionHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, marginTop: spacing.s6, marginBottom: spacing.s3,
  },
  todayRow: { paddingHorizontal: spacing.s5, gap: spacing.s4, paddingBottom: spacing.s2 },
  tallCard: {
    width: 230,
    backgroundColor: semantic.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1, borderColor: palette.neutral200,
    ...shadowStyle(2),
  },
  tallImgWrap: { position: 'relative' },
  tallImg: { width: '100%', height: 270, backgroundColor: palette.navy100 },
  priceBadge: {
    position: 'absolute', top: spacing.s3, end: spacing.s3,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: spacing.s3, paddingVertical: 5, borderRadius: radius.lg,
    ...shadowStyle(1),
  },
  tallBody: { padding: spacing.s4, gap: 4 },
  vendorRow: { flexDirection: 'row', alignItems: 'center' },
  collectionHead: { paddingHorizontal: spacing.s5, marginTop: spacing.s6, marginBottom: spacing.s3, gap: 2 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.s5, justifyContent: 'space-between', gap: spacing.s3,
  },
  sqCard: {
    backgroundColor: semantic.surface,
    borderRadius: radius.xl, overflow: 'hidden',
    borderWidth: 1, borderColor: palette.neutral200,
    marginBottom: spacing.s3,
    ...shadowStyle(1),
  },
  sqImg: { width: '100%', aspectRatio: 1, backgroundColor: palette.navy100 },
  empty: { padding: spacing.s7, alignItems: 'center', justifyContent: 'center' },
});
