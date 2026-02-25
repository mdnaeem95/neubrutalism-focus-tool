import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useStore } from '../../stores';
import { NeuBadge } from '../ui/NeuBadge';
import { NeuModal } from '../ui/NeuModal';
import { NeuInput } from '../ui/NeuInput';
import { NeuButton } from '../ui/NeuButton';
import { PaywallModal } from '../ui/PaywallModal';
import { BUILT_IN_PRESETS, MAX_CUSTOM_PRESETS_PRO } from '../../utils/constants';
import { colors, typography, spacing, borders } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

const PRESET_COLORS: Record<string, string> = {
  quick: colors.limeGreen,
  standard: colors.electricBlue,
  long: colors.hotPink,
};

export function PresetPicker() {
  const c = useColors();
  const selectedPresetId = useStore((s) => s.selectedPresetId);
  const customPresets = useStore((s) => s.customPresets);
  const selectPreset = useStore((s) => s.selectPreset);
  const addCustomPreset = useStore((s) => s.addCustomPreset);
  const deleteCustomPreset = useStore((s) => s.deleteCustomPreset);
  const isPro = useStore((s) => s.isPro);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleAddPreset = () => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    setPresetName('');
    setShowSaveModal(true);
  };

  const handleSavePreset = () => {
    const trimmed = presetName.trim();
    if (!trimmed) return;
    addCustomPreset(trimmed);
    setShowSaveModal(false);
  };

  const allPresets = [...BUILT_IN_PRESETS, ...customPresets];
  const canAddMore = customPresets.length < MAX_CUSTOM_PRESETS_PRO;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allPresets.map((preset) => (
          <View key={preset.id} style={styles.presetItem}>
            <NeuBadge
              label={preset.name}
              active={selectedPresetId === preset.id}
              color={PRESET_COLORS[preset.id] ?? colors.lavender}
              onPress={() => selectPreset(preset.id)}
            />
            {!preset.isBuiltIn ? (
              <Pressable
                onPress={() => deleteCustomPreset(preset.id)}
                accessibilityLabel={`Delete ${preset.name} preset`}
                accessibilityRole="button"
                style={styles.deleteBtn}
              >
                <MaterialCommunityIcons name="close-circle" size={16} color={colors.coral} />
              </Pressable>
            ) : undefined}
          </View>
        ))}
        {canAddMore ? (
          <Pressable
            onPress={handleAddPreset}
            accessibilityLabel="Save current settings as preset"
            accessibilityRole="button"
            style={[
              styles.addBtn,
              { backgroundColor: c.bgCard, borderColor: borders.color },
            ]}
          >
            <MaterialCommunityIcons name="plus" size={16} color={c.black} />
          </Pressable>
        ) : undefined}
      </ScrollView>

      <NeuModal visible={showSaveModal} onClose={() => setShowSaveModal(false)} title="Save Preset">
        <NeuInput
          placeholder="Preset name"
          value={presetName}
          onChangeText={setPresetName}
          maxLength={20}
          autoFocus
        />
        <View style={styles.saveActions}>
          <NeuButton title="Save" onPress={handleSavePreset} color={colors.limeGreen} size="md" />
        </View>
      </NeuModal>

      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    marginLeft: 2,
    padding: 2,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: borders.radius.sm,
    borderWidth: borders.width.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveActions: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});
