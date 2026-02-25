import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Alert } from 'react-native';
import { Trip, TimelineRow } from '@/types/trip';
import { buildTimelineRows } from '@/utils/date-math';
import { loadTrips, saveTrips } from '@/utils/storage';
import { todayDateStr } from '@/utils/date-format';

const MAX_TRIPS = 15;

type Action =
  | { type: 'LOAD'; trips: Trip[] }
  | { type: 'ADD'; trip: Trip }
  | { type: 'UPDATE'; trip: Trip }
  | { type: 'DELETE'; id: string };

interface State {
  trips: Trip[];
  isLoading: boolean;
}

function byStartDate(a: Trip, b: Trip): number {
  return a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return { trips: action.trips, isLoading: false };
    case 'ADD':
      return { ...state, trips: [...state.trips, action.trip].sort(byStartDate) };
    case 'UPDATE':
      return {
        ...state,
        trips: state.trips.map(t => (t.id === action.trip.id ? action.trip : t)).sort(byStartDate),
      };
    case 'DELETE':
      return { ...state, trips: state.trips.filter(t => t.id !== action.id) };
    default:
      return state;
  }
}

export interface TripsContextValue {
  trips: Trip[];
  timelineRows: TimelineRow[];
  peak: number;
  todayStr: string;
  isLoading: boolean;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const todayStr = useMemo(() => todayDateStr(), []);
  const [state, dispatch] = useReducer(reducer, { trips: [], isLoading: true });

  useEffect(() => {
    loadTrips().then(trips => dispatch({ type: 'LOAD', trips }));
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveTrips(state.trips);
    }
  }, [state.trips, state.isLoading]);

  const timelineRows = useMemo(
    () => buildTimelineRows(state.trips, todayStr),
    [state.trips, todayStr],
  );

  const peak = useMemo(
    () => timelineRows.reduce((max, r) => Math.max(max, r.euDaysUsed), 0),
    [timelineRows],
  );

  function addTrip(trip: Omit<Trip, 'id'>) {
    if (state.trips.length >= MAX_TRIPS) {
      Alert.alert('Limit reached', `You can only add up to ${MAX_TRIPS} trips.`);
      return;
    }
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    dispatch({ type: 'ADD', trip: { ...trip, id } });
  }

  function updateTrip(trip: Trip) {
    dispatch({ type: 'UPDATE', trip });
  }

  function deleteTrip(id: string) {
    dispatch({ type: 'DELETE', id });
  }

  const value: TripsContextValue = {
    trips: state.trips,
    timelineRows,
    peak,
    todayStr,
    isLoading: state.isLoading,
    addTrip,
    updateTrip,
    deleteTrip,
  };

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips(): TripsContextValue {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error('useTrips must be used within TripsProvider');
  return ctx;
}
