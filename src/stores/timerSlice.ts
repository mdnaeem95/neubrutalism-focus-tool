import { StateCreator } from 'zustand';
import { TimerPhase, TimerStatus } from '../types/timer';
import {
  DEFAULT_WORK_MINUTES,
  DEFAULT_SHORT_BREAK_MINUTES,
  DEFAULT_LONG_BREAK_MINUTES,
  DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
} from '../utils/constants';
import type { SettingsSlice } from './settingsSlice';
import type { StatsSlice } from './statsSlice';
import type { FocusSlice } from './focusSlice';

type SharedSlices = TimerSlice & SettingsSlice & StatsSlice & FocusSlice;

export interface TimerSlice {
  timerStatus: TimerStatus;
  timerPhase: TimerPhase;
  secondsRemaining: number;
  currentSession: number;
  totalSessionsCompleted: number;
  timerStartedAt: number | null;
  phaseEndTime: number | null;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  skipPhase: () => void;
  completePhase: () => void;
  reconcileTimer: () => void;
}

export const createTimerSlice: StateCreator<SharedSlices, [], [], TimerSlice> = (set, get) => ({
  timerStatus: 'idle',
  timerPhase: 'work',
  secondsRemaining: DEFAULT_WORK_MINUTES * 60,
  currentSession: 1,
  totalSessionsCompleted: 0,
  timerStartedAt: null,
  phaseEndTime: null,

  startTimer: () =>
    set((state) => ({
      timerStatus: 'running',
      timerStartedAt: Date.now(),
      phaseEndTime: Date.now() + state.secondsRemaining * 1000,
    })),

  pauseTimer: () =>
    set({
      timerStatus: 'paused',
      timerStartedAt: null,
      phaseEndTime: null,
    }),

  resetTimer: () => {
    const state = get();
    const seconds =
      state.timerPhase === 'work'
        ? state.workDurationMinutes * 60
        : state.timerPhase === 'shortBreak'
        ? state.shortBreakMinutes * 60
        : state.longBreakMinutes * 60;

    set({
      timerStatus: 'idle',
      secondsRemaining: seconds,
      timerStartedAt: null,
      phaseEndTime: null,
    });
  },

  tick: () =>
    set((state) => {
      if (state.secondsRemaining <= 0) return state;
      return { secondsRemaining: state.secondsRemaining - 1 };
    }),

  skipPhase: () => {
    get().completePhase();
  },

  completePhase: () => {
    const state = get();
    const { timerPhase, currentSession } = state;

    if (timerPhase === 'work') {
      // Record the completed work session in stats
      const durationMinutes = state.workDurationMinutes;
      const focusScore = state.focusScore;
      state.recordCompletedSession(durationMinutes, focusScore);
      state.recalculateStreak();
      state.endFocusMode();

      const newSessionsCompleted = state.totalSessionsCompleted + 1;
      const isLongBreak = currentSession >= state.sessionsBeforeLongBreak;
      const nextPhase: TimerPhase = isLongBreak ? 'longBreak' : 'shortBreak';
      const nextSeconds =
        nextPhase === 'longBreak'
          ? state.longBreakMinutes * 60
          : state.shortBreakMinutes * 60;

      set({
        timerStatus: 'idle',
        timerPhase: nextPhase,
        secondsRemaining: nextSeconds,
        totalSessionsCompleted: newSessionsCompleted,
        timerStartedAt: null,
        phaseEndTime: null,
      });
    } else {
      // After a break, go back to work
      const nextSession =
        timerPhase === 'longBreak' ? 1 : currentSession + 1;

      set({
        timerStatus: 'idle',
        timerPhase: 'work',
        secondsRemaining: state.workDurationMinutes * 60,
        currentSession: nextSession,
        timerStartedAt: null,
        phaseEndTime: null,
      });
    }
  },

  reconcileTimer: () => {
    const state = get();
    if (state.timerStatus !== 'running' || !state.phaseEndTime) return;

    const remaining = Math.ceil((state.phaseEndTime - Date.now()) / 1000);
    if (remaining <= 0) {
      state.completePhase();
    } else {
      set({ secondsRemaining: remaining });
    }
  },
});
