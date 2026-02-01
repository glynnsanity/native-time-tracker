/**
 * Google Authentication Service - Native Version
 *
 * Uses expo-auth-session for OAuth flow.
 * Requires Google Cloud Console configuration.
 */

import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { AuthSessionResult } from 'expo-auth-session';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Configure for OAuth redirects
WebBrowser.maybeCompleteAuthSession();

// Google OAuth client IDs (to be configured in Google Cloud Console)
const GOOGLE_CLIENT_ID = {
  expo: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_EXPO || '',
  ios: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '',
  android: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '',
  web: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '',
};

export interface GoogleAuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Check if Google auth is configured
 */
export const isGoogleAuthConfigured = (): boolean => {
  return Boolean(GOOGLE_CLIENT_ID.expo || GOOGLE_CLIENT_ID.ios || GOOGLE_CLIENT_ID.android);
};

/**
 * Get the appropriate client ID for the current platform
 */
const getClientId = (): string | undefined => {
  if (Platform.OS === 'ios') {
    return GOOGLE_CLIENT_ID.ios || GOOGLE_CLIENT_ID.expo;
  } else if (Platform.OS === 'android') {
    return GOOGLE_CLIENT_ID.android || GOOGLE_CLIENT_ID.expo;
  } else {
    return GOOGLE_CLIENT_ID.web || GOOGLE_CLIENT_ID.expo;
  }
};

/**
 * Hook for Google OAuth - to be used in components
 * Returns the request, response, and promptAsync function
 */
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: getClientId(),
    iosClientId: GOOGLE_CLIENT_ID.ios,
    androidClientId: GOOGLE_CLIENT_ID.android,
    webClientId: GOOGLE_CLIENT_ID.web,
  });

  return { request, response, promptAsync };
};

/**
 * Handle Google sign-in with Supabase
 */
export const signInWithGoogle = async (idToken: string): Promise<GoogleAuthResult> => {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase is not configured. Please add your credentials to enable Google Sign-In.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to sign in with Google',
    };
  }
};

/**
 * Process Google auth response
 */
export const handleGoogleResponse = async (
  response: AuthSessionResult | null
): Promise<GoogleAuthResult> => {
  if (!response) {
    return { success: false, error: 'No response received' };
  }

  if (response.type === 'success') {
    const { id_token } = response.params;

    if (id_token) {
      return signInWithGoogle(id_token);
    } else {
      return {
        success: false,
        error: 'No ID token received from Google',
      };
    }
  } else if (response.type === 'cancel') {
    return {
      success: false,
      error: 'Sign-in was cancelled',
    };
  } else {
    return {
      success: false,
      error: response.type === 'error' ? 'Authentication error' : 'Unknown error',
    };
  }
};
