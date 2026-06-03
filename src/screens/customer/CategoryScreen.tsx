import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Logo from '../../ui/Logo';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import { LoadingState } from '../../ui/EmptyState';
import { useCategories, useServices, useVendors } from '../../data/hooks';
import { useFavoritesStore } from '../../stores/favorites';
import { useColors } from '../../theme/colors';
import { radius, shadowStyle, spacing, formatPrice, pickLocale, getCurrentLocale } from '../../theme/ts';
import type { Service, Vendor } from '@shared/types';
import type { RootStackScreenProps } from '../../navigation/types';

type Sort = 'newest' | 'price_asc' | 'price_desc';

export default function CategoryScreen({ route, navigation }: RootStackScreenProps<'Category'>) {
  const { categoryId } = route.params;
  const { data: all, loading: productsLoading } = useServices();
  const { data: categories } = useCategories();
  const { data: vendors } = useVendors();
  const { width } = useWindowDimensions();
  const c = useColors();
  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;
  const [sort, setSort] = useState<Sort>('newest');

  const category = useMemo(() => categories.find((x) => x.id === categoryId), [categories, categoryId]);
  const vendorMap = useMemo(() => Object.fromEntries(vendors.map((v) => [v.id, v])), [vendors]);

  const products = useMemo(() => {
    let list = all.filter((p) => p.categoryIds?.includes(categoryId));
    if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [all, categoryId, sort]);

  const ar = getCurrentLocale() === 'ar';

  return (
    <Screen>
      {/* Hero (deep navy brand block — reads well in both themes) */}
      <View style={styles.hero}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
        </Pressable>
        <View style={styles.heroContent}>
          <Text variant="caption" color="#c2cfe3">
            {i18n.t('cats.productCount', { n: products.length })}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s2 }}>
            <Text variant="hero" color="#fff" weight="700">{category?.emoji ?? '🏷️'}</Text>
            <Text variant="pageTitle" color="#fff" weight="700">
              {category ? pickLocale(category.name) : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Sort row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
        {(['newest', 'price_asc', 'price_desc'] as Sort[]).map((s) => {
          const active = sort === s;
          return (
            <Pressable
              key={s}
              onPress={() => setSort(s)}
              style={[
                styles.sortChip,
                { backgroundColor: active ? c.brand : c.surface, borderColor: active ? c.brand : c.border },
              ]}
            >
              <Text variant="label" weight="600" color={active ? '#fff' : c.text}>
                {s === 'newest' ? (ar ? 'الأحدث' : 'Newest') : s === 'price_asc' ? (ar ? 'السعر ↑' : 'Price ↑') : (ar ? 'السعر ↓' : 'Price ↓')}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {productsLoading && all.length === 0 ? (
        <LoadingState label={ar ? 'جاري التحميل…' : 'Loading…'} />
      ) : products.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={48} color={c.textMuted} />
          <Text variant="body" color={c.textMuted} style={{ marginTop: spacing.s3 }}>
            {ar ? 'لا توجد منتجات في هذا التصنيف بعد.' : 'No products in this category yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(p) => p.id}
          columnWrapperStyle={{ paddingHorizontal: spacing.s5, justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingTop: spacing.s3, paddingBottom: 120 }}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 40).duration(360)}>
              <ProductTile
                product={item}
                vendor={vendorMap[item.vendorId]}
                width={tileWidth}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
              />
            </Animated.View>
          )}
        />
      )}
    </Screen>
  );
}

const ProductTile: React.FC<{ product: Service; vendor?: Vendor; width: number; onPress: () => void }> = ({ product, vendor, width, onPress }) => {
  const c = useColors();
  const isFav = useFavoritesStore((s) => s.productIds.has(product.id));
  const toggleProduct = useFavoritesStore((s) => s.toggleProduct);
  return (
    <PressableScale onPress={onPress}>
      <View style={{ width, marginBottom: spacing.s4 }}>
        <View style={styles.tileImgWrap}>
          <Image source={{ uri: product.images?.[0] }} style={[styles.tileImg, { backgroundColor: c.surfaceSunken }]} contentFit="cover" />
          <Pressable
            onPress={() => { Haptics.selectionAsync().catch(() => {}); toggleProduct(product.id); }}
            hitSlop={8}
            style={[styles.heart, { backgroundColor: c.glass }]}
          >
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={14} color={isFav ? c.danger : c.text} />
          </Pressable>
        </View>
        <Text variant="label" weight="600" numberOfLines={1} style={{ marginTop: 10 }}>
          {pickLocale(product.title)}
        </Text>
        <Text variant="cardTitle" color={c.brandText} weight="700" forceLtr>
          {formatPrice(product.price, product.currency)}
        </Text>
        {vendor && (
          <View style={styles.vendorStrip}>
            <Logo name={vendor.name.en} size={20} uri={vendor.logoImage} />
            <Text variant="caption" color={c.textMuted} numberOfLines={1} style={{ flex: 1, marginStart: 4 }}>
              {pickLocale(vendor.name)}
            </Text>
            {vendor.verifiedAt && <Ionicons name="checkmark-circle" size={12} color={c.brandText} />}
          </View>
        )}
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#001a41',
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s5,
    paddingBottom: spacing.s6,
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.s4,
  },
  heroContent: { gap: spacing.s1 },
  sortRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s4, gap: spacing.s2 },
  sortChip: {
    paddingHorizontal: spacing.s3, height: 36, borderRadius: 999,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.s7 },
  tileImgWrap: { position: 'relative' },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg },
  heart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 28, height: 28, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(1),
  },
  vendorStrip: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
});
