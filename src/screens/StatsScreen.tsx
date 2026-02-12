import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenEntrance } from '../hooks/useScreenEntrance';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../stores';
import { StatCard } from '../components/stats/StatCard';
import { DailyChart } from '../components/stats/DailyChart';
import { StreakCalendar } from '../components/stats/StreakCalendar';
import { NeuCard } from '../components/ui/NeuCard';
import { colors, typography, spacing } from '../theme';

function EmptyStats() {
  return (
    <NeuCard color={colors.bgCard} shadowSize="md">
      <View style={styles.emptyInner}>
        <MaterialCommunityIcons name="chart-bar" size={40} color={colors.black} style={{ marginBottom: spacing.sm }} />
        <Text style={styles.emptyTitle}>No data yet</Text>
        <Text style={styles.emptySubtitle}>
          Complete your first focus session to start tracking your progress!
        </Text>
      </View>
    </NeuCard>
  );
}

export function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { opacity, translateY } = useScreenEntrance();
  const totalLifetimeSessions = useStore((s) => s.totalLifetimeSessions);
  const totalLifetimeMinutes = useStore((s) => s.totalLifetimeMinutes);
  const currentStreak = useStore((s) => s.currentStreak);
  const longestStreak = useStore((s) => s.longestStreak);

  const totalHours = (totalLifetimeMinutes / 60).toFixed(1);
  const hasData = totalLifetimeSessions > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ opacity, transform: [{ translateY }] }}
      >
        <Text style={styles.title}>STATS</Text>

        <View style={styles.grid}>
          <StatCard
            label="Sessions"
            value={totalLifetimeSessions}
            icon="target"
            color={colors.hotPink}
            delay={0}
          />
          <StatCard
            label="Hours"
            value={totalHours}
            icon="clock-outline"
            color={colors.electricBlue}
            delay={80}
          />
        </View>
        <View style={styles.grid}>
          <StatCard
            label="Current Streak"
            value={`${currentStreak}d`}
            icon="fire"
            color={colors.brightYellow}
            delay={160}
          />
          <StatCard
            label="Best Streak"
            value={`${longestStreak}d`}
            icon="trophy"
            color={colors.limeGreen}
            delay={240}
          />
        </View>

        {hasData ? (
          <>
            <DailyChart />
            <StreakCalendar />
          </>
        ) : (
          <EmptyStats />
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgStats,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.black,
    letterSpacing: 4,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  emptyInner: {
    alignItems: 'center',
    padding: spacing['2xl'],
    gap: spacing.sm,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.lg,
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    opacity: 0.5,
    textAlign: 'center',
  },
});
