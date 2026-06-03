import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import Text from './Text';
import Button from './Button';
import { radius, spacing } from '../theme/ts';
import { useColors } from '../theme/colors';
import { useLocaleStore } from '../stores/locale';
import { firebaseAuth } from '@shared/firebase';

export interface ForgotPasswordSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Prefill from whatever the user already typed on the sign-in form. */
  initialEmail?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * "Forgot password" bottom sheet. Collects an email, fires
 * `sendPasswordResetEmail`, and shows a success confirmation or a friendly
 * error. Fully bilingual + theme-aware.
 */
export const ForgotPasswordSheet: React.FC<ForgotPasswordSheetProps> = ({
  visible,
  onClose,
  initialEmail = '',
}) => {
  const c = useColors();
  const { locale } = useLocaleStore();
  const ar = locale === 'ar';
  const isRtl = ar;

  const [email, setEmail] = useState(initialEmail);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // Reset transient state every time the sheet opens, seeding the email.
  useEffect(() => {
    if (visible) {
      setEmail(initialEmail);
      setErr('');
      setSent(false);
      setSubmitting(false);
    }
  }, [visible, initialEmail]);

  const t = ar
    ? {
        title: 'نسيت كلمة المرور؟',
        body: 'اكتب بريدك الإلكتروني وبنرسل لك رابط لإعادة تعيين كلمة المرور.',
        email: 'البريد الإلكتروني',
        send: 'إرسال الرابط',
        sending: 'جاري الإرسال…',
        cancel: 'إلغاء',
        done: 'تمام',
        errEmpty: 'اكتب بريدك الإلكتروني.',
        errInvalid: 'بريد إلكتروني غير صحيح.',
        errGeneric: 'تعذّر إرسال الرابط. حاول مرة ثانية.',
        successTitle: 'وصلتك الرسالة',
        successBody: 'إذا كان هذا البريد مسجّل عندنا، بتلقى رابط إعادة التعيين في بريدك. تأكد من مجلد الـ Spam.',
      }
    : {
        title: 'Forgot password?',
        body: "Enter your email and we'll send you a link to reset your password.",
        email: 'Email',
        send: 'Send reset link',
        sending: 'Sending…',
        cancel: 'Cancel',
        done: 'Done',
        errEmpty: 'Enter your email.',
        errInvalid: 'Invalid email address.',
        errGeneric: "Couldn't send the link. Try again.",
        successTitle: 'Check your inbox',
        successBody: "If that email is registered, you'll get a reset link shortly. Check your spam folder too.",
      };

  const onSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed) { setErr(t.errEmpty); return; }
    if (!EMAIL_RE.test(trimmed)) { setErr(t.errInvalid); return; }
    if (submitting) return;
    setSubmitting(true);
    setErr('');
    try {
      await sendPasswordResetEmail(firebaseAuth(), trimmed);
      setSent(true);
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === 'auth/invalid-email') setErr(t.errInvalid);
      // For privacy we don't reveal whether the account exists — treat
      // user-not-found as success.
      else if (code === 'auth/user-not-found') setSent(true);
      else setErr(t.errGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={onClose}>
          <Pressable style={[styles.sheet, { backgroundColor: c.surface }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.handle, { backgroundColor: c.borderStrong }]} />

            {sent ? (
              <View style={styles.successWrap}>
                <View style={[styles.successIcon, { backgroundColor: c.isDark ? 'rgba(37,211,102,0.16)' : '#E8F8EE' }]}>
                  <Ionicons name="mail-open-outline" size={30} color={c.whatsappDark} />
                </View>
                <Text variant="cardTitle" weight="700" align="center" style={{ marginTop: spacing.s4 }}>
                  {t.successTitle}
                </Text>
                <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: spacing.s2 }}>
                  {t.successBody}
                </Text>
                <Button title={t.done} onPress={onClose} fullWidth style={{ marginTop: spacing.s5 }} />
              </View>
            ) : (
              <>
                <Text variant="cardTitle" weight="700">{t.title}</Text>
                <Text variant="body" color={c.textMuted} style={{ marginTop: spacing.s2 }}>{t.body}</Text>

                <View style={[styles.fieldWrap, { backgroundColor: c.surfaceSunken, borderColor: err ? c.danger : c.border }]}>
                  <Ionicons name="mail-outline" size={18} color={c.textMuted} />
                  <TextInput
                    value={email}
                    onChangeText={(v) => { setEmail(v); setErr(''); }}
                    placeholder={t.email}
                    placeholderTextColor={c.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                    returnKeyType="send"
                    onSubmitEditing={onSubmit}
                    style={[styles.input, { color: c.text, textAlign: isRtl ? 'right' : 'left' }]}
                  />
                </View>
                {err ? (
                  <Text variant="caption" color={c.danger} style={{ marginTop: 6 }}>{err}</Text>
                ) : null}

                <Button
                  title={submitting ? t.sending : t.send}
                  onPress={onSubmit}
                  disabled={submitting}
                  fullWidth
                  style={{ marginTop: spacing.s4 }}
                />
                <Pressable onPress={onClose} hitSlop={8} style={styles.cancelBtn}>
                  <Text variant="label" weight="600" color={c.textMuted}>{t.cancel}</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ForgotPasswordSheet;

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
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s4,
    height: 52,
    gap: spacing.s2,
    marginTop: spacing.s4,
  },
  input: { flex: 1, fontSize: 15 },
  cancelBtn: { alignSelf: 'center', paddingVertical: spacing.s3, marginTop: spacing.s1 },
  successWrap: { alignItems: 'center', paddingTop: spacing.s2 },
  successIcon: { width: 64, height: 64, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
