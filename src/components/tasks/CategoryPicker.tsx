import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../../stores';
import { BUILT_IN_CATEGORIES } from '../../utils/constants';
import { NeuBadge } from '../ui/NeuBadge';
import { borders, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';
import { TaskCategory } from '../../types/category';

interface CategoryPickerProps {
  selectedCategory: string | undefined;
  onSelectCategory: (category: string | undefined) => void;
  /** Render as full NeuBadge pills with labels (for filter rows). Default: compact dots. */
  variant?: 'dots' | 'badges';
}

export function CategoryPicker({
  selectedCategory,
  onSelectCategory,
  variant = 'dots',
}: CategoryPickerProps) {
  const c = useColors();
  const customCategories = useStore((s) => s.customCategories);

  const allCategories: TaskCategory[] = [...BUILT_IN_CATEGORIES, ...customCategories];

  const handlePress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onSelectCategory(undefined);
    } else {
      onSelectCategory(categoryId);
    }
  };

  if (variant === 'badges') {
    return (
      <View style={styles.badgeRow}>
        {allCategories.map((cat) => (
          <NeuBadge
            key={cat.id}
            label={cat.name}
            active={selectedCategory === cat.id}
            color={cat.color}
            onPress={() => handlePress(cat.id)}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.dotRow}>
      {allCategories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => handlePress(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={`${cat.name} category`}
            accessibilityState={{ selected: isActive }}
            style={styles.dotHit}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isActive ? cat.color : 'transparent',
                  borderColor: isActive ? borders.color : c.black,
                  opacity: isActive ? 1 : 0.35,
                },
              ]}
            >
              {isActive ? (
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={10}
                  color={c.black}
                />
              ) : undefined}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dotRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dotHit: {
    padding: 4,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: borders.width.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
