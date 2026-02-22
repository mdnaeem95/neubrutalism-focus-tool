import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStore } from '../../stores';
import { NeuButton } from './NeuButton';
import { NeuCard } from './NeuCard';
import { PaywallModal } from './PaywallModal';
import { typography, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

interface ProGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProGate({ children, fallback }: ProGateProps) {
  const c = useColors();
  const isPro = useStore((s) => s.isPro);
  const [showPaywall, setShowPaywall] = useState(false);

  if (isPro) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <>
      <NeuCard color={c.brightYellow} shadowSize="sm">
        <View style={styles.container}>
          <Text style={[styles.label, { color: '#1A1A2E' }]}>PRO FEATURE</Text>
          <NeuButton
            title="Upgrade"
            onPress={() => setShowPaywall(true)}
            color={c.hotPink}
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
    color: '#1A1A2E',
    letterSpacing: 1,
  },
});
