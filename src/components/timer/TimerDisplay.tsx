import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useStore } from '../../stores';
import { NeuCard } from '../ui/NeuCard';
import { colors, typography, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';
import { formatTime } from '../../utils/formatTime';

const PHASE_LABELS: Record<string, string> = {
  work: 'FOCUS TIME',
  shortBreak: 'SHORT BREAK',
  longBreak: 'LONG BREAK',
};

const PHASE_COLORS: Record<string, string> = {
  work: colors.hotPink,
  shortBreak: colors.electricBlue,
  longBreak: colors.limeGreen,
};

export function TimerDisplay() {
  const c = useColors();
  const secondsRemaining = useStore((s) => s.secondsRemaining);
  const timerPhase = useStore((s) => s.timerPhase);
  const timerStatus = useStore((s) => s.timerStatus);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevPhase = useRef(timerPhase);

  // Subtle pulse when timer is running
  useEffect(() => {
    if (timerStatus === 'running') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      scaleAnim.setValue(1);
    }
  }, [timerStatus, scaleAnim]);

  // Pop animation on phase change
  useEffect(() => {
    if (prevPhase.current !== timerPhase) {
      prevPhase.current = timerPhase;
      scaleAnim.setValue(0.9);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 12,
      }).start();
    }
  }, [timerPhase, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <NeuCard shadowSize="lg">
        <View style={styles.container}>
          <Text
            style={[styles.time, { color: c.black }]}
            accessibilityLabel={`${Math.floor(secondsRemaining / 60)} minutes ${secondsRemaining % 60} seconds remaining`}
          >
            {formatTime(secondsRemaining)}
          </Text>
          <View style={[styles.phaseBadge, { backgroundColor: PHASE_COLORS[timerPhase] + '30' }]}>
            <Text style={[styles.phase, { color: PHASE_COLORS[timerPhase] }]}>
              {PHASE_LABELS[timerPhase]}
            </Text>
          </View>
        </View>
      </NeuCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing['3xl'],
  },
  time: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['5xl'],
    color: colors.black,
    letterSpacing: 4,
    minWidth: 240,
    textAlign: 'center',
  },
  phaseBadge: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: 100,
  },
  phase: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    letterSpacing: 2,
  },
});
