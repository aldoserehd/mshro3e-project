import React from 'react';
import { Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Text from './Text';
import Button from './Button';
import { radius, spacing } from '../theme/ts';
import { useColors } from '../theme/colors';
import { useLocaleStore } from '../stores/locale';
import { VENDOR_SITE_URL } from '../config';
import { BRAND } from '../brand';

export interface VendorCtaSheetProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * "List your business on Mshro3e" explainer sheet. Honest about the model:
 * customers browse free, vendors get WhatsApp leads, and sign-up + plans
 * happen on the public website (we never take payment in-app). The primary
 * button opens VENDOR_SITE_URL in the browser.
 */
export const VendorCtaSheet: React.FC<VendorCtaSheetProps> = ({ visible, onClose }) => {
  const c = useColors();
  const { locale } = useLocaleStore();
  const ar = locale === 'ar';

  const t = ar
    ? {
        title: `اعرض مشروعك على ${BRAND.ar}`,
        subtitle: 'وصّل منتجاتك لعملاء يدوّرون عليك بالكويت.',
        cta: 'سجّل مشروعك',
        later: 'مو الحين',
        bullets: [
          { icon: 'eye-outline' as const, text: 'التصفّح مجاني للعملاء — بدون اشتراك ولا تسجيل.' },
          { icon: 'logo-whatsapp' as const, text: 'العميل يكلّمك مباشرة على واتساب، والطلبات توصلك بدون وسيط.' },
          { icon: 'pricetags-outline' as const, text: 'خطط بسيطة: اشتراك شهر أو ٣ أشهر. التسجيل والدفع على الموقع.' },
          { icon: 'shield-checkmark-outline' as const, text: 'ما نتدخّل بالدفع ولا التوصيل — الترتيب بينك وبين العميل.' },
        ],
        note: `بنفتح لك موقع ${BRAND.ar} للتسجيل واختيار الخطة.`,
      }
    : {
        title: `List your business on ${BRAND.en}`,
        subtitle: 'Get your products in front of customers searching across Kuwait.',
        cta: 'List your business',
        later: 'Not now',
        bullets: [
          { icon: 'eye-outline' as const, text: 'Browsing is free for customers — no signup, no account needed.' },
          { icon: 'logo-whatsapp' as const, text: 'Customers message you directly on WhatsApp — leads reach you, no middleman.' },
          { icon: 'pricetags-outline' as const, text: 'Simple plans: 1 month or 3 months. Sign-up and payment happen on the website.' },
          { icon: 'shield-checkmark-outline' as const, text: "We don't handle payment or delivery — you arrange that with the customer." },
        ],
        note: `We'll open the ${BRAND.en} site so you can register and pick a plan.`,
      };

  const openSite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Linking.openURL(VENDOR_SITE_URL).catch(() => {});
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.handle, { backgroundColor: c.borderStrong }]} />

          {/* Brand hero */}
          <View style={styles.hero}>
            <LinearGradient
              colors={[c.brandDark, c.brand]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroIcon}>
              <Ionicons name="storefront-outline" size={26} color="#fff" />
            </View>
            <Text variant="cardTitle" weight="700" color="#fff" align="center" style={{ marginTop: spacing.s3 }}>
              {t.title}
            </Text>
            <Text variant="body" color="rgba(255,255,255,0.86)" align="center" style={{ marginTop: 4 }}>
              {t.subtitle}
            </Text>
          </View>

          <View style={styles.bullets}>
            {t.bullets.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletIcon, { backgroundColor: c.brandFill }]}>
                  <Ionicons name={b.icon} size={18} color={c.brandText} />
                </View>
                <Text variant="body" style={{ flex: 1, marginStart: spacing.s3 }}>{b.text}</Text>
              </View>
            ))}
          </View>

          <Text variant="caption" color={c.textMuted} align="center" style={{ marginTop: spacing.s2 }}>
            {t.note}
          </Text>

          <Button title={t.cta} icon="open-outline" iconPosition="trailing" onPress={openSite} fullWidth style={{ marginTop: spacing.s4 }} />
          <Pressable onPress={onClose} hitSlop={8} style={styles.laterBtn}>
            <Text variant="label" weight="600" color={c.textMuted}>{t.later}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default VendorCtaSheet;

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopStartRadius: radius.xl,
    borderTopEndRadius: radius.xl,
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s3,
    paddingBottom: spacing.s7,
  },
  handle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 999, marginBottom: spacing.s4 },
  hero: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: spacing.s5,
    paddingHorizontal: spacing.s4,
  },
  heroIcon: {
    width: 52, height: 52, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center', justifyContent: 'center',
  },
  bullets: { marginTop: spacing.s4, gap: spacing.s3 },
  bulletRow: { flexDirection: 'row', alignItems: 'center' },
  bulletIcon: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  laterBtn: { alignSelf: 'center', paddingVertical: spacing.s3, marginTop: spacing.s1 },
});
