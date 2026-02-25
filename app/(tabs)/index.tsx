import React, { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTrips } from '@/context/trips-context';
import TimelineRow from '@/components/timeline-row';
import { TimelineRow as TimelineRowType } from '@/types/trip';
import {
  ROW_HEIGHT,
  DATE_COL_WIDTH,
  DAYS_COL_WIDTH,
} from '@/constants/layout';
import { SC } from '@/constants/semantic-colors';
import StatusBanner from '@/components/status-banner';
import FAB from '@/components/fab';
import EmptyTripsState from '@/components/empty-trips-state';
import RotatedHeaderLabel from '@/components/rotated-header-label';

const getItemLayout = (_: unknown, index: number) => ({
  length: ROW_HEIGHT,
  offset: ROW_HEIGHT * index,
  index,
});

export default function TimelineScreen() {
  const { trips, timelineRows, peak, todayStr, isLoading } = useTrips();
  const listRef = useRef<FlatList<TimelineRowType>>(null);
  const [showCounts, setShowCounts] = useState(false);

  // ~7px per character at fontSize 11 bold, min 40, max 120
  const labelHeight = useMemo(
    () => Math.max(40, Math.min(120, (Math.max(0, ...trips.map(t => t.label.length)) * 7) + 12)),
    [trips],
  );

  useEffect(() => {
    if (!isLoading && timelineRows.length > 0) {
      const todayIndex = timelineRows.findIndex(r => r.dateStr === todayStr);
      if (todayIndex >= 0) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({ index: todayIndex, animated: false, viewPosition: 0.3 });
        }, 100);
      }
    }
  }, [isLoading, timelineRows, todayStr]);

  const renderItem = useCallback(
    ({ item }: { item: TimelineRowType }) => (
      <TimelineRow row={item} trips={trips} showCounts={showCounts} />
    ),
    [trips, showCounts],
  );

  const keyExtractor = useCallback((item: TimelineRowType) => item.dateStr, []);

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

      {/* Fixed column header */}
      <View style={styles.header}>
        <Text style={[styles.headerCell, { width: DATE_COL_WIDTH }]}>Date</Text>
        <Text style={[styles.headerCell, { width: DAYS_COL_WIDTH, textAlign: 'center' }]}>Days</Text>
        <View style={styles.headerCols}>
          {trips.map(t => (
            <RotatedHeaderLabel key={t.id} label={t.label} colorIndex={t.colorIndex} labelHeight={labelHeight} />
          ))}
        </View>
      </View>

      {trips.length === 0 ? (
        <EmptyTripsState />
      ) : (
        <FlatList
          ref={listRef}
          data={timelineRows}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={() => {}}
          initialNumToRender={40}
          maxToRenderPerBatch={40}
          windowSize={10}
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: SC.border,
    backgroundColor: SC.bgHeader,
    paddingBottom: 4,
  },
  headerCell: {
    paddingLeft: 8,
    fontSize: 12,
    fontWeight: '600',
    color: SC.textLabel,
  },
  headerCols: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
