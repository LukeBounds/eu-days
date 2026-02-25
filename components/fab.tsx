import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SC } from '@/constants/semantic-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Props {
  onPress: () => void;
  accessibilityLabel?: string;
}

export default function FAB({ onPress, accessibilityLabel = 'Add' }: Props) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} accessibilityLabel={accessibilityLabel}>
      <IconSymbol name="plus" size={28} color={SC.textOnAccent} />
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
    ...Platform.select({
      android: { elevation: 4 },
      web: {
        // @ts-ignore — web-only CSS property
        boxShadow: '0 2px 4px rgba(0,0,0,0.20)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
});
