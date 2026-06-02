import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Logo from '../../ui/Logo';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import { useServices, useVendors } from '../../data/hooks';
import { useFavoritesStore } from '../../stores/favorites';
import { useColors } from '../../theme/colors';
import { radius, spacing, formatPrice, pickLocale } from '../../theme/ts';
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
  const toggleProduct = useFavoritesStore((s) => s.toggleProduct);
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
            <Text variant="button" weight="600" color={tab === k ? '#fff' : c.textMuted}>
              {k === 'products' ? i18n.t('favorites.tabProducts') : i18n.t('favorites.tabVendors')}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'products' ? (
          products.length === 0 ? (
            <Empty />
          ) : (
            <View style={styles.grid}>
              {products.map((p) => {
                const v = vendorMap[p.vendorId];
                return (
                  <PressableScale key={p.id} onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}>
                    <View style={{ width: tileWidth, marginBottom: spacing.s4 }}>
                      <View>
                        <Image source={{ uri: p.images?.[0] }} style={[styles.tileImg, { backgroundColor: c.surfaceSunken }]} contentFit="cover" />
                        <Pressable
                          onPress={() => { Haptics.selectionAsync().catch(() => {}); toggleProduct(p.id); }}
                          style={[styles.heart, { backgroundColor: c.glass }]}
                          hitSlop={8}
                        >
                          <Ionicons name="heart" size={15} color={c.danger} />
                        </Pressable>
                      </View>
                      <Text variant="label" weight="600" numberOfLines={1} style={{ marginTop: 8 }}>{pickLocale(p.title)}</Text>
                      <Text variant="cardTitle" weight="700" color={c.brandText} forceLtr>{formatPrice(p.price, p.currency)}</Text>
                      {v && <Text variant="caption" color={c.textMuted} numberOfLines={1}>{pickLocale(v.name)}</Text>}
                    </View>
                  </PressableScale>
                );
              })}
            </View>
          )
        ) : vendors.length === 0 ? (
          <Empty />
        ) : (
          <View style={{ paddingHorizontal: spacing.s5, gap: spacing.s3 }}>
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
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const Empty: React.FC = () => {
  const c = useColors();
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: c.brandFill }]}>
        <Ionicons name="heart-outline" size={36} color={c.brandText} />
      </View>
      <Text variant="cardTitle" weight="700" style={{ marginTop: spacing.s4 }}>{i18n.t('favorites.empty.title')}</Text>
      <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: 4 }}>{i18n.t('favorites.empty.subtitle')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.s5, paddingTop: spacing.s2, paddingBottom: spacing.s3 },
  tabs: { flexDirection: 'row', marginHorizontal: spacing.s5, borderRadius: 999, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 999 },
  scroll: { paddingTop: spacing.s4, paddingBottom: 120 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: spacing.s5 },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg },
  heart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 30, height: 30, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
  },
  vendorCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.s3, borderRadius: radius.lg, borderWidth: 1,
  },
  empty: { padding: spacing.s7, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { width: 72, height: 72, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
