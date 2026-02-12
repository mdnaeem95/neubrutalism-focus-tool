import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NeuButton } from '../ui/NeuButton';
import { colors, typography, spacing, borders } from '../../theme';

const MOTIVATIONAL_MESSAGES = [
  'Stay focused! You got this!',
  'Almost there — keep going!',
  'Deep work = deep results.',
  'One task at a time.',
  'Focus is a superpower.',
  'You came back — now stay!',
];

interface FocusReminderProps {
  visible: boolean;
  onDismiss: () => void;
  focusScore: number;
}

export function FocusReminder({ visible, onDismiss, focusScore }: FocusReminderProps) {
  const [message] = useState(
    () => MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  );

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      overlayOpacity.setValue(0);
      cardScale.setValue(0.85);
      cardOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          speed: 10,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
        <MaterialCommunityIcons name="target" size={48} color={colors.black} />
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.score}>Focus Score: {focusScore}%</Text>
        <NeuButton
          title="Back to Focus"
          onPress={onDismiss}
          color={colors.limeGreen}
          size="md"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: spacing['2xl'],
  },
  card: {
    backgroundColor: colors.cream,
    borderColor: borders.color,
    borderWidth: borders.width.thick,
    borderRadius: borders.radius.lg,
    padding: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.lg,
    width: '100%',
    maxWidth: 320,
  },
  message: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xl,
    color: colors.black,
    textAlign: 'center',
  },
  score: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
    opacity: 0.7,
  },
});
