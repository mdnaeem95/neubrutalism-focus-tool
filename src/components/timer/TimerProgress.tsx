import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useStore } from '../../stores';
import { NeuProgressBar } from '../ui/NeuProgressBar';
import { colors, spacing } from '../../theme';
import {
  DEFAULT_WORK_MINUTES,
  DEFAULT_SHORT_BREAK_MINUTES,
  DEFAULT_LONG_BREAK_MINUTES,
} from '../../utils/constants';

interface TimerProgressProps {
  style?: ViewStyle;
}

export function TimerProgress({ style }: TimerProgressProps) {
  const secondsRemaining = useStore((s) => s.secondsRemaining);
  const timerPhase = useStore((s) => s.timerPhase);

  const totalSeconds =
    timerPhase === 'work'
      ? DEFAULT_WORK_MINUTES * 60
      : timerPhase === 'shortBreak'
      ? DEFAULT_SHORT_BREAK_MINUTES * 60
      : DEFAULT_LONG_BREAK_MINUTES * 60;

  const progress = 1 - secondsRemaining / totalSeconds;

  const fillColor =
    timerPhase === 'work'
      ? colors.hotPink
      : timerPhase === 'shortBreak'
      ? colors.electricBlue
      : colors.limeGreen;

  return (
    <NeuProgressBar
      progress={progress}
      fillColor={fillColor}
      height={16}
      style={StyleSheet.flatten([styles.bar, style])}
    />
  );
}

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: spacing.xl,
  },
});
