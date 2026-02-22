import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

/** Constrains content width on tablets while filling the screen on phones. */
export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return (
    <View style={[styles.outer, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
  },
});
