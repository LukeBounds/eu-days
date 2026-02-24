import React from 'react';
import { View, Text } from 'react-native';
import { TRIP_COLORS } from '@/constants/trip-colors';
import { TRIP_COL_WIDTH } from '@/constants/layout';

interface Props {
  label: string;
  colorIndex: number;
  labelHeight: number;
}

export default function RotatedHeaderLabel({ label, colorIndex, labelHeight }: Props) {
  const innerLeft = (TRIP_COL_WIDTH - labelHeight) / 2;
  const innerTop  = (labelHeight - TRIP_COL_WIDTH) / 2;

  return (
    <View style={{ width: TRIP_COL_WIDTH, height: labelHeight, overflow: 'hidden' }}>
      <View
        style={{
          position: 'absolute',
          width: labelHeight,
          height: TRIP_COL_WIDTH,
          left: innerLeft,
          top: innerTop,
          transform: [{ rotate: '-90deg' }],
          justifyContent: 'center',
        }}
      >
        <Text
          numberOfLines={1}
          style={{ fontSize: 11, fontWeight: '600', color: TRIP_COLORS[colorIndex] }}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}
