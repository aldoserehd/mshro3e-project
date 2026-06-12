import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
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
import { useColors } from '../../theme/colors';
import { radius, spacing, getCurrentLocale } from '../../theme/ts';
import type { MainTabsScreenProps } from '../../navigation/types';

interface LeadRow {
  id: string;
  productTitle?: string;
  ref: string;
  createdAt?: number;
  status?: string;
}

/** "Requests" tab — the customer's WhatsApp contact history (leads they created). */
export default function RequestsScreen({ navigation }: MainTabsScreenProps<'Requests'>) {
  const c = useColors();
  const user = useUserStore((s) => s.user);
  const ar = getCurrentLocale() === 'ar';
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
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: c.brandFill }]}>
                <Ionicons name="logo-whatsapp" size={20} color={c.brandText} />
              </View>
              <View style={{ flex: 1, marginStart: spacing.s3 }}>
                <Text variant="label" weight="700" numberOfLines={1}>{item.productTitle || i18n.t('requests.product')}</Text>
                <Text variant="caption" color={c.textMuted}>{when(item.createdAt)}</Text>
              </View>
              <View style={[styles.refPill, { backgroundColor: c.surfaceAlt }]}>
                <Text variant="microcopy" weight="700" color={c.brandText} forceLtr>{item.ref}</Text>
              </View>
            </View>
          )}
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
});
