import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { typography, borders, shadows, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

interface NeuInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export function NeuInput({ containerStyle, style, ...props }: NeuInputProps) {
  const c = useColors();
  const shadow = shadows.sm;

  return (
    <View style={[styles.container, { marginRight: shadow.offsetX, marginBottom: shadow.offsetY }, containerStyle]}>
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

      {/* Input */}
      <TextInput
        placeholderTextColor="#999"
        {...props}
        style={[
          styles.input,
          {
            backgroundColor: c.bgCard,
            color: c.black,
            borderColor: borders.color,
            borderWidth: borders.width.medium,
            borderRadius: borders.radius.md,
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    position: 'relative',
    zIndex: 1,
  },
});
