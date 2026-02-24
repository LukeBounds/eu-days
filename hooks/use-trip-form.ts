import { useState } from 'react';
import { Trip } from '@/types/trip';
import { toDateStr, fromDateStr } from '@/utils/date-format';

export function useTripForm(existingTrip?: Trip) {
  const today = new Date();

  const [label, setLabel] = useState(existingTrip?.label ?? '');
  const [startDate, setStartDate] = useState<Date>(
    existingTrip ? fromDateStr(existingTrip.startDate) : today,
  );
  const [endDate, setEndDate] = useState<Date>(
    existingTrip ? fromDateStr(existingTrip.endDate) : today,
  );
  const [endDateTouched, setEndDateTouched] = useState(Boolean(existingTrip));
  const [submitted, setSubmitted] = useState(false);

  const labelError = !label.trim() ? 'Label is required.' : null;
  const dateError = toDateStr(endDate) < toDateStr(startDate)
    ? 'End date must be on or after start date.'
    : null;

  function handleStartChange(date: Date) {
    setStartDate(date);
    if (!endDateTouched) {
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      setEndDate(next);
    }
  }

  function handleEndChange(date: Date) {
    setEndDateTouched(true);
    setEndDate(date);
  }

  return {
    label,
    setLabel,
    startDate,
    endDate,
    handleStartChange,
    handleEndChange,
    labelError,
    dateError,
    submitted,
    setSubmitted,
  };
}
