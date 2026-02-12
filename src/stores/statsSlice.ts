import { StateCreator } from 'zustand';
import { DayStats } from '../types/stats';
import { getTodayKey, getLast7Days } from '../utils/dateUtils';

export interface StatsSlice {
  dailyStats: Record<string, DayStats>;
  currentStreak: number;
  longestStreak: number;
  totalLifetimeSessions: number;
  totalLifetimeMinutes: number;

  recordCompletedSession: (durationMinutes: number, focusScore: number) => void;
  recalculateStreak: () => void;
  getWeeklyStats: () => DayStats[];
}

export const createStatsSlice: StateCreator<StatsSlice, [], [], StatsSlice> = (set, get) => ({
  dailyStats: {},
  currentStreak: 0,
  longestStreak: 0,
  totalLifetimeSessions: 0,
  totalLifetimeMinutes: 0,

  recordCompletedSession: (durationMinutes, focusScore) =>
    set((state) => {
      const today = getTodayKey();
      const existing = state.dailyStats[today] || {
        date: today,
        sessionsCompleted: 0,
        totalFocusMinutes: 0,
        averageFocusScore: 0,
      };

      const totalScoreSum =
        existing.averageFocusScore * existing.sessionsCompleted + focusScore;
      const newSessionCount = existing.sessionsCompleted + 1;

      const updatedDay: DayStats = {
        date: today,
        sessionsCompleted: newSessionCount,
        totalFocusMinutes: existing.totalFocusMinutes + durationMinutes,
        averageFocusScore: Math.round(totalScoreSum / newSessionCount),
      };

      return {
        dailyStats: { ...state.dailyStats, [today]: updatedDay },
        totalLifetimeSessions: state.totalLifetimeSessions + 1,
        totalLifetimeMinutes: state.totalLifetimeMinutes + durationMinutes,
      };
    }),

  recalculateStreak: () =>
    set((state) => {
      let streak = 0;
      const date = new Date();

      while (true) {
        const key = date.toISOString().split('T')[0];
        if (state.dailyStats[key]?.sessionsCompleted > 0) {
          streak++;
          date.setDate(date.getDate() - 1);
        } else {
          break;
        }
      }

      return {
        currentStreak: streak,
        longestStreak: Math.max(state.longestStreak, streak),
      };
    }),

  getWeeklyStats: () => {
    const state = get();
    return getLast7Days().map(
      (date) =>
        state.dailyStats[date] || {
          date,
          sessionsCompleted: 0,
          totalFocusMinutes: 0,
          averageFocusScore: 0,
        }
    );
  },
});
