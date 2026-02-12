import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, borders, spacing } from '../../theme';

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
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.badge,
        {
          backgroundColor: active ? color : colors.bgCard,
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
          { color: active ? colors.black : '#666' },
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
