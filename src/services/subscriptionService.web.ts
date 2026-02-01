/**
 * Subscription Service - Web Fallback
 *
 * In-app purchases are not available on web platforms.
 * This module provides graceful degradation with appropriate error messages.
 */

import { Platform } from 'react-native';

export type SubscriptionTier = 'free' | 'premium';

export type SubscriptionPeriod = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  name: string;
  period: SubscriptionPeriod;
  price: number;
  priceString: string;
  currency: string;
  features: string[];
  package?: any;
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: Date;
  plan?: SubscriptionPlan;
}

export interface SubscriptionService {
  initialize(userId?: string): Promise<void>;
  login(userId: string): Promise<void>;
  logout(): Promise<void>;
  getStatus(): Promise<SubscriptionStatus>;
  getPlans(): Promise<SubscriptionPlan[]>;
  subscribe(plan: SubscriptionPlan): Promise<{ success: boolean; error?: string }>;
  restore(): Promise<{ success: boolean; error?: string }>;
  cancel(): Promise<{ success: boolean; error?: string }>;
}

class WebSubscriptionService implements SubscriptionService {
  async initialize(_userId?: string): Promise<void> {
    // No-op on web
  }

  async login(_userId: string): Promise<void> {
    // No-op on web
  }

  async logout(): Promise<void> {
    // No-op on web
  }

  async getStatus(): Promise<SubscriptionStatus> {
    return {
      tier: 'free',
      isActive: false,
    };
  }

  async getPlans(): Promise<SubscriptionPlan[]> {
    // Return empty plans on web - IAP not available
    return [];
  }

  async subscribe(_plan: SubscriptionPlan): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'In-app purchases are not available on web. Please use our iOS or Android app to subscribe.',
    };
  }

  async restore(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'In-app purchases are not available on web. Please use our iOS or Android app to restore purchases.',
    };
  }

  async cancel(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Subscriptions must be managed through the App Store or Play Store.',
    };
  }
}

export const subscriptionService: SubscriptionService = new WebSubscriptionService();

export async function isPremiumUser(): Promise<boolean> {
  const status = await subscriptionService.getStatus();
  return status.tier === 'premium' && status.isActive;
}
