import { ColumnState, TimelineRow, Trip } from '@/types/trip';
import { toDateStr, fromDateStr } from '@/utils/date-format';

/** The Schengen rolling window length in days */
export const WINDOW_DAYS = 180;

export function addDays(dateStr: string, n: number): string {
  const date = fromDateStr(dateStr);
  date.setDate(date.getDate() + n);
  return toDateStr(date);
}

export function isInRange(dateStr: string, start: string, end: string): boolean {
  return dateStr >= start && dateStr <= end;
}

export function computeEuDays(dateStr: string, trips: Trip[]): number {
  const windowStart = addDays(dateStr, -(WINDOW_DAYS - 1));
  let count = 0;
  let cur = windowStart;
  while (cur <= dateStr) {
    const inAnyTrip = trips.some(t => isInRange(cur, t.startDate, t.endDate));
    if (inAnyTrip) count++;
    cur = addDays(cur, 1);
  }
  return count;
}

export function computeTripContribution(dateStr: string, trip: Trip): number {
  const windowStart = addDays(dateStr, -(WINDOW_DAYS - 1));
  const overlapStart = windowStart > trip.startDate ? windowStart : trip.startDate;
  const overlapEnd = dateStr < trip.endDate ? dateStr : trip.endDate;
  if (overlapStart > overlapEnd) return 0;
  return Math.round(
    (fromDateStr(overlapEnd).getTime() - fromDateStr(overlapStart).getTime()) / 86_400_000,
  ) + 1;
}

export function getColumnState(dateStr: string, trip: Trip): ColumnState {
  if (isInRange(dateStr, trip.startDate, trip.endDate)) {
    return { kind: 'active' };
  }
  const tailEnd = addDays(trip.endDate, WINDOW_DAYS - 1);
  if (dateStr > trip.endDate && dateStr <= tailEnd) {
    const droppingStart = addDays(trip.startDate, WINDOW_DAYS);
    return dateStr >= droppingStart ? { kind: 'dropping' } : { kind: 'tail' };
  }
  return { kind: 'none' };
}

export function computeTimelineRange(
  trips: Trip[],
  today: string,
): { startDate: string; endDate: string } {
  if (trips.length === 0) {
    return { startDate: addDays(today, -90), endDate: addDays(today, 90) };
  }
  const minStart = trips.reduce(
    (min, t) => (t.startDate < min ? t.startDate : min),
    trips[0].startDate,
  );
  const maxEnd = trips.reduce(
    (max, t) => (t.endDate > max ? t.endDate : max),
    trips[0].endDate,
  );
  return {
    startDate: addDays(minStart, -7),
    endDate: addDays(maxEnd, WINDOW_DAYS),
  };
}

export function buildTimelineRows(trips: Trip[], today: string): TimelineRow[] {
  const { startDate, endDate } = computeTimelineRange(trips, today);
  const rows: TimelineRow[] = [];
  let cur = startDate;
  while (cur <= endDate) {
    const euDaysUsed = computeEuDays(cur, trips);
    const columnStates: ColumnState[] = trips.map(t => getColumnState(cur, t));
    const columnContributions: number[] = trips.map(t => computeTripContribution(cur, t));
    rows.push({
      dateStr: cur,
      euDaysUsed,
      isToday: cur === today,
      columnStates,
      columnContributions,
    });
    cur = addDays(cur, 1);
  }
  return rows;
}
