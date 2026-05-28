import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import CodeVerifyScreen from '../screens/auth/CodeVerifyScreen';

import HomeScreen from '../screens/customer/HomeScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import BookingsScreen from '../screens/customer/BookingsScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import VendorProfileScreen from '../screens/customer/VendorProfileScreen';
import ServiceDetailScreen from '../screens/customer/ServiceDetailScreen';

import ServiceConfirmScreen from '../screens/booking/ServiceConfirmScreen';
import DateTimePickerScreen from '../screens/booking/DateTimePickerScreen';
import ConfirmPayScreen from '../screens/booking/ConfirmPayScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';

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
    tabBar={(props) => <BlurTabBar {...props} />}
    screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: semantic.bg } }}
  >
    <Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: i18n.t('tabs.home') }} />
    <Tabs.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: i18n.t('tabs.search') }} />
    <Tabs.Screen name="Bookings" component={BookingsScreen} options={{ tabBarLabel: i18n.t('tabs.bookings') }} />
    <Tabs.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: i18n.t('tabs.profile') }} />
  </Tabs.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: semantic.bg } }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="CodeVerify" component={CodeVerifyScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="VendorProfile" component={VendorProfileScreen} />
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
        <Stack.Screen name="ServiceConfirm" component={ServiceConfirmScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="DateTimePicker" component={DateTimePickerScreen} />
        <Stack.Screen name="ConfirmPay" component={ConfirmPayScreen} />
        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmationScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
