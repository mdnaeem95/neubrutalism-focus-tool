import Purchases, {
  PurchasesOfferings,
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '',
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '',
};

const ENTITLEMENT_ID = 'pro';

let initPromise: Promise<void> | null = null;

export function initializePurchases(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
    if (!apiKey) {
      throw new Error(`RevenueCat API key is empty for ${Platform.OS}`);
    }
    Purchases.configure({ apiKey });
  })();

  return initPromise;
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  try {
    // Ensure SDK is initialized before fetching
    await initializePurchases();
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (e) {
    console.warn('Failed to fetch offerings:', e);
    return null;
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export async function restoreUserPurchases(): Promise<boolean> {
  const customerInfo = await Purchases.restorePurchases();
  return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('Status check failed:', e);
    return false;
  }
}
