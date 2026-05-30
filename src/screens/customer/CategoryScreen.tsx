import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import { useServices } from '../../data/hooks';
import { vendorById, categoryById } from '../../data/seed';
import { palette, radius, semantic, shadowStyle, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { Service } from '@shared/types';
import type { RootStackScreenProps } from '../../navigation/types';

type Sort = 'newest' | 'price_asc' | 'price_desc';

export default function CategoryScreen({ route, navigation }: RootStackScreenProps<'Category'>) {
  const { categoryId } = route.params;
  const { data: all } = useServices();
  const { width } = useWindowDimensions();
  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;
  const [sort, setSort] = useState<Sort>('newest');

  const category = categoryById(categoryId);
  const products = useMemo(() => {
    let list = all.filter((p) => p.categoryIds.includes(categoryId));
    if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [all, categoryId, sort]);

  return (
    <Screen>
      {/* Hero */}
      <View style={styles.hero}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
        </Pressable>
        <View style={styles.heroContent}>
          <Text variant="caption" color={palette.navy200}>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}
      >
        {(['newest', 'price_asc', 'price_desc'] as Sort[]).map((s) => (
          <Pressable
            key={s}
            onPress={() => setSort(s)}
            style={[styles.sortChip, sort === s && styles.sortChipActive]}
          >
            <Text variant="label" color={sort === s ? '#fff' : palette.navy900}>
              {s === 'newest' ? 'الأحدث' : s === 'price_asc' ? 'السعر ↑' : 'السعر ↓'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {products.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bag-outline" size={48} color={palette.navy300} />
          <Text variant="body" color={palette.neutral500} style={{ marginTop: spacing.s3 }}>
            لا توجد منتجات في هذا التصنيف بعد.
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

const ProductTile: React.FC<{ product: Service; width: number; onPress: () => void }> = ({ product, width, onPress }) => {
  const vendor = vendorById(product.vendorId);
  return (
    <PressableScale onPress={onPress}>
      <View style={{ width, marginBottom: spacing.s4 }}>
        <View style={styles.tileImgWrap}>
          <Image source={{ uri: product.images[0] }} style={styles.tileImg} contentFit="cover" />
          <View style={styles.heart}>
            <Ionicons name="heart-outline" size={14} color={palette.navy900} />
          </View>
        </View>
        <Text variant="label" numberOfLines={1} style={{ marginTop: 10 }}>
          {pickLocale(product.title)}
        </Text>
        <Text variant="cardTitle" color={palette.navy900} weight="700">
          {formatPrice(product.price, product.currency)}
        </Text>
        {vendor && (
          <View style={styles.vendorStrip}>
            <Image
              source={vendor.logoImage ? { uri: vendor.logoImage } : undefined}
              style={styles.vendorAvatar}
              contentFit="cover"
            />
            <Text variant="caption" color={palette.neutral500} numberOfLines={1} style={{ flex: 1, marginStart: 4 }}>
              {pickLocale(vendor.name)}
            </Text>
            {vendor.verifiedAt && (
              <Ionicons name="checkmark-circle" size={12} color={palette.navy600} />
            )}
          </View>
        )}
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: palette.navy900,
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
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.neutral200,
    alignItems: 'center', justifyContent: 'center',
  },
  sortChipActive: { backgroundColor: palette.navy900, borderColor: palette.navy900 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.s7 },
  tileImgWrap: { position: 'relative' },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg, backgroundColor: palette.navy100 },
  heart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 28, height: 28, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(1),
  },
  vendorStrip: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  vendorAvatar: { width: 20, height: 20, borderRadius: 999, backgroundColor: palette.navy100 },
});
