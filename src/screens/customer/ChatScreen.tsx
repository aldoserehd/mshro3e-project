import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../ui/Logo';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import { Chevron } from '../../ui/Chevron';
import { LoadingState } from '../../ui/EmptyState';
import { useVendor, useService } from '../../data/hooks';
import { useColors } from '../../theme/colors';
import { radius, spacing, formatPrice, pickLocale } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import type { RootStackScreenProps } from '../../navigation/types';

interface Msg {
  id: string;
  text: string;
  fromMe: boolean;
  ts: number;
}

export default function ChatScreen({ route, navigation }: RootStackScreenProps<'Chat'>) {
  const { vendorId, productId } = route.params;
  const { locale } = useLocaleStore();
  const c = useColors();
  const { data: vendor, loading: vendorLoading } = useVendor(vendorId);
  const { data: product } = useService(productId);

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 'sys-1',
      fromMe: false,
      ts: Date.now() - 10_000,
      text: locale === 'ar' ? 'أهلاً وسهلاً 👋 كيف نقدر نخدمك؟' : 'Hi 👋 how can we help?',
    },
  ]);
  const [draft, setDraft] = useState('');

  // Prefill draft once the product loads.
  React.useEffect(() => {
    if (product && !draft) {
      setDraft(
        locale === 'ar'
          ? `مرحبا، استفسر عن ${pickLocale(product.title)} بسعر ${formatPrice(product.price, product.currency)}`
          : `Hi, asking about ${pickLocale(product.title)} priced at ${formatPrice(product.price, product.currency)}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs((prev) => [...prev, { id: `m-${Date.now()}`, text, fromMe: true, ts: Date.now() }]);
    setDraft('');
    setTimeout(() => {
      setMsgs((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}r`,
          text: locale === 'ar' ? 'شكراً لرسالتك. بنرد عليك خلال دقائق ✨' : 'Thanks! We will reply within minutes ✨',
          fromMe: false,
          ts: Date.now(),
        },
      ]);
    }, 1200);
  };

  if (!vendor) {
    return (
      <Screen>
        <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.iconBtn, { backgroundColor: c.surfaceAlt }]}>
            <Chevron direction="back" size={20} color={c.text} />
          </Pressable>
        </View>
        {vendorLoading ? (
          <LoadingState label={locale === 'ar' ? 'جاري التحميل…' : 'Loading…'} />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.s7 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={44} color={c.textMuted} />
            <Text variant="body" color={c.textMuted} style={{ marginTop: spacing.s3 }}>
              {locale === 'ar' ? 'لم نعثر على هذا المحل.' : 'This shop could not be found.'}
            </Text>
          </View>
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: c.surface, borderBottomColor: c.border }]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[styles.iconBtn, { backgroundColor: c.surfaceAlt }]}>
            <Chevron direction="back" size={20} color={c.text} />
          </Pressable>
          <View style={styles.vendor}>
            <Logo name={vendor.name.en} size={44} uri={vendor.logoImage} />
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" numberOfLines={1}>{pickLocale(vendor.name)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={styles.greenDot} />
                <Text variant="caption" color={c.textMuted}>{locale === 'ar' ? 'يرد خلال ساعة' : 'Replies within an hour'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pinned product */}
        {product && (
          <View style={[styles.pinned, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
            <Image source={{ uri: product.images?.[0] }} style={[styles.pinnedImg, { backgroundColor: c.surfaceSunken }]} contentFit="cover" />
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="label" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
              <Text variant="cardTitle" color={c.brandText} weight="700" forceLtr>{formatPrice(product.price, product.currency)}</Text>
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          {msgs.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.fromMe
                  ? { backgroundColor: c.brand, alignSelf: 'flex-end', borderBottomEndRadius: 4 }
                  : { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, alignSelf: 'flex-start', borderBottomStartRadius: 4 },
              ]}
            >
              <Text variant="body" color={m.fromMe ? '#fff' : c.text}>{m.text}</Text>
            </View>
          ))}
          <Text variant="microcopy" color={c.textMuted} align="center" style={{ marginTop: spacing.s4 }}>
            {locale === 'ar'
              ? 'المحادثة آمنة. إذا طلب البائع معلومات شخصية غير ضرورية، أبلغنا.'
              : 'Chats are private. Report any vendor asking for unnecessary personal info.'}
          </Text>
        </ScrollView>

        {/* Composer */}
        <View style={[styles.composer, { backgroundColor: c.surface, borderTopColor: c.border }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={locale === 'ar' ? 'اكتب رسالة…' : 'Type a message…'}
            placeholderTextColor={c.textMuted}
            style={[styles.input, { backgroundColor: c.surfaceSunken, borderColor: c.border, color: c.text }]}
            multiline
            textAlignVertical="center"
          />
          <Pressable onPress={send} disabled={!draft.trim()} style={[styles.send, { backgroundColor: c.brand }, !draft.trim() && { opacity: 0.4 }]}>
            <Ionicons name="paper-plane" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.s3,
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3,
    borderBottomWidth: 1,
  },
  iconBtn: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  vendor: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  greenDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#25D366' },
  pinned: {
    flexDirection: 'row', alignItems: 'center',
    margin: spacing.s4, padding: spacing.s3,
    borderRadius: radius.lg, borderWidth: 1,
  },
  pinnedImg: { width: 48, height: 48, borderRadius: radius.md },
  messages: { padding: spacing.s4, gap: spacing.s2 },
  bubble: { maxWidth: '78%', paddingHorizontal: spacing.s4, paddingVertical: spacing.s3, borderRadius: radius.lg },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.s2,
    padding: spacing.s3, borderTopWidth: 1,
  },
  input: {
    flex: 1, minHeight: 44, maxHeight: 120,
    paddingHorizontal: spacing.s4, paddingTop: spacing.s3, paddingBottom: spacing.s3,
    borderRadius: radius.full, borderWidth: 1, fontSize: 14,
  },
  send: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
