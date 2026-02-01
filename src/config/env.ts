/**
 * Environment configuration
 *
 * Reads Supabase credentials from environment variables.
 * When properly configured, the app uses real Supabase authentication and database.
 * When not configured, the app falls back to mock mode for development.
 */

interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const config: EnvironmentConfig = {
  supabaseUrl,
  supabaseAnonKey,
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
};

export default config;
