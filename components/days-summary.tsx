import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SC } from '@/constants/semantic-colors';

interface Props {
  daysUsed: number;
  daysRemaining: number;
}

export default function DaysSummary({ daysUsed, daysRemaining }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.num}>{daysUsed}</Text> days used today
        {'  '}
        <Text style={styles.num}>{daysRemaining}</Text> remaining
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: SC.bgSummary,
    borderBottomWidth: 1,
    borderBottomColor: SC.border,
  },
  text: {
    fontSize: 15,
    color: SC.textSecondary,
  },
  num: {
    fontWeight: '700',
    fontSize: 16,
    color: SC.accent,
  },
});
