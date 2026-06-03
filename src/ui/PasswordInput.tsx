import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { radius, spacing, getCurrentLocale } from '../theme/ts';
import { useColors } from '../theme/colors';
import { useLocaleStore } from '../stores/locale';

export interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry' | 'style'> {
  /** Leading lock icon. Default 'lock-closed-outline'. */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Field-level error message — also tints the border red. */
  error?: string;
}

/**
 * Password field with a show/hide eye toggle. Matches the bordered field style
 * used across the auth screens and is fully theme-aware (light + dark).
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  icon = 'lock-closed-outline',
  error,
  placeholderTextColor,
  ...rest
}) => {
  const c = useColors();
  const [visible, setVisible] = useState(false);
  // Align input text by the *content* language, not the physical layout
  // direction (the app stays RTL but EN content reads left-aligned).
  useLocaleStore((s) => s.locale);
  const isRtl = getCurrentLocale() === 'ar';

  return (
    <View>
      <View style={[styles.fieldWrap, { backgroundColor: c.surface, borderColor: error ? c.danger : c.border }]}>
        <Ionicons name={icon} size={18} color={c.textMuted} />
        <TextInput
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={placeholderTextColor ?? c.textMuted}
          style={[styles.input, { color: c.text, textAlign: isRtl ? 'right' : 'left' }]}
          {...rest}
        />
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={c.textMuted} />
        </Pressable>
      </View>
      {error ? (
        <Text variant="caption" color={c.danger} style={{ marginTop: 4, marginStart: spacing.s2 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.s4,
    height: 52,
    gap: spacing.s2,
  },
  input: { flex: 1, fontSize: 15 },
});
