import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Pill from '../../ui/Pill';
import Card from '../../ui/Card';
import Avatar from '../../ui/Avatar';
import RatingDots from '../../ui/RatingDots';
import FreshDataPill from '../../ui/FreshDataPill';
import { useCategories, useVendors } from '../../data/hooks';
import { font, palette, pickLocale, radius, rtl, semantic, shadowStyle, spacing } from '../../theme/ts';
import { MainTabsScreenProps } from '../../navigation/types';

type ViewMode = 'list' | 'map';

export default function SearchScreen({ navigation }: MainTabsScreenProps<'Search'>) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [openNow, setOpenNow] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [mode, setMode] = useState<ViewMode>('list');

  const { data: categories } = useCategories();
  const { data: vendors } = useVendors({ categoryId, query });

  const filtered = useMemo(() => {
    let list = vendors;
    if (topRated) list = list.filter((v) => v.rating >= 4.7);
    return list;
  }, [vendors, topRated]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="pageTitle" weight="700">
          {i18n.t('search.title')}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={palette.neutral500} />
        <TextInput
          style={[styles.input, font('body', false)]}
          placeholder={i18n.t('search.placeholder')}
          placeholderTextColor={palette.neutral500}
          value={query}
          onChangeText={setQuery}
          textAlign={rtl() ? 'right' : 'left'}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={palette.neutral500} />
          </Pressable>
        )}
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
        style={styles.pillsScroll}
      >
        <Pill
          label={i18n.t('search.filters.openNow')}
          active={openNow}
          onPress={() => setOpenNow((v) => !v)}
          onClose={openNow ? () => setOpenNow(false) : undefined}
          icon="time-outline"
        />
        <View style={styles.pillGap} />
        <Pill
          label={i18n.t('search.filters.rating')}
          active={topRated}
          onPress={() => setTopRated((v) => !v)}
          onClose={topRated ? () => setTopRated(false) : undefined}
          icon="star-outline"
        />
        {categories.map((c) => (
          <View key={c.id} style={{ flexDirection: 'row' }}>
            <View style={styles.pillGap} />
            <Pill
              label={pickLocale(c.name)}
              active={categoryId === c.id}
              onPress={() => setCategoryId((v) => (v === c.id ? undefined : c.id))}
              onClose={categoryId === c.id ? () => setCategoryId(undefined) : undefined}
            />
          </View>
        ))}
      </ScrollView>

      {/* List/Map toggle */}
      <View style={styles.modeToggleWrap}>
        <View style={styles.modeToggle}>
          {(['list', 'map'] as ViewMode[]).map((m) => {
            const active = mode === m;
            return (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={[styles.modeBtn, active && styles.modeBtnActive]}
              >
                <Ionicons
                  name={m === 'list' ? 'list' : 'map'}
                  size={14}
                  color={active ? palette.white : palette.navy900}
                />
                <Text
                  variant="label"
                  weight="600"
                  color={active ? palette.white : palette.navy900}
                  style={{ marginStart: spacing.s1 }}
                >
                  {i18n.t(`search.${m}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text variant="label" color={palette.neutral500}>
          {filtered.length}
        </Text>
      </View>

      {mode === 'list' ? (
        <FlatList
          data={filtered}
          keyExtractor={(v) => v.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card
              onPress={() => navigation.navigate('VendorProfile', { vendorId: item.id })}
              style={styles.resultCard}
              padding="sm"
            >
              <View style={styles.resultRow}>
                <Avatar source={item.logoImage} name={pickLocale(item.name)} size={60} />
                <View style={styles.resultBody}>
                  <Text variant="cardTitle" weight="600" numberOfLines={1}>
                    {pickLocale(item.name)}
                  </Text>
                  {item.address && (
                    <Text variant="caption" color={palette.neutral500} numberOfLines={1} style={{ marginTop: 2 }}>
                      {pickLocale(item.address)}
                    </Text>
                  )}
                  <View style={styles.resultMeta}>
                    <RatingDots value={item.rating} reviewCount={item.reviewCount} size={12} />
                    <View style={{ width: spacing.s3 }} />
                    <FreshDataPill updatedAt={item.updatedAt} />
                  </View>
                </View>
                <Ionicons
                  name={rtl() ? 'chevron-back' : 'chevron-forward'}
                  size={18}
                  color={palette.navy300}
                />
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search" size={32} color={palette.navy300} />
              <Text variant="body" color={palette.neutral500} align="center" style={{ marginTop: spacing.s3 }}>
                {i18n.t('search.empty')}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapGrid}>
            {filtered.slice(0, 6).map((v, i) => (
              <View
                key={v.id}
                style={[
                  styles.mapPin,
                  {
                    top: 40 + (i % 3) * 60,
                    start: 30 + Math.floor(i / 3) * 120 + (i % 2) * 30,
                  },
                ]}
              >
                <View style={styles.mapPinDot} />
              </View>
            ))}
          </View>
          <View style={styles.mapMessage}>
            <Ionicons name="map-outline" size={24} color={palette.navy500} />
            <Text variant="cardTitle" weight="600" align="center" style={{ marginTop: spacing.s2 }}>
              {i18n.t('search.mapPlaceholderTitle')}
            </Text>
            <Text
              variant="body"
              color={palette.neutral500}
              align="center"
              style={{ marginTop: spacing.s1, maxWidth: 260 }}
            >
              {i18n.t('search.mapPlaceholderBody')}
            </Text>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.s5, paddingTop: spacing.s2, paddingBottom: spacing.s3 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.s5,
    paddingHorizontal: spacing.s4,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: semantic.border,
  },
  input: {
    flex: 1,
    height: 48,
    marginStart: spacing.s2,
    color: semantic.text,
  },
  pillsScroll: { flexGrow: 0 },
  pillsRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s2 },
  pillGap: { width: spacing.s2 },
  modeToggleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s5,
    paddingVertical: spacing.s3,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: palette.navy100,
    borderRadius: radius.full,
    padding: 3,
  },
  modeBtn: {
    height: 28,
    paddingHorizontal: spacing.s3,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: palette.navy900 },
  listContent: { paddingHorizontal: spacing.s5, paddingBottom: 120 },
  resultCard: { marginBottom: spacing.s3 },
  resultRow: { flexDirection: 'row', alignItems: 'center' },
  resultBody: { flex: 1, paddingStart: spacing.s3, paddingEnd: spacing.s2 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.s1 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  mapPlaceholder: {
    flex: 1,
    marginHorizontal: spacing.s5,
    marginBottom: 100,
    borderRadius: radius.lg,
    backgroundColor: palette.navy50,
    borderWidth: 1,
    borderColor: semantic.borderStrong,
    overflow: 'hidden',
  },
  mapGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.5 },
  mapPin: { position: 'absolute', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  mapPinDot: { width: 14, height: 14, borderRadius: radius.full, backgroundColor: palette.navy900, ...shadowStyle(2) },
  mapMessage: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: spacing.s5 },
});
