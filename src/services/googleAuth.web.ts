/**
 * Google Authentication Service - Web Version
 *
 * Web version returns mock implementations since OAuth requires native setup.
 */

export interface GoogleAuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Check if Google auth is configured (always false on web)
 */
export const isGoogleAuthConfigured = (): boolean => {
  return false;
};

/**
 * Hook for Google OAuth - mock for web
 */
export const useGoogleAuth = () => {
  return {
    request: null,
    response: null,
    promptAsync: async () => ({ type: 'dismiss' as const }),
  };
};

/**
 * Handle Google sign-in - not available on web
 */
export const signInWithGoogle = async (idToken: string): Promise<GoogleAuthResult> => {
  return {
    success: false,
    error: 'Google Sign-In is not available on web. Please use email/password.',
  };
};

/**
 * Process Google auth response - not available on web
 */
export const handleGoogleResponse = async (
  response: any | null
): Promise<GoogleAuthResult> => {
  return {
    success: false,
    error: 'Google Sign-In is not available on web.',
  };
};
