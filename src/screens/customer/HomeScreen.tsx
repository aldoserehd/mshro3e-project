import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import PressableScale from '../../ui/PressableScale';
import RatingDots from '../../ui/RatingDots';
import FreshDataPill from '../../ui/FreshDataPill';
import Avatar from '../../ui/Avatar';
import {
  useCategories,
  useFeaturedVendors,
  useNearbyVendors,
} from '../../data/hooks';
import { palette, radius, semantic, shadowStyle, spacing, rtl } from '../../theme/ts';
import { pickLocale } from '../../theme/ts';
import type { Vendor } from '@shared/types';
import { MainTabsScreenProps } from '../../navigation/types';

const HERO_HEIGHT = 180;
const HERO_BANNERS = [
  {
    id: 'b1',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80',
    title: { ar: 'خصومات الصيف', en: 'Summer deals' },
    subtitle: { ar: 'وفر حتى ٣٠٪ على الخدمات المختارة', en: 'Save up to 30% on selected services' },
  },
  {
    id: 'b2',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    title: { ar: 'باقات العرايس', en: 'Bridal packages' },
    subtitle: { ar: 'تجهيزات كاملة لليوم الأهم', en: 'Complete prep for the big day' },
  },
  {
    id: 'b3',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    title: { ar: 'صيانة سريعة', en: 'Same-day service' },
    subtitle: { ar: 'فنّيون في موقعك خلال ساعة', en: 'Technicians on-site within an hour' },
  },
];

export default function HomeScreen({ navigation }: MainTabsScreenProps<'Home'>) {
  const { data: categories } = useCategories();
  const { data: featured } = useFeaturedVendors();
  const { data: nearby } = useNearbyVendors();

  const { width } = useWindowDimensions();
  const carouselRef = useRef<FlatList>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => {
        const next = (i + 1) % HERO_BANNERS.length;
        carouselRef.current?.scrollToOffset({ offset: next * (width - spacing.s4 * 2), animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [width]);

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const w = width - spacing.s4 * 2;
    const i = Math.round(e.nativeEvent.contentOffset.x / w);
    if (i !== heroIndex) setHeroIndex(i);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color={palette.neutral500}>
              {i18n.t('home.greeting')}
            </Text>
            <Text variant="sectionTitle" weight="700" style={{ marginTop: 2 }}>
              {i18n.t('app.name')}
            </Text>
          </View>
          <Pressable
            hitSlop={12}
            onPress={() => {}}
            style={styles.iconBtn}
          >
            <Ionicons name="notifications-outline" size={20} color={palette.navy900} />
          </Pressable>
        </View>

        {/* Search shortcut */}
        <PressableScale
          onPress={() => navigation.navigate('Search')}
          style={styles.searchBar}
        >
          <Ionicons name="search" size={18} color={palette.neutral500} />
          <Text variant="body" color={palette.neutral500} style={styles.searchHint}>
            {i18n.t('home.searchHint')}
          </Text>
        </PressableScale>

        {/* Hero carousel */}
        <FlatList
          ref={carouselRef}
          data={HERO_BANNERS}
          keyExtractor={(b) => b.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - spacing.s4 * 2}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: spacing.s4 }}
          onScroll={onHeroScroll}
          scrollEventThrottle={16}
          style={{ marginTop: spacing.s4 }}
          renderItem={({ item }) => (
            <View style={[styles.heroCard, { width: width - spacing.s4 * 2 }]}>
              <Image source={{ uri: item.image }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={150} />
              <LinearGradient
                colors={['transparent', 'rgba(10,16,32,0.85)']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.heroContent}>
                <Text variant="cardTitle" color={palette.white} weight="700">
                  {pickLocale(item.title)}
                </Text>
                <Text variant="caption" color={palette.navy200} style={{ marginTop: 2 }}>
                  {pickLocale(item.subtitle)}
                </Text>
              </View>
            </View>
          )}
        />
        <View style={styles.heroDots}>
          {HERO_BANNERS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.heroDot,
                {
                  backgroundColor: i === heroIndex ? palette.navy900 : palette.navy200,
                  width: i === heroIndex ? 20 : 6,
                },
              ]}
            />
          ))}
        </View>

        {/* Categories */}
        <SectionHeader title={i18n.t('home.categoriesTitle')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map((c) => (
            <PressableScale
              key={c.id}
              onPress={() => navigation.navigate('Search')}
              style={styles.categoryItem}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={c.icon as any} size={22} color={palette.navy900} />
              </View>
              <Text variant="caption" weight="500" align="center" style={{ marginTop: spacing.s1 }}>
                {pickLocale(c.name)}
              </Text>
            </PressableScale>
          ))}
        </ScrollView>

        {/* Featured vendors */}
        <SectionHeader title={i18n.t('home.featuredTitle')} actionLabel={i18n.t('home.viewAll')} onAction={() => navigation.navigate('Search')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredRow}
        >
          {featured.map((v) => (
            <FeaturedCard
              key={v.id}
              vendor={v}
              onPress={() => navigation.navigate('VendorProfile', { vendorId: v.id })}
            />
          ))}
        </ScrollView>

        {/* Nearby */}
        <SectionHeader title={i18n.t('home.nearbyTitle')} />
        <View style={styles.nearbyList}>
          {nearby.map((v) => (
            <NearbyRow
              key={v.id}
              vendor={v}
              onPress={() => navigation.navigate('VendorProfile', { vendorId: v.id })}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const SectionHeader: React.FC<{ title: string; actionLabel?: string; onAction?: () => void }> = ({
  title,
  actionLabel,
  onAction,
}) => (
  <View style={styles.sectionHeader}>
    <Text variant="sectionTitle" weight="600">
      {title}
    </Text>
    {actionLabel && (
      <Pressable hitSlop={8} onPress={onAction}>
        <Text variant="label" weight="600" color={palette.navy500}>
          {actionLabel}
        </Text>
      </Pressable>
    )}
  </View>
);

const FeaturedCard: React.FC<{ vendor: Vendor; onPress: () => void }> = ({ vendor, onPress }) => (
  <PressableScale onPress={onPress} style={styles.featuredCard}>
    <View style={styles.featuredImageWrap}>
      <Image source={{ uri: vendor.coverImage }} style={styles.featuredImage} contentFit="cover" transition={200} />
      <View style={styles.featuredFreshPill}>
        <FreshDataPill updatedAt={vendor.updatedAt} />
      </View>
    </View>
    <View style={styles.featuredBody}>
      <Text variant="cardTitle" weight="600" numberOfLines={1}>
        {pickLocale(vendor.name)}
      </Text>
      <View style={styles.featuredMetaRow}>
        <RatingDots value={vendor.rating} reviewCount={vendor.reviewCount} size={12} />
      </View>
    </View>
  </PressableScale>
);

const NearbyRow: React.FC<{ vendor: Vendor; onPress: () => void }> = ({ vendor, onPress }) => (
  <Card onPress={onPress} style={styles.nearbyCard} padding="sm">
    <View style={styles.nearbyRow}>
      <Avatar source={vendor.logoImage} name={pickLocale(vendor.name)} size={56} />
      <View style={styles.nearbyBody}>
        <Text variant="cardTitle" weight="600" numberOfLines={1}>
          {pickLocale(vendor.name)}
        </Text>
        {vendor.address && (
          <Text variant="caption" color={palette.neutral500} numberOfLines={1} style={{ marginTop: 2 }}>
            {pickLocale(vendor.address)}
          </Text>
        )}
        <View style={styles.nearbyMeta}>
          <RatingDots value={vendor.rating} reviewCount={vendor.reviewCount} size={12} />
          <View style={{ width: spacing.s3 }} />
          <FreshDataPill updatedAt={vendor.updatedAt} />
        </View>
      </View>
      <Ionicons
        name={rtl() ? 'chevron-back' : 'chevron-forward'}
        size={18}
        color={palette.navy300}
      />
    </View>
  </Card>
);

const styles = StyleSheet.create({
  scroll: { paddingBottom: 120 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s2,
    paddingBottom: spacing.s3,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle(1),
  },
  searchBar: {
    marginHorizontal: spacing.s5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s4,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: semantic.border,
    ...shadowStyle(1),
  },
  searchHint: { marginStart: spacing.s2 },
  heroCard: {
    height: HERO_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.navy100,
    marginEnd: spacing.s3,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.s4,
    left: spacing.s4,
    right: spacing.s4,
  },
  heroDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.s3,
  },
  heroDot: { height: 6, marginHorizontal: 3, borderRadius: radius.full },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.s5,
    marginBottom: spacing.s3,
    paddingHorizontal: spacing.s5,
  },
  categoriesRow: {
    paddingHorizontal: spacing.s5,
  },
  categoryItem: {
    alignItems: 'center',
    marginEnd: spacing.s4,
    width: 64,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle(1),
  },
  featuredRow: {
    paddingHorizontal: spacing.s5,
  },
  featuredCard: {
    width: 220,
    marginEnd: spacing.s3,
    borderRadius: radius.lg,
    backgroundColor: palette.white,
    overflow: 'hidden',
    ...shadowStyle(1),
  },
  featuredImageWrap: { width: '100%', height: 130, backgroundColor: palette.navy100 },
  featuredImage: { width: '100%', height: '100%' },
  featuredFreshPill: {
    position: 'absolute',
    top: spacing.s2,
    start: spacing.s2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: spacing.s2,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  featuredBody: { padding: spacing.s3 },
  featuredMetaRow: {
    marginTop: spacing.s1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyList: {
    paddingHorizontal: spacing.s5,
  },
  nearbyCard: {
    marginBottom: spacing.s3,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyBody: {
    flex: 1,
    paddingStart: spacing.s3,
    paddingEnd: spacing.s2,
  },
  nearbyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s1,
  },
});
