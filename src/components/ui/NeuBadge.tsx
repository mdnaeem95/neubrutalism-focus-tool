import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borders, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

interface NeuBadgeProps {
  label: string;
  active?: boolean;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function NeuBadge({
  label,
  active = false,
  color = colors.electricBlue,
  onPress,
  style,
}: NeuBadgeProps) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[
        styles.badge,
        {
          backgroundColor: active ? color : c.bgCard,
          borderColor: borders.color,
          borderWidth: borders.width.thin,
          borderRadius: borders.radius.sm,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: active ? c.black : '#666' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  text: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
