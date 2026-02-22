import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useStore } from '../../stores';
import { NeuCard } from '../ui/NeuCard';
import { typography, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

export function ActiveTaskBanner() {
  const c = useColors();
  const tasks = useStore((s) => s.tasks);
  const activeTask = tasks.find((t) => t.assignedToSession && !t.completed);

  if (!activeTask) return null;

  return (
    <NeuCard color={c.brightYellow} shadowSize="sm">
      <Text style={[styles.label, { color: '#1A1A2E' }]}>WORKING ON:</Text>
      <Text style={[styles.text, { color: '#1A1A2E' }]} numberOfLines={1}>
        {activeTask.text}
      </Text>
    </NeuCard>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    color: '#1A1A2E',
    opacity: 0.6,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    letterSpacing: 1,
  },
  text: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.base,
    color: '#1A1A2E',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
});
