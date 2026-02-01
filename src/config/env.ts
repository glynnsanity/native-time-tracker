/**
 * Environment configuration
 *
 * Reads credentials from environment variables for:
 * - Supabase authentication and database
 * - RevenueCat in-app purchases
 * - Google OAuth
 *
 * When properly configured, the app uses real services.
 * When not configured, the app falls back to mock mode for development.
 */

interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
  revenueCatApiKey: string;
  isIAPConfigured: boolean;
  googleClientIdExpo: string;
  googleClientIdIOS: string;
  googleClientIdAndroid: string;
  googleClientIdWeb: string;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const revenueCatApiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || '';

export const config: EnvironmentConfig = {
  supabaseUrl,
  supabaseAnonKey,
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
  revenueCatApiKey,
  isIAPConfigured: Boolean(revenueCatApiKey),
  googleClientIdExpo: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_EXPO || '',
  googleClientIdIOS: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || '',
  googleClientIdAndroid: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '',
  googleClientIdWeb: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '',
};

export default config;
