import { StateCreator } from 'zustand';
import { TimerPhase, TimerStatus } from '../types/timer';
import {
  DEFAULT_WORK_MINUTES,
  DEFAULT_SHORT_BREAK_MINUTES,
  DEFAULT_LONG_BREAK_MINUTES,
  DEFAULT_SESSIONS_BEFORE_LONG_BREAK,
} from '../utils/constants';

export interface TimerSlice {
  timerStatus: TimerStatus;
  timerPhase: TimerPhase;
  secondsRemaining: number;
  currentSession: number;
  totalSessionsCompleted: number;
  timerStartedAt: number | null;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  skipPhase: () => void;
  completePhase: () => void;
}

export const createTimerSlice: StateCreator<TimerSlice, [], [], TimerSlice> = (set, get) => ({
  timerStatus: 'idle',
  timerPhase: 'work',
  secondsRemaining: DEFAULT_WORK_MINUTES * 60,
  currentSession: 1,
  totalSessionsCompleted: 0,
  timerStartedAt: null,

  startTimer: () =>
    set({
      timerStatus: 'running',
      timerStartedAt: Date.now(),
    }),

  pauseTimer: () =>
    set({
      timerStatus: 'paused',
      timerStartedAt: null,
    }),

  resetTimer: () =>
    set((state) => ({
      timerStatus: 'idle',
      secondsRemaining:
        state.timerPhase === 'work'
          ? DEFAULT_WORK_MINUTES * 60
          : state.timerPhase === 'shortBreak'
          ? DEFAULT_SHORT_BREAK_MINUTES * 60
          : DEFAULT_LONG_BREAK_MINUTES * 60,
      timerStartedAt: null,
    })),

  tick: () =>
    set((state) => {
      if (state.secondsRemaining <= 0) return state;
      return { secondsRemaining: state.secondsRemaining - 1 };
    }),

  skipPhase: () => {
    get().completePhase();
  },

  completePhase: () =>
    set((state) => {
      const { timerPhase, currentSession } = state;

      if (timerPhase === 'work') {
        const newSessionsCompleted = state.totalSessionsCompleted + 1;
        const isLongBreak = currentSession >= DEFAULT_SESSIONS_BEFORE_LONG_BREAK;
        const nextPhase: TimerPhase = isLongBreak ? 'longBreak' : 'shortBreak';
        const nextSeconds =
          nextPhase === 'longBreak'
            ? DEFAULT_LONG_BREAK_MINUTES * 60
            : DEFAULT_SHORT_BREAK_MINUTES * 60;

        return {
          timerStatus: 'idle',
          timerPhase: nextPhase,
          secondsRemaining: nextSeconds,
          totalSessionsCompleted: newSessionsCompleted,
          timerStartedAt: null,
        };
      }

      // After a break, go back to work
      const nextSession =
        timerPhase === 'longBreak' ? 1 : currentSession + 1;

      return {
        timerStatus: 'idle',
        timerPhase: 'work',
        secondsRemaining: DEFAULT_WORK_MINUTES * 60,
        currentSession: nextSession,
        timerStartedAt: null,
      };
    }),
});
