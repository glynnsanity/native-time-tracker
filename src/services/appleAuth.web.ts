/**
 * Apple Authentication Service - Web Version
 *
 * Web version returns mock implementations since Apple Sign-In is iOS only.
 */

export interface AppleAuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

/**
 * Check if Apple authentication is available (always false on web)
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  return false;
};

/**
 * Sign in with Apple - not available on web
 */
export const signInWithApple = async (): Promise<AppleAuthResult> => {
  return {
    success: false,
    error: 'Apple Sign-In is only available on iOS devices.',
  };
};

/**
 * Apple Sign-In button components - null on web
 */
export const AppleAuthButton = null;
export const AppleButtonType = {};
export const AppleButtonStyle = {};
