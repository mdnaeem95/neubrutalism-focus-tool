import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { colors, typography, spacing } from '../theme';
import { useColors } from '../theme/ThemeContext';

export function TimerScreen() {
  const insets = useSafeAreaInsets();
  const { opacity, translateY } = useScreenEntrance();
  const c = useColors();
  useTimer();
  const { isFocusModeActive, focusScore, shouldShowReminder } = useFocusTracking();
  const [showReminder, setShowReminder] = useState(false);

  // Show reminder when app returns to foreground during focus mode
  const handleDismissReminder = useCallback(() => {
    setShowReminder(false);
  }, []);

  return (
    <ScreenContainer style={{ backgroundColor: c.bgTimer, paddingTop: insets.top + spacing.lg }}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ opacity, transform: [{ translateY }] }}
      >
        <Text style={[styles.title, { color: c.black }]}>FOCUS</Text>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
