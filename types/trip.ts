export interface Trip {
  id: string;
  label: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  colorIndex: number;
}

export interface TimelineRow {
  dateStr: string;
  euDaysUsed: number; // rolling count for this date [0..90]
  isToday: boolean;
  columnStates: ColumnState[];       // one per trip, same order as trips array
  columnContributions: number[];     // days each trip contributes to the rolling window on this date
}

export type ColumnState =
  | { kind: 'active' }    // inside trip
  | { kind: 'tail' }      // after trip end, before any days drop off the 180-day window
  | { kind: 'dropping' }  // days are actively leaving the rolling window (dateStr >= startDate+180)
  | { kind: 'none' };
