import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Avatar from '../../ui/Avatar';
import PressableScale from '../../ui/PressableScale';
import { useColors } from '../../theme/colors';
import { radius, spacing, shadowStyle, getCurrentLocale } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import { useUserStore } from '../../stores/user';
import { firebaseAuth } from '@shared/firebase';
import { signOut } from 'firebase/auth';
import type { MainTabsScreenProps } from '../../navigation/types';

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, label, trailing, onPress, destructive }) => {
  const c = useColors();
  return (
    <PressableScale onPress={onPress}>
      <View style={[styles.row, { backgroundColor: c.surface, borderColor: c.border }]}>
        <View style={[styles.rowIcon, { backgroundColor: destructive ? '#fdecec' : c.brandFill }]}>
          <Ionicons name={icon} size={18} color={destructive ? c.danger : c.brandText} />
        </View>
        <Text variant="body" color={destructive ? c.danger : c.text} style={{ flex: 1, marginStart: spacing.s3 }}>
          {label}
        </Text>
        {trailing ?? (
          <Ionicons name="chevron-back" size={18} color={c.textMuted} style={{ transform: [{ scaleX: -1 }] }} />
        )}
      </View>
    </PressableScale>
  );
};

const LangToggle: React.FC = () => {
  const { locale, setLocale } = useLocaleStore();
  const c = useColors();
  return (
    <View style={[styles.langWrap, { backgroundColor: c.surfaceAlt }]}>
      {(['en', 'ar'] as const).map((k) => (
        <Pressable
          key={k}
          onPress={() => setLocale(k)}
          style={[styles.langChip, locale === k && { backgroundColor: c.brand }]}
        >
          <Text variant="microcopy" color={locale === k ? '#fff' : c.textMuted}>{k.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default function AccountScreen({ navigation }: MainTabsScreenProps<'Account'>) {
  const { locale } = useLocaleStore();
  const c = useColors();
  const user = useUserStore((s) => s.user);

  const displayName = user?.name?.trim() || (getCurrentLocale() === 'ar' ? 'ضيف' : 'Guest');
  const subtitle = user?.phone?.trim() || user?.email?.trim() || (getCurrentLocale() === 'ar' ? 'سجّل دخولك' : 'Sign in');

  const onLogout = () => {
    Alert.alert(
      locale === 'ar' ? 'تسجيل الخروج' : 'Log out',
      locale === 'ar' ? 'هل تريد تسجيل الخروج من حسابك؟' : 'Are you sure you want to log out?',
      [
        { text: locale === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: locale === 'ar' ? 'تسجيل الخروج' : 'Log out',
          style: 'destructive',
          onPress: async () => {
            try { await signOut(firebaseAuth()); } catch { /* fall through */ }
            useUserStore.getState().signOut();
            navigation.reset({ index: 0, routes: [{ name: 'SignIn' as never }] });
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBar}>
          <Text variant="pageTitle" weight="700">{i18n.t('account.title')}</Text>
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={12} style={[styles.gear, { backgroundColor: c.surfaceAlt }]}>
            <Ionicons name="settings-outline" size={20} color={c.text} />
          </Pressable>
        </View>

        <View style={styles.profile}>
          <View>
            <Avatar name={displayName} size={92} />
            <View style={[styles.editBadge, { backgroundColor: c.brand, borderColor: c.bg }]}>
              <Ionicons name="pencil" size={13} color="#fff" />
            </View>
          </View>
          <Text variant="sectionTitle" weight="700" style={{ marginTop: spacing.s3 }}>{displayName}</Text>
          <Text variant="body" color={c.textMuted}>{subtitle}</Text>
        </View>

        <View style={styles.list}>
          <Row icon="person-outline" label={i18n.t('account.rows.profile')} onPress={() => navigation.navigate('Settings')} />
          <Row icon="notifications-outline" label={i18n.t('account.rows.notifications')} onPress={() => navigation.navigate('Notifications')} />
          <Row icon="language-outline" label={i18n.t('account.rows.language')} trailing={<LangToggle />} />
          <Row icon="help-circle-outline" label={i18n.t('account.rows.support')} onPress={() => navigation.navigate('Info', { topic: 'help' })} />
          <Row icon="information-circle-outline" label={getCurrentLocale() === 'ar' ? 'عن مشروعي' : 'About Mshro3e'} onPress={() => navigation.navigate('Info', { topic: 'about' })} />
          <Row icon="log-out-outline" label={i18n.t('account.rows.logout')} destructive onPress={onLogout} />
        </View>

        <PressableScale onPress={() => navigation.navigate('Info', { topic: 'about' })}>
          <View style={[styles.upgrade, { backgroundColor: c.brand }]}>
            <View style={[styles.upgradeIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <Ionicons name="rocket-outline" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" weight="700" color="#fff">{i18n.t('account.upgrade.title')}</Text>
              <Text variant="caption" color="rgba(255,255,255,0.82)" style={{ marginTop: 4 }}>
                {i18n.t('account.upgrade.body')}
              </Text>
            </View>
            <View style={styles.upgradeCta}>
              <Text variant="button" weight="700" color={c.brand}>{i18n.t('account.upgrade.cta')}</Text>
            </View>
          </View>
        </PressableScale>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.s5, paddingBottom: 120 },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.s5,
  },
  gear: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  profile: { alignItems: 'center', marginBottom: spacing.s6, gap: 2 },
  editBadge: {
    position: 'absolute', end: 0, bottom: 0,
    width: 28, height: 28, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2,
  },
  list: { gap: spacing.s2, marginBottom: spacing.s5 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.s3, borderRadius: radius.lg, borderWidth: 1,
  },
  rowIcon: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  langWrap: { flexDirection: 'row', borderRadius: 999, padding: 2 },
  langChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  upgrade: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: radius.xl, padding: spacing.s4, ...shadowStyle(2),
  },
  upgradeIcon: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  upgradeCta: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.s3, paddingVertical: spacing.s2, borderRadius: 999,
  },
});
