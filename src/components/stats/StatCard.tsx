import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NeuCard } from '../ui/NeuCard';
import { typography, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, color, delay = 0 }: StatCardProps) {
  const c = useColors();
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          speed: 12,
          bounciness: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity, transform: [{ scale }] }}>
      <NeuCard color={color} shadowSize="sm" style={styles.card}>
        <View style={styles.container}>
          <MaterialCommunityIcons name={icon} size={24} color={c.black} />
          <Text style={[styles.value, { color: c.black }]}>{value}</Text>
          <Text style={[styles.label, { color: c.black }]}>{label}</Text>
        </View>
      </NeuCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  value: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['2xl'],
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    opacity: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
