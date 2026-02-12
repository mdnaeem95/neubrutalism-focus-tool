import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSettingsSlice, SettingsSlice } from './settingsSlice';
import { createTaskSlice, TaskSlice } from './taskSlice';
import { createTimerSlice, TimerSlice } from './timerSlice';
import { createFocusSlice, FocusSlice } from './focusSlice';
import { createStatsSlice, StatsSlice } from './statsSlice';
import { createSubscriptionSlice, SubscriptionSlice } from './subscriptionSlice';

export type AppState = SettingsSlice & TaskSlice & TimerSlice & FocusSlice & StatsSlice & SubscriptionSlice;

export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createSettingsSlice(...a),
      ...createTaskSlice(...a),
      ...createTimerSlice(...a),
      ...createFocusSlice(...a),
      ...createStatsSlice(...a),
      ...createSubscriptionSlice(...a),
    }),
    {
      name: 'focus-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        dailyStats: state.dailyStats,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        totalLifetimeSessions: state.totalLifetimeSessions,
        totalLifetimeMinutes: state.totalLifetimeMinutes,
        workDurationMinutes: state.workDurationMinutes,
        shortBreakMinutes: state.shortBreakMinutes,
        longBreakMinutes: state.longBreakMinutes,
        sessionsBeforeLongBreak: state.sessionsBeforeLongBreak,
        notificationsEnabled: state.notificationsEnabled,
        hapticsEnabled: state.hapticsEnabled,
        soundEnabled: state.soundEnabled,
        hasOnboarded: state.hasOnboarded,
        isPro: state.isPro,
        subscriptionPlan: state.subscriptionPlan,
      }),
    }
  )
);
