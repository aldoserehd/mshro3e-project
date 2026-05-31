import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import PressableScale from '../../ui/PressableScale';
import { palette, radius, semantic, shadowStyle, spacing } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import { useThemeStore, type ThemeMode } from '../../stores/theme';
import { seedFirestore } from '../../lib/seed-firestore';
import type { RootStackScreenProps } from '../../navigation/types';

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
};

const Row: React.FC<RowProps> = ({ icon, label, description, trailing, onPress }) => (
  <PressableScale onPress={onPress}>
    <Card style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={palette.navy700} />
      </View>
      <View style={{ flex: 1, marginStart: spacing.s3 }}>
        <Text variant="body" weight="600">{label}</Text>
        {description && (
          <Text variant="caption" color={palette.neutral500}>{description}</Text>
        )}
      </View>
      {trailing}
    </Card>
  </PressableScale>
);

export default function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const { locale, setLocale } = useLocaleStore();
  const [seeding, setSeeding] = useState(false);

  const onSeed = async () => {
    if (seeding) return;
    setSeeding(true);
    try {
      const res = await seedFirestore();
      if (res.ok) {
        const counts = res.counts;
        const msg = res.alreadySeeded
          ? locale === 'ar'
            ? 'البيانات موجودة مسبقاً.'
            : 'Already seeded.'
          : locale === 'ar'
            ? `تم: ${counts.categories} تصنيف، ${counts.vendors} بائع، ${counts.products} منتج، ${counts.reviews} مراجعة.`
            : `Done: ${counts.categories} categories, ${counts.vendors} vendors, ${counts.products} products, ${counts.reviews} reviews.`;
        Alert.alert(locale === 'ar' ? 'تم التحميل' : 'Seed complete', msg);
      } else {
        Alert.alert(
          locale === 'ar' ? 'فشل التحميل' : 'Seed failed',
          res.error ?? 'Unknown error',
        );
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      Alert.alert(locale === 'ar' ? 'فشل التحميل' : 'Seed failed', message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Screen>
      {/* Custom top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={26} color={palette.neutral900} />
        </Pressable>
        <Text variant="cardTitle" weight="700">{useLocaleStore.getState().locale === 'ar' ? 'الإعدادات' : 'Settings'}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Language section */}
        <Text variant="microcopy" color={palette.neutral500} style={styles.sectionLabel}>
          اللغة / LANGUAGE
        </Text>
        <Card style={styles.langCard}>
          {(['ar', 'en'] as const).map((k, i) => (
            <Pressable
              key={k}
              onPress={() => setLocale(k)}
              style={[styles.langRow, i > 0 && styles.langRowBorder]}
            >
              <View style={styles.langDot}>
                {locale === k && <View style={styles.langDotInner} />}
              </View>
              <Text variant="body" weight="600" style={{ flex: 1, marginStart: spacing.s3 }}>
                {k === 'ar' ? 'العربية' : 'English'}
              </Text>
            </Pressable>
          ))}
        </Card>

        {/* Theme section */}
        <Text variant="microcopy" color={palette.neutral500} style={styles.sectionLabel}>
          {locale === 'ar' ? 'المظهر / THEME' : 'THEME'}
        </Text>
        <ThemePicker locale={locale} />

        {/* App section */}
        <Text variant="microcopy" color={palette.neutral500} style={styles.sectionLabel}>
          {locale === 'ar' ? 'التطبيق' : 'APP'}
        </Text>
        <View style={{ gap: spacing.s2 }}>
          <Row icon="notifications-outline"      label={locale === 'ar' ? 'الإشعارات' : 'Notifications'} />
          <Row icon="information-circle-outline" label={locale === 'ar' ? 'عن مشروعي' : 'About Mshro3e'} />
          <Row icon="help-circle-outline"        label={locale === 'ar' ? 'المساعدة والدعم' : 'Help & support'} />
          <Row icon="shield-checkmark-outline"   label={locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy policy'} />
        </View>

        {/* Payments — info-only since we don't process */}
        <Text variant="microcopy" color={palette.neutral500} style={styles.sectionLabel}>
          {locale === 'ar' ? 'الدفع' : 'PAYMENTS'}
        </Text>
        <Card style={{ padding: spacing.s4, gap: spacing.s2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s2 }}>
            <View style={[styles.rowIcon, { backgroundColor: '#E8F3EC' }]}>
              <Ionicons name="information-circle" size={18} color="#2E7D45" />
            </View>
            <Text variant="body" weight="600" style={{ flex: 1 }}>
              {locale === 'ar' ? 'لا نتعامل مع الدفع أو التوصيل' : "We don't handle payment or delivery"}
            </Text>
          </View>
          <Text variant="caption" color={palette.neutral500}>
            {locale === 'ar'
              ? 'مشروعي يعرض المنتجات فقط. تتم الترتيبات المالية مع البائع مباشرة عبر واتساب أو KNET الخاص بالبائع (للباقة Pro).'
              : 'Mshro3e only lists products. Payment and delivery are arranged directly with the vendor via WhatsApp, or the vendor\'s own KNET (Pro tier).'}
          </Text>
        </Card>

        {/* Dev-only Firestore seed button */}
        {__DEV__ && (
          <View style={{ marginTop: spacing.s4 }}>
            <Text variant="microcopy" color={palette.neutral500} style={styles.sectionLabel}>
              {locale === 'ar' ? 'تطوير' : 'DEV'}
            </Text>
            <Row
              icon="cloud-upload-outline"
              label={
                seeding
                  ? locale === 'ar'
                    ? 'جاري التحميل…'
                    : 'Seeding…'
                  : locale === 'ar'
                    ? 'تحميل البيانات (تطوير)'
                    : 'Seed Firestore (dev)'
              }
              description={
                locale === 'ar'
                  ? 'نسخ بيانات العرض إلى Firestore'
                  : 'Copy demo data to Firestore'
              }
              onPress={onSeed}
            />
          </View>
        )}

        {/* Upgrade banner */}
        <PressableScale>
          <View style={styles.banner}>
            <LinearGradient
              colors={[palette.navy800, palette.navy900]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.bannerIcon}>
              <Ionicons name="rocket-outline" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" color="#fff">
                {locale === 'ar' ? 'افتح متجرك على مشروعي' : 'Open your shop on Mshro3e'}
              </Text>
              <Text variant="caption" color={palette.navy300}>
                {locale === 'ar' ? '٩ د.ك / شهر — تسعير الكويت' : '9 KWD / month — Kuwait pricing'}
              </Text>
            </View>
            <Ionicons name="chevron-back" size={18} color={palette.navy300} style={{ transform: [{ scaleX: -1 }] }} />
          </View>
        </PressableScale>

        <Pressable style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color="#B91C1C" />
          <Text variant="button" color="#B91C1C" style={{ marginStart: spacing.s2 }}>
            {locale === 'ar' ? 'تسجيل الخروج' : 'Log out'}
          </Text>
        </Pressable>

        <Text variant="microcopy" color={palette.neutral500} align="center" style={{ marginTop: spacing.s4 }}>
          Mshro3e v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, paddingVertical: spacing.s4,
    borderBottomWidth: 1, borderBottomColor: palette.neutral200,
    backgroundColor: semantic.surface,
  },
  scroll: { padding: spacing.s5, paddingBottom: 80 },
  sectionLabel: { marginTop: spacing.s4, marginBottom: spacing.s2, letterSpacing: 1 },
  langCard: { padding: 0, overflow: 'hidden', marginBottom: spacing.s4 },
  langRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s4,
  },
  langRowBorder: { borderTopWidth: 1, borderTopColor: palette.neutral200 },
  langDot: {
    width: 22, height: 22, borderRadius: 999,
    borderWidth: 2, borderColor: palette.navy200,
    alignItems: 'center', justifyContent: 'center',
  },
  langDotInner: { width: 10, height: 10, borderRadius: 999, backgroundColor: palette.navy900 },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.s4 },
  rowIcon: {
    width: 36, height: 36, borderRadius: 999,
    backgroundColor: palette.navy100,
    alignItems: 'center', justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.s4,
    borderRadius: radius.xl,
    marginTop: spacing.s5,
    overflow: 'hidden',
    ...shadowStyle(2),
  },
  bannerIcon: {
    width: 44, height: 44, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FBE9E9',
    paddingVertical: spacing.s4,
    borderRadius: radius.md,
    marginTop: spacing.s5,
  },
  themeRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.s2,
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.navy100,
    borderRadius: radius.lg,
    padding: 4,
  },
  themeChip: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: spacing.s3,
    borderRadius: radius.md,
  },
  themeChipActive: { backgroundColor: palette.navy900 },
});

// ─── Theme picker (light / dark / system) ───
const ThemePicker: React.FC<{ locale: 'ar' | 'en' }> = ({ locale }) => {
  const { mode, setMode } = useThemeStore();
  const opts: { key: ThemeMode; icon: keyof typeof Ionicons.glyphMap; labelAr: string; labelEn: string }[] = [
    { key: 'light',  icon: 'sunny-outline',  labelAr: 'فاتح', labelEn: 'Light' },
    { key: 'dark',   icon: 'moon-outline',   labelAr: 'داكن', labelEn: 'Dark' },
    { key: 'system', icon: 'phone-portrait-outline', labelAr: 'الجهاز', labelEn: 'System' },
  ];
  return (
    <View style={styles.themeRow}>
      {opts.map((o) => {
        const on = mode === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => setMode(o.key)}
            style={[styles.themeChip, on && styles.themeChipActive]}
          >
            <Ionicons name={o.icon} size={16} color={on ? '#fff' : palette.navy900} />
            <Text variant="label" weight="600" color={on ? '#fff' : palette.navy900}>
              {locale === 'ar' ? o.labelAr : o.labelEn}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
