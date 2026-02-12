import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useStore } from '../../stores';
import { NeuCard } from '../ui/NeuCard';
import { colors, typography, spacing } from '../../theme';

export function ActiveTaskBanner() {
  const tasks = useStore((s) => s.tasks);
  const activeTask = tasks.find((t) => t.assignedToSession && !t.completed);

  if (!activeTask) return null;

  return (
    <NeuCard color={colors.brightYellow} shadowSize="sm">
      <Text style={styles.label}>WORKING ON:</Text>
      <Text style={styles.text} numberOfLines={1}>
        {activeTask.text}
      </Text>
    </NeuCard>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    color: colors.black,
    opacity: 0.6,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    letterSpacing: 1,
  },
  text: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.base,
    color: colors.black,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
});
