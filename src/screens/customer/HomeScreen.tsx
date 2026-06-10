import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
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
import { LoadingState } from '../../ui/EmptyState';
import { useCategories, useServices, useVendors } from '../../data/hooks';
import { KUWAIT_AREAS, type Area } from '../../data/areas';
import { useColors } from '../../theme/colors';
import { radius, shadowStyle, spacing, formatPrice, pickLocale, getCurrentLocale } from '../../theme/ts';
import type { Service, Vendor } from '@shared/types';
import { useLocaleStore } from '../../stores/locale';
import { MainTabsScreenProps } from '../../navigation/types';

export default function HomeScreen({ navigation }: MainTabsScreenProps<'Home'>) {
  const { data: categories } = useCategories();
  const { data: vendors } = useVendors();
  const { data: products, loading: productsLoading } = useServices();
  const { width } = useWindowDimensions();
  const { locale } = useLocaleStore();
  const c = useColors();
  const gridTile = (width - spacing.s5 * 2 - spacing.s3) / 2;

  const [query, setQuery] = useState('');
  const [area, setArea] = useState<Area>(KUWAIT_AREAS[0]);
  const [areaOpen, setAreaOpen] = useState(false);

  // Live vendor lookup (Firestore).
  const vendorMap = useMemo(() => {
    const m: Record<string, Vendor> = {};
    for (const v of vendors) m[v.id] = v;
    return m;
  }, [vendors]);

  // Area filter: keep a product if its vendor's address matches the chosen area.
  const areaFiltered = useMemo(() => {
    if (area.id === 'all') return products;
    const needle = [area.ar, area.en].map((s) => s.toLowerCase());
    const matched = products.filter((p) => {
      const v = vendorMap[p.vendorId];
      const addr = v?.address ? `${v.address.ar} ${v.address.en}`.toLowerCase() : '';
      return needle.some((n) => addr.includes(n));
    });
    // Graceful fallback: if no vendor data carries this area yet, don't blank the home.
    return matched.length ? matched : products;
  }, [products, area, vendorMap]);

  // In-page search results.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return areaFiltered.filter((p) => {
      const v = vendorMap[p.vendorId];
      const hay = [
        p.title?.ar, p.title?.en,
        v?.name?.ar, v?.name?.en,
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [query, areaFiltered, vendorMap]);

  const today = areaFiltered.slice(0, 8);
  const collection = areaFiltered.slice(8, 12).length >= 2 ? areaFiltered.slice(8, 12) : areaFiltered.slice(0, 4);

  return (
    <Screen>
      {/* ── Top bar: location · brand · favorites ── */}
      <View style={[styles.topBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <Pressable style={[styles.locationPill, { backgroundColor: c.surfaceAlt }]} hitSlop={8} onPress={() => setAreaOpen(true)}>
          <Ionicons name="location" size={16} color={c.brandText} />
          <Text variant="label" weight="600" style={{ marginStart: 4 }}>{pickLocale(area)}</Text>
          <Ionicons name="chevron-down" size={14} color={c.textMuted} style={{ marginStart: 2 }} />
        </Pressable>
        <Text variant="cardTitle" weight="700" color={c.brandText}>{i18n.t('app.name')}</Text>
        <Pressable onPress={() => navigation.navigate('Favorites')} hitSlop={8} style={[styles.iconBtn, { backgroundColor: c.surfaceAlt }]}>
          <Ionicons name="heart-outline" size={20} color={c.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* ── Inline search field ── */}
        <View style={[styles.searchBar, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Ionicons name="search" size={20} color={c.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={i18n.t('home.searchHint')}
            placeholderTextColor={c.textMuted}
            style={[styles.searchInput, { color: c.text, textAlign: locale === 'ar' ? 'right' : 'left' }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={c.textMuted} />
            </Pressable>
          )}
        </View>

        {productsLoading && products.length === 0 ? (
          <LoadingState
            label={getCurrentLocale() === 'ar' ? 'جاري التحميل…' : 'Loading…'}
            style={{ paddingTop: spacing.s8 }}
          />
        ) : results ? (
          /* ── Search results (in-page) ── */
          <>
            <View style={styles.sectionHead}>
              <Text variant="sectionTitle" weight="700">{i18n.t('home.resultsFor')} · {results.length}</Text>
            </View>
            {results.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={40} color={c.textMuted} />
                <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: spacing.s2 }}>
                  {i18n.t('home.noResults')}
                </Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {results.map((p) => (
                  <SquareProductCard
                    key={p.id}
                    product={p}
                    width={gridTile}
                    onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            {/* ── Category chips ── */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {categories.map((cat) => (
                <PressableScale key={cat.id} onPress={() => navigation.navigate('Category', { categoryId: cat.id })}>
                  <View style={[styles.chip, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <Text style={styles.chipEmoji}>{cat.emoji ?? '🏷️'}</Text>
                    <Text variant="label" weight="600">{pickLocale(cat.name)}</Text>
                  </View>
                </PressableScale>
              ))}
            </ScrollView>

            {/* ── Available Today ── */}
            <View style={styles.sectionHead}>
              <Text variant="sectionTitle" weight="700">{i18n.t('home.availableToday')}</Text>
            </View>
            {today.length === 0 ? (
              <EmptyHint />
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
            {collection.length > 0 && (
              <>
                <View style={styles.collectionHead}>
                  <Text variant="sectionTitle" weight="700">{i18n.t('home.gatheringTonight')}</Text>
                  <Text variant="body" color={c.textMuted}>{i18n.t('home.gatheringSub')}</Text>
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
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* ── Area picker ── */}
      <Modal visible={areaOpen} transparent animationType="slide" onRequestClose={() => setAreaOpen(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={() => setAreaOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.handle, { backgroundColor: c.borderStrong }]} />
            <Text variant="cardTitle" weight="700" style={{ marginBottom: spacing.s3 }}>{i18n.t('home.chooseArea')}</Text>
            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {KUWAIT_AREAS.map((a) => {
                const selected = a.id === area.id;
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => { setArea(a); setAreaOpen(false); }}
                    style={[styles.areaRow, { borderBottomColor: c.border }]}
                  >
                    <Ionicons
                      name={a.id === 'all' ? 'earth-outline' : 'location-outline'}
                      size={18}
                      color={selected ? c.brandText : c.textMuted}
                    />
                    <Text
                      variant="body"
                      weight={selected ? '700' : '400'}
                      color={selected ? c.brandText : c.text}
                      style={{ flex: 1, marginStart: spacing.s3 }}
                    >
                      {pickLocale(a)}
                    </Text>
                    {selected && <Ionicons name="checkmark" size={20} color={c.brand} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

// ── components ──

const TallProductCard: React.FC<{ product: Service; vendor?: Vendor; onPress: () => void }> = ({ product, vendor, onPress }) => {
  const c = useColors();
  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.tallCard, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={styles.tallImgWrap}>
          <Image source={{ uri: product.images?.[0] }} style={[styles.tallImg, { backgroundColor: c.surfaceSunken }]} contentFit="cover" transition={150} />
          <View style={[styles.priceBadge, { backgroundColor: c.glass }]}>
            <Text variant="label" weight="700" forceLtr>{formatPrice(product.price, product.currency)}</Text>
          </View>
        </View>
        <View style={styles.tallBody}>
          {vendor && (
            <View style={styles.vendorRow}>
              <Text variant="caption" color={c.textMuted} numberOfLines={1} style={{ flexShrink: 1 }}>
                {pickLocale(vendor.name)}
              </Text>
              {vendor.verifiedAt && <Ionicons name="checkmark-circle" size={12} color={c.brandText} style={{ marginStart: 3 }} />}
            </View>
          )}
          <Text variant="cardTitle" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
        </View>
      </View>
    </PressableScale>
  );
};

const SquareProductCard: React.FC<{ product: Service; width: number; onPress: () => void }> = ({ product, width, onPress }) => {
  const c = useColors();
  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.sqCard, { width, backgroundColor: c.surface, borderColor: c.border }]}>
        <Image source={{ uri: product.images?.[0] }} style={[styles.sqImg, { backgroundColor: c.surfaceSunken }]} contentFit="cover" transition={150} />
        <View style={{ padding: spacing.s3 }}>
          <Text variant="label" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
          <Text variant="cardTitle" weight="700" color={c.brandText} style={{ marginTop: 2 }} forceLtr>
            {formatPrice(product.price, product.currency)}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
};

const EmptyHint: React.FC = () => {
  const c = useColors();
  return (
    <View style={styles.empty}>
      <Ionicons name="storefront-outline" size={40} color={c.textMuted} />
      <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: spacing.s2 }}>
        {getCurrentLocale() === 'ar' ? 'لا توجد منتجات بعد — أضف من لوحة الإدارة.' : 'No products yet — add some from the admin.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, paddingVertical: spacing.s3,
    borderBottomWidth: 1,
  },
  locationPill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.s3, height: 34, borderRadius: 999,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingBottom: 130 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    marginHorizontal: spacing.s5, marginTop: spacing.s4,
    paddingHorizontal: spacing.s4, height: 52, gap: spacing.s2,
    ...shadowStyle(1),
  },
  searchInput: { flex: 1, fontSize: 15 },
  chipRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s4, gap: spacing.s2 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: spacing.s4, height: 38, borderRadius: 999,
  },
  chipEmoji: { fontSize: 15, marginEnd: 5, lineHeight: 20 },
  sectionHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, marginTop: spacing.s6, marginBottom: spacing.s3,
  },
  todayRow: { paddingHorizontal: spacing.s5, gap: spacing.s4, paddingBottom: spacing.s2 },
  tallCard: {
    width: 230, borderRadius: radius.xl, overflow: 'hidden',
    borderWidth: 1, ...shadowStyle(2),
  },
  tallImgWrap: { position: 'relative' },
  tallImg: { width: '100%', height: 270 },
  priceBadge: {
    position: 'absolute', top: spacing.s3, end: spacing.s3,
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
    borderRadius: radius.xl, overflow: 'hidden',
    borderWidth: 1, marginBottom: spacing.s3, ...shadowStyle(1),
  },
  sqImg: { width: '100%', aspectRatio: 1 },
  empty: { padding: spacing.s7, alignItems: 'center', justifyContent: 'center' },
  // area sheet
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopStartRadius: radius.xl, borderTopEndRadius: radius.xl,
    paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s7,
  },
  handle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 999, marginBottom: spacing.s4 },
  areaRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.s4, borderBottomWidth: 1,
  },
});
