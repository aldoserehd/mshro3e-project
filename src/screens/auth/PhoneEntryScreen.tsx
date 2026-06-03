import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Header from '../../ui/Header';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import { font, radius, spacing, rtl } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { RootStackScreenProps } from '../../navigation/types';

export default function PhoneEntryScreen({ navigation }: RootStackScreenProps<'PhoneEntry'>) {
  const c = useColors();
  const [phone, setPhone] = useState('');
  const valid = phone.replace(/\D/g, '').length >= 8;

  const submit = () => {
    if (!valid) return;
    const e164 = `${i18n.t('auth.countryPrefix')}${phone.replace(/\D/g, '')}`;
    navigation.navigate('CodeVerify', { phone: e164 });
  };

  return (
    <Screen>
      <Header onBack={() => navigation.goBack()} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.body}>
          <Text variant="pageTitle" weight="700">
            {i18n.t('auth.phoneTitle')}
          </Text>
          <Text variant="body" color={c.textMuted} style={styles.subtitle}>
            {i18n.t('auth.phoneSubtitle')}
          </Text>

          <View style={styles.inputRow}>
            <View style={[styles.prefixBox, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
              <Text variant="body" weight="600" color={c.text} forceLtr>
                {i18n.t('auth.countryPrefix')}
              </Text>
            </View>
            <TextInput
              style={[styles.input, font('body', false), { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/[^0-9 ]/g, ''))}
              keyboardType="phone-pad"
              placeholder={i18n.t('auth.phonePlaceholder')}
              placeholderTextColor={c.textMuted}
              textAlign={rtl() ? 'right' : 'left'}
              maxLength={12}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title={i18n.t('auth.continue')}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!valid}
              onPress={submit}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: spacing.s5,
    paddingTop: spacing.s4,
  },
  subtitle: { marginTop: spacing.s2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.s6,
  },
  prefixBox: {
    height: 56,
    paddingHorizontal: spacing.s4,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.s2,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: spacing.s4,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.s5,
  },
});
