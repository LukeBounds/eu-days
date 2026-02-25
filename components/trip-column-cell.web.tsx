import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColumnState } from '@/types/trip';
import { TRIP_COLORS } from '@/constants/trip-colors';
import { ROW_HEIGHT, TRIP_COL_WIDTH } from '@/constants/layout';
import { SC } from '@/constants/semantic-colors';

interface Props {
  state: ColumnState;
  colorIndex: number;
  showCount: boolean;
  count: number;
}

const cellBase: React.ComponentProps<typeof View>['style'] = {
  width: TRIP_COL_WIDTH,
  height: ROW_HEIGHT,
  alignItems: 'center',
  justifyContent: 'center',
};

function CountLabel({ count, shade }: { count: number; shade?: 'grey' | 'dark' }) {
  return (
    <Text style={[styles.countText, shade === 'grey' && styles.countTextGrey, shade === 'dark' && styles.countTextDark]}>
      {count}
    </Text>
  );
}

function TripColumnCell({ state, colorIndex, showCount, count }: Props) {
  const color = TRIP_COLORS[colorIndex];
  const showNum = showCount && count > 0;

  if (state.kind === 'none') {
    return <View style={cellBase} />;
  }

  if (state.kind === 'active') {
    return (
      <View style={[cellBase, { backgroundColor: color }]}>
        {showNum && <CountLabel count={count} />}
      </View>
    );
  }

  if (state.kind === 'tail') {
    return (
      <View style={[cellBase, { backgroundColor: color + '38' }]}>
        {showNum && <CountLabel count={count} shade="grey" />}
      </View>
    );
  }

  // dropping — CSS diagonal hatch
  return (
    <View
      style={{
        ...cellBase,
        // @ts-ignore — web-only CSS property
        background: `repeating-linear-gradient(
          45deg,
          ${color}55,
          ${color}55 3px,
          transparent 3px,
          transparent 8px
        )`,
      }}
    >
      {showNum && <CountLabel count={count} shade="dark" />}
    </View>
  );
}

const styles = StyleSheet.create({
  countText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  countTextGrey: {
    color: SC.textMuted,
  },
  countTextDark: {
    color: SC.textSecondary,
  },
});

export default React.memo(TripColumnCell);
