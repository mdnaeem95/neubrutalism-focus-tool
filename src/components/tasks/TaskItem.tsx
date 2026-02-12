import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Task } from '../../types/task';
import { useStore } from '../../stores';
import { NeuCheckbox } from '../ui/NeuCheckbox';
import { NeuCard } from '../ui/NeuCard';
import { colors, typography, spacing } from '../../theme';
import { useHaptics } from '../../hooks/useHaptics';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useStore((s) => s.toggleTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const assignTaskToSession = useStore((s) => s.assignTaskToSession);
  const unassignTaskFromSession = useStore((s) => s.unassignTaskFromSession);
  const haptics = useHaptics();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const enterX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(enterX, {
        toValue: 0,
        speed: 12,
        bounciness: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleToggle = () => {
    toggleTask(task.id);
    if (!task.completed) haptics.success();
  };

  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      deleteTask(task.id);
    });
    haptics.light();
  };

  const handleAssign = () => {
    if (task.assignedToSession) {
      unassignTaskFromSession(task.id);
    } else {
      assignTaskToSession(task.id);
    }
    haptics.light();
  };

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateX: enterX }],
    }}>
      <NeuCard color={colors.bgCard} shadowSize="sm">
        <View style={styles.container}>
          <NeuCheckbox checked={task.completed} onToggle={handleToggle} />
          <Text
            style={[
              styles.text,
              task.completed ? styles.completedText : undefined,
            ]}
            numberOfLines={2}
            accessibilityLabel={`Task: ${task.text}${task.completed ? ', completed' : ''}`}
          >
            {task.text}
          </Text>
          <Pressable
            onPress={handleAssign}
            accessibilityRole="button"
            accessibilityLabel={task.assignedToSession ? 'Unassign from session' : 'Assign to session'}
            style={styles.iconBtn}
          >
            <View style={[
              styles.assignDot,
              {
                backgroundColor: task.assignedToSession ? colors.hotPink : 'transparent',
                borderColor: task.assignedToSession ? colors.hotPink : '#CCC',
              },
            ]} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete task"
            style={styles.iconBtn}
          >
            <MaterialCommunityIcons name="close-thick" size={16} color={colors.coral} />
          </Pressable>
        </View>
      </NeuCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  text: {
    flex: 1,
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  iconBtn: {
    padding: spacing.xs,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});
