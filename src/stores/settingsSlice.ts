import { StateCreator } from 'zustand';
import {
  DEFAULT_WORK_MINUTES,
  DEFAULT_SHORT_BREAK_MINUTES,
  DEFAULT_LONG_BREAK_MINUTES,
  DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
} from '../utils/constants';

export interface SettingsSlice {
  workDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  hasOnboarded: boolean;

  updateWorkDuration: (minutes: number) => void;
  updateShortBreak: (minutes: number) => void;
  updateLongBreak: (minutes: number) => void;
  updateSessionsBeforeLongBreak: (count: number) => void;
  toggleNotifications: () => void;
  toggleHaptics: () => void;
  toggleSound: () => void;
  resetSettingsToDefaults: () => void;
  completeOnboarding: () => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  workDurationMinutes: DEFAULT_WORK_MINUTES,
  shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
  longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
  sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
  notificationsEnabled: true,
  hapticsEnabled: true,
  soundEnabled: true,
  hasOnboarded: false,

  updateWorkDuration: (minutes) => set({ workDurationMinutes: minutes }),
  updateShortBreak: (minutes) => set({ shortBreakMinutes: minutes }),
  updateLongBreak: (minutes) => set({ longBreakMinutes: minutes }),
  updateSessionsBeforeLongBreak: (count) => set({ sessionsBeforeLongBreak: count }),
  toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
  toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  resetSettingsToDefaults: () =>
    set({
      workDurationMinutes: DEFAULT_WORK_MINUTES,
      shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
      longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
      sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
      notificationsEnabled: true,
      hapticsEnabled: true,
      soundEnabled: true,
    }),
  completeOnboarding: () => set({ hasOnboarded: true }),
});
