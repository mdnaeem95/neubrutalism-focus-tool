import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { colors, typography, spacing } from '../../theme';

function ErrorFallback() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        The app ran into an unexpected error. Please close and reopen the app.
      </Text>
    </View>
  );
}

interface Props {
  children: ReactNode;
}

export function AppErrorBoundary({ children }: Props) {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xl,
    color: colors.black,
    textAlign: 'center',
  },
  message: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
    textAlign: 'center',
    opacity: 0.6,
  },
});
