import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import Avatar from '../../ui/Avatar';
import PressableScale from '../../ui/PressableScale';
import { palette, radius, semantic, spacing, shadowStyle } from '../../theme/ts';
import type { MainTabsScreenProps } from '../../navigation/types';

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, label, trailing, onPress, destructive }) => (
  <PressableScale onPress={onPress}>
    <Card style={styles.row}>
      <Ionicons
        name={icon}
        size={18}
        color={destructive ? '#B91C1C' : palette.navy700}
      />
      <Text variant="body" color={destructive ? '#B91C1C' : palette.neutral900} style={{ flex: 1, marginStart: spacing.s3 }}>
        {label}
      </Text>
      {trailing ?? (
        <Ionicons name="chevron-back" size={18} color={palette.neutral500} style={{ transform: [{ scaleX: -1 }] }} />
      )}
    </Card>
  </PressableScale>
);

const LangToggle: React.FC = () => {
  const [lang, setLang] = React.useState<'ar' | 'en'>('ar');
  return (
    <View style={styles.langWrap}>
      {(['en', 'ar'] as const).map((k) => (
        <Pressable
          key={k}
          onPress={() => setLang(k)}
          style={[styles.langChip, lang === k && styles.langChipActive]}
        >
          <Text variant="microcopy" color={lang === k ? '#fff' : palette.navy700}>
            {k.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default function AccountScreen(_: MainTabsScreenProps<'Account'>) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerBar}>
          <Pressable hitSlop={12}>
            <Ionicons name="menu" size={26} color={palette.neutral900} />
          </Pressable>
          <Text variant="cardTitle" weight="700">Mshro3e</Text>
        </View>

        <View style={styles.profile}>
          <View>
            <Avatar name="Fahad" size={96} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#fff" />
            </View>
          </View>
          <Text variant="pageTitle" style={{ marginTop: spacing.s3 }}>
            فهد المهاجري
          </Text>
          <Text variant="body" color={palette.neutral500}>
            +965 •••• 1234
          </Text>
        </View>

        <View style={styles.list}>
          <Row icon="person-outline"        label={i18n.t('account.rows.profile')} />
          <Row icon="location-outline"      label={i18n.t('account.rows.addresses')} />
          <Row icon="notifications-outline" label={i18n.t('account.rows.notifications')} />
          <Row
            icon="language-outline"
            label={i18n.t('account.rows.language')}
            trailing={<LangToggle />}
          />
          <Row icon="help-circle-outline"   label={i18n.t('account.rows.support')} />
          <Row icon="log-out-outline"       label={i18n.t('account.rows.logout')} destructive />
        </View>

        <PressableScale>
          <View style={styles.upgrade}>
            <View style={styles.upgradeIcon}>
              <Ionicons name="rocket-outline" size={20} color={palette.navy900} />
            </View>
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" color="#fff">{i18n.t('account.upgrade.title')}</Text>
              <Text variant="caption" color={palette.navy300} style={{ marginTop: 4 }}>
                {i18n.t('account.upgrade.body')}
              </Text>
            </View>
            <View style={styles.upgradeCta}>
              <Text variant="button" color={palette.navy900}>
                {i18n.t('account.upgrade.cta')}
              </Text>
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
  profile: { alignItems: 'center', marginBottom: spacing.s5, gap: 4 },
  editBadge: {
    position: 'absolute', end: 0, bottom: 0,
    width: 28, height: 28, borderRadius: 999,
    backgroundColor: palette.navy900,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  list: { gap: spacing.s2, marginBottom: spacing.s5 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.s4,
  },
  langWrap: {
    flexDirection: 'row',
    backgroundColor: palette.navy100,
    borderRadius: 999,
    padding: 2,
  },
  langChip: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 999,
  },
  langChipActive: { backgroundColor: palette.navy900 },
  upgrade: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: palette.navy900,
    borderRadius: radius.xl,
    padding: spacing.s4,
    ...shadowStyle(2),
  },
  upgradeIcon: {
    width: 44, height: 44, borderRadius: 999,
    backgroundColor: palette.white,
    alignItems: 'center', justifyContent: 'center',
  },
  upgradeCta: {
    backgroundColor: palette.white,
    paddingHorizontal: spacing.s3, paddingVertical: spacing.s2,
    borderRadius: 999,
  },
});
