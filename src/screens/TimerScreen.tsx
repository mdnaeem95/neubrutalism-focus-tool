import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../stores';
import { useTimer } from '../hooks/useTimer';
import { useFocusTracking } from '../hooks/useFocusTracking';
import { useScreenEntrance } from '../hooks/useScreenEntrance';
import { TimerDisplay } from '../components/timer/TimerDisplay';
import { TimerControls } from '../components/timer/TimerControls';
import { SessionIndicator } from '../components/timer/SessionIndicator';
import { TimerProgress } from '../components/timer/TimerProgress';
import { ActiveTaskBanner } from '../components/tasks/ActiveTaskBanner';
import { FocusReminder } from '../components/focus/FocusReminder';
import { FocusScore } from '../components/focus/FocusScore';
import { colors, typography, spacing } from '../theme';

export function TimerScreen() {
  const insets = useSafeAreaInsets();
  const { opacity, translateY } = useScreenEntrance();
  useTimer();
  const { isFocusModeActive, focusScore, shouldShowReminder } = useFocusTracking();
  const [showReminder, setShowReminder] = useState(false);

  // Show reminder when app returns to foreground during focus mode
  const handleDismissReminder = useCallback(() => {
    setShowReminder(false);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ opacity, transform: [{ translateY }] }}
      >
        <Text style={styles.title}>FOCUS</Text>

        <SessionIndicator />

        <View style={styles.timerWrap}>
          <TimerDisplay />
        </View>

        <TimerProgress style={styles.progress} />

        <ActiveTaskBanner />

        <FocusScore score={focusScore} visible={isFocusModeActive} />

        <View style={styles.controls}>
          <TimerControls />
        </View>
      </Animated.ScrollView>

      <FocusReminder
        visible={shouldShowReminder && showReminder}
        onDismiss={handleDismissReminder}
        focusScore={focusScore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgTimer,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    alignItems: 'stretch',
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 4,
  },
  timerWrap: {
    alignItems: 'center',
  },
  progress: {
    marginHorizontal: 0,
  },
  controls: {
    marginTop: spacing.md,
  },
});
