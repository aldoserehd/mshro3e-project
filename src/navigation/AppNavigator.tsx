import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import PreferencesScreen from '../screens/auth/PreferencesScreen';

import HomeScreen from '../screens/customer/HomeScreen';
import CategoriesScreen from '../screens/customer/CategoriesScreen';
import FavoritesScreen from '../screens/customer/FavoritesScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import VendorProfileScreen from '../screens/customer/VendorProfileScreen';
import ServiceDetailScreen from '../screens/customer/ServiceDetailScreen';
import CategoryScreen from '../screens/customer/CategoryScreen';
import SettingsScreen from '../screens/customer/SettingsScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';
import ChatScreen from '../screens/customer/ChatScreen';
import InfoScreen from '../screens/customer/InfoScreen';

import BlurTabBar from '../ui/BlurTabBar';
import i18n from '../locales/i18n';
import { useColors } from '../theme/colors';
import type { RootStackParamList, MainTabsParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();

const MainTabs = () => {
  const c = useColors();
  return (
  <Tabs.Navigator
    initialRouteName="Home"
    tabBar={(props) => <BlurTabBar {...props} />}
    screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: c.bg } }}
  >
    {/* Order is reversed under RTL so Home appears on the LEFT and Account on the RIGHT visually. */}
    <Tabs.Screen name="Account" component={ProfileScreen} options={{ tabBarLabel: i18n.t('tabs.account') }} />
    <Tabs.Screen name="Favorites" component={FavoritesScreen} options={{ tabBarLabel: i18n.t('tabs.favorites') }} />
    <Tabs.Screen name="Search" component={CategoriesScreen} options={{ tabBarLabel: i18n.t('tabs.search') }} />
    <Tabs.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: i18n.t('tabs.home') }} />
  </Tabs.Navigator>
  );
};

export default function AppNavigator() {
  const c = useColors();
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: c.brand,
      background: c.bg,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.brand,
    },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.bg },
          animation: 'slide_from_right',
          animationDuration: 280,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Profile" component={EditProfileScreen} />
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
