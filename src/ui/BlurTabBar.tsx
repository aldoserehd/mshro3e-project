import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Text from './Text';
import { motion, palette, radius, semantic, shadowStyle, spacing } from '../theme/ts';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Search: { active: 'search', inactive: 'search-outline' },
  Favorites: { active: 'heart', inactive: 'heart-outline' },
  Account: { active: 'person', inactive: 'person-outline' },
};

/**
 * Custom bottom tab bar:
 *   - expo-blur BlurView intense=85, tint='light'
 *   - active indicator translates via withSpring(damping:22, stiffness:220)
 *   - icon color crossfades 180ms (brief §5.3)
 */
export const BlurTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalMargin = spacing.s4;
  const tabBarWidth = width - horizontalMargin * 2;
  const tabWidth = tabBarWidth / state.routes.length;

  const indicatorX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    indicatorX.value = withSpring(state.index * tabWidth, motion.spring.tab);
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + spacing.s2,
          start: horizontalMargin,
          end: horizontalMargin,
        },
      ]}
    >
      <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.fallbackBg]} />
      <Animated.View
        style={[
          styles.indicator,
          { width: tabWidth - spacing.s2 * 2, marginStart: spacing.s2 },
          indicatorStyle,
        ]}
      />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;
          const iconSet = ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              Haptics.selectionAsync().catch(() => {});
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.tab, { width: tabWidth }]}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              <TabIcon focused={focused} active={iconSet.active} inactive={iconSet.inactive} />
              <Text
                variant="microcopy"
                weight="500"
                color={focused ? palette.navy900 : palette.navy400}
                style={styles.label}
              >
                {label as string}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const TabIcon: React.FC<{
  focused: boolean;
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
}> = ({ focused, active, inactive }) => {
  const opacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0, { duration: 180 });
  }, [focused, opacity]);

  const activeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const inactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - opacity.value }));

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={[StyleSheet.absoluteFill, activeStyle, styles.iconCenter]}>
        <Ionicons name={active} size={22} color={palette.navy900} />
      </Animated.View>
      <Animated.View style={[inactiveStyle, styles.iconCenter]}>
        <Ionicons name={inactive} size={22} color={palette.navy400} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 64,
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadowStyle(3),
  },
  fallbackBg: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s2,
  },
  tab: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCenter: { alignItems: 'center', justifyContent: 'center' },
  label: {
    marginTop: 2,
  },
  indicator: {
    position: 'absolute',
    top: spacing.s2,
    bottom: spacing.s2,
    borderRadius: radius.full,
    backgroundColor: palette.navy100,
  },
});

export default BlurTabBar;
