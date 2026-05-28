import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Header from '../../ui/Header';
import { useService } from '../../data/hooks';
import { vendorById } from '../../data/seed';
import { palette, semantic, radius, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

const Step: React.FC<{ n: number; active?: boolean; done?: boolean }> = ({ n, active, done }) => (
  <View
    style={[
      stepStyles.dot,
      { backgroundColor: done ? palette.navy900 : active ? palette.navy600 : palette.navy200 },
    ]}
  >
    {done ? (
      <Ionicons name="checkmark" size={14} color="#fff" />
    ) : (
      <Text variant="label" color={active ? '#fff' : palette.navy700} weight="700">
        {n}
      </Text>
    )}
  </View>
);

export const StepRow: React.FC<{ step: 1 | 2 | 3 }> = ({ step }) => (
  <View style={stepStyles.row}>
    <Step n={1} done={step > 1} active={step === 1} />
    <View style={[stepStyles.line, { backgroundColor: step > 1 ? palette.navy900 : palette.navy200 }]} />
    <Step n={2} done={step > 2} active={step === 2} />
    <View style={[stepStyles.line, { backgroundColor: step > 2 ? palette.navy900 : palette.navy200 }]} />
    <Step n={3} active={step === 3} />
  </View>
);

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s5, paddingVertical: spacing.s4, gap: spacing.s2 },
  dot: { width: 28, height: 28, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, height: 2 },
});

export default function ServiceConfirmScreen({ route, navigation }: RootStackScreenProps<'ServiceConfirm'>) {
  const { serviceId } = route.params;
  const { data: service } = useService(serviceId);

  if (!service) return null;
  const vendor = vendorById(service.vendorId);

  return (
    <Screen>
      <Header title={i18n.t('booking.confirmService')} onBack={() => navigation.goBack()} />
      <StepRow step={1} />

      <ScrollView contentContainerStyle={{ padding: spacing.s5, paddingBottom: 120 }}>
        <Card style={styles.serviceCard}>
          <Image source={{ uri: service.images[0] }} style={styles.img} contentFit="cover" />
          <View style={{ flex: 1, marginStart: spacing.s4, gap: 4 }}>
            <Text variant="cardTitle" numberOfLines={2}>{pickLocale(service.title)}</Text>
            {vendor && (
              <Text variant="caption" color={palette.neutral500}>{pickLocale(vendor.name)}</Text>
            )}
            <View style={{ flexDirection: 'row', gap: spacing.s2, marginTop: spacing.s1 }}>
              <View style={styles.chip}>
                <Text variant="label" color={palette.navy700}>
                  {service.durationMinutes} {i18n.t('common.min')}
                </Text>
              </View>
              <View style={styles.chip}>
                <Text variant="label" color={palette.navy700}>{formatPrice(service.price, service.currency)}</Text>
              </View>
            </View>
          </View>
        </Card>

        <Text variant="sectionTitle" style={{ marginTop: spacing.s5, marginBottom: spacing.s2 }}>
          {i18n.t('booking.summary')}
        </Text>
        <Card style={{ padding: spacing.s4 }}>
          <Row label={i18n.t('booking.service')} value={pickLocale(service.title)} />
          <Row label={i18n.t('booking.duration')} value={`${service.durationMinutes} ${i18n.t('common.min')}`} />
          <Row label={i18n.t('booking.price')} value={formatPrice(service.price, service.currency)} bold />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={i18n.t('common.continue')}
          onPress={() => navigation.navigate('DateTimePicker', { serviceId })}
        />
      </View>
    </Screen>
  );
}

const Row: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text variant="body" color={palette.neutral500}>{label}</Text>
    <Text variant="body" weight={bold ? '600' : '400'} style={{ flex: 1, textAlign: 'right' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  serviceCard: { flexDirection: 'row', padding: spacing.s3 },
  img: { width: 88, height: 88, borderRadius: radius.md, backgroundColor: palette.navy100 },
  chip: {
    backgroundColor: palette.navy100,
    paddingHorizontal: spacing.s3, paddingVertical: 4,
    borderRadius: 999,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.s2 },
  footer: {
    position: 'absolute', start: 0, end: 0, bottom: 0,
    paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s5,
    backgroundColor: semantic.surface, borderTopWidth: 1, borderTopColor: palette.neutral200,
  },
});
