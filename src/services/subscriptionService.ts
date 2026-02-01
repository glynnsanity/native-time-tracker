/**
 * Subscription Service
 *
 * Interface for handling premium subscriptions.
 * This is a stub implementation - full IAP integration requires
 * App Store/Play Store configuration.
 */

export type SubscriptionTier = 'free' | 'premium';

export type SubscriptionPeriod = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  name: string;
  period: SubscriptionPeriod;
  price: number;
  currency: string;
  features: string[];
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: Date;
  plan?: SubscriptionPlan;
}

export interface SubscriptionService {
  getStatus(): Promise<SubscriptionStatus>;
  getPlans(): Promise<SubscriptionPlan[]>;
  subscribe(planId: string): Promise<{ success: boolean; error?: string }>;
  restore(): Promise<{ success: boolean; error?: string }>;
  cancel(): Promise<{ success: boolean; error?: string }>;
}

// Default plans (would be fetched from store in production)
const PLANS: SubscriptionPlan[] = [
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    period: 'yearly',
    price: 49.99,
    currency: 'USD',
    features: [
      'Activity & Timer customization',
      'Advanced Reports & Analytics',
      'Multiple Device Sync',
      'Unlimited Time Goals',
      'Goal Achievement Badges',
      'Shared Activity Lists',
    ],
  },
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    period: 'monthly',
    price: 5.99,
    currency: 'USD',
    features: [
      'Activity & Timer customization',
      'Advanced Reports & Analytics',
      'Multiple Device Sync',
      'Unlimited Time Goals',
      'Goal Achievement Badges',
      'Shared Activity Lists',
    ],
  },
];

// Mock implementation for development
class MockSubscriptionService implements SubscriptionService {
  private status: SubscriptionStatus = {
    tier: 'free',
    isActive: false,
  };

  async getStatus(): Promise<SubscriptionStatus> {
    // Simulate network delay
    await this.delay(500);
    return this.status;
  }

  async getPlans(): Promise<SubscriptionPlan[]> {
    await this.delay(300);
    return PLANS;
  }

  async subscribe(planId: string): Promise<{ success: boolean; error?: string }> {
    await this.delay(1000);

    // In production, this would:
    // 1. Initiate the IAP flow
    // 2. Verify the receipt with the backend
    // 3. Update the user's subscription status

    return {
      success: false,
      error: 'In-app purchases require App Store/Play Store configuration.',
    };
  }

  async restore(): Promise<{ success: boolean; error?: string }> {
    await this.delay(1000);

    return {
      success: false,
      error: 'No previous purchases found.',
    };
  }

  async cancel(): Promise<{ success: boolean; error?: string }> {
    await this.delay(500);

    return {
      success: false,
      error: 'Subscriptions must be cancelled through the App Store/Play Store.',
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const subscriptionService: SubscriptionService = new MockSubscriptionService();

// Helper to check if user has premium
export async function isPremiumUser(): Promise<boolean> {
  const status = await subscriptionService.getStatus();
  return status.tier === 'premium' && status.isActive;
}
