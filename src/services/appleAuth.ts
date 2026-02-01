/**
 * Apple Authentication Service - Native Version
 *
 * Uses expo-apple-authentication for native Apple Sign-In.
 * Only available on iOS devices.
 */

import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AppleAuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Check if Apple authentication is available
 * Only available on iOS 13+
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
};

/**
 * Sign in with Apple
 */
export const signInWithApple = async (): Promise<AppleAuthResult> => {
  if (Platform.OS !== 'ios') {
    return {
      success: false,
      error: 'Apple Sign-In is only available on iOS devices.',
    };
  }

  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase is not configured. Please add your credentials to enable Apple Sign-In.',
    };
  }

  try {
    // Check availability
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Apple Sign-In is not available on this device.',
      };
    }

    // Request credentials
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Sign in with Supabase using the identity token
    if (credential.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // If this is the first sign-in, we may have the user's name
      if (credential.fullName?.givenName || credential.fullName?.familyName) {
        const displayName = [
          credential.fullName.givenName,
          credential.fullName.familyName,
        ]
          .filter(Boolean)
          .join(' ');

        // Update user metadata with their name
        if (displayName) {
          await supabase.auth.updateUser({
            data: { display_name: displayName },
          });
        }
      }

      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        error: 'No identity token received from Apple.',
      };
    }
  } catch (err: any) {
    // Handle user cancellation
    if (err.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'Sign-in was cancelled.',
      };
    }

    return {
      success: false,
      error: err.message || 'Failed to sign in with Apple.',
    };
  }
};

/**
 * Get the Apple Sign-In button component
 * Re-exported for convenience
 */
export const AppleAuthButton = AppleAuthentication.AppleAuthenticationButton;
export const AppleButtonType = AppleAuthentication.AppleAuthenticationButtonType;
export const AppleButtonStyle = AppleAuthentication.AppleAuthenticationButtonStyle;
