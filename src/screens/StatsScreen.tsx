import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenEntrance } from '../hooks/useScreenEntrance';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../stores';
import { StatCard } from '../components/stats/StatCard';
import { DailyChart } from '../components/stats/DailyChart';
import { StreakCalendar } from '../components/stats/StreakCalendar';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { ProGate } from '../components/ui/ProGate';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { colors, typography, spacing } from '../theme';
import { getLast7Days } from '../utils/dateUtils';
import { shareStats } from '../utils/exportData';
import { useColors } from '../theme/ThemeContext';

function EmptyStats() {
  const c = useColors();
  return (
    <NeuCard shadowSize="md">
      <View style={styles.emptyInner}>
        <MaterialCommunityIcons name="chart-bar" size={40} color={c.black} style={{ marginBottom: spacing.sm }} />
        <Text style={[styles.emptyTitle, { color: c.black }]}>No data yet</Text>
        <Text style={[styles.emptySubtitle, { color: c.black }]}>
          Complete your first focus session to start tracking your progress!
        </Text>
      </View>
    </NeuCard>
  );
}

export function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { opacity, translateY } = useScreenEntrance();
  const c = useColors();
  const totalLifetimeSessions = useStore((s) => s.totalLifetimeSessions);
  const totalLifetimeMinutes = useStore((s) => s.totalLifetimeMinutes);
  const currentStreak = useStore((s) => s.currentStreak);
  const longestStreak = useStore((s) => s.longestStreak);
  const dailyStats = useStore((s) => s.dailyStats);

  const totalHours = (totalLifetimeMinutes / 60).toFixed(1);
  const hasData = totalLifetimeSessions > 0;

  // Compute 7-day average focus score
  const last7 = getLast7Days();
  const daysWithScore = last7
    .map((d) => dailyStats[d])
    .filter((d) => d && d.sessionsCompleted > 0);
  const avgFocusScore =
    daysWithScore.length > 0
      ? Math.round(
          daysWithScore.reduce((sum, d) => sum + d.averageFocusScore, 0) /
            daysWithScore.length
        )
      : 0;

  return (
    <ScreenContainer style={{ backgroundColor: c.bgStats, paddingTop: insets.top + spacing.lg }}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ opacity, transform: [{ translateY }] }}
      >
        <Text style={[styles.title, { color: c.black }]}>STATS</Text>

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
            <ProGate>
              <View style={styles.grid}>
                <StatCard
                  label="Avg Focus"
                  value={`${avgFocusScore}%`}
                  icon="brain"
                  color={
                    avgFocusScore >= 80
                      ? colors.limeGreen
                      : avgFocusScore >= 50
                      ? colors.brightYellow
                      : colors.coral
                  }
                  delay={320}
                />
              </View>
              <StreakCalendar />
              <NeuButton
                title="SHARE STATS"
                onPress={() =>
                  shareStats({
                    totalSessions: totalLifetimeSessions,
                    totalHours,
                    currentStreak,
                    avgFocusScore,
                  })
                }
                color={colors.electricBlue}
                size="sm"
              />
            </ProGate>
          </>
        ) : (
          <EmptyStats />
        )}
      </Animated.ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
