import React from 'react';
import { ActivityIndicator, View, StyleSheet, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionSpecs,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import SettingsScreen from '../screens/main/SettingsScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Custom fade transition for smooth screen changes
const fadeTransition = {
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 250,
        easing: Easing.in(Easing.cubic),
      },
    },
  },
  cardStyleInterpolator: ({ current }: StackCardInterpolationProps) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
};

// Modal slide up animation with spring
const modalSlideUp = {
  gestureDirection: 'vertical' as const,
  transitionSpec: {
    open: {
      animation: 'spring' as const,
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      },
    },
  },
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
};

const RootNavigator: React.FC = () => {
  const { isLoading, isAuthenticated, hasOnboarded } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...fadeTransition,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              presentation: 'modal',
              cardStyle: { backgroundColor: colors.background },
              gestureEnabled: true,
              ...modalSlideUp,
            }}
          />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{
              presentation: 'modal',
              cardStyle: { backgroundColor: colors.background },
              gestureEnabled: true,
              ...modalSlideUp,
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default Navigation;
