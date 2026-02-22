import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../stores';
import { useAppState } from './useAppState';

export function useTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStatus = useStore((s) => s.timerStatus);
  const secondsRemaining = useStore((s) => s.secondsRemaining);
  const tick = useStore((s) => s.tick);
  const completePhase = useStore((s) => s.completePhase);
  const reconcileTimer = useStore((s) => s.reconcileTimer);

  // Reconcile timer when app returns to foreground
  const handleForeground = useCallback(() => {
    reconcileTimer();
  }, [reconcileTimer]);

  const handleBackground = useCallback(() => {
    // Nothing needed — notification is already scheduled
  }, []);

  useAppState(handleForeground, handleBackground);

  useEffect(() => {
    if (timerStatus === 'running') {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerStatus, tick]);

  useEffect(() => {
    if (secondsRemaining === 0 && timerStatus === 'running') {
      completePhase();
    }
  }, [secondsRemaining, timerStatus, completePhase]);
}
