import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borders } from '../../theme';

interface NeuProgressBarProps {
  progress: number; // 0 to 1
  fillColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function NeuProgressBar({
  progress,
  fillColor = colors.limeGreen,
  height = 20,
  style,
}: NeuProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderColor: borders.color,
          borderWidth: borders.width.medium,
          borderRadius: borders.radius.sm,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: fillColor,
            borderRadius: clampedProgress === 1 ? borders.radius.sm - 2 : 0,
            borderTopLeftRadius: borders.radius.sm - 2,
            borderBottomLeftRadius: borders.radius.sm - 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
