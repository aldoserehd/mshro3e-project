import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import PasswordInput from '../../ui/PasswordInput';
import ForgotPasswordSheet from '../../ui/ForgotPasswordSheet';
import { Chevron } from '../../ui/Chevron';
import { palette, radius, spacing } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { useLocaleStore } from '../../stores/locale';
import { useUserStore } from '../../stores/user';
import { firebaseAuth, firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import type { RootStackScreenProps } from '../../navigation/types';

export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
  const { locale } = useLocaleStore();
  const c = useColors();
  const isRtl = locale === 'ar';
  const hydrate = useUserStore((s) => s.hydrate);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const t = locale === 'ar'
    ? { title: 'مرحباً بعودتك', subtitle: 'سجّل دخولك للمتابعة',
        identifier: 'البريد أو رقم الجوال', password: 'كلمة المرور',
        signIn: 'تسجيل الدخول', signingIn: 'جاري الدخول…',
        noAccount: 'ليس لديك حساب؟', signUp: 'إنشاء حساب',
        forgot: 'نسيت كلمة المرور؟', err: 'الرجاء تعبئة الحقول',
        errBadCreds: 'البريد أو كلمة المرور غير صحيحة.',
        errGeneric: 'تعذّر تسجيل الدخول.' }
    : { title: 'Welcome back', subtitle: 'Sign in to continue',
        identifier: 'Email or phone', password: 'Password',
        signIn: 'Sign in', signingIn: 'Signing in…',
        noAccount: "Don't have an account?", signUp: 'Sign up',
        forgot: 'Forgot password?', err: 'Please fill in all fields',
        errBadCreds: 'Wrong email or password.',
        errGeneric: 'Could not sign in.' };

  const onSubmit = async () => {
    if (!identifier.trim() || !password) {
      setErr(t.err);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setErr('');
    try {
      const cred = await signInWithEmailAndPassword(
        firebaseAuth(),
        identifier.trim(),
        password,
      );
      try {
        const snap = await getDoc(doc(firebaseDb(), COL.users, cred.user.uid));
        if (snap.exists()) {
          const data = snap.data() as {
            name?: string;
            email?: string;
            phone?: string;
            preferredCategoryIds?: string[];
          };
          hydrate({
            uid: cred.user.uid,
            name: data.name ?? cred.user.displayName ?? '',
            email: data.email ?? cred.user.email ?? identifier.trim(),
            phone: data.phone ?? '',
            preferredCategoryIds: data.preferredCategoryIds ?? [],
            isAuthenticated: true,
          });
        } else {
          hydrate({
            uid: cred.user.uid,
            name: cred.user.displayName ?? '',
            email: cred.user.email ?? identifier.trim(),
            phone: '',
            preferredCategoryIds: [],
            isAuthenticated: true,
          });
        }
      } catch {
        // hydration failure is non-fatal — the auth listener will retry
      }
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        setErr(t.errBadCreds);
      } else {
        setErr((e as { message?: string }).message ?? t.errGeneric);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.hero}>
          <LinearGradient colors={[palette.navy900, palette.navy800]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({ length: 40 }).map((_, i) => (
              <View key={i} style={{
                position: 'absolute', left: (i * 31) % 360, top: (i * 19) % 180,
                width: 3, height: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)',
              }} />
            ))}
          </View>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Chevron direction="back" size={20} color="#fff" />
          </Pressable>
          <View style={styles.logoMark}>
            <Text variant="hero" color="#fff" weight="800" style={{ fontSize: 28 }}>م</Text>
          </View>
          <Text variant="pageTitle" color="#fff" weight="700" style={{ marginTop: spacing.s3 }}>{t.title}</Text>
          <Text variant="body" color={palette.navy300} style={{ marginTop: 4 }}>{t.subtitle}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <View style={{ gap: spacing.s3 }}>
            <View style={[styles.fieldWrap, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Ionicons name="at-outline" size={18} color={c.textMuted} />
              <TextInput
                value={identifier}
                onChangeText={(v) => { setIdentifier(v); setErr(''); }}
                placeholder={t.identifier}
                placeholderTextColor={c.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={[styles.input, { color: c.text, textAlign: isRtl ? 'right' : 'left' }]}
              />
            </View>
            <PasswordInput
              value={password}
              onChangeText={(v) => { setPassword(v); setErr(''); }}
              placeholder={t.password}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />
          </View>

          {err.length > 0 && (
            <Text variant="caption" color={c.danger} style={{ marginTop: spacing.s2 }}>{err}</Text>
          )}

          <Pressable onPress={() => setForgotOpen(true)} hitSlop={8} style={{ alignSelf: 'flex-end', marginTop: spacing.s2 }}>
            <Text variant="label" color={c.brandText}>{t.forgot}</Text>
          </Pressable>

          <Button
            title={submitting ? t.signingIn : t.signIn}
            onPress={onSubmit}
            disabled={submitting}
            style={{ marginTop: spacing.s5 }}
          />

          <View style={styles.bottomRow}>
            <Text variant="body" color={c.textMuted}>{t.noAccount}</Text>
            <Pressable onPress={() => navigation.replace('SignUp')} hitSlop={8}>
              <Text variant="body" weight="600" color={c.brandText} style={{ marginStart: 4 }}>{t.signUp}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotPasswordSheet
        visible={forgotOpen}
        initialEmail={identifier}
        onClose={() => setForgotOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.s5, paddingTop: spacing.s6, paddingBottom: spacing.s7,
    borderBottomStartRadius: radius.xl, borderBottomEndRadius: radius.xl,
    overflow: 'hidden',
  },
  backBtn: {
    position: 'absolute', top: spacing.s4, start: spacing.s4,
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoMark: {
    width: 64, height: 64, borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.s5,
  },
  form: { padding: spacing.s5, paddingBottom: spacing.s7 },
  fieldWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s4, height: 52, gap: spacing.s2,
  },
  input: { flex: 1, fontSize: 15 },
  bottomRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.s5,
  },
});
