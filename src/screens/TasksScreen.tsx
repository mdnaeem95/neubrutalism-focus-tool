import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenEntrance } from '../hooks/useScreenEntrance';
import { useStore } from '../stores';
import { TaskInput } from '../components/tasks/TaskInput';
import { TaskList } from '../components/tasks/TaskList';
import { NeuBadge } from '../components/ui/NeuBadge';
import { NeuButton } from '../components/ui/NeuButton';
import { colors, typography, spacing } from '../theme';

type Filter = 'all' | 'active' | 'completed';

export function TasksScreen() {
  const insets = useSafeAreaInsets();
  const { opacity, translateY } = useScreenEntrance();
  const [filter, setFilter] = useState<Filter>('all');
  const tasks = useStore((s) => s.tasks);
  const clearCompletedTasks = useStore((s) => s.clearCompletedTasks);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>TASKS</Text>
          <NeuBadge label={`${tasks.length}`} active color={colors.brightYellow} />
        </View>

        <TaskInput />

        <View style={styles.filters}>
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <NeuBadge
              key={f}
              label={f}
              active={filter === f}
              color={colors.brightYellow}
              onPress={() => setFilter(f)}
            />
          ))}
        </View>

        <View style={styles.list}>
          <TaskList filter={filter} />
        </View>

        {completedCount > 0 && (
          <View style={styles.footer}>
            <NeuButton
              title="Clear Completed"
              onPress={clearCompletedTasks}
              color={colors.coral}
              size="sm"
            />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgTasks,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.black,
    letterSpacing: 4,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  list: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
});
