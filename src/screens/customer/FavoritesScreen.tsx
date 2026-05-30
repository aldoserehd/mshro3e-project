import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Logo from '../../ui/Logo';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import { useServices, useVendors } from '../../data/hooks';
import { vendorById } from '../../data/seed';
import { palette, radius, semantic, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { MainTabsScreenProps } from '../../navigation/types';

type Tab = 'products' | 'vendors';
type Occasion = 'all' | 'eid' | 'baby' | 'graduation' | 'wedding' | 'other';

const OCCASIONS: Occasion[] = ['all', 'eid', 'baby', 'graduation', 'wedding', 'other'];

export default function FavoritesScreen({ navigation }: MainTabsScreenProps<'Favorites'>) {
  const [tab, setTab] = useState<Tab>('products');
  const [occasion, setOccasion] = useState<Occasion>('all');
  const { data: allProducts } = useServices();
  const { data: allVendors } = useVendors();
  const { width } = useWindowDimensions();
  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;

  // Mock: just show a slice as "favorites"
  const products = allProducts.slice(0, 4);
  const vendors = allVendors.slice(0, 4);

  return (
    <Screen>
      <View style={styles.headerBar}>
        <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={12}>
          <Ionicons name="menu" size={26} color={palette.neutral900} />
        </Pressable>
        <Text variant="cardTitle" weight="700">Mshro3e</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['products', 'vendors'] as Tab[]).map((k) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            style={[styles.tab, tab === k && styles.tabActive]}
          >
            <Text variant="button" color={tab === k ? '#fff' : palette.navy700}>
              {k === 'products' ? i18n.t('favorites.tabProducts') : i18n.t('favorites.tabVendors')}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Occasion chips */}
      {tab === 'products' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {OCCASIONS.map((o) => (
            <Pressable
              key={o}
              onPress={() => setOccasion(o)}
              style={[styles.chip, occasion === o && styles.chipActive]}
            >
              <Text variant="label" color={occasion === o ? '#fff' : palette.navy900}>
                {i18n.t(`favorites.occasions.${o}`)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {tab === 'products' ? (
          products.length === 0 ? (
            <Empty />
          ) : (
            <View style={styles.grid}>
              {products.map((p) => {
                const v = vendorById(p.vendorId);
                return (
                  <PressableScale
                    key={p.id}
                    onPress={() => navigation.navigate('ServiceDetail', { serviceId: p.id })}
                  >
                    <View style={{ width: tileWidth, marginBottom: spacing.s3 }}>
                      <Image source={{ uri: p.images[0] }} style={styles.tileImg} contentFit="cover" />
                      <View style={styles.heart}>
                        <Ionicons name="heart" size={14} color="#B91C1C" />
                      </View>
                      <Text variant="label" numberOfLines={1} style={{ marginTop: 8 }}>
                        {pickLocale(p.title)}
                      </Text>
                      <Text variant="cardTitle" color={palette.navy900}>
                        {formatPrice(p.price, p.currency)}
                      </Text>
                      {v && (
                        <Text variant="caption" color={palette.neutral500} numberOfLines={1}>
                          {pickLocale(v.name)}
                        </Text>
                      )}
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
              <PressableScale
                key={v.id}
                onPress={() => navigation.navigate('VendorProfile', { vendorId: v.id })}
              >
                <View style={styles.vendorCard}>
                  <Logo name={v.name.en} size={48} />
                  <View style={{ flex: 1, marginStart: spacing.s3 }}>
                    <Text variant="cardTitle">{pickLocale(v.name)}</Text>
                    <Text variant="caption" color={palette.neutral500}>
                      {v.address ? pickLocale(v.address) : ''}
                    </Text>
                  </View>
                  <Ionicons name="chevron-back" size={18} color={palette.neutral500} style={{ transform: [{ scaleX: -1 }] }} />
                </View>
              </PressableScale>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const Empty: React.FC = () => (
  <View style={styles.empty}>
    <Ionicons name="heart-outline" size={56} color={palette.navy300} />
    <Text variant="cardTitle" style={{ marginTop: spacing.s4 }}>
      {i18n.t('favorites.empty.title')}
    </Text>
    <Text variant="body" color={palette.neutral500} align="center">
      {i18n.t('favorites.empty.subtitle')}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, paddingVertical: spacing.s3,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: palette.navy100,
    marginHorizontal: spacing.s5,
    borderRadius: 999,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 999 },
  tabActive: { backgroundColor: palette.navy900 },
  chipRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s4, gap: spacing.s2 },
  chip: {
    paddingHorizontal: spacing.s3, height: 32,
    borderRadius: 999,
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.neutral200,
    alignItems: 'center', justifyContent: 'center',
  },
  chipActive: { backgroundColor: palette.navy900, borderColor: palette.navy900 },
  scroll: { paddingTop: spacing.s4, paddingBottom: 120 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
  },
  tileImg: { width: '100%', aspectRatio: 1, borderRadius: radius.lg, backgroundColor: palette.navy100 },
  heart: {
    position: 'absolute', top: spacing.s2, end: spacing.s2,
    width: 28, height: 28, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
  },
  vendorCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: semantic.surface,
    padding: spacing.s3,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: palette.neutral200,
  },
  vendorLogo: { width: 48, height: 48, borderRadius: 999, backgroundColor: palette.navy100 },
  empty: { padding: spacing.s7, alignItems: 'center', justifyContent: 'center', gap: spacing.s2 },
});
