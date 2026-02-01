import React from 'react';
import { Easing } from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import type { AuthStackParamList } from './types';
import { colors } from '../theme';

import OnboardingScreen from '../screens/auth/OnboardingScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createStackNavigator<AuthStackParamList>();

// Smooth horizontal slide with fade
const horizontalSlideWithFade = {
  gestureDirection: 'horizontal' as const,
  gestureEnabled: true,
  transitionSpec: {
    open: {
      animation: 'spring' as const,
      config: {
        stiffness: 1000,
        damping: 100,
        mass: 2,
        overshootClamping: false,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      },
    },
  },
  cardStyleInterpolator: ({ current, next, layouts }: StackCardInterpolationProps) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
        {
          scale: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.95],
              })
            : 1,
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      }),
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
      }),
    },
  }),
};

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
        cardOverlayEnabled: true,
        ...horizontalSlideWithFade,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
