import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { toDateStr, fromDateStr } from '@/utils/date-format';
import { SC } from '@/constants/semantic-colors';

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export default function DatePicker({ label, value, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <input
        type="date"
        value={toDateStr(value)}
        onChange={e => {
          const val = e.target.value;
          if (val) onChange(fromDateStr(val));
        }}
        style={{
          fontSize: 16,
          padding: '10px 12px',
          border: `1px solid ${SC.border}`,
          borderRadius: 8,
          color: SC.textPrimary,
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: SC.textLabel,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
