import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { toDateStr } from '@/utils/date-format';
import { SC } from '@/constants/semantic-colors';

interface Props {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export default function DatePicker({ label, value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  function handleChange(_: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === 'android') setShowPicker(false);
    if (date) onChange(date);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      {Platform.OS === 'android' && !showPicker && (
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateButtonText}>{toDateStr(value)}</Text>
        </TouchableOpacity>
      )}
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
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
  dateButton: {
    borderWidth: 1,
    borderColor: SC.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: SC.textPrimary,
  },
});
