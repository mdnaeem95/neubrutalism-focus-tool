import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Task } from '../../types/task';
import { useStore } from '../../stores';
import { NeuCheckbox } from '../ui/NeuCheckbox';
import { NeuCard } from '../ui/NeuCard';
import { colors, typography, spacing, borders } from '../../theme';
import { useColors } from '../../theme/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { BUILT_IN_CATEGORIES } from '../../utils/constants';

interface TaskItemProps {
  task: Task;
  drag?: () => void;
  isActive?: boolean;
}

export function TaskItem({ task, drag, isActive }: TaskItemProps) {
  const c = useColors();
  const customCategories = useStore((s) => s.customCategories);
  const toggleTask = useStore((s) => s.toggleTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const editTask = useStore((s) => s.editTask);
  const assignTaskToSession = useStore((s) => s.assignTaskToSession);
  const unassignTaskFromSession = useStore((s) => s.unassignTaskFromSession);
  const haptics = useHaptics();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const enterX = useRef(new Animated.Value(-20)).current;
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

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

  const handleEditSubmit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      editTask(task.id, trimmed);
    } else {
      setEditText(task.text);
    }
    setEditing(false);
  };

  const handleLongPress = () => {
    if (!task.completed) {
      setEditing(true);
      haptics.light();
    }
  };

  return (
    <Animated.View style={{
      opacity: isActive ? 0.9 : fadeAnim,
      transform: isActive ? [{ scale: 1.03 }] : [{ translateX: enterX }],
    }}>
      <NeuCard shadowSize="sm">
        <View style={styles.container}>
          {drag ? (
            <Pressable onLongPress={drag} delayLongPress={150} accessibilityLabel="Drag to reorder">
              <MaterialCommunityIcons name="drag" size={20} color={c.black} style={{ opacity: 0.4 }} />
            </Pressable>
          ) : undefined}
          <NeuCheckbox checked={task.completed} onToggle={handleToggle} />
          {task.category ? (() => {
            const allCats = [...BUILT_IN_CATEGORIES, ...customCategories];
            const cat = allCats.find((c) => c.id === task.category);
            return cat ? (
              <View
                style={[styles.categoryDot, { backgroundColor: cat.color }]}
                accessibilityLabel={`${cat.name} category`}
              />
            ) : undefined;
          })() : undefined}
          {editing ? (
            <TextInput
              style={[styles.editInput, { color: c.black }]}
              value={editText}
              onChangeText={setEditText}
              onSubmitEditing={handleEditSubmit}
              onBlur={handleEditSubmit}
              autoFocus
              returnKeyType="done"
              selectTextOnFocus
            />
          ) : (
            <Pressable onLongPress={handleLongPress} style={styles.textWrap}>
              <Text
                style={[
                  styles.text,
                  { color: c.black },
                  task.completed ? styles.completedText : undefined,
                ]}
                numberOfLines={2}
                accessibilityLabel={`Task: ${task.text}${task.completed ? ', completed' : ''}. Long press to edit.`}
              >
                {task.text}
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleAssign}
            accessibilityRole="button"
            accessibilityLabel={task.assignedToSession ? 'Unassign from session' : 'Assign to session'}
            style={styles.iconBtn}
          >
            <MaterialCommunityIcons
              name={task.assignedToSession ? 'pin' : 'pin-outline'}
              size={18}
              color={task.assignedToSession ? colors.hotPink : c.black}
              style={{ opacity: task.assignedToSession ? 1 : 0.35 }}
            />
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
  textWrap: {
    flex: 1,
  },
  text: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  editInput: {
    flex: 1,
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
    borderBottomWidth: borders.width.medium,
    borderBottomColor: colors.electricBlue,
    paddingVertical: 2,
  },
  iconBtn: {
    padding: spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: borders.color,
  },
});
