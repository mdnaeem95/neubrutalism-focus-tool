import React, { useRef, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { typography, borders, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

const TAB_COLOR_KEYS: Record<string, keyof import('../../theme/colors').ColorPalette> = {
  Timer: 'hotPink',
  Tasks: 'electricBlue',
  Stats: 'limeGreen',
  Settings: 'brightYellow',
};

const TAB_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Timer: 'clock-outline',
  Tasks: 'checkbox-marked-outline',
  Stats: 'chart-bar',
  Settings: 'cog-outline',
};

function TabItem({
  label,
  isFocused,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const c = useColors();
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.85)).current;
  const tabColor = c[TAB_COLOR_KEYS[label] ?? 'electricBlue'];

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1 : 0.85,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [isFocused, scaleAnim]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={accessibilityLabel || `${label} tab`}
      style={styles.tab}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          isFocused
            ? {
                backgroundColor: tabColor,
                borderColor: borders.color,
                borderWidth: borders.width.medium,
              }
            : undefined,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <MaterialCommunityIcons name={TAB_ICONS[label] || 'circle'} size={20} color={c.black} />
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: isFocused ? c.black : '#999' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function NeuTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const c = useColors();
  return (
    <View style={[styles.container, { backgroundColor: c.cream }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            label={route.name}
            isFocused={isFocused}
            onPress={onPress}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: borders.width.thick,
    borderTopColor: borders.color,
    paddingBottom: 24,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
