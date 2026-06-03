import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import i18n from '../../locales/i18n';
import Screen from '../../ui/Screen';
import Header from '../../ui/Header';
import Text from '../../ui/Text';
import Button from '../../ui/Button';
import { font, radius, spacing } from '../../theme/ts';
import { useColors } from '../../theme/colors';
import { RootStackScreenProps } from '../../navigation/types';

const CODE_LEN = 6;

export default function CodeVerifyScreen({ navigation, route }: RootStackScreenProps<'CodeVerify'>) {
  const c = useColors();
  const { phone } = route.params;
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(45);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Auto-focus
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  const valid = code.length === CODE_LEN;

  const verify = () => {
    if (!valid) return;
    Keyboard.dismiss();
    // Stub OTP verification — accept any 6-digit code.
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <Screen>
      <Header onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text variant="pageTitle" weight="700">
          {i18n.t('auth.codeTitle')}
        </Text>
        <Text variant="body" color={c.textMuted} style={styles.subtitle}>
          {i18n.t('auth.codeSubtitle')}{' '}
          <Text variant="body" weight="600" color={c.text} forceLtr>
            {phone}
          </Text>
        </Text>

        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={styles.codeRow}
        >
          {Array.from({ length: CODE_LEN }).map((_, i) => {
            const filled = i < code.length;
            const active = i === code.length;
            return (
              <View
                key={i}
                style={[
                  styles.codeCell,
                  { backgroundColor: c.surface, borderColor: c.border },
                  filled && { borderColor: c.text },
                  active && { borderColor: c.brand },
                ]}
              >
                <Text variant="cardTitle" weight="700" forceLtr>
                  {code[i] ?? ''}
                </Text>
              </View>
            );
          })}
        </Pressable>

        {/* Hidden input that captures the actual keystrokes. */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, CODE_LEN))}
          keyboardType="number-pad"
          maxLength={CODE_LEN}
          style={[styles.hiddenInput, font('body', false)]}
          autoFocus
        />

        <Pressable
          disabled={secondsLeft > 0}
          onPress={() => setSecondsLeft(45)}
          style={styles.resend}
        >
          <Text
            variant="label"
            weight="500"
            color={secondsLeft > 0 ? c.textMuted : c.brandText}
          >
            {secondsLeft > 0
              ? `${i18n.t('auth.resendIn')} ${secondsLeft}s`
              : i18n.t('auth.resend')}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Button
            title={i18n.t('auth.verify')}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!valid}
            onPress={verify}
          />
        </View>
      </View>
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
  codeRow: {
    flexDirection: 'row',
    marginTop: spacing.s6,
    justifyContent: 'space-between',
  },
  codeCell: {
    width: 48,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  resend: {
    marginTop: spacing.s5,
    alignSelf: 'center',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.s5,
  },
});
