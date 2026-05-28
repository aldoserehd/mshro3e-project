import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import Header from '../../ui/Header';
import { StepRow } from './ServiceConfirmScreen';
import { useService } from '../../data/hooks';
import { palette, semantic, radius, spacing, formatPrice, pickLocale } from '../../theme/ts';
import type { RootStackScreenProps } from '../../navigation/types';

const HOUR = 60 * 60_000;
const MIN = 60_000;
const DAY = 24 * HOUR;

interface DayItem { date: Date; key: string; }
const buildDays = (count = 14): DayItem[] => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start.getTime() + i * DAY);
    return { date: d, key: d.toISOString() };
  });
};

const buildSlots = (start = 10, end = 22, intervalMin = 30): { label: string; minutesFromMidnight: number }[] => {
  const slots: { label: string; minutesFromMidnight: number }[] = [];
  for (let h = start; h < end; h++) {
    for (let m = 0; m < 60; m += intervalMin) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      slots.push({ label: `${hh}:${mm}`, minutesFromMidnight: h * 60 + m });
    }
  }
  return slots;
};

const fmtDayAr = new Intl.DateTimeFormat('ar-KW', { weekday: 'short', day: 'numeric', calendar: 'gregory' });
const fmtMonth = new Intl.DateTimeFormat('ar-KW', { month: 'long', year: 'numeric', calendar: 'gregory' });

export default function DateTimePickerScreen({ route, navigation }: RootStackScreenProps<'DateTimePicker'>) {
  const { serviceId } = route.params;
  const { data: service } = useService(serviceId);
  const days = useMemo(() => buildDays(14), []);
  const allSlots = useMemo(() => buildSlots(10, 22, 30), []);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [ampm, setAmpm] = useState<'am' | 'pm'>('am');

  const visibleSlots = useMemo(
    () => allSlots.filter((s) => (ampm === 'am' ? s.minutesFromMidnight < 12 * 60 : s.minutesFromMidnight >= 12 * 60)),
    [allSlots, ampm],
  );

  const goNext = () => {
    if (selectedSlot == null || !service) return;
    const d = new Date(days[selectedDayIdx].date.getTime() + selectedSlot * MIN);
    navigation.navigate('ConfirmPay', { serviceId, startAt: d.getTime() });
  };

  return (
    <Screen>
      <Header title={i18n.t('booking.pickTime')} onBack={() => navigation.goBack()} />
      <StepRow step={2} />

      <View style={styles.monthRow}>
        <Text variant="cardTitle">{fmtMonth.format(days[selectedDayIdx].date)}</Text>
      </View>

      <FlatList
        data={days}
        horizontal
        keyExtractor={(d) => d.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysList}
        renderItem={({ item, index }) => {
          const sel = index === selectedDayIdx;
          return (
            <Pressable
              onPress={() => {
                setSelectedDayIdx(index);
                setSelectedSlot(null);
              }}
              style={[styles.dayCard, sel && styles.dayCardSel]}
            >
              <Text variant="caption" color={sel ? '#fff' : palette.neutral500}>
                {fmtDayAr.format(item.date).split(' ')[0]}
              </Text>
              <Text variant="pageTitle" color={sel ? '#fff' : palette.neutral900}>
                {item.date.getDate()}
              </Text>
            </Pressable>
          );
        }}
      />

      <View style={styles.ampm}>
        {(['am', 'pm'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setAmpm(k)}
            style={[styles.ampmBtn, ampm === k && styles.ampmBtnActive]}
          >
            <Text variant="button" color={ampm === k ? '#fff' : palette.navy700}>
              {i18n.t(`booking.${k}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.slots}>
        <View style={styles.slotGrid}>
          {visibleSlots.map((s) => {
            const sel = selectedSlot === s.minutesFromMidnight;
            return (
              <Pressable
                key={s.label}
                onPress={() => setSelectedSlot(s.minutesFromMidnight)}
                style={[styles.slot, sel && styles.slotSel]}
              >
                <Text variant="button" color={sel ? '#fff' : palette.navy900}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text variant="caption" color={palette.neutral500}>
            {service ? formatPrice(service.price, service.currency) : ''}
          </Text>
          <Text variant="cardTitle">{i18n.t('booking.total')}</Text>
        </View>
        <Button
          title={i18n.t('common.continue')}
          onPress={goNext}
          disabled={selectedSlot == null}
          style={{ minWidth: 160 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  monthRow: { paddingHorizontal: spacing.s5, paddingTop: spacing.s2, paddingBottom: spacing.s3 },
  daysList: { paddingHorizontal: spacing.s5, gap: spacing.s2 },
  dayCard: {
    width: 60, height: 80, borderRadius: radius.lg,
    backgroundColor: palette.navy50,
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  dayCardSel: { backgroundColor: palette.navy900 },
  ampm: {
    flexDirection: 'row',
    backgroundColor: palette.navy100,
    borderRadius: 999,
    marginHorizontal: spacing.s5,
    marginTop: spacing.s4,
    padding: 4,
  },
  ampmBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 999 },
  ampmBtnActive: { backgroundColor: palette.navy900 },
  slots: { paddingHorizontal: spacing.s5, paddingTop: spacing.s4, paddingBottom: 140 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s2 },
  slot: {
    width: '31%',
    height: 44,
    borderRadius: radius.md,
    backgroundColor: palette.navy50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: palette.navy100,
  },
  slotSel: { backgroundColor: palette.navy900, borderColor: palette.navy900 },
  footer: {
    position: 'absolute', start: 0, end: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s5, paddingTop: spacing.s3, paddingBottom: spacing.s5,
    backgroundColor: semantic.surface, borderTopWidth: 1, borderTopColor: palette.neutral200,
  },
});
