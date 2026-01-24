// Mock Supabase client for testing without credentials
// Replace this file with real Supabase integration when you have credentials

import AsyncStorage from '@react-native-async-storage/async-storage';

export const isSupabaseConfigured = false;

// Mock auth interface that mimics Supabase auth
const mockAuth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  signUp: async ({ email, password }: { email: string; password: string }) => ({
    data: { user: null, session: null },
    error: { message: 'Supabase not configured. Use Skip to test the app.' } as any,
  }),
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => ({
    data: { user: null, session: null },
    error: { message: 'Supabase not configured. Use Skip to test the app.' } as any,
  }),
  signOut: async () => ({ error: null }),
  onAuthStateChange: (callback: any) => ({
    data: {
      subscription: {
        unsubscribe: () => {},
      },
    },
  }),
};

// Mock Supabase client
export const supabase = {
  auth: mockAuth,
};

// Database types (to be expanded as needed)
export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          time_seconds: number;
          running: boolean;
          start_timestamp: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          time_seconds?: number;
          running?: boolean;
          start_timestamp?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          time_seconds?: number;
          running?: boolean;
          start_timestamp?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
