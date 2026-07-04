import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import { Row, RowGroup, SectionLabel, Segmented, TopBar, ROW_TINTS } from '../../ui/SettingsKit';
import { spacing, radius } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { useLocaleStore } from '../../stores/locale';
import { useThemeStore, type ThemeMode } from '../../stores/theme';
import { useUserStore } from '../../stores/user';
import { firebaseAuth } from '@shared/firebase';
import { seedFirestore } from '../../lib/seed-firestore';
import { BRAND } from '../../brand';
import type { RootStackScreenProps } from '../../navigation/types';

export default function SettingsScreen({ navigation }: RootStackScreenProps<'Settings'>) {
  const { locale, setLocale } = useLocaleStore();
  const { mode, setMode } = useThemeStore();
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

  return (
    <Screen>
      <TopBar title={ar ? 'الإعدادات' : 'Settings'} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Appearance & language ── */}
        <SectionLabel>{ar ? 'المظهر واللغة' : 'APPEARANCE & LANGUAGE'}</SectionLabel>
        <RowGroup>
          <Row
            first
            icon="language-outline"
            tint={ROW_TINTS.sky}
            label={ar ? 'اللغة' : 'Language'}
            trailing={
              <Segmented
                value={locale}
                onChange={setLocale}
                options={[{ key: 'ar', label: 'عربي' }, { key: 'en', label: 'EN' }]}
              />
            }
          />
          <Row
            icon="moon-outline"
            tint={ROW_TINTS.purple}
            label={ar ? 'المظهر' : 'Theme'}
            trailing={
              <Segmented
                value={mode}
                onChange={(m: ThemeMode) => setMode(m)}
                options={[
                  { key: 'light', label: ar ? 'فاتح' : 'Light' },
                  { key: 'dark', label: ar ? 'داكن' : 'Dark' },
                  { key: 'system', label: ar ? 'تلقائي' : 'Auto' },
                ]}
              />
            }
          />
        </RowGroup>

        {/* ── App ── */}
        <SectionLabel>{ar ? 'التطبيق' : 'APP'}</SectionLabel>
        <RowGroup>
          <Row
            first
            icon="notifications-outline"
            tint={ROW_TINTS.orange}
            label={ar ? 'الإشعارات' : 'Notifications'}
            onPress={() => navigation.navigate('Notifications')}
          />
          <Row
            icon="help-buoy-outline"
            tint={ROW_TINTS.green}
            label={ar ? 'المساعدة والدعم' : 'Help & support'}
            onPress={() => navigation.navigate('Info', { topic: 'help' })}
          />
          <Row
            icon="shield-checkmark-outline"
            tint={ROW_TINTS.teal}
            label={ar ? 'سياسة الخصوصية' : 'Privacy policy'}
            onPress={() => navigation.navigate('Info', { topic: 'privacy' })}
          />
          <Row
            icon="information-circle-outline"
            tint={ROW_TINTS.purple}
            label={ar ? `عن ${BRAND.ar}` : `About ${BRAND.en}`}
            onPress={() => navigation.navigate('Info', { topic: 'about' })}
          />
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
          <>
            <SectionLabel>{ar ? 'تطوير' : 'DEVELOPER'}</SectionLabel>
            <RowGroup>
              <Row
                first
                icon="cloud-upload-outline"
                tint={ROW_TINTS.slate}
                label={seeding ? (ar ? 'جاري التحميل…' : 'Seeding…') : (ar ? 'تحميل بيانات تجريبية' : 'Seed Firestore')}
                sub={ar ? 'نسخ بيانات العرض إلى Firestore' : 'Copy demo data to Firestore'}
                onPress={onSeed}
              />
            </RowGroup>
          </>
        )}

        {/* ── Sign out ── */}
        {user?.isAuthenticated && (
          <RowGroup style={{ marginTop: spacing.s5 }}>
            <Row first icon="log-out-outline" tint={c.danger} label={ar ? 'تسجيل الخروج' : 'Log out'} destructive onPress={onLogout} />
          </RowGroup>
        )}

        <Text variant="microcopy" color={c.textMuted} align="center" style={{ marginTop: spacing.s5 }}>
          {BRAND.en} {BRAND.version}
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.s5, paddingBottom: 80 },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.s5,
    padding: spacing.s4,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
