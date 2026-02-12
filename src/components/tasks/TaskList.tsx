import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../../stores';
import { TaskItem } from './TaskItem';
import { NeuCard } from '../ui/NeuCard';
import { colors, typography, spacing } from '../../theme';

interface TaskListProps {
  filter: 'all' | 'active' | 'completed';
}

const EMPTY_CONFIG: Record<string, { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; subtitle: string }> = {
  all: { icon: 'clipboard-text-outline', title: 'No tasks yet', subtitle: 'Add your first task above to get started!' },
  active: { icon: 'star-four-points-outline', title: 'All caught up!', subtitle: 'No active tasks — nice work.' },
  completed: { icon: 'flag-checkered', title: 'Nothing completed yet', subtitle: 'Start checking off tasks to see them here.' },
};

export function TaskList({ filter }: TaskListProps) {
  const tasks = useStore((s) => s.tasks);

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    const config = EMPTY_CONFIG[filter];
    return (
      <View style={styles.empty}>
        <NeuCard color={colors.bgCard} shadowSize="sm">
          <View style={styles.emptyInner}>
            <MaterialCommunityIcons name={config.icon} size={40} color={colors.black} style={{ marginBottom: spacing.sm }} />
            <Text style={styles.emptyTitle}>{config.title}</Text>
            <Text style={styles.emptySubtitle}>{config.subtitle}</Text>
          </View>
        </NeuCard>
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskItem task={item} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  empty: {
    paddingVertical: spacing['2xl'],
  },
  emptyInner: {
    alignItems: 'center',
    padding: spacing['2xl'],
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.lg,
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    opacity: 0.5,
    textAlign: 'center',
  },
});
