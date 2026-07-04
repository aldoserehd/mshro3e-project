import React, { useEffect } from 'react';
import { I18nManager, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
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
import { motion, radius, shadowStyle, spacing } from '../theme/ts';
import { useColors } from '../theme/colors';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Search: { active: 'grid', inactive: 'grid-outline' },
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
  const c = useColors();
  const { width } = useWindowDimensions();
  const horizontalMargin = spacing.s4;
  const tabBarWidth = width - horizontalMargin * 2;
  const tabWidth = tabBarWidth / state.routes.length;

  // Indicator is positioned by absolute `left` (screen coords — never mirrored
  // by RTL, unlike `start`/transforms). We compute the VISUAL slot: under
  // forced-RTL the flex row renders children reversed, so the focused route's
  // visual index counts from the other side.
  const PAD = spacing.s2;
  const indWidth = tabWidth - PAD * 2;
  const n = state.routes.length;
  const slotLeft = (idx: number) => {
    const visual = I18nManager.isRTL ? n - 1 - idx : idx;
    return visual * tabWidth + PAD * 2;
  };

  const indicatorX = useSharedValue(slotLeft(state.index));
  useEffect(() => {
    indicatorX.value = withSpring(slotLeft(state.index), motion.spring.tab);
  }, [state.index, tabWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  const indicatorStyle = useAnimatedStyle(() => ({ left: indicatorX.value }));

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
      <BlurView intensity={90} tint={c.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: c.isDark ? 'rgba(20,26,46,0.55)' : 'rgba(255,255,255,0.5)',
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: c.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.65)',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.indicator,
          { width: indWidth, backgroundColor: c.brand },
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
                weight={focused ? '700' : '500'}
                color={focused ? c.textOnBrand : c.textMuted}
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
  const c = useColors();
  const opacity = useSharedValue(focused ? 1 : 0);
  const scale = useSharedValue(focused ? 1 : 0.9);

  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0, { duration: 180 });
    scale.value = withSpring(focused ? 1.08 : 0.9, { damping: 12, stiffness: 220 });
  }, [focused, opacity, scale]);

  const activeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const inactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - opacity.value }));

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={[StyleSheet.absoluteFill, activeStyle, styles.iconCenter]}>
        <Ionicons name={active} size={22} color={c.textOnBrand} />
      </Animated.View>
      <Animated.View style={[inactiveStyle, styles.iconCenter]}>
        <Ionicons name={inactive} size={22} color={c.textMuted} />
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
  },
});

export default BlurTabBar;
