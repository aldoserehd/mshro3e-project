import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteUser, signOut } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import { OptionCard, Row, RowGroup, SectionCard, TopBar } from '../../ui/SettingsKit';
import { spacing, radius } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { useLocaleStore } from '../../stores/locale';
import { useThemeStore, type ThemeMode } from '../../stores/theme';
import { usePrefsStore, type NotifPrefs } from '../../stores/prefs';
import { useUserStore } from '../../stores/user';
import { firebaseAuth, firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import { seedFirestore } from '../../lib/seed-firestore';
import { BRAND } from '../../brand';
import type { RootStackScreenProps } from '../../navigation/types';

export default function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const { locale, setLocale } = useLocaleStore();
  const { mode, setMode } = useThemeStore();
  const prefs = usePrefsStore();
  const user = useUserStore((s) => s.user);
  const c = useColors();
  const [seeding, setSeeding] = useState(false);
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
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
          },
        },
      ],
    );
  };

  /** In-app account deletion (App Store requirement). */
  const onDeleteAccount = () => {
    Alert.alert(
      ar ? 'حذف الحساب نهائياً' : 'Delete account permanently',
      ar
        ? 'بيتم حذف حسابك وبياناتك نهائياً. هذا الإجراء لا يمكن التراجع عنه.'
        : 'Your account and data will be permanently deleted. This cannot be undone.',
      [
        { text: ar ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: ar ? 'حذف نهائي' : 'Delete', style: 'destructive',
          onPress: async () => {
            const fbUser = firebaseAuth().currentUser;
            if (!fbUser) return;
            try {
              await deleteDoc(doc(firebaseDb(), COL.users, fbUser.uid)).catch(() => {});
              await deleteUser(fbUser);
              useUserStore.getState().signOut();
              navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
              Alert.alert(ar ? 'تم حذف الحساب' : 'Account deleted');
            } catch (e) {
              const code = (e as { code?: string }).code;
              Alert.alert(
                ar ? 'تعذّر الحذف' : 'Could not delete',
                code === 'auth/requires-recent-login'
                  ? ar
                    ? 'لأمانك، سجّل دخولك من جديد ثم أعد المحاولة.'
                    : 'For your security, sign in again and retry.'
                  : ar ? 'حاول مرة أخرى.' : 'Try again.',
              );
            }
          },
        },
      ],
    );
  };

  const NOTIF_ROWS: { key: keyof NotifPrefs; label: string; sub: string }[] = [
    {
      key: 'orderUpdates',
      label: ar ? 'تحديثات الطلبات' : 'Order updates',
      sub: ar ? 'تنبيهات فورية عن طلباتك' : 'Real-time alerts for your orders',
    },
    {
      key: 'promos',
      label: ar ? 'العروض والخصومات' : 'Promotions & discounts',
      sub: ar ? 'عروض موسمية من المشاريع الكويتية' : 'Seasonal deals from Kuwaiti creators',
    },
    {
      key: 'vendorAlerts',
      label: ar ? 'تنبيهات المحلات' : 'Vendor alerts',
      sub: ar ? 'لما محلاتك المفضلة تنزل جديد' : 'When your favorite shops launch new items',
    },
  ];

  return (
    <Screen>
      <TopBar title={ar ? 'الإعدادات' : 'Settings'} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Language ── */}
        <SectionCard icon="language-outline" title={ar ? 'اللغة' : 'Language'}>
          <View style={styles.optionRow}>
            <OptionCard label="العربية (الكويت)" selected={locale === 'ar'} onPress={() => setLocale('ar')} />
            <OptionCard label="English" selected={locale === 'en'} onPress={() => setLocale('en')} />
          </View>
        </SectionCard>

        {/* ── Theme ── */}
        <SectionCard icon="color-palette-outline" title={ar ? 'المظهر' : 'Display'} style={{ marginTop: spacing.s4 }}>
          <View style={styles.optionRow}>
            {([
              { key: 'light' as ThemeMode, label: ar ? 'فاتح' : 'Light' },
              { key: 'dark' as ThemeMode, label: ar ? 'داكن' : 'Dark' },
              { key: 'system' as ThemeMode, label: ar ? 'تلقائي' : 'Auto' },
            ]).map((o) => (
              <OptionCard key={o.key} label={o.label} selected={mode === o.key} onPress={() => setMode(o.key)} />
            ))}
          </View>
        </SectionCard>

        {/* ── Notifications ── */}
        <SectionCard icon="notifications-outline" title={ar ? 'الإشعارات' : 'Notifications'} style={{ marginTop: spacing.s4 }}>
          {NOTIF_ROWS.map((row, i) => (
            <View
              key={row.key}
              style={[styles.toggleRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}
            >
              <View style={{ flex: 1, marginEnd: spacing.s3 }}>
                <Text variant="body" weight="600">{row.label}</Text>
                <Text variant="caption" color={c.textMuted}>{row.sub}</Text>
              </View>
              <Switch
                value={prefs[row.key]}
                onValueChange={(v) => prefs.setPref(row.key, v)}
                trackColor={{ false: c.borderStrong, true: c.brand }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </SectionCard>

        {/* ── Support ── */}
        <RowGroup title={ar ? 'الدعم' : 'SUPPORT'} style={{ marginTop: spacing.s4 }}>
          <Row first icon="help-buoy-outline" label={ar ? 'المساعدة والدعم' : 'Help & support'} onPress={() => navigation.navigate('Info', { topic: 'help' })} />
          <Row icon="shield-checkmark-outline" label={ar ? 'سياسة الخصوصية' : 'Privacy policy'} onPress={() => navigation.navigate('Info', { topic: 'privacy' })} />
          <Row icon="information-circle-outline" label={ar ? `عن ${BRAND.ar}` : `About ${BRAND.en}`} onPress={() => navigation.navigate('Info', { topic: 'about' })} />
        </RowGroup>

        {/* ── Trust note ── */}
        <View style={[styles.note, { backgroundColor: c.whatsappFill, borderColor: c.isDark ? 'rgba(37,211,102,0.25)' : '#CDEAD7' }]}>
          <Ionicons name="shield-checkmark" size={18} color={c.whatsappDark} style={{ marginTop: 1 }} />
          <View style={{ flex: 1, marginStart: spacing.s2 }}>
            <Text variant="label" weight="700">
              {ar ? 'لا نتعامل مع الدفع أو التوصيل' : "We don't handle payment or delivery"}
            </Text>
            <Text variant="caption" color={c.textMuted} style={{ marginTop: 2 }}>
              {ar ? 'الترتيبات تتم مع البائع مباشرة عبر واتساب.' : 'Arrangements happen directly with the vendor via WhatsApp.'}
            </Text>
          </View>
        </View>

        {/* ── Developer ── */}
        {__DEV__ && (
          <RowGroup title={ar ? 'تطوير' : 'DEVELOPER'} style={{ marginTop: spacing.s4 }}>
            <Row
              first
              icon="cloud-upload-outline"
              label={seeding ? (ar ? 'جاري التحميل…' : 'Seeding…') : (ar ? 'تحميل بيانات تجريبية' : 'Seed Firestore')}
              sub={ar ? 'نسخ بيانات العرض إلى Firestore' : 'Copy demo data to Firestore'}
              onPress={onSeed}
            />
          </RowGroup>
        )}

        {/* ── Danger zone ── */}
        {user?.isAuthenticated && (
          <View style={{ marginTop: spacing.s5, gap: spacing.s3 }}>
            <Pressable
              onPress={onLogout}
              style={[styles.dangerBtn, { borderColor: c.isDark ? 'rgba(255,107,107,0.35)' : 'rgba(186,26,26,0.25)' }]}
            >
              <Ionicons name="log-out-outline" size={19} color={c.danger} />
              <Text variant="button" weight="700" color={c.danger}>{ar ? 'تسجيل الخروج' : 'Log out'}</Text>
            </Pressable>
            <Pressable onPress={onDeleteAccount} hitSlop={8} style={{ alignSelf: 'center', padding: spacing.s2 }}>
              <Text variant="label" weight="600" color={c.danger} style={{ textDecorationLine: 'underline' }}>
                {ar ? 'حذف الحساب نهائياً' : 'Delete account permanently'}
              </Text>
            </Pressable>
          </View>
        )}

        <Text variant="microcopy" color={c.textMuted} align="center" style={{ marginTop: spacing.s5, letterSpacing: 1 }}>
          {BRAND.en.toUpperCase()} {BRAND.version}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.s5, paddingBottom: 80 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s2 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s3,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.s4,
    padding: spacing.s4,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s2,
    borderWidth: 2,
    borderRadius: radius.lg,
    paddingVertical: spacing.s4,
  },
});
