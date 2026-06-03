import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  PhoneEntry: undefined;
  CodeVerify: { phone: string };
  SignIn: undefined;
  SignUp: undefined;
  Preferences: undefined;
  MainTabs: undefined;
  Profile: undefined;
  VendorProfile: { vendorId: string };
  ServiceDetail: { serviceId: string };
  Category: { categoryId: string };
  Settings: undefined;
  Notifications: undefined;
  Chat: { vendorId: string; productId?: string };
  Info: { topic: 'notifications' | 'about' | 'help' | 'privacy' };
};

export type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Account: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabsScreenProps<T extends keyof MainTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
