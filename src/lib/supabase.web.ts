/**
 * Supabase Client - Web Version
 *
 * Uses mock client on web to avoid import.meta compatibility issues.
 * Real authentication should use native apps.
 */

export const isSupabaseConfigured = false;

// Database types (same as native)
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
      time_entries: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          start_time: number;
          end_time: number;
          duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          start_time: number;
          end_time: number;
          duration: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          user_id?: string;
          start_time?: number;
          end_time?: number;
          duration?: number;
          created_at?: string;
        };
      };
    };
  };
}

// Mock auth interface
const mockAuth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  signUp: async ({ email, password }: { email: string; password: string }) => ({
    data: { user: null, session: null },
    error: { message: 'Please use the mobile app for authentication.' } as any,
  }),
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => ({
    data: { user: null, session: null },
    error: { message: 'Please use the mobile app for authentication.' } as any,
  }),
  signOut: async () => ({ error: null }),
  onAuthStateChange: (callback: any) => ({
    data: {
      subscription: {
        unsubscribe: () => {},
      },
    },
  }),
  updateUser: async (updates: any) => ({
    data: { user: null },
    error: { message: 'Please use the mobile app for authentication.' } as any,
  }),
  signInWithIdToken: async (credentials: { provider: string; token: string; nonce?: string }) => ({
    data: { user: null, session: null },
    error: { message: 'Please use the mobile app for authentication.' } as any,
  }),
};

// Mock query builder
const createMockQueryBuilder = () => {
  const builder: any = {
    select: () => builder,
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => builder,
    delete: () => builder,
    upsert: () => Promise.resolve({ data: null, error: null }),
    eq: () => builder,
    gte: () => builder,
    lte: () => builder,
    order: () => builder,
    then: (resolve: any) => resolve({ data: [], error: null }),
  };
  return builder;
};

// Mock Supabase client for web
export const supabase = {
  auth: mockAuth,
  from: (table: string) => createMockQueryBuilder(),
};
