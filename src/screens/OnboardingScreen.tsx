import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingIllustration } from '../components/branding/OnboardingIllustration';
import { NeuButton } from '../components/ui/NeuButton';
import { useStore } from '../stores';
import { colors, typography, spacing, borders } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  {
    type: 'timer' as const,
    title: 'Fokus Your Way',
    subtitle: 'Pomodoro timer with customizable sessions. Work hard, take breaks, stay sharp.',
    bg: colors.hotPink,
  },
  {
    type: 'tasks' as const,
    title: 'Track Your Tasks',
    subtitle: 'Add tasks, assign them to sessions, and check them off as you go.',
    bg: colors.electricBlue,
  },
  {
    type: 'stats' as const,
    title: 'See Your Progress',
    subtitle: 'Daily charts, streak tracking, and lifetime stats to keep you motivated.',
    bg: colors.limeGreen,
  },
  {
    type: 'ready' as const,
    title: "Let's Go!",
    subtitle: "You're all set. Start your first fokus session and build the habit.",
    bg: colors.brightYellow,
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const goToNext = () => {
    if (currentPage < PAGES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentPage + 1) * SCREEN_WIDTH, animated: true });
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    onComplete();
  };

  const isLastPage = currentPage === PAGES.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Skip button */}
      {!isLastPage && (
        <Pressable style={styles.skipBtn} onPress={handleFinish}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {PAGES.map((page, index) => (
          <View key={index} style={[styles.page, { width: SCREEN_WIDTH }]}>
            <View style={[styles.illustrationContainer, { backgroundColor: page.bg }]}>
              <OnboardingIllustration type={page.type} size={200} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.subtitle}>{page.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottom}>
        {/* Dot indicators */}
        <View style={styles.dots}>
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPage
                  ? { backgroundColor: colors.hotPink, borderColor: colors.black }
                  : { backgroundColor: 'transparent', borderColor: '#CCC' },
              ]}
            />
          ))}
        </View>

        {/* Action button */}
        <View style={styles.buttonContainer}>
          <NeuButton
            title={isLastPage ? 'Get Started' : 'Next'}
            onPress={isLastPage ? handleFinish : goToNext}
            color={isLastPage ? colors.hotPink : colors.cream}
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: spacing.xl,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    opacity: 0.5,
    textDecorationLine: 'underline',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  illustrationContainer: {
    width: 240,
    height: 240,
    borderRadius: borders.radius.lg,
    borderWidth: borders.width.thick,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottom: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
