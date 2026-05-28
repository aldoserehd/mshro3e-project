import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import Avatar from '../../ui/Avatar';
import PressableScale from '../../ui/PressableScale';
import { palette, semantic, spacing } from '../../theme/ts';
import type { MainTabsScreenProps } from '../../navigation/types';

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, label, onPress, destructive }) => (
  <PressableScale onPress={onPress}>
    <View style={styles.row}>
      <View style={[styles.rowIcon, destructive && { backgroundColor: '#FBE9E9' }]}>
        <Ionicons name={icon} size={18} color={destructive ? '#B91C1C' : palette.navy700} />
      </View>
      <Text variant="body" color={destructive ? '#B91C1C' : palette.neutral900} style={{ flex: 1 }}>
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={palette.neutral500}
        style={{ transform: [{ scaleX: 1 }] }}
      />
    </View>
  </PressableScale>
);

export default function ProfileScreen({ navigation: _ }: MainTabsScreenProps<'Account'>) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Avatar name="Aldo Sereh" size={88} />
          <Text variant="pageTitle" style={{ marginTop: spacing.s3 }}>
            {i18n.t('profile.guestName')}
          </Text>
          <Text variant="body" color={palette.neutral500}>
            +965 5••• ••••
          </Text>
        </View>

        <Card style={styles.section}>
          <Row icon="heart-outline" label={i18n.t('profile.favorites')} />
          <Divider />
          <Row icon="location-outline" label={i18n.t('profile.addresses')} />
          <Divider />
          <Row icon="card-outline" label={i18n.t('profile.payment')} />
        </Card>

        <Card style={styles.section}>
          <Row icon="notifications-outline" label={i18n.t('profile.notifications')} />
          <Divider />
          <Row icon="language-outline" label={i18n.t('profile.language')} />
          <Divider />
          <Row icon="help-circle-outline" label={i18n.t('profile.help')} />
        </Card>

        <Card style={styles.section}>
          <Row icon="log-out-outline" label={i18n.t('profile.logout')} destructive />
        </Card>

        <Text variant="caption" color={palette.neutral500} align="center" style={{ marginTop: spacing.s4 }}>
          Mshro3e v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.s5,
    paddingBottom: spacing.s8,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.s4,
    marginBottom: spacing.s5,
    gap: spacing.s1,
  },
  section: {
    padding: 0,
    marginBottom: spacing.s4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s4,
    gap: spacing.s3,
  },
  rowIcon: {
    width: 32, height: 32, borderRadius: 999,
    backgroundColor: palette.navy100,
    alignItems: 'center', justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: palette.neutral200,
    marginStart: 56,
  },
});
