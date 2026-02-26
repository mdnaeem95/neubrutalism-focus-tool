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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOfferings()
      .then((offerings) => {
        setOffering(offerings?.current ?? null);
        if (!offerings?.current) {
          setError('No current offering found in RevenueCat dashboard.');
        }
      })
      .catch((e: any) => {
        setError(e?.message ?? 'Unknown error loading offerings');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { offering, loading, error };
}
