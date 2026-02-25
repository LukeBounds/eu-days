import React from 'react';
import { View } from 'react-native';
import { ROW_HEIGHT, TRIP_COL_WIDTH } from '@/constants/layout';

interface Props {
  color: string;
  width?: number;
  height?: number;
  stripeWidth?: number;
  stripeSpacing?: number;
}

export default function HatchOverlay({
  color,
  width = TRIP_COL_WIDTH,
  height = ROW_HEIGHT,
  stripeWidth = 3,
  stripeSpacing = 9,
}: Props) {
  const stripeLen = width + height + 10;
  const stripeCX: number[] = [];
  for (let x = -height; x <= width + height; x += stripeSpacing) {
    stripeCX.push(x);
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width,
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {stripeCX.map(cx => (
        <View
          key={cx}
          style={{
            position: 'absolute',
            width: stripeWidth,
            height: stripeLen,
            backgroundColor: color,
            opacity: 0.45,
            left: cx - stripeWidth / 2,
            top: height / 2 - stripeLen / 2,
            transform: [{ rotate: '45deg' }],
          }}
        />
      ))}
    </View>
  );
}
