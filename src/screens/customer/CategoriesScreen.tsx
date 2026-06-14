import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import PressableScale from '../../ui/PressableScale';
import { LoadingState } from '../../ui/EmptyState';
import { useCategories, useServices } from '../../data/hooks';
import { palette, radius, shadowStyle, spacing, pickLocale } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { useLocaleStore } from '../../stores/locale';
import { BRAND } from '../../brand';
import type { Category } from '@shared/types';
import type { MainTabsScreenProps } from '../../navigation/types';

type Sort = 'all' | 'popular' | 'new';

export default function CategoriesScreen({ navigation }: MainTabsScreenProps<'Search'>) {
  const { data: categories, loading: catsLoading } = useCategories();
  const { data: products } = useServices();
  const { locale } = useLocaleStore();
  const c = useColors();
  const isRtl = locale === 'ar';
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('all');

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of categories) m[c.id] = products.filter((p) => p.categoryIds.includes(c.id)).length;
    return m;
  }, [categories, products]);

  const filtered = useMemo(() => {
    let list = categories.slice();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) =>
        c.name.ar.toLowerCase().includes(q) || c.name.en.toLowerCase().includes(q),
      );
    }
    if (sort === 'popular') list.sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));
    else if (sort === 'new') list.sort((a, b) => b.order - a.order);
    else list.sort((a, b) => a.order - b.order);
    return list;
  }, [categories, query, sort, counts]);

  const tileWidth = (width - spacing.s5 * 2 - spacing.s3) / 2;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[palette.navy900, palette.navy800, palette.navy900]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Animated moving gradient sweep */}
          <SweepGlow />
          {/* Dot pattern */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({ length: 50 }).map((_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: (i * 41) % width,
                  top: ((i * 23) % 160) + 16,
                  width: 3, height: 3, borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                }}
              />
            ))}
          </View>

          <Animated.View entering={FadeIn.duration(400)} style={styles.heroBody}>
            <Text variant="caption" color={palette.navy300} weight="600" style={{ letterSpacing: 1 }}>
              {BRAND.en.toUpperCase()} · {locale === 'ar' ? 'سوق المشاريع' : 'MARKETPLACE'}
            </Text>
            <Text variant="hero" color="#fff" weight="700" style={{ fontSize: 28, lineHeight: 34, marginTop: 6 }}>
              {i18n.t('cats.title')}
            </Text>
            <Text variant="body" color={palette.navy300} style={{ marginTop: 4 }}>
              {i18n.t('cats.subtitle')}
            </Text>

            {/* Search bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={palette.neutral500} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={i18n.t('cats.searchPlaceholder')}
                placeholderTextColor={palette.neutral500}
                style={[styles.searchInput, { textAlign: isRtl ? 'right' : 'left' }]}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={palette.neutral500} />
                </Pressable>
              )}
            </View>
          </Animated.View>
        </View>

        {/* ── Sort pills ── */}
        <Animated.View entering={FadeInDown.delay(120).duration(360)} style={styles.sortRow}>
          {(['all', 'popular', 'new'] as Sort[]).map((s) => (
            <Pressable
              key={s}
              onPress={() => setSort(s)}
              style={[
                styles.sortChip,
                { backgroundColor: c.surface, borderColor: c.border },
                sort === s && { backgroundColor: c.brand, borderColor: c.brand },
              ]}
            >
              <Text variant="label" weight="600" color={sort === s ? '#fff' : c.text}>
                {i18n.t(`cats.sort${s.charAt(0).toUpperCase()}${s.slice(1)}`)}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* ── Category blocks grid ── */}
        {catsLoading && categories.length === 0 ? (
          <LoadingState
            label={locale === 'ar' ? 'جاري التحميل…' : 'Loading…'}
            style={{ paddingTop: spacing.s8 }}
          />
        ) : (
          <>
            <View style={styles.grid}>
              {filtered.map((cat) => (
                <CategoryBlock
                  key={cat.id}
                  category={cat}
                  count={counts[cat.id] ?? 0}
                  width={tileWidth}
                  onPress={() => navigation.navigate('Category', { categoryId: cat.id })}
                />
              ))}
            </View>

            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={48} color={c.textMuted} />
                <Text variant="body" color={c.textMuted} style={{ marginTop: spacing.s3 }}>
                  {query.trim()
                    ? (locale === 'ar' ? 'لا توجد تصنيفات مطابقة' : 'No matching categories')
                    : (locale === 'ar' ? 'لا توجد تصنيفات بعد' : 'No categories yet')}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

// ─── Animated moving gradient sweep across hero ───
const SweepGlow: React.FC = () => {
  const x = useSharedValue(-1);
  React.useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-1, { duration: 5500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [x]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 160 }],
  }));
  return (
    <Animated.View pointerEvents="none" style={[styles.sweep, style]}>
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

// ─── Category block tile ───
const CategoryBlock: React.FC<{
  category: Category;
  count: number;
  width: number;
  featured?: boolean;
  onPress: () => void;
}> = ({ category, count, width, onPress }) => {
  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.block, { width, marginBottom: spacing.s3 }]}>
        <LinearGradient
          colors={[palette.navy900, palette.navy800]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Subtle dot pattern */}
        <View style={styles.blockPattern} pointerEvents="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: ((i * 23) % width) | 0,
                top: ((i * 17) % 130) | 0,
                width: 3, height: 3, borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.10)',
              }}
            />
          ))}
        </View>
        <View style={styles.blockEmojiWrap}>
          <Text style={styles.blockEmoji}>{category.emoji ?? '🏷️'}</Text>
        </View>
        <View style={styles.blockBody}>
          <Text variant="cardTitle" color="#fff" weight="700" numberOfLines={1}>
            {pickLocale(category.name)}
          </Text>
          <Text variant="caption" color={palette.navy300}>
            {i18n.t('cats.productCount').replace('{n}', String(count))}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s5,
    paddingBottom: spacing.s5,
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
    overflow: 'hidden',
    minHeight: 220,
  },
  sweep: {
    position: 'absolute',
    top: -40, bottom: -40, width: 200,
    transform: [{ rotate: '12deg' }],
  },
  heroBody: { paddingTop: spacing.s2 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: radius.full,
    paddingHorizontal: spacing.s4,
    height: 48,
    gap: spacing.s2,
    marginTop: spacing.s4,
    ...shadowStyle(2),
  },
  searchInput: { flex: 1, fontSize: 14, color: palette.neutral900 },

  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s4,
    gap: spacing.s2,
  },
  sortChip: {
    paddingHorizontal: spacing.s4, height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.s5, paddingTop: spacing.s4,
    justifyContent: 'space-between',
  },

  block: {
    borderRadius: radius.xl,
    padding: spacing.s4,
    height: 144,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    ...shadowStyle(2),
  },
  blockPattern: { ...StyleSheet.absoluteFillObject },
  blockEmojiWrap: {
    position: 'absolute',
    top: spacing.s3, start: spacing.s3,
    width: 48, height: 48, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  blockEmoji: { fontSize: 24, lineHeight: 32, includeFontPadding: false, textAlign: 'center' },
  blockBody: { gap: 2 },

  empty: { padding: spacing.s7, alignItems: 'center', justifyContent: 'center' },
});
