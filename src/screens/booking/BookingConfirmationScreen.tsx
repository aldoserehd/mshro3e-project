import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import { useService } from '../../data/hooks';
import { vendorById } from '../../data/seed';
import { palette, semantic, radius, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

const fmtFull = new Intl.DateTimeFormat('ar-KW', {
  calendar: 'gregory',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
});

export default function BookingConfirmationScreen({ route, navigation }: RootStackScreenProps<'BookingConfirmation'>) {
  const { serviceId, startAt } = route.params;
  const { data: service } = useService(serviceId);
  const vendor = service ? vendorById(service.vendorId) : undefined;

  const ringScale = useSharedValue(0.85);
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    ringScale.value = withRepeat(
      withSequence(withTiming(1.4, { duration: 1200 }), withTiming(0.85, { duration: 0 })),
      -1,
      false,
    );
  }, [ringScale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringScale.value > 1.1 ? 1 - (ringScale.value - 1.1) * 3 : 1,
  }));

  if (!service) return null;

  const bubbles = [
    {
      key: 'b1',
      icon: 'checkmark-circle' as const,
      text: i18n.t('confirmation.b1'),
      delay: 0,
    },
    {
      key: 'b2',
      icon: 'notifications' as const,
      text: i18n.t('confirmation.b2', { vendor: pickLocale(vendor!.name) }),
      delay: 360,
    },
    {
      key: 'b3',
      icon: 'time' as const,
      text: i18n.t('confirmation.b3', { when: fmtFull.format(new Date(startAt)) }),
      delay: 720,
    },
  ];

  return (
    <Screen>
      <LinearGradient
        colors={[palette.navy50, semantic.surface]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.container}>
        <View style={styles.heroWrap}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <View style={styles.check}>
            <Ionicons name="checkmark" size={42} color="#fff" />
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(420)}>
          <Text variant="pageTitle" align="center" style={{ marginTop: spacing.s5 }}>
            {i18n.t('confirmation.title')}
          </Text>
          <Text variant="body" color={palette.neutral500} align="center" style={{ marginTop: spacing.s1 }}>
            {i18n.t('confirmation.subtitle')}
          </Text>
        </Animated.View>

        <View style={{ marginTop: spacing.s6, gap: spacing.s3, paddingHorizontal: spacing.s5 }}>
          {bubbles.map((b) => (
            <Animated.View
              key={b.key}
              entering={FadeInDown.delay(b.delay).duration(420)}
              style={styles.bubble}
            >
              <View style={styles.bubbleIcon}>
                <Ionicons name={b.icon} size={18} color={palette.navy900} />
              </View>
              <Text variant="body" style={{ flex: 1 }}>{b.text}</Text>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={i18n.t('confirmation.viewBookings')}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        />
        <View style={{ height: spacing.s2 }} />
        <Button
          variant="ghost"
          title={i18n.t('confirmation.backHome')}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        />
      </View>
    </Screen>
  );
}

const RING_SIZE = 140;
const CHECK_SIZE = 88;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: spacing.s8 },
  heroWrap: { width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: RING_SIZE, height: RING_SIZE, borderRadius: 999,
    borderWidth: 2, borderColor: palette.navy400,
  },
  check: {
    width: CHECK_SIZE, height: CHECK_SIZE, borderRadius: 999,
    backgroundColor: palette.navy900,
    alignItems: 'center', justifyContent: 'center',
  },
  bubble: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.s3,
    backgroundColor: semantic.surface,
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3,
    borderRadius: radius.lg, borderWidth: 1, borderColor: palette.neutral200,
  },
  bubbleIcon: { width: 32, height: 32, borderRadius: 999, backgroundColor: palette.navy100, alignItems: 'center', justifyContent: 'center' },
  footer: {
    position: 'absolute', start: 0, end: 0, bottom: 0,
    paddingHorizontal: spacing.s5, paddingBottom: spacing.s5,
  },
});
