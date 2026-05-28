import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Header from '../../ui/Header';
import { StepRow } from './ServiceConfirmScreen';
import { useService } from '../../data/hooks';
import { vendorById } from '../../data/seed';
import { palette, semantic, radius, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

type Method = 'apple_pay' | 'knet' | 'cash';

const PAY_METHODS: { id: Method; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { id: 'apple_pay', icon: 'logo-apple', label: 'Apple Pay' },
  { id: 'knet',      icon: 'card-outline', label: 'KNET' },
  { id: 'cash',      icon: 'cash-outline', label: 'cash' },
];

const fmtDateTime = new Intl.DateTimeFormat('ar-KW', {
  calendar: 'gregory',
  dateStyle: 'full',
  timeStyle: 'short',
});

export default function ConfirmPayScreen({ route, navigation }: RootStackScreenProps<'ConfirmPay'>) {
  const { serviceId, startAt } = route.params;
  const { data: service } = useService(serviceId);
  const [method, setMethod] = useState<Method>('knet');
  const [busy, setBusy] = useState(false);

  if (!service) return null;
  const vendor = vendorById(service.vendorId);
  const fee = Math.max(1, Math.round(service.price * 0.05));
  const total = service.price + fee;

  const onPay = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    navigation.replace('BookingConfirmation', { serviceId, startAt });
  };

  return (
    <Screen>
      <Header title={i18n.t('booking.confirmAndPay')} onBack={() => navigation.goBack()} />
      <StepRow step={3} />

      <ScrollView contentContainerStyle={{ padding: spacing.s5, paddingBottom: 160 }}>
        <Card style={{ padding: spacing.s4 }}>
          <Text variant="caption" color={palette.neutral500}>{i18n.t('booking.when')}</Text>
          <Text variant="cardTitle" style={{ marginTop: 4 }}>
            {fmtDateTime.format(new Date(startAt))}
          </Text>
        </Card>

        <Card style={{ padding: spacing.s4, marginTop: spacing.s4 }}>
          <Text variant="caption" color={palette.neutral500}>{i18n.t('booking.service')}</Text>
          <Text variant="cardTitle" style={{ marginTop: 4 }}>{pickLocale(service.title)}</Text>
          {vendor && (
            <Text variant="caption" color={palette.neutral500} style={{ marginTop: 4 }}>
              {pickLocale(vendor.name)}
            </Text>
          )}
        </Card>

        <Text variant="sectionTitle" style={{ marginTop: spacing.s5, marginBottom: spacing.s2 }}>
          {i18n.t('booking.payMethod')}
        </Text>
        <View style={{ gap: spacing.s2 }}>
          {PAY_METHODS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={[styles.payRow, method === m.id && styles.payRowSel]}
            >
              <View style={styles.payIcon}>
                <Ionicons name={m.icon} size={20} color={palette.navy900} />
              </View>
              <Text variant="body" style={{ flex: 1 }}>{i18n.t(`booking.method.${m.id}`)}</Text>
              <View style={[styles.radio, method === m.id && styles.radioSel]}>
                {method === m.id && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          ))}
        </View>

        <Text variant="sectionTitle" style={{ marginTop: spacing.s5, marginBottom: spacing.s2 }}>
          {i18n.t('booking.summary')}
        </Text>
        <Card style={{ padding: spacing.s4 }}>
          <Row label={i18n.t('booking.servicePrice')} value={formatPrice(service.price, service.currency)} />
          <Row label={i18n.t('booking.bookingFee')} value={formatPrice(fee, service.currency)} />
          <View style={styles.divider} />
          <Row label={i18n.t('booking.total')} value={formatPrice(total, service.currency)} bold />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={busy ? i18n.t('common.processing') : i18n.t('booking.payAndConfirm', { amount: formatPrice(total, service.currency) })}
          onPress={onPay}
          disabled={busy}
        />
      </View>
    </Screen>
  );
}

const Row: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text variant="body" color={palette.neutral500}>{label}</Text>
    <Text variant="body" weight={bold ? '600' : '400'}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  payRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: semantic.surface,
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s4,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: palette.neutral200,
    gap: spacing.s3,
  },
  payRowSel: { borderColor: palette.navy900, backgroundColor: palette.navy50 },
  payIcon: { width: 36, height: 36, borderRadius: 999, backgroundColor: palette.navy100, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 20, height: 20, borderRadius: 999, borderWidth: 2, borderColor: palette.navy200, alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: palette.navy900 },
  radioInner: { width: 10, height: 10, borderRadius: 999, backgroundColor: palette.navy900 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.s2 },
  divider: { height: 1, backgroundColor: palette.neutral200, marginVertical: spacing.s2 },
  footer: {
    position: 'absolute', start: 0, end: 0, bottom: 0,
    paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s5,
    backgroundColor: semantic.surface, borderTopWidth: 1, borderTopColor: palette.neutral200,
  },
});
