import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../stores';
import { useScreenEntrance } from '../hooks/useScreenEntrance';
import { NeuCard } from '../components/ui/NeuCard';
import { NeuButton } from '../components/ui/NeuButton';
import { NeuModal } from '../components/ui/NeuModal';
import { NeuBadge } from '../components/ui/NeuBadge';
import { PaywallModal } from '../components/ui/PaywallModal';
import { colors, typography, spacing, borders } from '../theme';

function Stepper({
  label,
  value,
  onIncrement,
  onDecrement,
  unit = 'min',
  min = 1,
  max = 60,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  unit?: string;
  min?: number;
  max?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        speed: 50,
        bounciness: 0,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [value]);

  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={onDecrement}
          disabled={value <= min}
          style={[styles.stepperBtn, value <= min ? styles.stepperBtnDisabled : undefined]}
        >
          <Text style={styles.stepperBtnText}>−</Text>
        </Pressable>
        <Animated.Text style={[styles.stepperValue, { transform: [{ scale: scaleAnim }] }]}>
          {value} {unit}
        </Animated.Text>
        <Pressable
          onPress={onIncrement}
          disabled={value >= max}
          style={[styles.stepperBtn, value >= max ? styles.stepperBtnDisabled : undefined]}
        >
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  const knobAnim = useRef(new Animated.Value(value ? 20 : 2)).current;

  useEffect(() => {
    Animated.spring(knobAnim, {
      toValue: value ? 20 : 2,
      speed: 18,
      bounciness: 6,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <Pressable onPress={onToggle} style={styles.toggleRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View
        style={[
          styles.toggle,
          { backgroundColor: value ? colors.limeGreen : '#E0E0E0' },
        ]}
      >
        <Animated.View
          style={[
            styles.toggleKnob,
            { marginLeft: knobAnim },
          ]}
        />
      </View>
    </Pressable>
  );
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { opacity, translateY } = useScreenEntrance();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const isPro = useStore((s) => s.isPro);
  const restorePurchases = useStore((s) => s.restorePurchases);

  const workDuration = useStore((s) => s.workDurationMinutes);
  const shortBreak = useStore((s) => s.shortBreakMinutes);
  const longBreak = useStore((s) => s.longBreakMinutes);
  const notificationsEnabled = useStore((s) => s.notificationsEnabled);
  const hapticsEnabled = useStore((s) => s.hapticsEnabled);
  const soundEnabled = useStore((s) => s.soundEnabled);

  const updateWorkDuration = useStore((s) => s.updateWorkDuration);
  const updateShortBreak = useStore((s) => s.updateShortBreak);
  const updateLongBreak = useStore((s) => s.updateLongBreak);
  const toggleNotifications = useStore((s) => s.toggleNotifications);
  const toggleHaptics = useStore((s) => s.toggleHaptics);
  const toggleSound = useStore((s) => s.toggleSound);
  const resetSettingsToDefaults = useStore((s) => s.resetSettingsToDefaults);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ opacity, transform: [{ translateY }] }}
      >
        <Text style={styles.title}>SETTINGS</Text>

        <Text style={styles.sectionTitle}>TIMER</Text>
        <NeuCard color={colors.bgCard} shadowSize="sm">
          <View style={styles.section}>
            <Stepper
              label="Work"
              value={workDuration}
              onIncrement={() => updateWorkDuration(workDuration + 5)}
              onDecrement={() => updateWorkDuration(workDuration - 5)}
              min={5}
              max={60}
            />
            <Stepper
              label="Short Break"
              value={shortBreak}
              onIncrement={() => updateShortBreak(shortBreak + 1)}
              onDecrement={() => updateShortBreak(shortBreak - 1)}
              min={1}
              max={15}
            />
            <Stepper
              label="Long Break"
              value={longBreak}
              onIncrement={() => updateLongBreak(longBreak + 5)}
              onDecrement={() => updateLongBreak(longBreak - 5)}
              min={5}
              max={30}
            />
          </View>
        </NeuCard>

        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <NeuCard color={colors.bgCard} shadowSize="sm">
          <View style={styles.section}>
            <ToggleRow
              label="Notifications"
              value={notificationsEnabled}
              onToggle={toggleNotifications}
            />
            <ToggleRow
              label="Sound"
              value={soundEnabled}
              onToggle={toggleSound}
            />
            <ToggleRow
              label="Haptics"
              value={hapticsEnabled}
              onToggle={toggleHaptics}
            />
          </View>
        </NeuCard>

        <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
        <NeuCard color={colors.bgCard} shadowSize="sm">
          <View style={styles.section}>
            {isPro ? (
              <View style={styles.proStatus}>
                <MaterialCommunityIcons name="crown" size={24} color={colors.brightYellow} />
                <Text style={styles.stepperLabel}>Pro Active</Text>
                <NeuBadge label="PRO" active color={colors.limeGreen} />
              </View>
            ) : (
              <View style={styles.proStatus}>
                <Text style={styles.stepperLabel}>Free Plan</Text>
                <NeuButton
                  title="Go Pro"
                  onPress={() => setShowPaywall(true)}
                  color={colors.hotPink}
                  size="sm"
                />
              </View>
            )}
            <Pressable onPress={restorePurchases} style={styles.restoreBtn}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </Pressable>
          </View>
        </NeuCard>

        <Text style={styles.sectionTitle}>DATA</Text>
        <View style={styles.dataSection}>
          <NeuButton
            title="Reset to Defaults"
            onPress={() => setShowResetModal(true)}
            color={colors.coral}
            size="sm"
          />
        </View>
      </Animated.ScrollView>

      <NeuModal
        visible={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Settings?"
      >
        <Text style={styles.modalText}>
          This will reset all settings to their default values.
        </Text>
        <View style={styles.modalActions}>
          <NeuButton
            title="Reset"
            onPress={() => {
              resetSettingsToDefaults();
              setShowResetModal(false);
            }}
            color={colors.coral}
            size="sm"
          />
          <NeuButton
            title="Cancel"
            onPress={() => setShowResetModal(false)}
            variant="outline"
            size="sm"
          />
        </View>
      </NeuModal>

      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSettings,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize['2xl'],
    color: colors.black,
    letterSpacing: 4,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    letterSpacing: 2,
    opacity: 0.7,
  },
  section: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepperLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: borders.radius.sm,
    borderWidth: borders.width.medium,
    borderColor: borders.color,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.3,
  },
  stepperBtnText: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.lg,
    color: colors.black,
  },
  stepperValue: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.base,
    color: colors.black,
    minWidth: 60,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: borders.width.thin,
    borderColor: borders.color,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bgCard,
    borderWidth: borders.width.thin,
    borderColor: borders.color,
  },
  dataSection: {
    alignItems: 'flex-start',
  },
  modalText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.black,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  proStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  restoreBtn: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  restoreText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.black,
    opacity: 0.5,
    textDecorationLine: 'underline',
  },
});
