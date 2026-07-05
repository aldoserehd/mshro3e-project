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
import { Row, RowGroup } from '../../ui/SettingsKit';
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

        {/* ── Profile header card — whole card opens Edit profile ── */}
        <View style={[styles.identity, { backgroundColor: c.surface, borderColor: c.border }]}>
          {isSignedIn ? (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => [styles.identityInner, pressed && { opacity: 0.75 }]}
            >
              <View style={styles.avatarWrap}>
                <View style={[styles.avatarRing, { borderColor: c.brandFill }]}>
                  <Avatar name={user!.name?.trim() || 'User'} size={64} />
                </View>
                <View style={[styles.editBadge, { backgroundColor: c.brand, borderColor: c.surface }]}>
                  <Ionicons name="pencil" size={11} color="#fff" />
                </View>
              </View>
              <View style={{ flex: 1, marginStart: spacing.s4, marginEnd: spacing.s2 }}>
                <Text variant="cardTitle" weight="700" numberOfLines={1}>
                  {user!.name?.trim() || (ar ? 'بدون اسم' : 'No name')}
                </Text>
                <Text variant="caption" color={c.textMuted} numberOfLines={1} forceLtr>
                  {user!.email || user!.phone || ''}
                </Text>
                <View style={[styles.memberPill, { backgroundColor: c.brandFill, borderColor: c.brand }]}>
                  <Ionicons name="checkmark-circle" size={13} color={c.brandText} />
                  <Text variant="microcopy" weight="700" color={c.brandText}>
                    {ar ? 'عضو مشروعي' : 'MSHRO3E MEMBER'}
                  </Text>
                </View>
              </View>
              <Chevron direction="forward" size={18} color={c.borderStrong} />
            </Pressable>
          ) : (
            <>
              <View style={[styles.guestIcon, { backgroundColor: c.brandFill }]}>
                <Ionicons name="person-outline" size={26} color={c.brandText} />
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
            </>
          )}
        </View>

        {/* ── Activity ── */}
        <RowGroup title={ar ? 'نشاطي' : 'ACTIVITY'} style={{ marginTop: spacing.s5 }}>
          <Row
            first
            variant="tile"
            icon="bag-handle-outline"
            label={ar ? 'طلباتي' : 'My orders'}
            sub={ar ? 'سجل تواصلك مع المحلات عبر واتساب' : 'Your WhatsApp order history'}
            onPress={() => navigation.navigate('Orders')}
          />
          <Row
            variant="tile"
            icon="heart-outline"
            label={ar ? 'المفضلة' : 'Favorites'}
            onPress={() => navigation.navigate('Favorites')}
          />
        </RowGroup>

        {/* ── Own a business? (Stitch navy card) ── */}
        <PressableScale onPress={() => setVendorCtaOpen(true)} style={{ marginTop: spacing.s5 }}>
          <View style={styles.bizCard}>
            <LinearGradient colors={['#151b2c', '#001a41']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            {/* soft glow circles */}
            <View style={[styles.glow, { top: -70, right: -50, backgroundColor: 'rgba(65,92,157,0.35)' }]} />
            <View style={[styles.glow, { bottom: -80, left: -60, backgroundColor: 'rgba(157,183,255,0.18)' }]} />
            <View style={styles.bizHead}>
              <Ionicons name="storefront-outline" size={26} color="#9db7ff" />
              <Text variant="cardTitle" weight="700" color="#fff">
                {ar ? 'عندك مشروع؟' : 'Own a business?'}
              </Text>
            </View>
            <Text variant="body" color="#7e8398" style={{ marginTop: spacing.s2 }}>
              {ar
                ? 'انضم لسوق المشاريع الكويتية — متجرك جاهز وطلباتك توصلك واتساب، بدون أي عمولة.'
                : "Join Kuwait's home-business marketplace — a ready storefront, orders on WhatsApp, zero commission."}
            </Text>
            <View style={[styles.bizCta, { backgroundColor: '#9db7ff' }]}>
              <Text variant="button" weight="700" color="#2a4686">
                {ar ? 'سجّل مشروعك' : 'Apply to become a vendor'}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={17}
                color="#2a4686"
                style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
              />
            </View>
          </View>
        </PressableScale>

        {/* ── App settings ── */}
        <RowGroup title={ar ? 'إعدادات التطبيق' : 'APP SETTINGS'} style={{ marginTop: spacing.s5 }}>
          <Row
            first
            icon="settings-outline"
            label={ar ? 'الإعدادات' : 'Settings'}
            sub={ar ? 'اللغة، المظهر، الإشعارات' : 'Language, theme, notifications'}
            onPress={() => navigation.navigate('Settings')}
          />
          <Row
            icon="notifications-outline"
            label={ar ? 'الإشعارات' : 'Notifications'}
            onPress={() => navigation.navigate('Notifications')}
          />
        </RowGroup>

        {/* ── Support ── */}
        <RowGroup title={ar ? 'الدعم' : 'SUPPORT'} style={{ marginTop: spacing.s5 }}>
          <Row
            first
            icon="help-buoy-outline"
            label={ar ? 'المساعدة والدعم' : 'Help & support'}
            onPress={() => navigation.navigate('Info', { topic: 'help' })}
          />
          <Row
            icon="information-circle-outline"
            label={ar ? `عن ${BRAND.ar}` : `About ${BRAND.en}`}
            onPress={() => navigation.navigate('Info', { topic: 'about' })}
          />
          <Row
            icon="shield-checkmark-outline"
            label={ar ? 'سياسة الخصوصية' : 'Privacy policy'}
            onPress={() => navigation.navigate('Info', { topic: 'privacy' })}
          />
        </RowGroup>

        {/* ── Log out (outlined, Stitch danger style) ── */}
        {isSignedIn && (
          <Pressable
            onPress={onLogout}
            style={[styles.logoutBtn, { borderColor: c.isDark ? 'rgba(255,107,107,0.35)' : 'rgba(186,26,26,0.25)' }]}
          >
            <Ionicons name="log-out-outline" size={19} color={c.danger} />
            <Text variant="button" weight="700" color={c.danger}>
              {ar ? 'تسجيل الخروج' : 'Log out'}
            </Text>
          </Pressable>
        )}

        <Text variant="microcopy" color={c.textMuted} align="center" style={{ marginTop: spacing.s5, letterSpacing: 1 }}>
          {BRAND.en.toUpperCase()} {BRAND.version}
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
  identityInner: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatarRing: { borderWidth: 3, borderRadius: 999, padding: 2 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.s2,
    paddingVertical: 3,
    marginTop: 6,
  },
  guestIcon: { width: 52, height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  bizCard: {
    borderRadius: radius.xl,
    padding: spacing.s5,
    overflow: 'hidden',
    ...shadowStyle(2),
  },
  glow: { position: 'absolute', width: 190, height: 190, borderRadius: 999 },
  bizHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.s3 },
  bizCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s2,
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s3,
    marginTop: spacing.s4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s2,
    borderWidth: 2,
    borderRadius: radius.lg,
    paddingVertical: spacing.s4,
    marginTop: spacing.s5,
  },
});
