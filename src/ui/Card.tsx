import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import PressableScale from './PressableScale';
import { palette, radius, semantic, shadowStyle, spacing } from '../theme/ts';

export interface CardProps extends Omit<ViewProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  /** Default 1; elevates to 2 while pressed. */
  elevation?: 1 | 2 | 3;
  padding?: keyof typeof paddings;
  background?: string;
  /** Round corners. Default radius.lg. */
  rounded?: number;
}

const paddings = {
  none: 0,
  sm: spacing.s3,
  md: spacing.s4,
  lg: spacing.s5,
} as const;

export const Card: React.FC<CardProps> = ({
  style,
  onPress,
  elevation = 1,
  padding = 'md',
  background = semantic.surface,
  rounded = radius.lg,
  children,
  ...rest
}) => {
  const baseStyle: ViewStyle = {
    backgroundColor: background,
    borderRadius: rounded,
    padding: paddings[padding],
    ...shadowStyle(elevation),
  };

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={[baseStyle, style]}>
        {children}
      </PressableScale>
    );
  }
  return (
    <View style={[baseStyle, style]} {...rest}>
      {children}
    </View>
  );
};

export default Card;

export const HairlineCardBorder: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      {
        borderTopWidth: 1,
        borderTopColor: palette.neutral200,
      },
      style,
    ]}
  />
);
