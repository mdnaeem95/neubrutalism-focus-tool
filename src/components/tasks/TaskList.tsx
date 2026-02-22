import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../../stores';
import { TaskItem } from './TaskItem';
import { NeuCard } from '../ui/NeuCard';
import { Task } from '../../types/task';
import { colors, typography, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

interface TaskListProps {
  filter: 'all' | 'active' | 'completed';
}

const EMPTY_CONFIG: Record<string, { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; subtitle: string }> = {
  all: { icon: 'clipboard-text-outline', title: 'No tasks yet', subtitle: 'Add your first task above to get started!' },
  active: { icon: 'star-four-points-outline', title: 'All caught up!', subtitle: 'No active tasks — nice work.' },
  completed: { icon: 'flag-checkered', title: 'Nothing completed yet', subtitle: 'Start checking off tasks to see them here.' },
};

export function TaskList({ filter }: TaskListProps) {
  const c = useColors();
  const tasks = useStore((s) => s.tasks);
  const reorderTasks = useStore((s) => s.reorderTasks);

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleDragEnd = useCallback(
    ({ from, to }: { from: number; to: number }) => {
      if (from !== to) reorderTasks(from, to);
    },
    [reorderTasks]
  );

  const renderDraggableItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Task>) => (
      <TaskItem task={item} drag={drag} isActive={isActive} />
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Task }) => <TaskItem task={item} />,
    []
  );

  if (filtered.length === 0) {
    const config = EMPTY_CONFIG[filter];
    return (
      <View style={styles.empty}>
        <NeuCard shadowSize="sm">
          <View style={styles.emptyInner}>
            <MaterialCommunityIcons name={config.icon} size={40} color={c.black} style={{ marginBottom: spacing.sm }} />
            <Text style={[styles.emptyTitle, { color: c.black }]}>{config.title}</Text>
            <Text style={[styles.emptySubtitle, { color: c.black }]}>{config.subtitle}</Text>
          </View>
        </NeuCard>
      </View>
    );
  }

  // Use draggable list only for unfiltered "all" view
  if (filter === 'all') {
    return (
      <DraggableFlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderDraggableItem}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
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
