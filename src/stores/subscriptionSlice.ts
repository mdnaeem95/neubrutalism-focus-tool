import { StateCreator } from 'zustand';
import {
  purchasePackage as rcPurchase,
  restoreUserPurchases,
  checkSubscriptionStatus,
  getOfferings,
} from '../utils/purchases';
import { PurchasesPackage } from 'react-native-purchases';

export interface SubscriptionSlice {
  isPro: boolean;
  subscriptionPlan: 'monthly' | 'yearly' | null;

  setPro: (isPro: boolean, plan?: 'monthly' | 'yearly' | null) => void;
  purchasePackage: (pkg: PurchasesPackage, plan: 'monthly' | 'yearly') => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  syncSubscriptionStatus: () => Promise<void>;
}

export const createSubscriptionSlice: StateCreator<
  SubscriptionSlice,
  [],
  [],
  SubscriptionSlice
> = (set) => ({
  isPro: false,
  subscriptionPlan: null,

  setPro: (isPro, plan = null) => set({ isPro, subscriptionPlan: plan }),

  purchasePackage: async (pkg, plan) => {
    const success = await rcPurchase(pkg);
    if (success) {
      set({ isPro: true, subscriptionPlan: plan });
    }
    return success;
  },

  restorePurchases: async () => {
    const hasPro = await restoreUserPurchases();
    if (hasPro) {
      set({ isPro: true });
    }
    return hasPro;
  },

  syncSubscriptionStatus: async () => {
    const hasPro = await checkSubscriptionStatus();
    set({ isPro: hasPro, subscriptionPlan: hasPro ? null : null });
  },
});
