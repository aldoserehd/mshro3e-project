import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
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

// ── Generic segmented control ──
function Segmented<T extends string>({
  options, value, onChange,
}: { options: { key: T; label: string; icon?: keyof typeof Ionicons.glyphMap }[]; value: T; onChange: (k: T) => void }) {
  const c = useColors();
  return (
    <View style={[styles.segment, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
      {options.map((o) => {
        const on = value === o.key;
        return (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={[styles.segmentChip, on && { backgroundColor: c.brand }]}>
            {o.icon && <Ionicons name={o.icon} size={15} color={on ? '#fff' : c.text} style={{ marginEnd: 6 }} />}
            <Text variant="label" weight="600" color={on ? '#fff' : c.text}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Grouped link list ──
const LinkRow: React.FC<{
  icon: keyof typeof Ionicons.glyphMap; label: string; description?: string;
  onPress?: () => void; first?: boolean;
}> = ({ icon, label, description, onPress, first }) => {
  const c = useColors();
  return (
    <Pressable onPress={onPress} style={[styles.linkRow, !first && { borderTopWidth: 1, borderTopColor: c.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: c.brandFill }]}>
        <Ionicons name={icon} size={17} color={c.brandText} />
      </View>
      <View style={{ flex: 1, marginStart: spacing.s3 }}>
        <Text variant="body" weight="600">{label}</Text>
        {description && <Text variant="caption" color={c.textMuted}>{description}</Text>}
      </View>
      <Ionicons name="chevron-back" size={18} color={c.textMuted} style={{ transform: [{ scaleX: -1 }] }} />
    </Pressable>
  );
};

export default function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const { locale, setLocale } = useLocaleStore();
  const { mode, setMode } = useThemeStore();
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
        const k = res.counts;
        const msg = res.alreadySeeded
          ? ar ? 'البيانات موجودة مسبقاً.' : 'Already seeded.'
          : ar
            ? `تم: ${k.categories} تصنيف، ${k.vendors} بائع، ${k.products} منتج، ${k.reviews} مراجعة.`
            : `Done: ${k.categories} categories, ${k.vendors} vendors, ${k.products} products, ${k.reviews} reviews.`;
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

  const SectionLabel = ({ children }: { children: string }) => (
    <Text variant="microcopy" weight="700" color={c.textMuted} style={styles.sectionLabel}>{children}</Text>
  );

  return (
    <Screen>
      <View style={[styles.topBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.iconBtn, { backgroundColor: c.surfaceAlt }]}>
          <Ionicons name="chevron-back" size={20} color={c.text} style={{ transform: [{ scaleX: -1 }] }} />
        </Pressable>
        <Text variant="cardTitle" weight="700">{ar ? 'الإعدادات' : 'Settings'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <SectionLabel>{ar ? 'المظهر واللغة' : 'APPEARANCE & LANGUAGE'}</SectionLabel>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={styles.controlRow}>
            <Text variant="body" weight="600">{ar ? 'اللغة' : 'Language'}</Text>
            <Segmented
              value={locale}
              onChange={setLocale}
              options={[{ key: 'ar', label: 'عربي' }, { key: 'en', label: 'EN' }]}
            />
          </View>
          <View style={[styles.controlRow, { borderTopWidth: 1, borderTopColor: c.border }]}>
            <Text variant="body" weight="600">{ar ? 'الثيم' : 'Theme'}</Text>
            <Segmented
              value={mode}
              onChange={(m: ThemeMode) => setMode(m)}
              options={[
                { key: 'light', label: ar ? 'فاتح' : 'Light', icon: 'sunny-outline' },
                { key: 'dark', label: ar ? 'داكن' : 'Dark', icon: 'moon-outline' },
                { key: 'system', label: ar ? 'الجهاز' : 'Auto', icon: 'phone-portrait-outline' },
              ]}
            />
          </View>
        </View>

        {/* App links */}
        <SectionLabel>{ar ? 'التطبيق' : 'APP'}</SectionLabel>
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
          <LinkRow first icon="notifications-outline" label={ar ? 'الإشعارات' : 'Notifications'} onPress={() => navigation.navigate('Notifications')} />
          <LinkRow icon="information-circle-outline" label={ar ? 'عن مشروعي' : 'About Mshro3e'} onPress={() => navigation.navigate('Info', { topic: 'about' })} />
          <LinkRow icon="help-circle-outline" label={ar ? 'المساعدة والدعم' : 'Help & support'} onPress={() => navigation.navigate('Info', { topic: 'help' })} />
          <LinkRow icon="shield-checkmark-outline" label={ar ? 'سياسة الخصوصية' : 'Privacy policy'} onPress={() => navigation.navigate('Info', { topic: 'privacy' })} />
        </View>

        {/* Payments note */}
        <View style={[styles.note, { backgroundColor: c.isDark ? 'rgba(37,211,102,0.10)' : '#EEF8F1', borderColor: c.isDark ? 'rgba(37,211,102,0.25)' : '#CDEAD7' }]}>
          <Ionicons name="shield-checkmark" size={18} color={c.whatsappDark} style={{ marginTop: 1 }} />
          <View style={{ flex: 1, marginStart: spacing.s2 }}>
            <Text variant="label" weight="700">{ar ? 'لا نتعامل مع الدفع أو التوصيل' : "We don't handle payment or delivery"}</Text>
            <Text variant="caption" color={c.textMuted} style={{ marginTop: 2 }}>
              {ar ? 'الترتيبات تتم مع البائع مباشرة عبر واتساب.' : 'Arrangements happen directly with the vendor via WhatsApp.'}
            </Text>
          </View>
        </View>

        {/* Dev */}
        {__DEV__ && (
          <>
            <SectionLabel>{ar ? 'تطوير' : 'DEVELOPER'}</SectionLabel>
            <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
              <LinkRow
                first
                icon="cloud-upload-outline"
                label={seeding ? (ar ? 'جاري التحميل…' : 'Seeding…') : (ar ? 'تحميل بيانات تجريبية' : 'Seed Firestore')}
                description={ar ? 'نسخ بيانات العرض إلى Firestore' : 'Copy demo data to Firestore'}
                onPress={onSeed}
              />
            </View>
          </>
        )}

        {/* Vendor CTA */}
        <PressableScale onPress={() => setVendorCtaOpen(true)}>
          <View style={styles.banner}>
            <LinearGradient colors={['#2a4686', '#001a41']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.bannerIcon}><Ionicons name="storefront-outline" size={20} color="#fff" /></View>
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" weight="700" color="#fff">{ar ? 'اعرض مشروعك على مشروعي' : 'List your business on Mshro3e'}</Text>
              <Text variant="caption" color="#9db7ff">{ar ? 'اشتراك شهر أو ٣ أشهر — التسجيل على الموقع' : '1 or 3-month plans — sign up on the site'}</Text>
            </View>
            <Ionicons name="chevron-back" size={18} color="#9db7ff" style={{ transform: [{ scaleX: -1 }] }} />
          </View>
        </PressableScale>

        <Pressable style={[styles.logoutBtn, { backgroundColor: c.isDark ? 'rgba(255,107,107,0.12)' : '#FBE9E9' }]} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color={c.danger} />
          <Text variant="button" weight="600" color={c.danger} style={{ marginStart: spacing.s2 }}>{ar ? 'تسجيل الخروج' : 'Log out'}</Text>
        </Pressable>

        <Text variant="microcopy" color={c.textMuted} align="center" style={{ marginTop: spacing.s4 }}>Mshro3e v1.0.0</Text>
      </ScrollView>

      <VendorCtaSheet visible={vendorCtaOpen} onClose={() => setVendorCtaOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3, borderBottomWidth: 1,
  },
  iconBtn: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.s5, paddingBottom: 80 },
  sectionLabel: { marginTop: spacing.s5, marginBottom: spacing.s2, marginStart: spacing.s1, letterSpacing: 1 },
  card: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  controlRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3, gap: spacing.s3,
  },
  segment: { flexDirection: 'row', borderRadius: 999, borderWidth: 1, padding: 3 },
  segmentChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s3, paddingVertical: 7, borderRadius: 999 },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s4, paddingVertical: spacing.s3 },
  rowIcon: { width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  note: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: spacing.s5, padding: spacing.s4, borderRadius: radius.lg, borderWidth: 1,
  },
  banner: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.s4,
    borderRadius: radius.xl, marginTop: spacing.s5, overflow: 'hidden', ...shadowStyle(2),
  },
  bannerIcon: { width: 44, height: 44, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.s4, borderRadius: radius.md, marginTop: spacing.s5 },
});
