import { StateCreator } from 'zustand';
import {
  DEFAULT_WORK_MINUTES,
  DEFAULT_SHORT_BREAK_MINUTES,
  DEFAULT_LONG_BREAK_MINUTES,
  DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
} from '../utils/constants';

/** Minimal timer fields needed so settings can sync secondsRemaining when idle. */
type SettingsWithTimer = SettingsSlice & {
  timerStatus: string;
  timerPhase: string;
  secondsRemaining: number;
};

export interface SettingsSlice {
  workDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  hasOnboarded: boolean;

  toggleDarkMode: () => void;
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

export const createSettingsSlice: StateCreator<SettingsWithTimer, [], [], SettingsSlice> = (set, get) => ({
  workDurationMinutes: DEFAULT_WORK_MINUTES,
  shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
  longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
  sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
  notificationsEnabled: true,
  hapticsEnabled: true,
  soundEnabled: true,
  darkMode: false,
  hasOnboarded: false,

  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  updateWorkDuration: (minutes) => {
    const s = get();
    set({
      workDurationMinutes: minutes,
      ...(s.timerStatus === 'idle' && s.timerPhase === 'work' ? { secondsRemaining: minutes * 60 } : {}),
    });
  },
  updateShortBreak: (minutes) => {
    const s = get();
    set({
      shortBreakMinutes: minutes,
      ...(s.timerStatus === 'idle' && s.timerPhase === 'shortBreak' ? { secondsRemaining: minutes * 60 } : {}),
    });
  },
  updateLongBreak: (minutes) => {
    const s = get();
    set({
      longBreakMinutes: minutes,
      ...(s.timerStatus === 'idle' && s.timerPhase === 'longBreak' ? { secondsRemaining: minutes * 60 } : {}),
    });
  },
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
