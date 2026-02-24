import React from 'react';
import { View } from 'react-native';
import { ROW_HEIGHT, TRIP_COL_WIDTH } from '@/constants/layout';

const STRIPE_LEN = TRIP_COL_WIDTH + ROW_HEIGHT + 10;
const STRIPE_WIDTH = 3;
const STRIPE_SPACING = 9;

const STRIPE_CX: number[] = [];
for (let x = -ROW_HEIGHT; x <= TRIP_COL_WIDTH + ROW_HEIGHT; x += STRIPE_SPACING) {
  STRIPE_CX.push(x);
}

export default function HatchOverlay({ color }: { color: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: TRIP_COL_WIDTH,
        height: ROW_HEIGHT,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {STRIPE_CX.map(cx => (
        <View
          key={cx}
          style={{
            position: 'absolute',
            width: STRIPE_WIDTH,
            height: STRIPE_LEN,
            backgroundColor: color,
            opacity: 0.45,
            left: cx - STRIPE_WIDTH / 2,
            top: ROW_HEIGHT / 2 - STRIPE_LEN / 2,
            transform: [{ rotate: '45deg' }],
          }}
        />
      ))}
    </View>
  );
}
