import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTrips } from '@/context/trips-context';
import { nextColorIndex } from '@/constants/trip-colors';
import { toDateStr } from '@/utils/date-format';
import { useTripForm } from '@/hooks/use-trip-form';
import { SC } from '@/constants/semantic-colors';
import DatePicker from '@/components/date-picker';

export default function ModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { trips, addTrip, updateTrip, deleteTrip } = useTrips();

  const existingTrip = id ? trips.find(t => t.id === id) : undefined;
  const isEditing = Boolean(existingTrip);

  const form = useTripForm(existingTrip);

  function handleSave() {
    form.setSubmitted(true);
    if (form.labelError || form.dateError) return;

    if (isEditing && existingTrip) {
      updateTrip({
        ...existingTrip,
        label: form.label.trim(),
        startDate: toDateStr(form.startDate),
        endDate: toDateStr(form.endDate),
      });
    } else {
      const colorIndex = nextColorIndex(trips.map(t => t.colorIndex));
      addTrip({
        label: form.label.trim(),
        startDate: toDateStr(form.startDate),
        endDate: toDateStr(form.endDate),
        colorIndex,
      });
    }
    router.back();
  }

  function handleDelete() {
    if (!existingTrip) return;
    deleteTrip(existingTrip.id);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{isEditing ? 'Edit trip' : 'Add trip'}</Text>

        <Text style={styles.fieldLabel}>Label</Text>
        <TextInput
          style={[styles.input, form.submitted && form.labelError ? styles.inputError : null]}
          value={form.label}
          onChangeText={form.setLabel}
          placeholder="e.g. France vacation"
          placeholderTextColor={SC.textDisabled}
          returnKeyType="done"
        />
        {form.submitted && form.labelError && (
          <Text style={styles.errorText}>{form.labelError}</Text>
        )}

        <DatePicker label="Start date" value={form.startDate} onChange={form.handleStartChange} />
        <DatePicker label="End date" value={form.endDate} onChange={form.handleEndChange} />
        {form.submitted && form.dateError && (
          <Text style={styles.errorText}>{form.dateError}</Text>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{isEditing ? 'Save changes' : 'Add trip'}</Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Delete trip</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SC.bgPrimary,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: SC.textPrimary,
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: SC.textLabel,
    marginBottom: 6,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: SC.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: SC.textPrimary,
  },
  inputError: {
    borderColor: SC.destructive,
  },
  errorText: {
    marginTop: 4,
    fontSize: 13,
    color: SC.destructive,
  },
  saveBtn: {
    marginTop: 32,
    backgroundColor: SC.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: SC.textOnAccent,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteBtn: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SC.destructive,
  },
  deleteBtnText: {
    color: SC.destructive,
    fontSize: 16,
    fontWeight: '600',
  },
});
