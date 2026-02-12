import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors, typography, borders, shadows, spacing } from '../../theme';

interface NeuInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export function NeuInput({ containerStyle, style, ...props }: NeuInputProps) {
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
    backgroundColor: colors.bgCard,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    color: colors.black,
    position: 'relative',
    zIndex: 1,
  },
});
