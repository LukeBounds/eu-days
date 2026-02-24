import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '@/types/trip';

const KEY = 'eu_days_trips';

export async function loadTrips(): Promise<Trip[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Trip[];
  } catch {
    return [];
  }
}

export async function saveTrips(trips: Trip[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(trips));
  } catch {
    // silently ignore storage errors
  }
}
