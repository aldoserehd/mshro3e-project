import React, { useState } from 'react';
import { Alert, I18nManager, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Avatar from '../../ui/Avatar';
import Button from '../../ui/Button';
import PressableScale from '../../ui/PressableScale';
import { Chevron } from '../../ui/Chevron';
import VendorCtaSheet from '../../ui/VendorCtaSheet';
import { Row, RowGroup, SectionLabel, ROW_TINTS } from '../../ui/SettingsKit';
import { useColors } from '../../theme/colors';
import { radius, spacing, shadowStyle } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import { useUserStore } from '../../stores/user';
import { firebaseAuth } from '@shared/firebase';
import { BRAND } from '../../brand';
import type { MainTabsScreenProps } from '../../navigation/types';

export default function AccountScreen({ navigation }: MainTabsScreenProps<'Account'>) {
  const { locale } = useLocaleStore();
  const ar = locale === 'ar';
  const c = useColors();
  const user = useUserStore((s) => s.user);
  const [vendorCtaOpen, setVendorCtaOpen] = useState(false);
  const isSignedIn = !!user?.isAuthenticated;

  const onLogout = () => {
    Alert.alert(
      ar ? 'تسجيل الخروج' : 'Log out',
      ar ? 'هل تريد تسجيل الخروج من حسابك؟' : 'Are you sure you want to log out?',
      [
        { text: ar ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: ar ? 'تسجيل الخروج' : 'Log out',
          style: 'destructive',
          onPress: async () => {
            try { await signOut(firebaseAuth()); } catch { /* fall through */ }
            useUserStore.getState().signOut();
            // Browsing is free — stay in the app as a guest.
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="pageTitle" weight="700" style={{ marginBottom: spacing.s4 }}>
          {ar ? 'حسابي' : 'My account'}
        </Text>

        {/* ── Identity ── */}
        {isSignedIn ? (
          <PressableScale onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.identity, { backgroundColor: c.surface, borderColor: c.border }]}>
              <View style={[styles.avatarRing, { borderColor: c.brandFill }]}>
                <Avatar name={user!.name?.trim() || 'User'} size={56} />
              </View>
              <View style={{ flex: 1, marginStart: spacing.s3 }}>
                <Text variant="cardTitle" weight="700" numberOfLines={1}>
                  {user!.name?.trim() || (ar ? 'بدون اسم' : 'No name')}
                </Text>
                <Text variant="caption" color={c.textMuted} numberOfLines={1}>
                  {user!.email || user!.phone || ''}
                </Text>
                <Text variant="microcopy" weight="600" color={c.brandText} style={{ marginTop: 2 }}>
                  {ar ? 'عرض وتعديل الملف' : 'View & edit profile'}
                </Text>
              </View>
              <Chevron direction="forward" size={18} color={c.borderStrong} />
            </View>
          </PressableScale>
        ) : (
          <View style={[styles.identity, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={[styles.guestIcon, { backgroundColor: c.brandFill }]}>
              <Ionicons name="person-outline" size={24} color={c.brandText} />
            </View>
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" weight="700">{ar ? 'حياك في مشروعي 👋' : 'Welcome 👋'}</Text>
              <Text variant="caption" color={c.textMuted}>
                {ar ? 'سجّل عشان تتابع طلباتك وتحفظ مفضلاتك.' : 'Sign in to track orders and keep favorites.'}
              </Text>
              <View style={{ flexDirection: 'row', gap: spacing.s2, marginTop: spacing.s3 }}>
                <Button title={ar ? 'تسجيل الدخول' : 'Sign in'} size="sm" onPress={() => navigation.navigate('SignIn')} />
                <Button
                  title={ar ? 'حساب جديد' : 'Sign up'}
                  size="sm"
                  variant="ghost"
                  onPress={() => navigation.navigate('SignUp')}
                />
              </View>
            </View>
          </View>
        )}

        {/* ── Activity ── */}
        <SectionLabel>{ar ? 'نشاطي' : 'MY ACTIVITY'}</SectionLabel>
        <RowGroup>
          <Row
            first
            icon="receipt-outline"
            tint={ROW_TINTS.blue}
            label={ar ? 'طلباتي' : 'My orders'}
            sub={ar ? 'سجل تواصلك مع المحلات عبر واتساب' : 'Your WhatsApp order history'}
            onPress={() => navigation.navigate('Orders')}
          />
          <Row
            icon="heart-outline"
            tint={ROW_TINTS.pink}
            label={ar ? 'المفضلة' : 'Favorites'}
            onPress={() => navigation.navigate('Favorites')}
          />
          <Row
            icon="notifications-outline"
            tint={ROW_TINTS.orange}
            label={ar ? 'الإشعارات' : 'Notifications'}
            onPress={() => navigation.navigate('Notifications')}
          />
        </RowGroup>

        {/* ── General ── */}
        <SectionLabel>{ar ? 'عام' : 'GENERAL'}</SectionLabel>
        <RowGroup>
          <Row
            first
            icon="settings-outline"
            tint={ROW_TINTS.slate}
            label={ar ? 'الإعدادات' : 'Settings'}
            sub={ar ? 'اللغة، المظهر، الخصوصية' : 'Language, theme, privacy'}
            onPress={() => navigation.navigate('Settings')}
          />
          <Row
            icon="help-buoy-outline"
            tint={ROW_TINTS.green}
            label={ar ? 'المساعدة والدعم' : 'Help & support'}
            onPress={() => navigation.navigate('Info', { topic: 'help' })}
          />
          <Row
            icon="information-circle-outline"
            tint={ROW_TINTS.purple}
            label={ar ? `عن ${BRAND.ar}` : `About ${BRAND.en}`}
            onPress={() => navigation.navigate('Info', { topic: 'about' })}
          />
        </RowGroup>

        {/* ── Vendor CTA ── */}
        <PressableScale onPress={() => setVendorCtaOpen(true)} style={{ marginTop: spacing.s5 }}>
          <View style={styles.banner}>
            <LinearGradient colors={['#2a4686', '#001a41']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={styles.bannerIcon}>
              <Ionicons name="storefront-outline" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" weight="700" color="#fff">
                {ar ? 'عندك مشروع؟' : 'Own a business?'}
              </Text>
              <Text variant="caption" color="#9db7ff">
                {ar ? 'اعرضه على مشروعي — بدون عمولة' : 'List it on Mshro3e — zero commission'}
              </Text>
            </View>
            <View style={styles.bannerCta}>
              <Ionicons name="arrow-forward" size={16} color="#001a41" style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }} />
            </View>
          </View>
        </PressableScale>

        {/* ── Sign out ── */}
        {isSignedIn && (
          <RowGroup style={{ marginTop: spacing.s5 }}>
            <Row first icon="log-out-outline" tint={c.danger} label={ar ? 'تسجيل الخروج' : 'Log out'} destructive onPress={onLogout} />
          </RowGroup>
        )}

        <Text variant="microcopy" color={c.textMuted} align="center" style={{ marginTop: spacing.s5 }}>
          {BRAND.en} {BRAND.version}
        </Text>
      </ScrollView>

      <VendorCtaSheet visible={vendorCtaOpen} onClose={() => setVendorCtaOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.s5, paddingBottom: 130 },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s4,
    borderRadius: radius.xl,
    borderWidth: 1,
    ...shadowStyle(1),
  },
  avatarRing: { borderWidth: 3, borderRadius: 999, padding: 2 },
  guestIcon: { width: 48, height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s4,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadowStyle(2),
  },
  bannerIcon: {
    width: 44, height: 44, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerCta: { width: 34, height: 34, borderRadius: 999, backgroundColor: '#9db7ff', alignItems: 'center', justifyContent: 'center' },
});
