import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NeuCard } from '../ui/NeuCard';
import { colors, typography, spacing } from '../../theme';

interface FocusScoreProps {
  score: number;
  visible: boolean;
}

export function FocusScore({ score, visible }: FocusScoreProps) {
  if (!visible) return null;

  const scoreColor =
    score >= 80 ? colors.limeGreen : score >= 50 ? colors.brightYellow : colors.coral;

  return (
    <NeuCard color={scoreColor} shadowSize="sm">
      <View style={styles.container}>
        <Text style={styles.label}>FOCUS SCORE</Text>
        <Text style={styles.score}>{score}%</Text>
      </View>
    </NeuCard>
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
  score: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xl,
    color: colors.black,
  },
});
