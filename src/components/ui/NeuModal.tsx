import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Modal, View, StyleSheet, Pressable, Text, Animated } from 'react-native';
import { typography, borders, spacing } from '../../theme';
import { useColors } from '../../theme/ThemeContext';
import { NeuCard } from './NeuCard';

interface NeuModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function NeuModal({ visible, onClose, title, children }: NeuModalProps) {
  const c = useColors();
  const [showModal, setShowModal] = useState(visible);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      overlayOpacity.setValue(0);
      cardScale.setValue(0.9);
      cardOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          speed: 14,
          bounciness: 6,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (showModal) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  return (
    <Modal visible={showModal} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close dialog" accessibilityRole="button" />
        <Animated.View style={[styles.cardWrapper, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <NeuCard color={c.cream} shadowSize="lg">
              <View style={styles.inner}>
                <Text style={[styles.title, { color: c.black }]}>{title}</Text>
                {children}
              </View>
            </NeuCard>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  inner: {
    padding: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.monoBold,
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
  },
});
