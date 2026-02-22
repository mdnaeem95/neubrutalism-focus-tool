import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '../../stores';
import { NeuButton } from '../ui/NeuButton';
import { NeuModal } from '../ui/NeuModal';
import { colors, spacing } from '../../theme';
import { useHaptics } from '../../hooks/useHaptics';
import {
  scheduleTimerNotification,
  cancelTimerNotification,
} from '../../hooks/useNotifications';

export function TimerControls() {
  const timerStatus = useStore((s) => s.timerStatus);
  const timerPhase = useStore((s) => s.timerPhase);
  const secondsRemaining = useStore((s) => s.secondsRemaining);
  const startTimer = useStore((s) => s.startTimer);
  const pauseTimer = useStore((s) => s.pauseTimer);
  const resetTimer = useStore((s) => s.resetTimer);
  const skipPhase = useStore((s) => s.skipPhase);
  const startFocusMode = useStore((s) => s.startFocusMode);
  const endFocusMode = useStore((s) => s.endFocusMode);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const [showResetModal, setShowResetModal] = useState(false);
  const haptics = useHaptics();

  const handleStartPause = async () => {
    if (timerStatus === 'running') {
      pauseTimer();
      await cancelTimerNotification();
      haptics.medium();
    } else {
      startTimer();
      if (timerPhase === 'work') {
        startFocusMode();
      }
      await scheduleTimerNotification(secondsRemaining, timerPhase, soundEnabled);
      haptics.light();
    }
  };

  const handleReset = async () => {
    resetTimer();
    endFocusMode();
    await cancelTimerNotification();
    setShowResetModal(false);
    haptics.medium();
  };

  const handleSkip = () => {
    skipPhase();
    endFocusMode();
    cancelTimerNotification();
    haptics.light();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <NeuButton
          title={timerStatus === 'running' ? 'PAUSE' : 'START'}
          onPress={handleStartPause}
          color={colors.electricBlue}
          size="lg"
        />
      </View>
      <View style={styles.row}>
        <NeuButton
          title="RESET"
          onPress={() => setShowResetModal(true)}
          color={colors.brightYellow}
          size="sm"
          style={styles.secondaryBtn}
        />
        <NeuButton
          title="SKIP"
          onPress={handleSkip}
          variant="outline"
          size="sm"
          style={styles.secondaryBtn}
        />
      </View>

      <NeuModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Timer?"
      >
        <View style={styles.modalActions}>
          <NeuButton
            title="Reset"
            onPress={handleReset}
            color={colors.coral}
            size="sm"
          />
          <NeuButton
            title="Cancel"
            onPress={() => setShowResetModal(false)}
            variant="outline"
            size="sm"
          />
        </View>
      </NeuModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  secondaryBtn: {
    minWidth: 100,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
});
