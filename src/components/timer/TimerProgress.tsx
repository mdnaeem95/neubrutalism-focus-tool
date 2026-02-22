import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useStore } from '../../stores';
import { NeuProgressBar } from '../ui/NeuProgressBar';
import { colors, spacing } from '../../theme';

interface TimerProgressProps {
  style?: ViewStyle;
}

export function TimerProgress({ style }: TimerProgressProps) {
  const secondsRemaining = useStore((s) => s.secondsRemaining);
  const timerPhase = useStore((s) => s.timerPhase);
  const workMinutes = useStore((s) => s.workDurationMinutes);
  const shortBreakMinutes = useStore((s) => s.shortBreakMinutes);
  const longBreakMinutes = useStore((s) => s.longBreakMinutes);

  const totalSeconds =
    timerPhase === 'work'
      ? workMinutes * 60
      : timerPhase === 'shortBreak'
      ? shortBreakMinutes * 60
      : longBreakMinutes * 60;

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
