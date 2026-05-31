import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Card from '../../ui/Card';
import { Chevron } from '../../ui/Chevron';
import { palette, radius, semantic, spacing } from '../../theme/ts';
import { useLocaleStore } from '../../stores/locale';
import type { RootStackScreenProps } from '../../navigation/types';

const COPY: Record<string, { ar: { title: string; intro: string; body: string[] }; en: { title: string; intro: string; body: string[] } }> = {
  notifications: {
    ar: {
      title: 'الإشعارات',
      intro: 'تحكّم في الإشعارات التي تصلك من مشروعي.',
      body: [
        '• إشعارات عند صدور منتجات جديدة من البائعين اللي تتابعهم.',
        '• إشعارات عند الردّ على رسائلك داخل التطبيق.',
        '• إشعارات تخفيضات وعروض موسمية.',
        'سنُفعّل التحكم التفصيلي قريباً.',
      ],
    },
    en: {
      title: 'Notifications',
      intro: 'Control which notifications you receive from Mshro3e.',
      body: [
        '• Alerts when followed vendors post new products.',
        '• Alerts when vendors reply to your in-app messages.',
        '• Deal and seasonal promotion alerts.',
        'Granular controls are coming soon.',
      ],
    },
  },
  about: {
    ar: {
      title: 'عن مشروعي',
      intro: 'منصة كويتية لدعم المشاريع المنزلية والصغيرة.',
      body: [
        'مشروعي يربط بين العملاء والبائعين الكويتيين بمنتجات فريدة من بيوتهم.',
        'نحن لا نتولّى الدفع ولا التوصيل — تتم الترتيبات مباشرة بين العميل والبائع عبر واتساب أو محادثة التطبيق.',
        '٠٪ رسوم على المبيعات. اشتراك شهري بسيط للبائعين فقط (٩ / ١٥ / ٢٣ د.ك).',
        'صنع في الكويت 🇰🇼',
      ],
    },
    en: {
      title: 'About Mshro3e',
      intro: 'A Kuwaiti platform supporting home and small businesses.',
      body: [
        'Mshro3e connects customers with Kuwaiti vendors selling unique handmade products.',
        'We do not handle payment or delivery — arrangements happen directly between customer and vendor via WhatsApp or in-app chat.',
        '0% transaction fees. Simple monthly subscription for vendors only (9 / 15 / 23 KWD).',
        'Made in Kuwait 🇰🇼',
      ],
    },
  },
  help: {
    ar: {
      title: 'المساعدة والدعم',
      intro: 'فريقنا متاح للرد على استفساراتك.',
      body: [
        '📧 البريد: support@mshro3e.kw',
        '💬 واتساب: +965 5000 0000',
        '⏰ ساعات الدعم: الأحد إلى الخميس، ٩ ص — ٦ م بتوقيت الكويت.',
        'الأسئلة الشائعة والمقالات قريباً.',
      ],
    },
    en: {
      title: 'Help & support',
      intro: 'Our team is here to answer your questions.',
      body: [
        '📧 Email: support@mshro3e.kw',
        '💬 WhatsApp: +965 5000 0000',
        '⏰ Support hours: Sunday – Thursday, 9 AM – 6 PM Kuwait time.',
        'FAQ and articles coming soon.',
      ],
    },
  },
  privacy: {
    ar: {
      title: 'سياسة الخصوصية',
      intro: 'كيف نتعامل مع بياناتك.',
      body: [
        '• نطلب الاسم والبريد ورقم الجوال فقط لإنشاء الحساب.',
        '• لا نشارك بياناتك مع أي طرف ثالث.',
        '• بإمكانك حذف حسابك في أي وقت من الإعدادات.',
        '• تفاصيل قانونية كاملة قريباً.',
      ],
    },
    en: {
      title: 'Privacy policy',
      intro: 'How we handle your data.',
      body: [
        '• We only collect your name, email, and phone for account creation.',
        '• We never share your data with third parties.',
        '• You can delete your account at any time from Settings.',
        '• Full legal text coming soon.',
      ],
    },
  },
};

export default function InfoScreen({ route, navigation }: RootStackScreenProps<'Info'>) {
  const { locale } = useLocaleStore();
  const { topic } = route.params;
  const copy = COPY[topic]?.[locale] ?? COPY.about[locale];

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <Chevron direction="back" size={20} color={palette.navy900} />
        </Pressable>
        <Text variant="cardTitle" weight="700">{copy.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="body" color={palette.neutral500} style={{ marginBottom: spacing.s4 }}>
          {copy.intro}
        </Text>
        <Card style={styles.card}>
          {copy.body.map((line, i) => (
            <Text key={i} variant="body" color={palette.neutral900} style={{ marginBottom: spacing.s2 }}>
              {line}
            </Text>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3,
    backgroundColor: semantic.surface,
    borderBottomWidth: 1, borderBottomColor: palette.navy100,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: palette.navy50,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { padding: spacing.s5, paddingBottom: spacing.s8 },
  card: { padding: spacing.s4 },
});
