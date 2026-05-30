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
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Chevron } from '../../ui/Chevron';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import PulseDot from '../../ui/PulseDot';
import { useCategories, useFeaturedVendors, useServices, useVendors } from '../../data/hooks';
import { palette, radius, semantic, shadowStyle, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { Service, Vendor, Category } from '@shared/types';
import { vendorById } from '../../data/seed';
import { useLocaleStore } from '../../stores/locale';
import { MainTabsScreenProps } from '../../navigation/types';

export default function HomeScreen({ navigation }: MainTabsScreenProps<'Home'>) {
  const { data: categories } = useCategories();
  const { data: featured } = useFeaturedVendors();
  const { data: vendors } = useVendors();
  const { data: products } = useServices();
  const { width } = useWindowDimensions();
  const { locale } = useLocaleStore();
  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;

  // Group products by category for the section blocks
  const productsByCategory = React.useMemo(() => {
    const map: Record<string, Service[]> = {};
    for (const c of categories) {
      map[c.id] = products.filter((p) => p.categoryIds.includes(c.id));
    }
    return map;
  }, [categories, products]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ───── HERO TOP BAR ───── */}
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={[palette.navy900, palette.navy800]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Subtle dot pattern overlay */}
          <View style={styles.dotPattern} pointerEvents="none">
            {Array.from({ length: 60 }).map((_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: (i * 37) % width,
                  top: ((i * 53) % 100) + 20,
                  width: 3, height: 3, borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }}
              />
            ))}
          </View>

          <View style={styles.topRow}>
            <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={12} style={styles.iconBtnDark}>
              <Ionicons name="menu" size={22} color="#fff" />
            </Pressable>
            <Text variant="cardTitle" weight="800" color="#fff" style={{ letterSpacing: -0.3 }}>Mshro3e</Text>
            <Pressable hitSlop={12} style={styles.iconBtnDark}>
              <Ionicons name="mail-outline" size={22} color="#fff" />
              <View style={styles.badge} />
            </Pressable>
          </View>

          <Text variant="hero" color="#fff" weight="700" style={{ fontSize: 26, lineHeight: 32 }}>
            {locale === 'ar' ? 'اكتشف الكويت،' : 'Discover Kuwait,'}
          </Text>
          <Text variant="pageTitle" color={palette.navy300} weight="500" style={{ marginTop: 2 }}>
            {locale === 'ar' ? 'صنع بأيدي كويتية 🇰🇼' : 'made by Kuwaiti hands 🇰🇼'}
          </Text>

          <Pressable onPress={() => navigation.navigate('Search')} style={styles.searchBar}>
            <Ionicons name="search" size={20} color={palette.neutral500} />
            <TextInput
              editable={false}
              placeholder={i18n.t('home.searchHint')}
              placeholderTextColor={palette.neutral500}
              style={styles.searchInput}
            />
            <View style={styles.searchFilter}>
              <Ionicons name="options-outline" size={16} color="#fff" />
            </View>
          </Pressable>
        </View>

        {/* ───── CATEGORY GRID — Uber Eats style ───── */}
        <View style={styles.catGrid}>
          {categories.slice(0, 8).map((c) => (
            <View key={c.id} style={{ width: '25%' }}>
              <CategoryTile
                category={c}
                onPress={() => navigation.navigate('Category', { categoryId: c.id })}
              />
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => navigation.navigate('Search')}
          style={styles.seeAllCats}
        >
          <Text variant="label" weight="600" color={palette.navy900}>
            {locale === 'ar' ? `عرض كل التصنيفات (${categories.length})` : `Show all categories (${categories.length})`}
          </Text>
          <Chevron direction="forward" size={16} color={palette.navy900} />
        </Pressable>

        {/* ───── VENDOR STORIES ───── */}
        <SectionHeader title={i18n.t('home.storiesTitle')} />
        <FlatList
          data={featured}
          horizontal
          keyExtractor={(v) => v.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesRow}
          renderItem={({ item }) => (
            <StoryItem
              vendor={item}
              onPress={() => navigation.navigate('VendorProfile', { vendorId: item.id })}
            />
          )}
        />

        {/* ───── TRENDING VENDORS — horizontal multi-product cards ───── */}
        <SectionHeader title={locale === 'ar' ? 'محلات رائجة' : 'Trending shops'} onSeeAll={() => navigation.navigate('Search')} />
        <FlatList
          data={vendors.slice(0, 6)}
          horizontal
          keyExtractor={(v) => v.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vendorCardsRow}
          renderItem={({ item }) => (
            <VendorCard
              vendor={item}
              products={products.filter((p) => p.vendorId === item.id).slice(0, 3)}
              onPress={() => navigation.navigate('VendorProfile', { vendorId: item.id })}
            />
          )}
        />

        {/* ───── PER-CATEGORY BLOCKS — FB Marketplace style ───── */}
        {categories.slice(0, 4).map((c) => {
          const list = productsByCategory[c.id] ?? [];
          if (list.length === 0) return null;
          return (
            <View key={c.id} style={{ marginTop: spacing.s6 }}>
              <View style={styles.blockHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s2 }}>
                  <Text style={{ fontSize: 22 }}>{c.emoji ?? '🏷️'}</Text>
                  <Text variant="sectionTitle">{pickLocale(c.name)}</Text>
                </View>
                <Pressable onPress={() => navigation.navigate('Category', { categoryId: c.id })}>
                  <Text variant="label" color={palette.navy600}>{i18n.t('home.viewAll')}</Text>
                </Pressable>
              </View>
              <FlatList
                data={list.slice(0, 6)}
                horizontal
                keyExtractor={(p) => p.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.blockRow}
                renderItem={({ item }) => (
                  <ProductCardHorizontal
                    product={item}
                    onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
                  />
                )}
              />
            </View>
          );
        })}

        {/* ───── DISCOVER GRID with live tiles ───── */}
        <View style={[styles.blockHeader, { marginTop: spacing.s6 }]}>
          <Text variant="sectionTitle">{i18n.t('home.discoverTitle')}</Text>
          <Pressable onPress={() => navigation.navigate('Search')} style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color={palette.navy700} />
            <Text variant="label" color={palette.navy700} style={{ marginStart: 4 }}>
              {locale === 'ar' ? 'تصفية' : 'Filter'}
            </Text>
          </Pressable>
        </View>
        <View style={styles.grid}>
          {products.slice(0, 8).map((p, idx) => (
            <ProductTile
              key={p.id}
              product={p}
              width={tileWidth}
              live={idx % 3 === 0}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

// ──────────────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ title: string; onSeeAll?: () => void }> = ({ title, onSeeAll }) => (
  <View style={styles.blockHeader}>
    <Text variant="sectionTitle">{title}</Text>
    {onSeeAll && (
      <Pressable onPress={onSeeAll}>
        <Text variant="label" color={palette.navy600}>{i18n.t('home.viewAll')}</Text>
      </Pressable>
    )}
  </View>
);

const CategoryTile: React.FC<{ category: Category; onPress: () => void }> = ({ category, onPress }) => (
  <PressableScale onPress={onPress}>
    <View style={styles.catTile}>
      <View style={styles.catEmojiWrap}>
        <Text style={{ fontSize: 28 }}>{category.emoji ?? '🏷️'}</Text>
      </View>
      <Text variant="label" weight="600" align="center" numberOfLines={2} style={styles.catLabel}>
        {pickLocale(category.name)}
      </Text>
    </View>
  </PressableScale>
);

const StoryItem: React.FC<{ vendor: Vendor; onPress: () => void }> = ({ vendor, onPress }) => (
  <PressableScale onPress={onPress}>
    <View style={styles.storyWrap}>
      <LinearGradient
        colors={[palette.navy900, palette.navy500, palette.navy200]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.storyRing}
      >
        <View style={styles.storyInner}>
          <Image
            source={vendor.logoImage ? { uri: vendor.logoImage } : undefined}
            style={styles.storyAvatar}
            contentFit="contain"
          />
        </View>
      </LinearGradient>
      <Text variant="microcopy" weight="500" color={palette.neutral900} numberOfLines={1} style={styles.storyLabel}>
        {pickLocale(vendor.name)}
      </Text>
    </View>
  </PressableScale>
);

const VendorCard: React.FC<{ vendor: Vendor; products: Service[]; onPress: () => void }> = ({ vendor, products, onPress }) => (
  <PressableScale onPress={onPress}>
    <View style={styles.vendorCard}>
      <View style={styles.vendorCardHead}>
        <Image
          source={vendor.logoImage ? { uri: vendor.logoImage } : undefined}
          style={styles.vendorCardLogo}
          contentFit="contain"
        />
        <View style={{ flex: 1, marginStart: spacing.s3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text variant="label" weight="700" numberOfLines={1}>{pickLocale(vendor.name)}</Text>
            {vendor.verifiedAt && (
              <Ionicons name="checkmark-circle" size={12} color={palette.navy600} />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={11} color="#F0B400" />
            <Text variant="microcopy" color={palette.neutral500}>
              {vendor.rating.toFixed(1)} · {vendor.reviewCount}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.vendorCardImgs}>
        {products.slice(0, 3).map((p, i) => (
          <Image
            key={p.id}
            source={{ uri: p.images[0] }}
            style={[styles.vendorCardImg, i > 0 && { marginStart: 2 }]}
            contentFit="cover"
          />
        ))}
      </View>
    </View>
  </PressableScale>
);

const ProductCardHorizontal: React.FC<{ product: Service; onPress: () => void }> = ({ product, onPress }) => {
  const vendor = vendorById(product.vendorId);
  return (
    <PressableScale onPress={onPress}>
      <View style={styles.hProductCard}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: product.images[0] }} style={styles.hProductImg} contentFit="cover" />
          <Pressable style={styles.hProductHeart} hitSlop={8}>
            <Ionicons name="heart-outline" size={14} color={palette.navy900} />
          </Pressable>
        </View>
        <View style={{ padding: spacing.s3, gap: 2 }}>
          <Text variant="label" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
          <Text variant="cardTitle" color={palette.navy900} weight="700">
            {formatPrice(product.price, product.currency)}
          </Text>
          {vendor && (
            <View style={styles.vendorStripSmall}>
              <Image source={vendor.logoImage ? { uri: vendor.logoImage } : undefined} style={styles.vendorAvatarSmall} contentFit="contain" />
              <Text variant="caption" color={palette.neutral500} numberOfLines={1} style={{ flex: 1, marginStart: 4 }}>
                {pickLocale(vendor.name)}
              </Text>
              {vendor.verifiedAt && <Ionicons name="checkmark-circle" size={11} color={palette.navy600} />}
            </View>
          )}
        </View>
      </View>
    </PressableScale>
  );
};

const ProductTile: React.FC<{ product: Service; width: number; live: boolean; onPress: () => void }> = ({
  product, width, live, onPress,
}) => {
  const vendor = vendorById(product.vendorId);
  return (
    <PressableScale onPress={onPress}>
      <View style={{ width, marginBottom: spacing.s4 }}>
        <View style={styles.tileImgWrap}>
          <Image source={{ uri: product.images[0] }} style={styles.tileImg} contentFit="cover" />
          {live && (
            <View style={styles.pulseWrap}><PulseDot size={8} /></View>
          )}
          <Pressable style={styles.heart} hitSlop={8}>
            <Ionicons name="heart-outline" size={14} color={palette.navy900} />
          </Pressable>
        </View>
        <Text variant="label" weight="600" numberOfLines={1} style={{ marginTop: 10 }}>
          {pickLocale(product.title)}
        </Text>
        <Text variant="cardTitle" color={palette.navy900} weight="700">
          {formatPrice(product.price, product.currency)}
        </Text>
        {vendor && (
          <View style={styles.vendorStripSmall}>
            <Image source={vendor.logoImage ? { uri: vendor.logoImage } : undefined} style={styles.vendorAvatarSmall} contentFit="contain" />
            <Text variant="caption" color={palette.neutral500} numberOfLines={1} style={{ flex: 1, marginStart: 4 }}>
              {pickLocale(vendor.name)}
            </Text>
            {vendor.verifiedAt && <Ionicons name="checkmark-circle" size={11} color={palette.navy600} />}
          </View>
        )}
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: 120 },

  // Hero
  heroWrap: {
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s4,
    paddingBottom: spacing.s7,
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
    overflow: 'hidden',
  },
  dotPattern: { ...StyleSheet.absoluteFillObject },
  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.s5,
  },
  iconBtnDark: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute', top: 9, end: 11,
    width: 8, height: 8, borderRadius: 999,
    backgroundColor: '#F0B400',
    borderWidth: 1, borderColor: palette.navy900,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.full,
    paddingHorizontal: spacing.s4,
    height: 50,
    gap: spacing.s2,
    marginTop: spacing.s5,
    ...shadowStyle(2),
  },
  searchInput: { flex: 1, fontSize: 14, color: palette.neutral900, textAlign: 'right' },
  searchFilter: {
    width: 32, height: 32, borderRadius: 999,
    backgroundColor: palette.navy900,
    alignItems: 'center', justifyContent: 'center',
  },

  // Categories grid
  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.s4,
    paddingTop: spacing.s5,
    gap: 0,
  },
  catTile: {
    alignItems: 'center',
    paddingVertical: spacing.s2,
    paddingHorizontal: 4,
    height: 108,
    justifyContent: 'flex-start',
  },
  catEmojiWrap: {
    width: 60, height: 60, borderRadius: radius.lg,
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.navy100,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  catLabel: { textAlign: 'center', minHeight: 32 },
  seeAllCats: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.navy100,
    marginHorizontal: spacing.s5,
    marginTop: spacing.s2,
    paddingVertical: spacing.s3,
    borderRadius: radius.full,
    gap: spacing.s2,
  },

  // Section header (shared)
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
    marginTop: spacing.s6,
    marginBottom: spacing.s3,
  },

  // Stories
  storiesRow: { paddingHorizontal: spacing.s5, gap: spacing.s4 },
  storyWrap: { alignItems: 'center', width: 76 },
  storyRing: {
    width: 70, height: 70, borderRadius: 999,
    padding: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  storyInner: {
    width: '100%', height: '100%', borderRadius: 999,
    padding: 2,
    backgroundColor: semantic.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  storyAvatar: { width: '100%', height: '100%', borderRadius: 999, backgroundColor: palette.navy100 },
  storyLabel: { width: 76, marginTop: 6, textAlign: 'center' },

  // Vendor cards (trending)
  vendorCardsRow: { paddingHorizontal: spacing.s5, gap: spacing.s3 },
  vendorCard: {
    width: 230,
    backgroundColor: semantic.surface,
    borderRadius: radius.xl,
    padding: spacing.s3,
    borderWidth: 1, borderColor: palette.navy100,
    ...shadowStyle(1),
  },
  vendorCardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.s3 },
  vendorCardLogo: { width: 40, height: 40, borderRadius: 999, backgroundColor: palette.navy100 },
  vendorCardImgs: { flexDirection: 'row', borderRadius: radius.md, overflow: 'hidden' },
  vendorCardImg: { flex: 1, height: 90, backgroundColor: palette.navy100 },

  // Block (category) rows
  blockRow: { paddingHorizontal: spacing.s5, gap: spacing.s3 },
  hProductCard: {
    width: 180,
    backgroundColor: semantic.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1, borderColor: palette.navy100,
    ...shadowStyle(1),
  },
  hProductImg: { width: '100%', height: 140, backgroundColor: palette.navy100 },
  hProductHeart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 28, height: 28, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Discover grid
  filterBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.navy200,
    paddingHorizontal: spacing.s3, height: 32, borderRadius: 999,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.s5,
    justifyContent: 'space-between',
  },
  tileImgWrap: { position: 'relative' },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg, backgroundColor: palette.navy100 },
  pulseWrap: { position: 'absolute', top: spacing.s2, start: spacing.s2 },
  heart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 30, height: 30, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(1),
  },
  vendorStripSmall: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  vendorAvatarSmall: { width: 18, height: 18, borderRadius: 999, backgroundColor: palette.navy100 },
});
