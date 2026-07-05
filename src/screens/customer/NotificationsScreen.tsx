import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import { TopBar } from '../../ui/SettingsKit';
import { usePrefsStore, type NotifPrefs } from '../../stores/prefs';
import { useColors } from '../../theme/colors';
import { radius, spacing, getCurrentLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

export default function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  const c = useColors();
  const prefs = usePrefsStore();
  const ar = getCurrentLocale() === 'ar';

  const ROWS: { key: keyof NotifPrefs; icon: keyof typeof Ionicons.glyphMap; label: string; sub?: string }[] = [
    { key: 'push', icon: 'phone-portrait-outline', label: ar ? 'إشعارات التطبيق' : 'Push notifications' },
    { key: 'orderUpdates', icon: 'receipt-outline', label: ar ? 'تحديثات الطلبات' : 'Order updates' },
    { key: 'promos', icon: 'pricetag-outline', label: ar ? 'العروض والخصومات' : 'Promotions & discounts' },
    { key: 'vendorAlerts', icon: 'sparkles-outline', label: ar ? 'تنبيهات المحلات' : 'Vendor alerts' },
  ];

  return (
    <Screen>
      <TopBar title={i18n.t('notif.title')} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Empty feed state */}
        <Animated.View entering={FadeInDown.duration(300)} style={[styles.emptyCard, { backgroundColor: c.surfaceAlt }]}>
          <View style={[styles.bell, { backgroundColor: c.brandFill }]}>
            <Ionicons name="notifications-outline" size={26} color={c.brandText} />
          </View>
          <Text variant="cardTitle" weight="700" align="center" style={{ marginTop: spacing.s3 }}>
            {i18n.t('notif.feedEmptyTitle')}
          </Text>
          <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: 4 }}>
            {i18n.t('notif.feedEmptyBody')}
          </Text>
        </Animated.View>

        {/* Preferences — persisted in the prefs store (shared with Settings) */}
        <Text variant="microcopy" weight="700" color={c.textMuted} style={styles.prefsHead}>
          {i18n.t('notif.prefsTitle')}
        </Text>
        <View style={[styles.prefsCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          {ROWS.map((row, i) => (
            <View
              key={row.key}
              style={[
                styles.prefRow,
                i < ROWS.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border },
              ]}
            >
              <View style={[styles.prefIcon, { backgroundColor: c.brandFill }]}>
                <Ionicons name={row.icon} size={18} color={c.brandText} />
              </View>
              <Text variant="body" style={{ flex: 1, marginStart: spacing.s3 }}>{row.label}</Text>
              <Switch
                value={prefs[row.key]}
                onValueChange={(v) => prefs.setPref(row.key, v)}
                trackColor={{ false: c.borderStrong, true: c.brand }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.s5, paddingBottom: spacing.s8 },
  emptyCard: { borderRadius: radius.xl, padding: spacing.s6, alignItems: 'center' },
  bell: { width: 56, height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  prefsHead: { marginTop: spacing.s6, marginBottom: spacing.s2, marginStart: spacing.s1, letterSpacing: 1 },
  prefsCard: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  prefRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.s4 },
  prefIcon: { width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
