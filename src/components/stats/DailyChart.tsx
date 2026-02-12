import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NeuCard } from '../ui/NeuCard';
import { useStore } from '../../stores';
import { colors, typography, spacing, borders } from '../../theme';
import { getLast7Days, getDayLabel } from '../../utils/dateUtils';

function AnimatedBar({
  height,
  color,
  hasBorder,
  index,
}: {
  height: number;
  color: string;
  hasBorder: boolean;
  index: number;
}) {
  const animHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(animHeight, {
        toValue: height,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }, index * 60);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          height: animHeight,
          backgroundColor: color,
          borderColor: borders.color,
          borderWidth: hasBorder ? borders.width.thin : 0,
        },
      ]}
    />
  );
}

export function DailyChart() {
  const dailyStats = useStore((s) => s.dailyStats);
  const days = getLast7Days();

  const maxSessions = Math.max(
    1,
    ...days.map((d) => dailyStats[d]?.sessionsCompleted || 0)
  );

  const chartHeight = 120;

  return (
    <NeuCard color={colors.bgCard} shadowSize="md">
      <View style={styles.container}>
        <Text style={styles.title}>LAST 7 DAYS</Text>
        <View style={styles.chartRow}>
          {days.map((day, index) => {
            const sessions = dailyStats[day]?.sessionsCompleted || 0;
            const barHeight = Math.max(4, (sessions / maxSessions) * chartHeight);
            const barColor =
              sessions === 0
                ? '#E0E0E0'
                : sessions >= 4
                ? colors.limeGreen
                : sessions >= 2
                ? colors.brightYellow
                : colors.hotPink;

            return (
              <View key={day} style={styles.barCol}>
                <View style={[styles.barTrack, { height: chartHeight }]}>
                  <AnimatedBar
                    height={barHeight}
                    color={barColor}
                    hasBorder={sessions > 0}
                    index={index}
                  />
                </View>
                <Text style={styles.dayLabel}>{getDayLabel(day)}</Text>
                <Text style={styles.countLabel}>{sessions}</Text>
              </View>
            );
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
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    justifyContent: 'flex-end',
    width: 28,
  },
  bar: {
    width: '100%',
    borderRadius: 3,
  },
  dayLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.black,
    marginTop: spacing.xs,
    opacity: 0.6,
  },
  countLabel: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 10,
    color: colors.black,
  },
});
