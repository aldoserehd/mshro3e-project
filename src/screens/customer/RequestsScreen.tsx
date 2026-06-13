import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import NavyHero from '../../ui/NavyHero';
import Button from '../../ui/Button';
import { LoadingState } from '../../ui/EmptyState';
import { firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import { useUserStore } from '../../stores/user';
import { useVendors } from '../../data/hooks';
import { useColors } from '../../theme/colors';
import { radius, spacing, getCurrentLocale } from '../../theme/ts';
import type { MainTabsScreenProps } from '../../navigation/types';

interface LeadRow {
  id: string;
  vendorId?: string;
  productTitle?: string;
  ref: string;
  createdAt?: number;
  status?: string;
}

/** "Requests" tab — the customer's WhatsApp contact history (leads they created). */
export default function RequestsScreen({ navigation }: MainTabsScreenProps<'Requests'>) {
  const c = useColors();
  const user = useUserStore((s) => s.user);
  const { data: vendors } = useVendors();
  const ar = getCurrentLocale() === 'ar';
  const vendorMap = useMemo(
    () => Object.fromEntries(vendors.map((v) => [v.id, v])),
    [vendors],
  );

  /** The conversation lives in WhatsApp — reopen it with the vendor. */
  const reopenChat = (lead: LeadRow) => {
    const v = lead.vendorId ? vendorMap[lead.vendorId] : undefined;
    const phone = (v?.whatsapp ?? v?.phone ?? '').replace(/[^\d]/g, '');
    if (!phone) return;
    Linking.openURL(`https://wa.me/${phone}`).catch(() => {});
  };
  const [rows, setRows] = useState<LeadRow[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.uid) { setRows([]); return; }
    try {
      const snap = await getDocs(
        query(collection(firebaseDb(), COL.leads), where('customerUid', '==', user.uid)),
      );
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as object) }) as LeadRow)
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setRows(list);
    } catch {
      setRows([]);
    }
  }, [user?.uid]);

  useEffect(() => { load(); }, [load]);

  const when = (ts?: number) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleDateString(ar ? 'ar-KW' : 'en-US', { dateStyle: 'medium' }); }
    catch { return ''; }
  };

  return (
    <Screen>
      <NavyHero
        eyebrow={i18n.t('requests.subtitle')}
        title={i18n.t('requests.title')}
        pattern="dots"
      />
      {!user ? (
        <View style={styles.center}>
          <Ionicons name="person-circle-outline" size={48} color={c.textMuted} />
          <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: spacing.s2 }}>
            {i18n.t('requests.signInHint')}
          </Text>
          <Button title={i18n.t('requests.signInCta')} onPress={() => navigation.navigate('SignIn')} style={{ marginTop: spacing.s4 }} />
        </View>
      ) : rows === null ? (
        <LoadingState style={{ paddingTop: spacing.s8 }} />
      ) : rows.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="logo-whatsapp" size={48} color={c.textMuted} />
          <Text variant="cardTitle" weight="700" align="center" style={{ marginTop: spacing.s3 }}>
            {i18n.t('requests.emptyTitle')}
          </Text>
          <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: spacing.s1 }}>
            {i18n.t('requests.emptyBody')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: spacing.s5, paddingBottom: 130, gap: spacing.s3 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
          ListHeaderComponent={
            <View style={[styles.hint, { backgroundColor: c.surfaceAlt }]}>
              <Ionicons name="information-circle-outline" size={16} color={c.textMuted} />
              <Text variant="caption" color={c.textMuted} style={{ flex: 1, marginStart: 6 }}>
                {ar
                  ? 'المحادثة نفسها تصير في واتساب — هذا سجل طلباتك، واضغط أي طلب عشان تكمل المحادثة.'
                  : 'The conversation happens in WhatsApp — this is your request log. Tap one to continue the chat.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const v = item.vendorId ? vendorMap[item.vendorId] : undefined;
            return (
              <Pressable onPress={() => reopenChat(item)} style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
                <View style={[styles.iconWrap, { backgroundColor: 'rgba(37,211,102,0.12)' }]}>
                  <Ionicons name="logo-whatsapp" size={20} color={c.whatsappDark} />
                </View>
                <View style={{ flex: 1, marginStart: spacing.s3 }}>
                  <Text variant="label" weight="700" numberOfLines={1}>{item.productTitle || i18n.t('requests.product')}</Text>
                  <Text variant="caption" color={c.textMuted} numberOfLines={1}>
                    {v ? `${ar ? v.name.ar : v.name.en} · ` : ''}{when(item.createdAt)}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <View style={[styles.refPill, { backgroundColor: c.surfaceAlt }]}>
                    <Text variant="microcopy" weight="700" color={c.brandText} forceLtr>{item.ref}</Text>
                  </View>
                  {v ? (
                    <Text variant="microcopy" weight="600" color={c.whatsappDark}>
                      {ar ? 'كمّل المحادثة ←' : 'Continue chat →'}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.s7 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: radius.lg, padding: spacing.s4,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  refPill: { paddingHorizontal: spacing.s2, paddingVertical: 4, borderRadius: 999 },
  hint: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: radius.lg, padding: spacing.s3, marginBottom: spacing.s3,
  },
});
