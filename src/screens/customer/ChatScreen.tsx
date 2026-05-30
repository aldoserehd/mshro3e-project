import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import { vendorById, serviceById } from '../../data/seed';
import { palette, radius, semantic, spacing, formatPrice, pickLocale } from '../../theme/ts';
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
  const vendor = vendorById(vendorId);
  const product = productId ? serviceById(productId) : undefined;

  const initialMsgs: Msg[] = [
    {
      id: 'sys-1',
      fromMe: false,
      ts: Date.now() - 10_000,
      text: locale === 'ar'
        ? `أهلاً وسهلاً 👋 معك ${vendor ? pickLocale(vendor.name) : ''}. كيف نقدر نخدمك؟`
        : `Hi 👋 you are talking to ${vendor ? pickLocale(vendor.name) : ''}. How can we help?`,
    },
  ];

  const [msgs, setMsgs] = useState<Msg[]>(initialMsgs);
  const [draft, setDraft] = useState(
    product
      ? (locale === 'ar'
        ? `مرحبا، استفسر عن ${pickLocale(product.title)} بسعر ${formatPrice(product.price, product.currency)}`
        : `Hi, asking about ${pickLocale(product.title)} priced at ${formatPrice(product.price, product.currency)}`)
      : '',
  );

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs((prev) => [...prev, { id: `m-${Date.now()}`, text, fromMe: true, ts: Date.now() }]);
    setDraft('');
    // Auto-reply stub
    setTimeout(() => {
      setMsgs((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}r`,
          text: locale === 'ar'
            ? 'شكراً لرسالتك. سنرد عليك خلال دقائق ✨'
            : 'Thanks for your message. We will reply within minutes ✨',
          fromMe: false,
          ts: Date.now(),
        },
      ]);
    }, 1200);
  };

  if (!vendor) return null;

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color={palette.navy900} style={{ transform: [{ scaleX: -1 }] }} />
          </Pressable>
          <View style={styles.vendor}>
            <Image
              source={vendor.logoImage ? { uri: vendor.logoImage } : undefined}
              style={styles.vendorAvatar}
              contentFit="cover"
            />
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="cardTitle" numberOfLines={1}>{pickLocale(vendor.name)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={styles.greenDot} />
                <Text variant="caption" color={palette.neutral500}>
                  {locale === 'ar' ? 'يرد خلال ساعة' : 'Replies within an hour'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pinned product banner */}
        {product && (
          <View style={styles.pinned}>
            <Image source={{ uri: product.images[0] }} style={styles.pinnedImg} contentFit="cover" />
            <View style={{ flex: 1, marginStart: spacing.s3 }}>
              <Text variant="label" weight="600" numberOfLines={1}>{pickLocale(product.title)}</Text>
              <Text variant="cardTitle" color={palette.navy900} weight="700">
                {formatPrice(product.price, product.currency)}
              </Text>
            </View>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
        >
          {msgs.map((m) => (
            <View
              key={m.id}
              style={[styles.bubble, m.fromMe ? styles.bubbleMe : styles.bubbleThem]}
            >
              <Text variant="body" color={m.fromMe ? '#fff' : palette.neutral900}>{m.text}</Text>
            </View>
          ))}
          <Text variant="microcopy" color={palette.neutral500} align="center" style={{ marginTop: spacing.s4 }}>
            {locale === 'ar'
              ? 'المحادثة آمنة. إذا طلب البائع منك معلومات شخصية غير ضرورية، أبلغنا.'
              : 'Chats are private. Report any vendor asking for unnecessary personal info.'}
          </Text>
        </ScrollView>

        {/* Composer */}
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={locale === 'ar' ? 'اكتب رسالة…' : 'Type a message…'}
            placeholderTextColor={palette.neutral500}
            style={styles.input}
            multiline
            textAlignVertical="center"
          />
          <Pressable
            onPress={send}
            disabled={!draft.trim()}
            style={[styles.send, !draft.trim() && { opacity: 0.4 }]}
          >
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
    backgroundColor: semantic.surface,
    borderBottomWidth: 1, borderBottomColor: palette.neutral200,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: palette.navy50,
    alignItems: 'center', justifyContent: 'center',
  },
  vendor: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  vendorAvatar: { width: 44, height: 44, borderRadius: 999, backgroundColor: palette.navy100 },
  greenDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#2E7D45' },
  pinned: {
    flexDirection: 'row', alignItems: 'center',
    margin: spacing.s4,
    padding: spacing.s3,
    backgroundColor: palette.navy50,
    borderRadius: radius.lg,
    borderWidth: 1, borderColor: palette.navy100,
  },
  pinnedImg: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: palette.navy100 },
  messages: { padding: spacing.s4, gap: spacing.s2 },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.s4,
    paddingVertical: spacing.s3,
    borderRadius: radius.lg,
  },
  bubbleMe: {
    backgroundColor: palette.navy900,
    alignSelf: 'flex-end',
    borderBottomEndRadius: 4,
  },
  bubbleThem: {
    backgroundColor: semantic.surface,
    borderWidth: 1, borderColor: palette.neutral200,
    alignSelf: 'flex-start',
    borderBottomStartRadius: 4,
  },
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: spacing.s2,
    padding: spacing.s3,
    backgroundColor: semantic.surface,
    borderTopWidth: 1, borderTopColor: palette.neutral200,
  },
  input: {
    flex: 1,
    minHeight: 44, maxHeight: 120,
    paddingHorizontal: spacing.s4, paddingTop: spacing.s3, paddingBottom: spacing.s3,
    borderRadius: radius.full,
    backgroundColor: palette.navy50,
    borderWidth: 1, borderColor: palette.navy100,
    color: palette.neutral900,
    fontSize: 14,
  },
  send: {
    width: 44, height: 44, borderRadius: 999,
    backgroundColor: palette.navy900,
    alignItems: 'center', justifyContent: 'center',
  },
});
