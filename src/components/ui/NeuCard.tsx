import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borders, shadows } from '../../theme';

interface NeuCardProps {
  children: ReactNode;
  color?: string;
  shadowSize?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function NeuCard({
  children,
  color = colors.bgCard,
  shadowSize = 'md',
  style,
}: NeuCardProps) {
  const shadow = shadows[shadowSize];

  return (
    <View style={[styles.container, { marginRight: shadow.offsetX, marginBottom: shadow.offsetY }, style]}>
      {/* Shadow layer */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: shadow.color,
            borderRadius: borders.radius.md,
            top: shadow.offsetY,
            left: shadow.offsetX,
          },
        ]}
      />

      {/* Content layer */}
      <View
        style={[
          styles.content,
          {
            backgroundColor: color,
            borderColor: borders.color,
            borderWidth: borders.width.medium,
            borderRadius: borders.radius.md,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
});
