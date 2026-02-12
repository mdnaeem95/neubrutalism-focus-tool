import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, borders } from '../../theme';

interface NeuCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  color?: string;
}

export function NeuCheckbox({ checked, onToggle, color = colors.limeGreen }: NeuCheckboxProps) {
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (checked) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 12,
        }),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 10,
          }),
        ]),
      ]).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [checked, scaleAnim, bounceAnim]);

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={checked ? 'Mark incomplete' : 'Mark complete'}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.box,
          {
            borderColor: borders.color,
            borderWidth: borders.width.medium,
            borderRadius: borders.radius.sm,
            backgroundColor: colors.bgCard,
            transform: [{ scale: bounceAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              borderRadius: 1,
              opacity: scaleAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
        {checked && <MaterialCommunityIcons name="check-bold" size={16} color="#1A1A2E" style={styles.check} />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  box: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  check: {
    position: 'absolute' as const,
  },
});
