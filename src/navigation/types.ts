import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Data: undefined;
  Settings: undefined;
};

// Screen props types
export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

// Declare global types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainTabParamList {}
  }
}
