import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SC } from '@/constants/semantic-colors';

interface Props {
  onPress: () => void;
  accessibilityLabel?: string;
}

export default function FAB({ onPress, accessibilityLabel = 'Add' }: Props) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <Text style={styles.label}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SC.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    color: SC.textOnAccent,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
});
