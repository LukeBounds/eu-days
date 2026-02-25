import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTrips } from '@/context/trips-context';
import { Trip } from '@/types/trip';
import { SC } from '@/constants/semantic-colors';
import { daysSince } from '@/utils/date-format';
import { WINDOW_DAYS } from '@/utils/date-math';
import FAB from '@/components/fab';
import EmptyTripsState from '@/components/empty-trips-state';
import TripListItem from '@/components/trip-list-item';

export default function TripsScreen() {
  const { trips, todayStr, deleteTrip } = useTrips();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const expiredIds = useMemo(() => {
    const ids = new Set<string>();
    for (const trip of trips) {
      if (daysSince(trip.endDate, todayStr) > WINDOW_DAYS) ids.add(trip.id);
    }
    return ids;
  }, [trips, todayStr]);

  const overlappingIds = useMemo(() => {
    const ids = new Set<string>();
    for (let i = 0; i < trips.length; i++) {
      for (let j = i + 1; j < trips.length; j++) {
        const a = trips[i], b = trips[j];
        if (a.startDate <= b.endDate && b.startDate <= a.endDate) {
          ids.add(a.id);
          ids.add(b.id);
        }
      }
    }
    return ids;
  }, [trips]);

  const renderItem = useCallback(
    ({ item }: { item: Trip }) => (
      <TripListItem
        trip={item}
        isPendingDelete={pendingDeleteId === item.id}
        isExpired={expiredIds.has(item.id)}
        isOverlapping={overlappingIds.has(item.id)}
        onEdit={() => router.push(`/modal?id=${item.id}`)}
        onDeleteRequest={() => setPendingDeleteId(item.id)}
        onDeleteConfirm={() => { deleteTrip(item.id); setPendingDeleteId(null); }}
        onDeleteCancel={() => setPendingDeleteId(null)}
      />
    ),
    [pendingDeleteId, deleteTrip, expiredIds, overlappingIds],
  );

  return (
    <SafeAreaView style={styles.container}>
      {trips.length === 0 ? (
        <EmptyTripsState />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={t => t.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      <FAB onPress={() => router.push('/modal')} accessibilityLabel="Add trip" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SC.bgPrimary,
  },
});
