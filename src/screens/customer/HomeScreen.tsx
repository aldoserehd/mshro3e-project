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
import Card from '../../ui/Card';
import PressableScale from '../../ui/PressableScale';
import { useCategories, useFeaturedVendors, useServices } from '../../data/hooks';
import { palette, radius, semantic, shadowStyle, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { Service } from '@shared/types';
import { vendorById } from '../../data/seed';
import { MainTabsScreenProps } from '../../navigation/types';

const GRID_GUTTER = spacing.s3;

export default function HomeScreen({ navigation }: MainTabsScreenProps<'Home'>) {
  const { data: categories } = useCategories();
  const { data: featured } = useFeaturedVendors();
  const { data: products } = useServices();
  const { width } = useWindowDimensions();
  const tileWidth = (width - spacing.s5 * 2 - GRID_GUTTER) / 2;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable hitSlop={12}>
            <Ionicons name="menu" size={26} color={palette.neutral900} />
          </Pressable>
          <Text variant="cardTitle" weight="700">Mshro3e</Text>
        </View>

        <Pressable onPress={() => navigation.navigate('Search')} style={styles.searchBar}>
          <Ionicons name="search" size={18} color={palette.neutral500} />
          <TextInput
            editable={false}
            placeholder={i18n.t('home.searchHint')}
            placeholderTextColor={palette.neutral500}
            style={styles.searchInput}
          />
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {categories.map((c) => (
            <PressableScale key={c.id} onPress={() => navigation.navigate('Search')}>
              <View style={styles.chip}>
                <Text variant="caption" style={{ marginEnd: 4 }}>{c.emoji ?? '🏷️'}</Text>
                <Text variant="label" color={palette.navy900}>{pickLocale(c.name)}</Text>
              </View>
            </PressableScale>
          ))}
        </ScrollView>

        <Section title={i18n.t('home.storiesTitle')} onSeeAll={() => navigation.navigate('Search')} />
        <FlatList
          data={featured}
          horizontal
          keyExtractor={(v) => v.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesRow}
          renderItem={({ item }) => (
            <PressableScale onPress={() => navigation.navigate('VendorProfile', { vendorId: item.id })}>
              <View style={styles.storyWrap}>
                <View style={styles.storyRing}>
                  <Image
                    source={item.logoImage ? { uri: item.logoImage } : undefined}
                    style={styles.storyAvatar}
                    contentFit="cover"
                  />
                </View>
                <Text
                  variant="microcopy"
                  color={palette.neutral900}
                  align="center"
                  numberOfLines={1}
                  style={{ width: 72, marginTop: 6 }}
                >
                  {pickLocale(item.name)}
                </Text>
              </View>
            </PressableScale>
          )}
        />

        <Section title={i18n.t('home.newTitle')} onSeeAll={() => navigation.navigate('Search')} />
        <FlatList
          data={products.slice(0, 6)}
          horizontal
          keyExtractor={(p) => p.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newRow}
          renderItem={({ item }) => (
            <NewProductCard
              product={item}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
            />
          )}
        />

        <Section title={i18n.t('home.discoverTitle')} onSeeAll={() => navigation.navigate('Search')} />
        <View style={styles.grid}>
          {products.slice(0, 8).map((p) => (
            <ProductTile
              key={p.id}
              product={p}
              width={tileWidth}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const Section: React.FC<{ title: string; onSeeAll?: () => void }> = ({ title, onSeeAll }) => (
  <View style={styles.sectionHeader}>
    <Text variant="sectionTitle">{title}</Text>
    {onSeeAll && (
      <Pressable onPress={onSeeAll}>
        <Text variant="label" color={palette.navy600}>{i18n.t('home.viewAll')}</Text>
      </Pressable>
    )}
  </View>
);

const NewProductCard: React.FC<{ product: Service; onPress: () => void }> = ({ product, onPress }) => {
  const vendor = vendorById(product.vendorId);
  return (
    <PressableScale onPress={onPress}>
      <Card style={styles.newCard}>
        <Image source={{ uri: product.images[0] }} style={styles.newImg} contentFit="cover" />
        <View style={{ padding: spacing.s3 }}>
          <Text variant="cardTitle" numberOfLines={1}>{pickLocale(product.title)}</Text>
          {vendor && (
            <Text variant="caption" color={palette.neutral500} numberOfLines={1}>
              {pickLocale(vendor.name)}
            </Text>
          )}
          <Text variant="cardTitle" color={palette.navy900} style={{ marginTop: 6 }}>
            {formatPrice(product.price, product.currency)}
          </Text>
        </View>
      </Card>
    </PressableScale>
  );
};

const ProductTile: React.FC<{ product: Service; width: number; onPress: () => void }> = ({ product, width, onPress }) => {
  const vendor = vendorById(product.vendorId);
  return (
    <PressableScale onPress={onPress}>
      <View style={{ width, marginBottom: GRID_GUTTER }}>
        <View style={styles.tileImgWrap}>
          <Image source={{ uri: product.images[0] }} style={styles.tileImg} contentFit="cover" />
          <View style={styles.heart}>
            <Ionicons name="heart-outline" size={16} color={palette.navy900} />
          </View>
        </View>
        <Text variant="label" numberOfLines={2} style={{ marginTop: 8 }}>
          {pickLocale(product.title)}
        </Text>
        <Text variant="cardTitle" color={palette.navy900} style={{ marginTop: 2 }}>
          {formatPrice(product.price, product.currency)}
        </Text>
        {vendor && (
          <Text variant="caption" color={palette.neutral500} numberOfLines={1} style={{ marginTop: 2 }}>
            {pickLocale(vendor.name)}
          </Text>
        )}
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s3,
    paddingBottom: spacing.s3,
  },
  searchBar: {
    marginHorizontal: spacing.s5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.s4,
    height: 44,
    gap: spacing.s2,
    borderWidth: 1,
    borderColor: palette.neutral200,
  },
  searchInput: { flex: 1, fontSize: 14, color: palette.neutral900, textAlign: 'right' },
  chipRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s4, gap: spacing.s2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.surface,
    borderWidth: 1,
    borderColor: palette.neutral200,
    paddingHorizontal: spacing.s3,
    height: 36,
    borderRadius: radius.full,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
    marginTop: spacing.s5,
    marginBottom: spacing.s3,
  },
  storiesRow: { paddingHorizontal: spacing.s5, gap: spacing.s3 },
  storyWrap: { alignItems: 'center', width: 72 },
  storyRing: {
    width: 64, height: 64, borderRadius: 999,
    borderWidth: 2, borderColor: palette.navy600,
    padding: 3, justifyContent: 'center', alignItems: 'center',
  },
  storyAvatar: { width: '100%', height: '100%', borderRadius: 999, backgroundColor: palette.navy100 },
  newRow: { paddingHorizontal: spacing.s5, gap: spacing.s3 },
  newCard: { width: 240, padding: 0, overflow: 'hidden' },
  newImg: { width: '100%', height: 140, backgroundColor: palette.navy100 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.s5,
    justifyContent: 'space-between',
  },
  tileImgWrap: { position: 'relative' },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg, backgroundColor: palette.navy100 },
  heart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 30, height: 30, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    ...shadowStyle(1),
  },
});
