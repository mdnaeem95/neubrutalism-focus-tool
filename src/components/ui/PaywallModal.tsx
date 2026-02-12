import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../../stores';
import { useOfferings } from '../../hooks/useSubscription';
import { NeuButton } from './NeuButton';
import { NeuCard } from './NeuCard';
import { NeuModal } from './NeuModal';
import { colors, typography, spacing, borders } from '../../theme';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

const FEATURES = [
  { icon: 'infinity' as const, label: 'Unlimited tasks' },
  { icon: 'chart-timeline-variant' as const, label: 'Full stats history' },
  { icon: 'palette-outline' as const, label: 'Custom themes' },
  { icon: 'cloud-sync-outline' as const, label: 'Cloud backup' },
];

export function PaywallModal({ visible, onClose }: PaywallModalProps) {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [purchasing, setPurchasing] = useState(false);
  const purchasePackage = useStore((s) => s.purchasePackage);
  const restorePurchases = useStore((s) => s.restorePurchases);
  const { offering, loading } = useOfferings();

  const monthlyPkg = offering?.monthly;
  const yearlyPkg = offering?.annual;
  const monthlyPrice = monthlyPkg?.product.priceString ?? '$4.99';
  const yearlyPrice = yearlyPkg?.product.priceString ?? '$29.99';

  const handlePurchase = async () => {
    const pkg = plan === 'monthly' ? monthlyPkg : yearlyPkg;
    if (!pkg) return;
    setPurchasing(true);
    const success = await purchasePackage(pkg, plan);
    setPurchasing(false);
    if (success) onClose();
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const success = await restorePurchases();
    setPurchasing(false);
    if (success) onClose();
  };

  return (
    <NeuModal visible={visible} onClose={onClose} title="Go Pro">
      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View key={f.label} style={styles.featureRow}>
            <MaterialCommunityIcons name={f.icon} size={20} color={colors.limeGreen} />
            <Text style={styles.featureText}>{f.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.planToggle}>
        <Pressable
          onPress={() => setPlan('monthly')}
          style={[
            styles.planOption,
            plan === 'monthly'
              ? { backgroundColor: colors.electricBlue, borderColor: borders.color }
              : { backgroundColor: colors.bgCard, borderColor: '#CCC' },
          ]}
        >
          <Text style={styles.planLabel}>Monthly</Text>
          <Text style={styles.planPrice}>{monthlyPrice}/mo</Text>
        </Pressable>
        <Pressable
          onPress={() => setPlan('yearly')}
          style={[
            styles.planOption,
            plan === 'yearly'
              ? { backgroundColor: colors.brightYellow, borderColor: borders.color }
              : { backgroundColor: colors.bgCard, borderColor: '#CCC' },
          ]}
        >
          <Text style={styles.planLabel}>Yearly</Text>
          <Text style={styles.planPrice}>{yearlyPrice}/yr</Text>
          <View style={styles.saveBadge}>
            <Text style={styles.saveText}>SAVE 50%</Text>
          </View>
        </Pressable>
      </View>

      {purchasing ? (
        <ActivityIndicator size="large" color={colors.hotPink} style={styles.loader} />
      ) : (
        <View style={styles.actions}>
          <NeuButton
            title="Subscribe"
            onPress={handlePurchase}
            color={colors.hotPink}
            size="lg"
            disabled={loading && !monthlyPkg && !yearlyPkg}
          />
          <Pressable onPress={handleRestore} style={styles.restoreBtn}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </Pressable>
        </View>
      )}
    </NeuModal>
  );
}

const styles = StyleSheet.create({
  features: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
  },
  planToggle: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  planOption: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borders.radius.md,
    borderWidth: borders.width.medium,
    alignItems: 'center',
    gap: spacing.xs,
  },
  planLabel: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  planPrice: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.lg,
    color: colors.black,
  },
  saveBadge: {
    backgroundColor: colors.limeGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borders.radius.sm,
  },
  saveText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 10,
    color: colors.black,
    letterSpacing: 0.5,
  },
  actions: {
    alignItems: 'center',
    gap: spacing.md,
  },
  restoreBtn: {
    padding: spacing.sm,
  },
  restoreText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    opacity: 0.5,
    textDecorationLine: 'underline',
  },
  loader: {
    marginVertical: spacing.xl,
  },
});
