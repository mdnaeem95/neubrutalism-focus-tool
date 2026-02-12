import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../../stores';
import { NeuButton } from './NeuButton';
import { NeuCard } from './NeuCard';
import { PaywallModal } from './PaywallModal';
import { colors, typography, spacing } from '../../theme';

interface ProGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProGate({ children, fallback }: ProGateProps) {
  const isPro = useStore((s) => s.isPro);
  const [showPaywall, setShowPaywall] = useState(false);

  if (isPro) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <>
      <NeuCard color={colors.brightYellow} shadowSize="sm">
        <View style={styles.container}>
          <Text style={styles.label}>PRO FEATURE</Text>
          <NeuButton
            title="Upgrade"
            onPress={() => setShowPaywall(true)}
            color={colors.hotPink}
            size="sm"
          />
        </View>
      </NeuCard>
      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    color: colors.black,
    letterSpacing: 1,
  },
});
