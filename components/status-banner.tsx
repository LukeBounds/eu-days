import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getEuDaysTheme } from '@/utils/eu-days-color';

interface Props {
  peak: number;
  showCounts: boolean;
  onToggleCounts: () => void;
}

export default function StatusBanner({ peak, showCounts, onToggleCounts }: Props) {
  const { bg } = getEuDaysTheme(peak);
  const overBy = peak - 90;
  const msg = peak > 90
    ? `${peak}/90 days — ${overBy} day${overBy === 1 ? '' : 's'} over limit`
    : `Peak ${peak}/90 days — ${90 - peak} remaining`;

  return (
    <View style={[styles.banner, { backgroundColor: bg }]}>
      <Text style={[styles.text, { flex: 1 }]}>{msg}</Text>
      <TouchableOpacity
        onPress={onToggleCounts}
        style={[styles.toggle, showCounts && styles.toggleActive]}
        accessibilityLabel="Toggle contribution counts"
      >
        <Text style={[styles.toggleText, showCounts && styles.toggleTextActive]}>#</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: '#fff',
  },
  toggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  toggleActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
  },
  toggleTextActive: {
    color: '#333',
  },
});
