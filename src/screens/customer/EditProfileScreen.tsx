import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import Avatar from '../../ui/Avatar';
import { TopBar } from '../../ui/SettingsKit';
import { useCategories } from '../../data/hooks';
import { useUserStore } from '../../stores/user';
import { useLocaleStore } from '../../stores/locale';
import { useColors } from '../../theme/colors';
import { radius, spacing, pickLocale } from '../../theme/ts';
import { firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import type { RootStackScreenProps } from '../../navigation/types';

export default function EditProfileScreen({ navigation }: RootStackScreenProps<'Profile'>) {
  const { locale } = useLocaleStore();
  const c = useColors();
  const ar = locale === 'ar';
  const user = useUserStore((s) => s.user);
  const updateProfile = useUserStore((s) => s.updateProfile);
  const { data: categories } = useCategories();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [interests, setInterests] = useState<Set<string>>(new Set(user?.preferredCategoryIds ?? []));
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) =>
    setInterests((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  // ── Guest state ──
  if (!user?.isAuthenticated) {
    return (
      <Screen>
        <TopBar title={i18n.t('profile.title')} onBack={() => navigation.goBack()} />
        <View style={styles.guest}>
          <View style={[styles.guestIcon, { backgroundColor: c.brandFill }]}>
            <Ionicons name="person-circle-outline" size={44} color={c.brandText} />
          </View>
          <Text variant="sectionTitle" weight="700" align="center" style={{ marginTop: spacing.s4 }}>
            {i18n.t('profile.guestTitle')}
          </Text>
          <Text variant="body" color={c.textMuted} align="center" style={{ marginTop: 6, maxWidth: 300 }}>
            {i18n.t('profile.guestBody')}
          </Text>
          <Button title={i18n.t('profile.signIn')} onPress={() => navigation.navigate('SignIn')} fullWidth style={{ marginTop: spacing.s6 }} />
          <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8} style={{ marginTop: spacing.s4 }}>
            <Text variant="body" weight="600" color={c.brandText}>{i18n.t('profile.createAccount')}</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    const ids = Array.from(interests);
    updateProfile({ name: name.trim(), phone: phone.trim(), preferredCategoryIds: ids });
    if (user.uid) {
      try {
        await updateDoc(doc(firebaseDb(), COL.users, user.uid), {
          name: name.trim(),
          phone: phone.trim(),
          preferredCategoryIds: ids,
        });
      } catch (e) {
        // Non-fatal: local store already updated.
        console.warn('[profile] save failed', e);
      }
    }
    setSaving(false);
    Alert.alert(i18n.t('profile.saved'));
    navigation.goBack();
  };

  return (
    <Screen>
      <TopBar title={i18n.t('profile.edit')} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Avatar name={name || 'Guest'} size={96} />
          </View>

          {/* Fields */}
          <Field label={i18n.t('profile.name')}>
            <Input value={name} onChangeText={setName} placeholder={i18n.t('profile.namePh')} ar={ar} />
          </Field>

          <Field label={i18n.t('profile.email')}>
            <View style={[styles.input, styles.inputLocked, { backgroundColor: c.surfaceSunken, borderColor: c.border }]}>
              <Text variant="body" color={c.textMuted} numberOfLines={1}>{user.email || '—'}</Text>
              <Ionicons name="lock-closed" size={14} color={c.textMuted} />
            </View>
            <Text variant="caption" color={c.textMuted} style={{ marginTop: 4 }}>{i18n.t('profile.emailLocked')}</Text>
          </Field>

          <Field label={i18n.t('profile.phone')}>
            <Input value={phone} onChangeText={setPhone} placeholder={i18n.t('profile.phonePh')} keyboardType="phone-pad" ar={ar} />
          </Field>

          {/* Interests */}
          <Text variant="label" weight="700" color={c.textMuted} style={{ marginTop: spacing.s5, marginBottom: 2 }}>
            {i18n.t('profile.interests')}
          </Text>
          <Text variant="caption" color={c.textMuted} style={{ marginBottom: spacing.s3 }}>{i18n.t('profile.interestsHint')}</Text>
          <View style={styles.chips}>
            {categories.map((cat) => {
              const on = interests.has(cat.id);
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => toggle(cat.id)}
                  style={[styles.chip, { backgroundColor: on ? c.brand : c.surface, borderColor: on ? c.brand : c.border }]}
                >
                  <Text style={{ fontSize: 15, marginEnd: 5 }}>{cat.emoji ?? '🏷️'}</Text>
                  <Text variant="label" weight="600" color={on ? '#fff' : c.text}>{pickLocale(cat.name)}</Text>
                </Pressable>
              );
            })}
          </View>

          <Button title={saving ? i18n.t('profile.saving') : i18n.t('profile.save')} onPress={onSave} disabled={saving} fullWidth style={{ marginTop: spacing.s6 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const c = useColors();
  return (
    <View style={{ marginTop: spacing.s4 }}>
      <Text variant="label" weight="600" color={c.textMuted} style={{ marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
};

const Input: React.FC<{
  value: string; onChangeText: (v: string) => void; placeholder?: string;
  keyboardType?: 'default' | 'phone-pad'; ar: boolean;
}> = ({ value, onChangeText, placeholder, keyboardType, ar }) => {
  const c = useColors();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={c.textMuted}
      keyboardType={keyboardType ?? 'default'}
      style={[styles.input, { backgroundColor: c.surface, borderColor: c.border, color: c.text, textAlign: ar ? 'right' : 'left' }]}
    />
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.s4, paddingVertical: spacing.s3, borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.s5, paddingBottom: spacing.s8 },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.s4 },
  input: {
    height: 52, borderWidth: 1, borderRadius: radius.md,
    paddingHorizontal: spacing.s4, fontSize: 15,
  },
  inputLocked: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s2 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.s3, height: 38, borderRadius: 999, borderWidth: 1,
  },
  guest: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.s6 },
  guestIcon: { width: 80, height: 80, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
