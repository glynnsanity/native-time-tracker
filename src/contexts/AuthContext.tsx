import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { subscriptionService } from '../services/subscriptionService';

// Local type definitions (avoids importing from @supabase/supabase-js which breaks web)
interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

interface Session {
  user: User;
  access_token: string;
  [key: string]: any;
}

interface AuthError {
  message: string;
  status?: number;
}

const AUTH_SKIPPED_KEY = 'auth_skipped';
const HAS_ONBOARDED_KEY = 'has_onboarded';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSkipped: boolean;
  hasOnboarded: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  skipAuth: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    hasSkipped: false,
    hasOnboarded: false,
  });

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle RevenueCat user identification
        if (event === 'SIGNED_IN' && session?.user) {
          await subscriptionService.initialize(session.user.id);
          await subscriptionService.login(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          await subscriptionService.logout();
        }

        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
          isAuthenticated: !!session || prev.hasSkipped,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if user has onboarded
      const hasOnboarded = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);

      // Check if user has skipped auth
      const hasSkipped = await AsyncStorage.getItem(AUTH_SKIPPED_KEY);

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();

      // Initialize RevenueCat if user is logged in
      if (session?.user) {
        await subscriptionService.initialize(session.user.id);
        await subscriptionService.login(session.user.id);
      } else {
        // Initialize RevenueCat without user ID for anonymous usage
        await subscriptionService.initialize();
      }

      setState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session || hasSkipped === 'true',
        hasSkipped: hasSkipped === 'true',
        hasOnboarded: hasOnboarded === 'true',
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
      setState((prev) => ({
        ...prev,
        hasOnboarded: true,
      }));
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
      await AsyncStorage.removeItem(AUTH_SKIPPED_KEY);
      setState((prev) => ({
        ...prev,
        hasOnboarded: true,
        hasSkipped: false,
      }));
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await subscriptionService.logout();
    await AsyncStorage.removeItem(AUTH_SKIPPED_KEY);
    setState((prev) => ({
      ...prev,
      user: null,
      session: null,
      isAuthenticated: false,
      hasSkipped: false,
    }));
  };

  const skipAuth = async () => {
    await AsyncStorage.setItem(AUTH_SKIPPED_KEY, 'true');
    await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      hasSkipped: true,
      hasOnboarded: true,
    }));
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
    setState((prev) => ({
      ...prev,
      hasOnboarded: true,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        skipAuth,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
