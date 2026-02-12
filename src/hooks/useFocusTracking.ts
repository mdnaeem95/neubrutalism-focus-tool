import { useCallback } from 'react';
import { useStore } from '../stores';
import { useAppState } from './useAppState';

export function useFocusTracking() {
  const isFocusModeActive = useStore((s) => s.isFocusModeActive);
  const recordAppBackground = useStore((s) => s.recordAppBackground);
  const recordAppForeground = useStore((s) => s.recordAppForeground);
  const focusScore = useStore((s) => s.focusScore);
  const appBackgroundCount = useStore((s) => s.appBackgroundCount);

  const handleForeground = useCallback(() => {
    if (isFocusModeActive) {
      recordAppForeground();
    }
  }, [isFocusModeActive, recordAppForeground]);

  const handleBackground = useCallback(() => {
    if (isFocusModeActive) {
      recordAppBackground();
    }
  }, [isFocusModeActive, recordAppBackground]);

  useAppState(handleForeground, handleBackground);

  return {
    isFocusModeActive,
    focusScore,
    appBackgroundCount,
    shouldShowReminder: isFocusModeActive && appBackgroundCount > 0,
  };
}
