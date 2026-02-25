import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTrips } from '@/context/trips-context';
import { SC } from '@/constants/semantic-colors';
import StatusBanner from '@/components/status-banner';
import CalendarView from '@/components/calendar-view';
import EmptyTripsState from '@/components/empty-trips-state';
import FAB from '@/components/fab';

export default function CalendarScreen() {
  const { trips, timelineRows, peak, todayStr, isLoading } = useTrips();
  const [showCounts, setShowCounts] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {trips.length > 0 && (
        <StatusBanner
          peak={peak}
          showCounts={showCounts}
          onToggleCounts={() => setShowCounts(v => !v)}
        />
      )}
      {trips.length === 0 ? (
        <EmptyTripsState />
      ) : (
        <CalendarView
          timelineRows={timelineRows}
          trips={trips}
          todayStr={todayStr}
          showCounts={showCounts}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
