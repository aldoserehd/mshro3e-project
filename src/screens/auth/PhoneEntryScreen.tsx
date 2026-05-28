import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Header from '../../ui/Header';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import { font, palette, radius, semantic, spacing, rtl } from '../../theme/ts';
import { RootStackScreenProps } from '../../navigation/types';

export default function PhoneEntryScreen({ navigation }: RootStackScreenProps<'PhoneEntry'>) {
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
          <Text variant="body" color={palette.neutral500} style={styles.subtitle}>
            {i18n.t('auth.phoneSubtitle')}
          </Text>

          <View style={styles.inputRow}>
            <View style={styles.prefixBox}>
              <Text variant="body" weight="600" color={palette.navy900} forceLtr>
                {i18n.t('auth.countryPrefix')}
              </Text>
            </View>
            <TextInput
              style={[styles.input, font('body', false)]}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/[^0-9 ]/g, ''))}
              keyboardType="phone-pad"
              placeholder={i18n.t('auth.phonePlaceholder')}
              placeholderTextColor={palette.neutral500}
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
    backgroundColor: palette.navy50,
    borderWidth: 1,
    borderColor: semantic.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing.s2,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: spacing.s4,
    borderRadius: radius.md,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: semantic.border,
    color: semantic.text,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.s5,
  },
});
