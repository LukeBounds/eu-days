import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTrips } from '@/context/trips-context';
import { Trip } from '@/types/trip';
import { SC } from '@/constants/semantic-colors';
import FAB from '@/components/fab';
import EmptyTripsState from '@/components/empty-trips-state';
import TripListItem from '@/components/trip-list-item';
import DaysSummary from '@/components/days-summary';

export default function TripsScreen() {
  const { trips, timelineRows, todayStr, deleteTrip } = useTrips();

  const todayRow = timelineRows.find(r => r.dateStr === todayStr);
  const daysUsed = todayRow?.euDaysUsed ?? 0;
  const daysRemaining = Math.max(0, 90 - daysUsed);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const renderItem = useCallback(
    ({ item }: { item: Trip }) => (
      <TripListItem
        trip={item}
        isPendingDelete={pendingDeleteId === item.id}
        onEdit={() => router.push(`/modal?id=${item.id}`)}
        onDeleteRequest={() => setPendingDeleteId(item.id)}
        onDeleteConfirm={() => { deleteTrip(item.id); setPendingDeleteId(null); }}
        onDeleteCancel={() => setPendingDeleteId(null)}
      />
    ),
    [pendingDeleteId, deleteTrip],
  );

  return (
    <SafeAreaView style={styles.container}>
      <DaysSummary daysUsed={daysUsed} daysRemaining={daysRemaining} />
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
