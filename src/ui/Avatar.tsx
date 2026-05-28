import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Text from './Text';
import { palette, radius } from '../theme/ts';

export interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  ring?: number;
  ringColor?: string;
  style?: ViewStyle;
}

/**
 * Circular avatar with initials fallback if image fails to load.
 */
export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 40,
  ring = 0,
  ringColor = palette.white,
  style,
}) => {
  const [failed, setFailed] = useState(false);
  const initials = (name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const inner: ViewStyle = {
    width: size,
    height: size,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.navy700,
  };

  const wrapper: ViewStyle = ring
    ? {
        padding: ring,
        borderRadius: radius.full,
        backgroundColor: ringColor,
      }
    : {};

  return (
    <View style={[wrapper, style]}>
      <View style={inner}>
        {source && !failed ? (
          <Image
            source={{ uri: source }}
            style={styles.image}
            onError={() => setFailed(true)}
            transition={150}
            contentFit="cover"
          />
        ) : (
          <Text color={palette.white} weight="700" style={{ fontSize: size * 0.4 }}>
            {initials}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
});

export default Avatar;
