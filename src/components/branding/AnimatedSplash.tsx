import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { AppIcon } from './AppIcon';
import { colors, typography } from '../../theme';

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const iconScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Icon springs in
    Animated.spring(iconScale, {
      toValue: 1,
      speed: 8,
      bounciness: 10,
      useNativeDriver: true,
    }).start();

    // 2. Text fades in after icon settles
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          speed: 12,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // 3. Everything fades out after a pause
    setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1500);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        <AppIcon size={140} />
      </Animated.View>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        FOKUS
      </Animated.Text>
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        stay sharp. get it done.
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: 40,
    color: colors.black,
    letterSpacing: 8,
    marginTop: 24,
  },
  subtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 14,
    color: colors.black,
    opacity: 0.5,
    marginTop: 8,
    letterSpacing: 1,
  },
});
