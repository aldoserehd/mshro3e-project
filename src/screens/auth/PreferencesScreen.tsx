import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, updateDoc } from 'firebase/firestore';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import { palette, radius, semantic, spacing, pickLocale } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import { useUserStore } from '../../stores/user';
import { useCategories } from '../../data/hooks';
import { firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import type { RootStackScreenProps } from '../../navigation/types';

export default function PreferencesScreen({ navigation }: RootStackScreenProps<'Preferences'>) {
  const { locale } = useLocaleStore();
  const setPrefs = useUserStore((s) => s.setPreferredCategories);
  const uid = useUserStore((s) => s.user?.uid);
  const { data: categories } = useCategories();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const t = locale === 'ar'
    ? {
        title: 'اختر اهتماماتك',
        subtitle: 'سنخصّص لك ما يعجبك. اختر ٣ على الأقل.',
        skip: 'تخطّي',
        cta: 'متابعة',
        minHint: 'اختر {n} تصنيف على الأقل',
      }
    : {
        title: 'Pick what you love',
        subtitle: 'We will tailor your home feed. Pick at least 3.',
        skip: 'Skip',
        cta: 'Continue',
        minHint: 'Pick at least {n} category',
      };

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onContinue = async () => {
    if (saving) return;
    setSaving(true);
    const ids = Array.from(selected);
    setPrefs(ids);
    if (uid) {
      try {
        await updateDoc(doc(firebaseDb(), COL.users, uid), {
          preferredCategoryIds: ids,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[prefs] failed to persist preferredCategoryIds', e);
        // Non-fatal — continue to MainTabs so the user is not blocked.
      }
    }
    setSaving(false);
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const enough = selected.size >= 3;

  return (
    <Screen>
      <View style={styles.hero}>
        <LinearGradient colors={[palette.navy900, palette.navy800]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: 32 }).map((_, i) => (
            <View key={i} style={{
              position: 'absolute', left: (i * 37) % 360, top: (i * 23) % 160,
              width: 3, height: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)',
            }} />
          ))}
        </View>
        <View style={styles.headerRow}>
          <Pressable onPress={onContinue} hitSlop={8}>
            <Text variant="label" weight="600" color={palette.navy300}>{t.skip}</Text>
          </Pressable>
        </View>
        <Text variant="pageTitle" color="#fff" weight="700">{t.title}</Text>
        <Text variant="body" color={palette.navy300} style={{ marginTop: 4 }}>{t.subtitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((c) => {
            const on = selected.has(c.id);
            return (
              <Pressable
                key={c.id}
                onPress={() => toggle(c.id)}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={{ fontSize: 22, marginEnd: spacing.s2 }}>{c.emoji ?? '🏷️'}</Text>
                <Text variant="label" weight={on ? '700' : '500'} color={on ? '#fff' : palette.navy900}>
                  {pickLocale(c.name)}
                </Text>
                {on && (
                  <Ionicons name="checkmark" size={14} color="#fff" style={{ marginStart: spacing.s2 }} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!enough && (
          <Text variant="caption" color={palette.neutral500} align="center" style={{ marginBottom: spacing.s2 }}>
            {t.minHint.replace('{n}', String(3 - selected.size))}
          </Text>
        )}
        <Button title={t.cta} onPress={onContinue} disabled={!enough || saving} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.s5, paddingTop: spacing.s5, paddingBottom: spacing.s6,
    borderBottomStartRadius: radius.xl, borderBottomEndRadius: radius.xl,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: spacing.s4 },
  scroll: { padding: spacing.s5, paddingBottom: spacing.s8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s2 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.navy200,
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3,
    borderRadius: 999,
  },
  chipOn: { backgroundColor: palette.navy900, borderColor: palette.navy900 },
  footer: {
    padding: spacing.s5,
    backgroundColor: semantic.surface,
    borderTopWidth: 1, borderTopColor: palette.neutral200,
  },
});
