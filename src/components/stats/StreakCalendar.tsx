import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NeuCard } from '../ui/NeuCard';
import { useStore } from '../../stores';
import { colors, typography, spacing, borders } from '../../theme';
import { useColors } from '../../theme/ThemeContext';
import { getLast30Days } from '../../utils/dateUtils';

function AnimatedCell({ hasSession, index }: { hasSession: boolean; index: number }) {
  const scale = useRef(new Animated.Value(hasSession ? 0 : 1)).current;

  useEffect(() => {
    if (hasSession) {
      const timeout = setTimeout(() => {
        Animated.spring(scale, {
          toValue: 1,
          speed: 14,
          bounciness: 8,
          useNativeDriver: true,
        }).start();
      }, index * 15);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          backgroundColor: hasSession ? colors.limeGreen : '#F0F0F0',
          borderColor: hasSession ? borders.color : '#DDD',
          borderWidth: hasSession ? borders.width.thin : 1,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

export function StreakCalendar() {
  const c = useColors();
  const dailyStats = useStore((s) => s.dailyStats);
  const days = getLast30Days();

  return (
    <NeuCard shadowSize="md">
      <View style={styles.container}>
        <Text style={[styles.title, { color: c.black }]}>30-DAY STREAK</Text>
        <View style={styles.grid}>
          {days.map((day, index) => {
            const hasSession = (dailyStats[day]?.sessionsCompleted || 0) > 0;
            return <AnimatedCell key={day} hasSession={hasSession} index={index} />;
          })}
        </View>
      </View>
    </NeuCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cell: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
});
