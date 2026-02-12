import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useStore } from '../../stores';
import { colors, borders, spacing } from '../../theme';
import { DEFAULT_SESSIONS_BEFORE_LONG_BREAK } from '../../utils/constants';

function Dot({ isCompleted, isCurrent }: { isCompleted: boolean; isCurrent: boolean }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCurrent) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.25, duration: 600, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isCurrent, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: isCompleted
            ? colors.limeGreen
            : isCurrent
            ? colors.hotPink
            : 'transparent',
          borderColor: borders.color,
          borderWidth: borders.width.medium,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
}

export function SessionIndicator() {
  const currentSession = useStore((s) => s.currentSession);
  const timerPhase = useStore((s) => s.timerPhase);

  return (
    <View
      style={styles.container}
      accessibilityLabel={`Session ${currentSession} of ${DEFAULT_SESSIONS_BEFORE_LONG_BREAK}`}
    >
      {Array.from({ length: DEFAULT_SESSIONS_BEFORE_LONG_BREAK }, (_, i) => {
        const sessionNum = i + 1;
        const isCompleted = sessionNum < currentSession;
        const isCurrent = sessionNum === currentSession && timerPhase === 'work';

        return (
          <Dot key={i} isCompleted={isCompleted} isCurrent={isCurrent} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});
