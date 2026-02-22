import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useStore } from '../../stores';
import { NeuInput } from '../ui/NeuInput';
import { NeuButton } from '../ui/NeuButton';
import { PaywallModal } from '../ui/PaywallModal';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';

export function TaskInput() {
  const c = useColors();
  const [text, setText] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const addTask = useStore((s) => s.addTask);
  const taskLimitReached = useStore((s) => s.taskLimitReached);
  const haptics = useHaptics();

  useEffect(() => {
    if (taskLimitReached) {
      setShowPaywall(true);
    }
  }, [taskLimitReached]);

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addTask(trimmed);
    if (!useStore.getState().taskLimitReached) {
      setText('');
    }
    haptics.light();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputWrap}>
          <NeuInput
            placeholder="Add a task..."
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
        </View>
        <NeuButton
          title="ADD"
          onPress={handleAdd}
          color={c.brightYellow}
          size="md"
          disabled={!text.trim()}
        />
      </View>
      <PaywallModal visible={showPaywall} onClose={() => setShowPaywall(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  inputWrap: {
    flex: 1,
  },
});
