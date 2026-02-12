import { StateCreator } from 'zustand';
import { FOCUS_SCORE_PENALTY } from '../utils/constants';

export interface FocusSlice {
  isFocusModeActive: boolean;
  focusScore: number;
  currentSessionStartedAt: number | null;
  appBackgroundCount: number;

  startFocusMode: () => void;
  endFocusMode: () => void;
  recordAppBackground: () => void;
  recordAppForeground: () => void;
  resetFocusSession: () => void;
}

export const createFocusSlice: StateCreator<FocusSlice, [], [], FocusSlice> = (set) => ({
  isFocusModeActive: false,
  focusScore: 100,
  currentSessionStartedAt: null,
  appBackgroundCount: 0,

  startFocusMode: () =>
    set({
      isFocusModeActive: true,
      focusScore: 100,
      currentSessionStartedAt: Date.now(),
      appBackgroundCount: 0,
    }),

  endFocusMode: () =>
    set({
      isFocusModeActive: false,
      currentSessionStartedAt: null,
    }),

  recordAppBackground: () =>
    set((state) => {
      if (!state.isFocusModeActive) return state;
      const newCount = state.appBackgroundCount + 1;
      return {
        appBackgroundCount: newCount,
        focusScore: Math.max(0, 100 - newCount * FOCUS_SCORE_PENALTY),
      };
    }),

  recordAppForeground: () => {
    // Placeholder for foreground logic (show reminder etc.)
  },

  resetFocusSession: () =>
    set({
      isFocusModeActive: false,
      focusScore: 100,
      currentSessionStartedAt: null,
      appBackgroundCount: 0,
    }),
});
