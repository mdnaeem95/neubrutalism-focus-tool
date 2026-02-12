import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, borders, shadows, spacing } from '../../theme';

interface NeuButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SIZE_CONFIG = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, fontSize: typography.fontSize.sm },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, fontSize: typography.fontSize.base },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing['2xl'], fontSize: typography.fontSize.lg },
};

export function NeuButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  color = colors.electricBlue,
  disabled = false,
  style,
  textStyle,
}: NeuButtonProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const shadow = shadows.md;
  const sizeConfig = SIZE_CONFIG[size];

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: shadow.offsetX - shadows.pressed.offsetX,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(translateY, {
        toValue: shadow.offsetY - shadows.pressed.offsetY,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
    ]).start();
  };

  const bgColor = variant === 'outline' ? colors.bgCard : color;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      style={[styles.container, style]}
    >
      {/* Shadow layer */}
      <Animated.View
        style={[
          styles.shadow,
          {
            backgroundColor: shadow.color,
            top: shadow.offsetY,
            left: shadow.offsetX,
            borderRadius: borders.radius.md,
            paddingVertical: sizeConfig.paddingVertical,
            paddingHorizontal: sizeConfig.paddingHorizontal,
          },
        ]}
      >
        <Text style={[styles.text, { fontSize: sizeConfig.fontSize, opacity: 0 }]}>{title}</Text>
      </Animated.View>

      {/* Content layer */}
      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: disabled ? colors.cream : bgColor,
            borderColor: disabled ? '#CCC' : borders.color,
            borderWidth: borders.width.medium,
            borderRadius: borders.radius.md,
            paddingVertical: sizeConfig.paddingVertical,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            transform: [{ translateX }, { translateY }, { scale }],
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeConfig.fontSize,
              color: disabled ? '#999' : colors.black,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.fontFamily.monoBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
