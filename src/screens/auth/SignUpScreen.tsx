import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import PasswordInput from '../../ui/PasswordInput';
import { Chevron } from '../../ui/Chevron';
import { palette, radius, spacing, getCurrentLocale } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { useLocaleStore } from '../../stores/locale';
import { useUserStore } from '../../stores/user';
import { firebaseAuth, firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import type { RootStackScreenProps } from '../../navigation/types';

interface FieldProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences';
  error?: string;
}

const Field: React.FC<FieldProps> = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize, error }) => {
  const c = useColors();
  const isRtl = getCurrentLocale() === 'ar';
  return (
    <View>
      <View style={[styles.fieldWrap, { backgroundColor: c.surface, borderColor: error ? c.danger : c.border }]}>
        <Ionicons name={icon} size={18} color={c.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={false}
          style={[styles.input, { color: c.text, textAlign: isRtl ? 'right' : 'left' }]}
        />
      </View>
      {error && (
        <Text variant="caption" color={c.danger} style={{ marginTop: 4, marginStart: spacing.s2 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default function SignUpScreen({ navigation }: RootStackScreenProps<'SignUp'>) {
  const { locale } = useLocaleStore();
  const c = useColors();
  const signUp = useUserStore((s) => s.signUp);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'phone' | 'password' | 'form', string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const t = locale === 'ar'
    ? {
        title: 'أنشئ حسابك',
        subtitle: 'سجّل ببياناتك للوصول لكل المحلات والمنتجات',
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الجوال',
        password: 'كلمة المرور',
        signUp: 'إنشاء حساب',
        signingUp: 'جاري الإنشاء…',
        haveAccount: 'لديك حساب؟',
        signIn: 'تسجيل الدخول',
        errReq: 'حقل مطلوب',
        errEmail: 'بريد إلكتروني غير صحيح',
        errPhone: 'رقم جوال غير صحيح',
        errPwShort: 'كلمة المرور قصيرة جداً (٦+ أحرف)',
        errSignUp: 'تعذّر إنشاء الحساب. حاول مرة أخرى.',
      }
    : {
        title: 'Create your account',
        subtitle: 'Sign up to access every shop and product',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone number',
        password: 'Password',
        signUp: 'Sign up',
        signingUp: 'Signing up…',
        haveAccount: 'Have an account?',
        signIn: 'Sign in',
        errReq: 'Required',
        errEmail: 'Invalid email',
        errPhone: 'Invalid phone',
        errPwShort: 'Password too short (6+ chars)',
        errSignUp: 'Could not create the account. Try again.',
      };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t.errReq;
    if (!email.trim()) e.email = t.errReq;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = t.errEmail;
    if (!phone.trim()) e.phone = t.errReq;
    else if (phone.replace(/\D/g, '').length < 8) e.phone = t.errPhone;
    if (!password) e.password = t.errReq;
    else if (password.length < 6) e.password = t.errPwShort;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    setErrors((prev) => ({ ...prev, form: undefined }));
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    try {
      const cred = await createUserWithEmailAndPassword(
        firebaseAuth(),
        trimmedEmail,
        password,
      );
      try {
        await updateProfile(cred.user, { displayName: trimmedName });
      } catch {
        // non-fatal — profile name is also stored in Firestore
      }
      await setDoc(doc(firebaseDb(), COL.users, cred.user.uid), {
        uid: cred.user.uid,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        preferredCategoryIds: [],
        createdAt: serverTimestamp(),
      });
      signUp({
        uid: cred.user.uid,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password,
      });
      navigation.replace('Preferences');
    } catch (e) {
      const code = (e as { code?: string }).code;
      let msg = (e as { message?: string }).message ?? t.errSignUp;
      if (code === 'auth/email-already-in-use') {
        msg = locale === 'ar' ? 'البريد مستخدم مسبقاً.' : 'Email already in use.';
      } else if (code === 'auth/invalid-email') {
        msg = t.errEmail;
      } else if (code === 'auth/weak-password') {
        msg = t.errPwShort;
      }
      setErrors((prev) => ({ ...prev, form: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient colors={[palette.navy900, palette.navy800]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          {/* Subtle dot pattern */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({ length: 40 }).map((_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: (i * 31) % 360,
                  top: (i * 19) % 180,
                  width: 3, height: 3, borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                }}
              />
            ))}
          </View>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Chevron direction="back" size={20} color="#fff" />
          </Pressable>
          <View style={styles.logoMark}>
            <Image source={require('../../assets/brand-mark.png')} style={{ width: 44, height: 44 }} resizeMode="contain" />
          </View>
          <Text variant="pageTitle" color="#fff" weight="700" style={{ marginTop: spacing.s3 }}>
            {t.title}
          </Text>
          <Text variant="body" color={palette.navy300} style={{ marginTop: 4 }}>
            {t.subtitle}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <View style={{ gap: spacing.s3 }}>
            <Field icon="person-outline" placeholder={t.name} value={name} onChangeText={setName} autoCapitalize="sentences" error={errors.name} />
            <Field icon="mail-outline" placeholder={t.email} value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
            <Field icon="call-outline" placeholder={t.phone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
            <PasswordInput
              placeholder={t.password}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />
          </View>

          {errors.form && (
            <Text variant="caption" color={c.danger} style={{ marginTop: spacing.s3 }}>
              {errors.form}
            </Text>
          )}

          <Button
            title={submitting ? t.signingUp : t.signUp}
            onPress={onSubmit}
            disabled={submitting}
            style={{ marginTop: spacing.s5 }}
          />

          <View style={styles.bottomRow}>
            <Text variant="body" color={c.textMuted}>{t.haveAccount}</Text>
            <Pressable onPress={() => navigation.replace('SignIn')} hitSlop={8}>
              <Text variant="body" weight="600" color={c.brandText} style={{ marginStart: 4 }}>{t.signIn}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s6,
    paddingBottom: spacing.s7,
    borderBottomStartRadius: radius.xl,
    borderBottomEndRadius: radius.xl,
    overflow: 'hidden',
  },
  backBtn: {
    // Physical left — back buttons live on the LEFT in both directions.
    position: 'absolute', top: spacing.s4, left: spacing.s4,
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoMark: {
    width: 64, height: 64, borderRadius: radius.lg,
    backgroundColor: '#ffffff',
    alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.s5,
  },
  form: { padding: spacing.s5, paddingBottom: spacing.s7 },
  fieldWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s4,
    height: 52,
    gap: spacing.s2,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  bottomRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: spacing.s5,
  },
});
