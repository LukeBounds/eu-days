import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColumnState } from '@/types/trip';
import { TRIP_COLORS } from '@/constants/trip-colors';
import { ROW_HEIGHT, TRIP_COL_WIDTH } from '@/constants/layout';
import HatchOverlay from '@/components/hatch-overlay';

interface Props {
  state: ColumnState;
  colorIndex: number;
  label: string;
  showCount: boolean;
  count: number;
}

function CountLabel({ count, shade }: { count: number; shade?: 'grey' | 'dark' }) {
  return (
    <Text style={[styles.countText, shade === 'grey' && styles.countTextGrey, shade === 'dark' && styles.countTextDark]}>{count}</Text>
  );
}

function TripColumnCell({ state, colorIndex, showCount, count }: Props) {
  const color = TRIP_COLORS[colorIndex];
  const showNum = showCount && count > 0;

  if (state.kind === 'none') {
    return <View style={styles.cell} />;
  }

  if (state.kind === 'active') {
    return (
      <View style={[styles.cell, { backgroundColor: color }]}>
        {showNum && <CountLabel count={count} />}
      </View>
    );
  }

  if (state.kind === 'tail') {
    return (
      <View style={styles.cell}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: color, opacity: 0.22 }]} />
        {showNum && <CountLabel count={count} shade="grey" />}
      </View>
    );
  }

  // dropping — hatched
  return (
    <View style={styles.cell}>
      <HatchOverlay color={color} />
      {showNum && <CountLabel count={count} shade="dark" />}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: TRIP_COL_WIDTH,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  countTextGrey: {
    color: '#888',
  },
  countTextDark: {
    color: '#333',
  },
});

export default React.memo(TripColumnCell);
