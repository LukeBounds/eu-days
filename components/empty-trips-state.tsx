import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SC } from '@/constants/semantic-colors';

export default function EmptyTripsState() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No trips yet.</Text>
      <Text style={styles.subText}>Tap + to add your first trip.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: SC.textLabel,
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: SC.textMuted,
  },
});
