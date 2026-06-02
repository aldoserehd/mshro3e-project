import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import CodeVerifyScreen from '../screens/auth/CodeVerifyScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import PreferencesScreen from '../screens/auth/PreferencesScreen';

import HomeScreen from '../screens/customer/HomeScreen';
import CategoriesScreen from '../screens/customer/CategoriesScreen';
import FavoritesScreen from '../screens/customer/FavoritesScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import VendorProfileScreen from '../screens/customer/VendorProfileScreen';
import ServiceDetailScreen from '../screens/customer/ServiceDetailScreen';
import CategoryScreen from '../screens/customer/CategoryScreen';
import SettingsScreen from '../screens/customer/SettingsScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';
import ChatScreen from '../screens/customer/ChatScreen';
import InfoScreen from '../screens/customer/InfoScreen';

import BlurTabBar from '../ui/BlurTabBar';
import { palette, semantic } from '../theme/ts';
import i18n from '../locales/i18n';
import type { RootStackParamList, MainTabsParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.navy900,
    background: semantic.bg,
    card: semantic.surface,
    text: palette.neutral900,
    border: palette.neutral200,
    notification: palette.navy600,
  },
};

const MainTabs = () => (
  <Tabs.Navigator
    initialRouteName="Home"
    tabBar={(props) => <BlurTabBar {...props} />}
    screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: semantic.bg } }}
  >
    {/* Order is reversed under RTL so Home appears on the LEFT and Account on the RIGHT visually. */}
    <Tabs.Screen name="Account" component={ProfileScreen} options={{ tabBarLabel: i18n.t('tabs.account') }} />
    <Tabs.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: i18n.t('tabs.favorites') }} />
    <Tabs.Screen name="Search" component={CategoriesScreen} options={{ tabBarLabel: i18n.t('tabs.search') }} />
    <Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: i18n.t('tabs.home') }} />
  </Tabs.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: semantic.bg },
          animation: 'slide_from_right',
          animationDuration: 280,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="CodeVerify" component={CodeVerifyScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="VendorProfile" component={VendorProfileScreen} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
