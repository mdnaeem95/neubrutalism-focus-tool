import { useEffect, useState } from 'react';
import { PurchasesOffering } from 'react-native-purchases';
import { useStore } from '../stores';
import { initializePurchases, getOfferings } from '../utils/purchases';

let initialized = false;

export function useSubscriptionInit() {
  useEffect(() => {
    if (!initialized) {
      initialized = true;
      initializePurchases().then(() => {
        useStore.getState().syncSubscriptionStatus();
      });
    }
  }, []);
}

export function useOfferings() {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfferings().then((offerings) => {
      setOffering(offerings?.current ?? null);
      setLoading(false);
    });
  }, []);

  return { offering, loading };
}
