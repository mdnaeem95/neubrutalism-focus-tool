import { StateCreator } from 'zustand';
import * as Crypto from 'expo-crypto';
import {
  DEFAULT_WORK_MINUTES,
  DEFAULT_SHORT_BREAK_MINUTES,
  DEFAULT_LONG_BREAK_MINUTES,
  DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
  BUILT_IN_PRESETS,
  MAX_CUSTOM_PRESETS_PRO,
} from '../utils/constants';
import { TimerPreset } from '../types/preset';
import { TaskCategory } from '../types/category';

/** Minimal fields from other slices needed for cross-slice access. */
type SharedSlices = SettingsSlice & {
  timerStatus: string;
  timerPhase: string;
  secondsRemaining: number;
  isPro: boolean;
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

  // Timer presets
  selectedPresetId: string | null;
  customPresets: TimerPreset[];

  // Task categories
  customCategories: TaskCategory[];

  // Daily reminder
  dailyReminderEnabled: boolean;
  dailyReminderHour: number;
  dailyReminderMinute: number;

  // Review prompt tracking
  lastReviewPromptDate: number | null;
  reviewPromptCount: number;

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

  // Preset actions
  selectPreset: (presetId: string) => void;
  addCustomPreset: (name: string) => void;
  deleteCustomPreset: (presetId: string) => void;

  // Category actions
  addCustomCategory: (name: string, color: string, icon: string) => void;
  deleteCustomCategory: (id: string) => void;

  // Daily reminder actions
  toggleDailyReminder: () => void;
  updateDailyReminderTime: (hour: number, minute: number) => void;

  // Review prompt actions
  recordReviewPrompt: () => void;
}

export const createSettingsSlice: StateCreator<SharedSlices, [], [], SettingsSlice> = (set, get) => ({
  workDurationMinutes: DEFAULT_WORK_MINUTES,
  shortBreakMinutes: DEFAULT_SHORT_BREAK_MINUTES,
  longBreakMinutes: DEFAULT_LONG_BREAK_MINUTES,
  sessionsBeforeLongBreak: DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
  notificationsEnabled: true,
  hapticsEnabled: true,
  soundEnabled: true,
  darkMode: false,
  hasOnboarded: false,

  // Timer presets
  selectedPresetId: null,
  customPresets: [],

  // Task categories
  customCategories: [],

  // Daily reminder
  dailyReminderEnabled: false,
  dailyReminderHour: 9,
  dailyReminderMinute: 0,

  // Review prompt tracking
  lastReviewPromptDate: null,
  reviewPromptCount: 0,

  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  updateWorkDuration: (minutes) => {
    const s = get();
    set({
      workDurationMinutes: minutes,
      selectedPresetId: null,
      ...(s.timerStatus === 'idle' && s.timerPhase === 'work' ? { secondsRemaining: minutes * 60 } : {}),
    });
  },
  updateShortBreak: (minutes) => {
    const s = get();
    set({
      shortBreakMinutes: minutes,
      selectedPresetId: null,
      ...(s.timerStatus === 'idle' && s.timerPhase === 'shortBreak' ? { secondsRemaining: minutes * 60 } : {}),
    });
  },
  updateLongBreak: (minutes) => {
    const s = get();
    set({
      longBreakMinutes: minutes,
      selectedPresetId: null,
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
      selectedPresetId: 'standard',
      customPresets: [],
      customCategories: [],
      dailyReminderEnabled: false,
      dailyReminderHour: 9,
      dailyReminderMinute: 0,
    }),
  completeOnboarding: () => set({ hasOnboarded: true }),

  // Preset actions
  selectPreset: (presetId) => {
    const s = get();
    const allPresets = [...BUILT_IN_PRESETS, ...s.customPresets];
    const preset = allPresets.find((p) => p.id === presetId);
    if (!preset) return;
    set({
      selectedPresetId: presetId,
      workDurationMinutes: preset.work,
      shortBreakMinutes: preset.shortBreak,
      longBreakMinutes: preset.longBreak,
      ...(s.timerStatus === 'idle' && s.timerPhase === 'work'
        ? { secondsRemaining: preset.work * 60 }
        : s.timerStatus === 'idle' && s.timerPhase === 'shortBreak'
        ? { secondsRemaining: preset.shortBreak * 60 }
        : s.timerStatus === 'idle' && s.timerPhase === 'longBreak'
        ? { secondsRemaining: preset.longBreak * 60 }
        : {}),
    });
  },

  addCustomPreset: (name) => {
    const s = get();
    if (!s.isPro) return;
    if (s.customPresets.length >= MAX_CUSTOM_PRESETS_PRO) return;
    const preset: TimerPreset = {
      id: Crypto.randomUUID(),
      name,
      work: s.workDurationMinutes,
      shortBreak: s.shortBreakMinutes,
      longBreak: s.longBreakMinutes,
      isBuiltIn: false,
    };
    set({
      customPresets: [...s.customPresets, preset],
      selectedPresetId: preset.id,
    });
  },

  deleteCustomPreset: (presetId) => {
    const s = get();
    set({
      customPresets: s.customPresets.filter((p) => p.id !== presetId),
      ...(s.selectedPresetId === presetId ? { selectedPresetId: null } : {}),
    });
  },

  // Category actions
  addCustomCategory: (name, color, icon) => {
    const s = get();
    if (!s.isPro) return;
    const category: TaskCategory = {
      id: Crypto.randomUUID(),
      name,
      color,
      icon,
      isBuiltIn: false,
    };
    set({ customCategories: [...s.customCategories, category] });
  },

  deleteCustomCategory: (id) => {
    const s = get();
    set({ customCategories: s.customCategories.filter((c) => c.id !== id) });
  },

  // Daily reminder actions
  toggleDailyReminder: () => set((s) => ({ dailyReminderEnabled: !s.dailyReminderEnabled })),
  updateDailyReminderTime: (hour, minute) => set({ dailyReminderHour: hour, dailyReminderMinute: minute }),

  // Review prompt actions
  recordReviewPrompt: () =>
    set((s) => ({
      lastReviewPromptDate: Date.now(),
      reviewPromptCount: s.reviewPromptCount + 1,
    })),
});
