import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import PressableScale from '../../ui/PressableScale';
import VendorCtaSheet from '../../ui/VendorCtaSheet';
import { radius, shadowStyle, spacing } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { useLocaleStore } from '../../stores/locale';
import { useThemeStore, type ThemeMode } from '../../stores/theme';
import { useUserStore } from '../../stores/user';
import { firebaseAuth } from '@shared/firebase';
import { seedFirestore } from '../../lib/seed-firestore';
import type { RootStackScreenProps } from '../../navigation/types';

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
};

const Row: React.FC<RowProps> = ({ icon, label, description, trailing, onPress }) => {
  const c = useColors();
  return (
    <PressableScale onPress={onPress}>
      <Card style={styles.row}>
        <View style={[styles.rowIcon, { backgroundColor: c.brandFill }]}>
          <Ionicons name={icon} size={18} color={c.brandText} />
        </View>
        <View style={{ flex: 1, marginStart: spacing.s3 }}>
          <Text variant="body" weight="600">{label}</Text>
          {description && <Text variant="caption" color={c.textMuted}>{description}</Text>}
        </View>
        {trailing}
      </Card>
    </PressableScale>
  );
};

export default function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const { locale, setLocale } = useLocaleStore();
  const c = useColors();
  const [seeding, setSeeding] = useState(false);
  const [vendorCtaOpen, setVendorCtaOpen] = useState(false);
  const ar = locale === 'ar';

  const onSeed = async () => {
    if (seeding) return;
    setSeeding(true);
    try {
      const res = await seedFirestore();
      if (res.ok) {
        const counts = res.counts;
        const msg = res.alreadySeeded
          ? ar ? 'البيانات موجودة مسبقاً.' : 'Already seeded.'
          : ar
            ? `تم: ${counts.categories} تصنيف، ${counts.vendors} بائع، ${counts.products} منتج، ${counts.reviews} مراجعة.`
            : `Done: ${counts.categories} categories, ${counts.vendors} vendors, ${counts.products} products, ${counts.reviews} reviews.`;
        Alert.alert(ar ? 'تم التحميل' : 'Seed complete', msg);
      } else {
        Alert.alert(ar ? 'فشل التحميل' : 'Seed failed', res.error ?? 'Unknown error');
      }
    } catch (e) {
      Alert.alert(ar ? 'فشل التحميل' : 'Seed failed', e instanceof Error ? e.message : String(e));
    } finally {
      setSeeding(false);
    }
  };

  const onLogout = () => {
    Alert.alert(
      ar ? 'تسجيل الخروج' : 'Log out',
      ar ? 'هل تريد تسجيل الخروج من حسابك؟' : 'Are you sure you want to log out?',
      [
        { text: ar ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: ar ? 'تسجيل الخروج' : 'Log out', style: 'destructive',
          onPress: async () => {
            try { await signOut(firebaseAuth()); } catch { /* fall through */ }
            useUserStore.getState().signOut();
            navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={[styles.topBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name="close" size={26} color={c.text} />
        </Pressable>
        <Text variant="cardTitle" weight="700">{ar ? 'الإعدادات' : 'Settings'}</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Language */}
        <Text variant="microcopy" color={c.textMuted} style={styles.sectionLabel}>{ar ? 'اللغة' : 'LANGUAGE'}</Text>
        <Card style={styles.langCard} padding="none">
          {(['ar', 'en'] as const).map((k, i) => (
            <Pressable key={k} onPress={() => setLocale(k)} style={[styles.langRow, i > 0 && { borderTopWidth: 1, borderTopColor: c.border }]}>
              <View style={[styles.langDot, { borderColor: locale === k ? c.brand : c.borderStrong }]}>
                {locale === k && <View style={[styles.langDotInner, { backgroundColor: c.brand }]} />}
              </View>
              <Text variant="body" weight="600" style={{ flex: 1, marginStart: spacing.s3 }}>{k === 'ar' ? 'العربية' : 'English'}</Text>
            </Pressable>
          ))}
        </Card>

        {/* Theme */}
        <Text variant="microcopy" color={c.textMuted} style={styles.sectionLabel}>{ar ? 'المظهر' : 'THEME'}</Text>
        <ThemePicker locale={locale} />

        {/* App */}
        <Text variant="microcopy" color={c.textMuted} style={styles.sectionLabel}>{ar ? 'التطبيق' : 'APP'}</Text>
        <View style={{ gap: spacing.s2 }}>
          <Row icon="notifications-outline" label={ar ? 'الإشعارات' : 'Notifications'} onPress={() => navigation.navigate('Notifications')} />
          <Row icon="information-circle-outline" label={ar ? 'عن مشروعي' : 'About Mshro3e'} onPress={() => navigation.navigate('Info', { topic: 'about' })} />
          <Row icon="help-circle-outline" label={ar ? 'المساعدة والدعم' : 'Help & support'} onPress={() => navigation.navigate('Info', { topic: 'help' })} />
          <Row icon="shield-checkmark-outline" label={ar ? 'سياسة الخصوصية' : 'Privacy policy'} onPress={() => navigation.navigate('Info', { topic: 'privacy' })} />
        </View>

        {/* Payments — info only */}
        <Text variant="microcopy" color={c.textMuted} style={styles.sectionLabel}>{ar ? 'الدفع' : 'PAYMENTS'}</Text>
        <Card style={{ padding: spacing.s4, gap: spacing.s2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s2 }}>
            <View style={[styles.rowIcon, { backgroundColor: c.isDark ? 'rgba(37,211,102,0.16)' : '#E8F3EC' }]}>
              <Ionicons name="information-circle" size={18} color={c.whatsappDark} />
            </View>
            <Text variant="body" weight="600" style={{ flex: 1 }}>{ar ? 'لا نتعامل مع الدفع أو التوصيل' : "We don't handle payment or delivery"}</Text>
          </View>
          <Text variant="caption" color={c.textMuted}>
            {ar
              ? 'مشروعي يعرض المنتجات فقط. تتم الترتيبات المالية مع البائع مباشرة عبر واتساب.'
              : 'Mshro3e only lists products. Payment and delivery are arranged directly with the vendor via WhatsApp.'}
          </Text>
        </Card>

        {/* Dev seed */}
        {__DEV__ && (
          <View style={{ marginTop: spacing.s4 }}>
            <Text variant="microcopy" color={c.textMuted} style={styles.sectionLabel}>{ar ? 'تطوير' : 'DEV'}</Text>
            <Row
              icon="cloud-upload-outline"
              label={seeding ? (ar ? 'جاري التحميل…' : 'Seeding…') : (ar ? 'تحميل البيانات (تطوير)' : 'Seed Firestore (dev)')}
              description={ar ? 'نسخ بيانات العرض إلى Firestore' : 'Copy demo data to Firestore'}
              onPress={onSeed}
            />
          </View>
        )}

        {/* Vendor CTA banner */}
        <PressableScale onPress={() => setVendorCtaOpen(true)}>
          <View style={styles.banner}>
            <LinearGradient colors={['#2a4686', '#001a41']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.bannerIcon}>
              <Ionicons name="storefront-outline" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" weight="700" color="#fff">{ar ? 'اعرض مشروعك على مشروعي' : 'List your business on Mshro3e'}</Text>
              <Text variant="caption" color="#9db7ff">{ar ? 'اشتراك شهر أو ٣ أشهر — التسجيل على الموقع' : '1 or 3-month plans — sign up on the site'}</Text>
            </View>
            <Ionicons name="chevron-back" size={18} color="#9db7ff" style={{ transform: [{ scaleX: -1 }] }} />
          </View>
        </PressableScale>

        <Pressable
          style={[styles.logoutBtn, { backgroundColor: c.isDark ? 'rgba(255,107,107,0.12)' : '#FBE9E9' }]}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={18} color={c.danger} />
          <Text variant="button" weight="600" color={c.danger} style={{ marginStart: spacing.s2 }}>{ar ? 'تسجيل الخروج' : 'Log out'}</Text>
        </Pressable>

        <Text variant="microcopy" color={c.textMuted} align="center" style={{ marginTop: spacing.s4 }}>Mshro3e v1.0.0</Text>
      </ScrollView>

      <VendorCtaSheet visible={vendorCtaOpen} onClose={() => setVendorCtaOpen(false)} />
    </Screen>
  );
}

const ThemePicker: React.FC<{ locale: 'ar' | 'en' }> = ({ locale }) => {
  const { mode, setMode } = useThemeStore();
  const c = useColors();
  const opts: { key: ThemeMode; icon: keyof typeof Ionicons.glyphMap; labelAr: string; labelEn: string }[] = [
    { key: 'light', icon: 'sunny-outline', labelAr: 'فاتح', labelEn: 'Light' },
    { key: 'dark', icon: 'moon-outline', labelAr: 'داكن', labelEn: 'Dark' },
    { key: 'system', icon: 'phone-portrait-outline', labelAr: 'الجهاز', labelEn: 'System' },
  ];
  return (
    <View style={[styles.themeRow, { backgroundColor: c.surface, borderColor: c.border }]}>
      {opts.map((o) => {
        const on = mode === o.key;
        return (
          <Pressable key={o.key} onPress={() => setMode(o.key)} style={[styles.themeChip, on && { backgroundColor: c.brand }]}>
            <Ionicons name={o.icon} size={16} color={on ? '#fff' : c.text} />
            <Text variant="label" weight="600" color={on ? '#fff' : c.text}>{locale === 'ar' ? o.labelAr : o.labelEn}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, paddingVertical: spacing.s4, borderBottomWidth: 1,
  },
  scroll: { padding: spacing.s5, paddingBottom: 80 },
  sectionLabel: { marginTop: spacing.s4, marginBottom: spacing.s2, letterSpacing: 1 },
  langCard: { overflow: 'hidden', marginBottom: spacing.s4 },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s4, paddingVertical: spacing.s4 },
  langDot: { width: 22, height: 22, borderRadius: 999, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  langDotInner: { width: 10, height: 10, borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.s4 },
  rowIcon: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  banner: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.s4,
    borderRadius: radius.xl, marginTop: spacing.s5, overflow: 'hidden', ...shadowStyle(2),
  },
  bannerIcon: { width: 44, height: 44, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.s4, borderRadius: radius.md, marginTop: spacing.s5 },
  themeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.s2, borderWidth: 1, borderRadius: radius.lg, padding: 4 },
  themeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: spacing.s3, borderRadius: radius.md },
});
