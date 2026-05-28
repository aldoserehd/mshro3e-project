import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import Avatar from '../../ui/Avatar';
import Card from '../../ui/Card';
import RatingDots from '../../ui/RatingDots';
import PressableScale from '../../ui/PressableScale';
import { useReviews, useService, useServices, useVendor } from '../../data/hooks';
import { palette, pickLocale, radius, rtl, semantic, shadowStyle, spacing } from '../../theme/ts';
import { RootStackScreenProps } from '../../navigation/types';

type Tab = 'about' | 'services' | 'reviews' | 'gallery';
const TABS: Tab[] = ['about', 'services', 'reviews', 'gallery'];

const HERO_H = 220;
const LOGO_SIZE = 72;

const AScrollView = Animated.ScrollView;

export default function VendorProfileScreen({ navigation, route }: RootStackScreenProps<'VendorProfile'>) {
  const { vendorId } = route.params;
  const { data: vendor } = useVendor(vendorId);
  const { data: services } = useServices(vendorId);
  const { data: reviews } = useReviews(vendorId);
  const [tab, setTab] = useState<Tab>('about');
  const scrollY = useSharedValue(0);
  const { width } = useWindowDimensions();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const coverStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [-150, 0, 200], [-75, 0, -100], 'clamp'),
      },
      {
        scale: interpolate(scrollY.value, [-150, 0], [1.3, 1], 'clamp'),
      },
    ],
  }));

  if (!vendor) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text>Not found</Text>
        </View>
      </Screen>
    );
  }

  const gallery = services.slice(0, 6).map((s) => s.images[0]).filter(Boolean);

  return (
    <Screen background={semantic.surface} statusBar="light">
      {/* Floating back/share */}
      <View style={styles.floatBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.floatBtn}
          hitSlop={8}
        >
          <Ionicons name={rtl() ? 'chevron-forward' : 'chevron-back'} size={20} color={palette.navy900} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable style={styles.floatBtn} hitSlop={8}>
          <Ionicons name="share-outline" size={18} color={palette.navy900} />
        </Pressable>
        <View style={{ width: spacing.s2 }} />
        <Pressable style={styles.floatBtn} hitSlop={8}>
          <Ionicons name="heart-outline" size={18} color={palette.navy900} />
        </Pressable>
      </View>

      <AScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
        <View style={[styles.coverContainer, { width }]}>
          <Animated.View style={[StyleSheet.absoluteFillObject, coverStyle]}>
            <Image
              source={{ uri: vendor.coverImage }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={['transparent', 'rgba(10,16,32,0.6)']}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </View>

        {/* Hero card body */}
        <View style={styles.heroBody}>
          <View style={styles.logoWrap}>
            <Avatar source={vendor.logoImage} name={pickLocale(vendor.name)} size={LOGO_SIZE} ring={4} />
          </View>
          <View style={styles.titleRow}>
            <Text variant="sectionTitle" weight="700" numberOfLines={1} style={{ flex: 1 }}>
              {pickLocale(vendor.name)}
            </Text>
            {vendor.verifiedAt && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={palette.navy500} />
                <Text variant="microcopy" color={palette.navy500} weight="500" style={{ marginStart: 4 }}>
                  {i18n.t('vendor.verified')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <RatingDots value={vendor.rating} reviewCount={vendor.reviewCount} size={14} />
            <View style={styles.dot} />
            <Text variant="label" color={palette.neutral500}>
              {i18n.t('vendor.distance', { n: '1.8' })}
            </Text>
            <View style={styles.dot} />
            <Text variant="label" color={palette.neutral500}>
              {i18n.t('vendor.responseTime', { n: 5 })}
            </Text>
          </View>
          <View style={styles.ctaRow}>
            <View style={{ flex: 1, marginEnd: spacing.s2 }}>
              <Button
                title={i18n.t('vendor.bookNow')}
                variant="primary"
                size="md"
                fullWidth
                onPress={() => {
                  const first = services[0];
                  if (first) navigation.navigate('ServiceDetail', { serviceId: first.id });
                }}
              />
            </View>
            <View style={{ flex: 1, marginStart: spacing.s2 }}>
              <Button title={i18n.t('vendor.contact')} variant="secondary" size="md" fullWidth icon="chatbubble-ellipses-outline" />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={styles.tabBtn}>
                <Text
                  variant="label"
                  weight={active ? '600' : '500'}
                  color={active ? palette.navy900 : palette.neutral500}
                >
                  {i18n.t(`vendor.tabs.${t}`)}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </Pressable>
            );
          })}
        </View>

        {/* Tab content */}
        <View style={styles.tabContent}>
          {tab === 'about' && vendor.bio && (
            <View>
              <Text variant="body" color={palette.neutral900} style={{ lineHeight: 26 }}>
                {pickLocale(vendor.bio)}
              </Text>
              <View style={styles.aboutSection}>
                <Text variant="cardTitle" weight="600">
                  {i18n.t('vendor.workingHours')}
                </Text>
                <View style={styles.hoursList}>
                  {Object.entries(vendor.workingHours).map(([day, slots]) => {
                    const first = slots?.[0];
                    if (!first) return null;
                    return (
                      <View key={day} style={styles.hoursRow}>
                        <Text variant="label" color={palette.neutral500}>
                          {dayName(parseInt(day, 10))}
                        </Text>
                        <Text variant="label" weight="500" forceLtr>
                          {first.open} — {first.close}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {tab === 'services' && (
            <View style={styles.servicesGrid}>
              {services.length === 0 ? (
                <Text variant="body" color={palette.neutral500} align="center">
                  {i18n.t('vendor.noServices')}
                </Text>
              ) : (
                services.map((s) => (
                  <PressableScale
                    key={s.id}
                    onPress={() => navigation.navigate('ServiceDetail', { serviceId: s.id })}
                    style={[styles.serviceTile, { width: (width - spacing.s5 * 2 - spacing.s3) / 2 }]}
                  >
                    <View style={styles.serviceImageWrap}>
                      <Image source={{ uri: s.images[0] }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={150} />
                    </View>
                    <View style={styles.serviceBody}>
                      <Text variant="label" weight="600" numberOfLines={2}>
                        {pickLocale(s.title)}
                      </Text>
                      <View style={styles.servicePriceRow}>
                        <Text variant="cardTitle" weight="700" forceLtr>
                          {s.price} ر.س
                        </Text>
                        <View style={styles.durationPill}>
                          <Text variant="microcopy" color={palette.navy900} weight="500" forceLtr>
                            {s.durationMinutes} د
                          </Text>
                        </View>
                      </View>
                    </View>
                  </PressableScale>
                ))
              )}
            </View>
          )}

          {tab === 'reviews' && (
            <View>
              {reviews.length === 0 ? (
                <Text variant="body" color={palette.neutral500} align="center">
                  {i18n.t('vendor.noReviews')}
                </Text>
              ) : (
                reviews.map((r) => (
                  <Card key={r.id} padding="md" style={{ marginBottom: spacing.s3 }}>
                    <View style={styles.reviewHead}>
                      <Avatar name="عميل" size={32} />
                      <View style={{ flex: 1, marginStart: spacing.s2 }}>
                        <Text variant="label" weight="600">
                          عميل #{r.id.slice(-3)}
                        </Text>
                        <RatingDots value={r.rating} size={11} showNumber={false} />
                      </View>
                      <Text variant="microcopy" color={palette.neutral500} forceLtr>
                        {Math.max(1, Math.round((Date.now() - r.createdAt) / 86400000))}d
                      </Text>
                    </View>
                    {r.comment && (
                      <Text variant="body" style={{ marginTop: spacing.s2 }}>
                        {r.comment}
                      </Text>
                    )}
                  </Card>
                ))
              )}
            </View>
          )}

          {tab === 'gallery' && (
            <View style={styles.gallery}>
              {gallery.map((g, i) => (
                <View key={i} style={[styles.galleryItem, { width: (width - spacing.s5 * 2 - spacing.s2 * 2) / 3 }]}>
                  <Image source={{ uri: g }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={150} />
                </View>
              ))}
            </View>
          )}
        </View>
      </AScrollView>
    </Screen>
  );
}

function dayName(d: number): string {
  const ar = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return rtl() ? ar[d] : en[d];
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  floatBar: {
    position: 'absolute',
    top: 8,
    start: spacing.s4,
    end: spacing.s4,
    flexDirection: 'row',
    zIndex: 10,
  },
  floatBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle(1),
  },
  coverContainer: {
    height: HERO_H,
    backgroundColor: palette.navy100,
    overflow: 'hidden',
  },
  heroBody: {
    backgroundColor: semantic.surface,
    marginTop: -spacing.s5,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.s5,
    paddingBottom: spacing.s4,
  },
  logoWrap: {
    marginTop: -(LOGO_SIZE / 2),
    alignSelf: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s3,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s2,
    paddingVertical: 4,
    backgroundColor: palette.navy100,
    borderRadius: radius.full,
    marginStart: spacing.s2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: palette.navy300,
    marginHorizontal: spacing.s2,
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: spacing.s4,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.s5,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border,
  },
  tabBtn: {
    paddingVertical: spacing.s3,
    marginEnd: spacing.s5,
    alignItems: 'center',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: palette.navy900,
    borderRadius: radius.full,
  },
  tabContent: {
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s4,
  },
  aboutSection: { marginTop: spacing.s5 },
  hoursList: { marginTop: spacing.s3 },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.s2,
    borderBottomWidth: 1,
    borderBottomColor: palette.navy100,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceTile: {
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    marginBottom: spacing.s3,
    overflow: 'hidden',
    ...shadowStyle(1),
  },
  serviceImageWrap: { width: '100%', aspectRatio: 1, backgroundColor: palette.navy100 },
  serviceBody: { padding: spacing.s3 },
  servicePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.s2,
  },
  durationPill: {
    paddingHorizontal: spacing.s2,
    paddingVertical: 2,
    backgroundColor: palette.navy100,
    borderRadius: radius.full,
  },
  reviewHead: { flexDirection: 'row', alignItems: 'center' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap' },
  galleryItem: {
    aspectRatio: 1,
    backgroundColor: palette.navy100,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginEnd: spacing.s2,
    marginBottom: spacing.s2,
  },
});
