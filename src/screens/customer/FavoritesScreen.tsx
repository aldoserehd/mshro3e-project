import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Logo from '../../ui/Logo';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import ProductCard from '../../ui/ProductCard';
import EmptyState from '../../ui/EmptyState';
import { useServices, useVendors } from '../../data/hooks';
import { useFavoritesStore } from '../../stores/favorites';
import { useColors } from '../../theme/colors';
import { radius, spacing, pickLocale } from '../../theme/ts';
import type { MainTabsScreenProps } from '../../navigation/types';

type Tab = 'products' | 'vendors';

export default function FavoritesScreen({ navigation }: MainTabsScreenProps<'Favorites'>) {
  const [tab, setTab] = useState<Tab>('products');
  const { data: allProducts } = useServices();
  const { data: allVendors } = useVendors();
  const { width } = useWindowDimensions();
  const c = useColors();
  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;

  const productIds = useFavoritesStore((s) => s.productIds);
  const vendorIds = useFavoritesStore((s) => s.vendorIds);
  const toggleVendor = useFavoritesStore((s) => s.toggleVendor);

  const products = useMemo(() => allProducts.filter((p) => productIds.has(p.id)), [allProducts, productIds]);
  const vendors = useMemo(() => allVendors.filter((v) => vendorIds.has(v.id)), [allVendors, vendorIds]);
  const vendorMap = useMemo(() => Object.fromEntries(allVendors.map((v) => [v.id, v])), [allVendors]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="pageTitle" weight="700">{i18n.t('favorites.title')}</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: c.surfaceAlt }]}>
        {(['products', 'vendors'] as Tab[]).map((k) => (
          <Pressable key={k} onPress={() => setTab(k)} style={[styles.tab, tab === k && { backgroundColor: c.brand }]}>
            <Text variant="button" weight="600" color={tab === k ? c.textOnBrand : c.textMuted}>
              {k === 'products' ? i18n.t('favorites.tabProducts') : i18n.t('favorites.tabVendors')}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'products' ? (
          products.length === 0 ? (
            <Empty onBrowse={() => navigation.navigate('Home')} />
          ) : (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.grid}>
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  vendor={vendorMap[p.vendorId]}
                  width={tileWidth}
                  onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}
                />
              ))}
            </Animated.View>
          )
        ) : vendors.length === 0 ? (
          <Empty onBrowse={() => navigation.navigate('Home')} />
        ) : (
          <Animated.View entering={FadeInDown.duration(300)} style={{ paddingHorizontal: spacing.s5, gap: spacing.s3 }}>
            {vendors.map((v) => (
              <PressableScale key={v.id} onPress={() => navigation.navigate('VendorProfile', { vendorId: v.id })}>
                <View style={[styles.vendorCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                  <Logo name={v.name.en} size={48} uri={v.logoImage} />
                  <View style={{ flex: 1, marginStart: spacing.s3 }}>
                    <Text variant="cardTitle" weight="600">{pickLocale(v.name)}</Text>
                    <Text variant="caption" color={c.textMuted}>{v.address ? pickLocale(v.address) : ''}</Text>
                  </View>
                  <Pressable onPress={() => { Haptics.selectionAsync().catch(() => {}); toggleVendor(v.id); }} hitSlop={8}>
                    <Ionicons name="heart" size={20} color={c.danger} />
                  </Pressable>
                </View>
              </PressableScale>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  );
}

const Empty: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <EmptyState
    icon="heart-outline"
    title={i18n.t('favorites.empty.title')}
    subtitle={i18n.t('favorites.empty.subtitle')}
    actionLabel={i18n.t('favorites.empty.cta')}
    onAction={onBrowse}
  />
);

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.s5, paddingTop: spacing.s2, paddingBottom: spacing.s3 },
  tabs: { flexDirection: 'row', marginHorizontal: spacing.s5, borderRadius: 999, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 999 },
  scroll: { paddingTop: spacing.s4, paddingBottom: 120 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: spacing.s5, gap: spacing.s3 },
  vendorCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.s3, borderRadius: radius.lg, borderWidth: 1,
  },
});
