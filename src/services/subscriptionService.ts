/**
 * Subscription Service - RevenueCat Integration
 *
 * Handles premium subscriptions using RevenueCat SDK.
 * Falls back to mock mode when RevenueCat is not configured.
 */

import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
} from 'react-native-purchases';
import { config } from '../config/env';

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
  package: PurchasesPackage;
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

const PREMIUM_ENTITLEMENT = 'premium';

const PREMIUM_FEATURES = [
  'Activity & Timer customization',
  'Advanced Reports & Analytics',
  'Multiple Device Sync',
  'Unlimited Time Goals',
  'Goal Achievement Badges',
  'Shared Activity Lists',
];

// Mock plans for development (when RevenueCat not configured)
const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    period: 'yearly',
    price: 49.99,
    priceString: '$49.99',
    currency: 'USD',
    features: PREMIUM_FEATURES,
    package: null as any,
  },
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    period: 'monthly',
    price: 5.99,
    priceString: '$5.99',
    currency: 'USD',
    features: PREMIUM_FEATURES,
    package: null as any,
  },
];

class RevenueCatSubscriptionService implements SubscriptionService {
  private initialized = false;

  async initialize(userId?: string): Promise<void> {
    if (this.initialized || !config.isIAPConfigured) {
      return;
    }

    try {
      Purchases.configure({
        apiKey: config.revenueCatApiKey,
        appUserID: userId,
      });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
    }
  }

  async login(userId: string): Promise<void> {
    if (!config.isIAPConfigured || !this.initialized) {
      return;
    }

    try {
      await Purchases.logIn(userId);
    } catch (error) {
      console.error('Failed to login to RevenueCat:', error);
    }
  }

  async logout(): Promise<void> {
    if (!config.isIAPConfigured || !this.initialized) {
      return;
    }

    try {
      await Purchases.logOut();
    } catch (error) {
      console.error('Failed to logout from RevenueCat:', error);
    }
  }

  async getStatus(): Promise<SubscriptionStatus> {
    if (!config.isIAPConfigured || !this.initialized) {
      return {
        tier: 'free',
        isActive: false,
      };
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isPremium = !!customerInfo.entitlements.active[PREMIUM_ENTITLEMENT];

      if (isPremium) {
        const entitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT];
        return {
          tier: 'premium',
          isActive: true,
          expiresAt: entitlement.expirationDate
            ? new Date(entitlement.expirationDate)
            : undefined,
        };
      }

      return {
        tier: 'free',
        isActive: false,
      };
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return {
        tier: 'free',
        isActive: false,
      };
    }
  }

  async getPlans(): Promise<SubscriptionPlan[]> {
    if (!config.isIAPConfigured || !this.initialized) {
      // Return mock plans for development
      return MOCK_PLANS;
    }

    try {
      const offerings = await Purchases.getOfferings();

      if (!offerings.current || !offerings.current.availablePackages.length) {
        console.warn('No offerings available from RevenueCat');
        return MOCK_PLANS;
      }

      return offerings.current.availablePackages.map((pkg) => {
        const isYearly =
          pkg.packageType === 'ANNUAL' ||
          pkg.product.identifier.includes('yearly') ||
          pkg.product.identifier.includes('annual');

        return {
          id: pkg.product.identifier,
          name: pkg.product.title,
          period: isYearly ? 'yearly' : 'monthly',
          price: pkg.product.price,
          priceString: pkg.product.priceString,
          currency: pkg.product.currencyCode,
          features: PREMIUM_FEATURES,
          package: pkg,
        };
      });
    } catch (error) {
      console.error('Failed to get subscription plans:', error);
      return MOCK_PLANS;
    }
  }

  async subscribe(plan: SubscriptionPlan): Promise<{ success: boolean; error?: string }> {
    if (!config.isIAPConfigured) {
      return {
        success: false,
        error: 'In-app purchases require configuration. Please set up RevenueCat.',
      };
    }

    if (!this.initialized) {
      return {
        success: false,
        error: 'Subscription service not initialized.',
      };
    }

    if (!plan.package) {
      return {
        success: false,
        error: 'Invalid subscription plan.',
      };
    }

    try {
      const { customerInfo } = await Purchases.purchasePackage(plan.package);

      if (customerInfo.entitlements.active[PREMIUM_ENTITLEMENT]) {
        return { success: true };
      }

      return {
        success: false,
        error: 'Purchase completed but premium entitlement not found.',
      };
    } catch (error: any) {
      // Handle user cancellation
      if (error.userCancelled) {
        return {
          success: false,
          error: 'Purchase was cancelled.',
        };
      }

      console.error('Purchase failed:', error);
      return {
        success: false,
        error: error.message || 'Purchase failed. Please try again.',
      };
    }
  }

  async restore(): Promise<{ success: boolean; error?: string }> {
    if (!config.isIAPConfigured) {
      return {
        success: false,
        error: 'In-app purchases require configuration.',
      };
    }

    if (!this.initialized) {
      return {
        success: false,
        error: 'Subscription service not initialized.',
      };
    }

    try {
      const customerInfo = await Purchases.restorePurchases();

      if (customerInfo.entitlements.active[PREMIUM_ENTITLEMENT]) {
        return { success: true };
      }

      return {
        success: false,
        error: 'No previous purchases found.',
      };
    } catch (error: any) {
      console.error('Restore failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to restore purchases.',
      };
    }
  }

  async cancel(): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Subscriptions must be cancelled through the App Store or Play Store.',
    };
  }
}

export const subscriptionService: SubscriptionService = new RevenueCatSubscriptionService();

export async function isPremiumUser(): Promise<boolean> {
  const status = await subscriptionService.getStatus();
  return status.tier === 'premium' && status.isActive;
}
