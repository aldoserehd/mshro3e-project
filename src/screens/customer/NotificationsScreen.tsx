import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import { Chevron } from '../../ui/Chevron';
import { useColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

type PrefKey = 'newProducts' | 'replies' | 'deals' | 'backInStock' | 'push';
const PREFS: { key: PrefKey; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'push', icon: 'phone-portrait-outline' },
  { key: 'newProducts', icon: 'sparkles-outline' },
  { key: 'replies', icon: 'chatbubble-ellipses-outline' },
  { key: 'deals', icon: 'pricetag-outline' },
  { key: 'backInStock', icon: 'refresh-outline' },
];

export default function NotificationsScreen({ navigation }: RootStackScreenProps<'Notifications'>) {
  const c = useColors();
  const [prefs, setPrefs] = useState<Record<PrefKey, boolean>>({
    push: true, newProducts: true, replies: true, deals: false, backInStock: true,
  });
  const toggle = (k: PrefKey) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <Screen>
      <View style={[styles.topBar, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.backBtn, { backgroundColor: c.surfaceAlt }]}>
          <Chevron direction="back" size={20} color={c.text} />
        </Pressable>
        <Text variant="cardTitle" weight="700">{i18n.t('notif.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

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

        {/* Preferences */}
        <Text variant="label" weight="700" color={c.textMuted} style={styles.prefsHead}>
          {i18n.t('notif.prefsTitle')}
        </Text>
        <View style={[styles.prefsCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          {PREFS.map(({ key, icon }, i) => (
            <View
              key={key}
              style={[
                styles.prefRow,
                i < PREFS.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border },
              ]}
            >
              <View style={[styles.prefIcon, { backgroundColor: c.brandFill }]}>
                <Ionicons name={icon} size={18} color={c.brandText} />
              </View>
              <Text variant="body" style={{ flex: 1, marginStart: spacing.s3 }}>{i18n.t(`notif.${key}`)}</Text>
              <Switch
                value={prefs[key]}
                onValueChange={() => toggle(key)}
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
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.s5, paddingBottom: spacing.s8 },
  emptyCard: { borderRadius: radius.xl, padding: spacing.s6, alignItems: 'center' },
  bell: { width: 56, height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  prefsHead: { marginTop: spacing.s6, marginBottom: spacing.s2, marginStart: spacing.s1 },
  prefsCard: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  prefRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.s4 },
  prefIcon: { width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
