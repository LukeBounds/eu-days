import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimelineRow as TimelineRowType, Trip } from '@/types/trip';
import TripColumnCell from '@/components/trip-column-cell';
import { ROW_HEIGHT, DATE_COL_WIDTH, DAYS_COL_WIDTH } from '@/constants/layout';
import { formatShortDate } from '@/utils/date-format';
import { getEuDaysTheme } from '@/utils/eu-days-color';
import { SC } from '@/constants/semantic-colors';

interface Props {
  row: TimelineRowType;
  trips: Trip[];
  showCounts: boolean;
}

function TimelineRow({ row, trips, showCounts }: Props) {
  const overLimit = row.euDaysUsed > 90;
  const { color } = getEuDaysTheme(row.euDaysUsed);
  return (
    <View style={[styles.row, row.isToday && styles.todayRow, overLimit && styles.overLimitRow]}>
      <Text style={styles.dateText}>{formatShortDate(row.dateStr)}</Text>
      <Text style={[styles.daysText, { color }]}>{row.euDaysUsed}</Text>
      <View style={styles.columns}>
        {trips.map((trip, i) => (
          <TripColumnCell
            key={trip.id}
            state={row.columnStates[i] ?? { kind: 'none' }}
            colorIndex={trip.colorIndex}
            label={trip.label}
            showCount={showCounts}
            count={row.columnContributions[i] ?? 0}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  todayRow: {
    backgroundColor: SC.rowToday,
  },
  overLimitRow: {
    backgroundColor: SC.rowOverLimit,
  },
  dateText: {
    width: DATE_COL_WIDTH,
    paddingLeft: 8,
    fontSize: 13,
    color: '#444',
  },
  daysText: {
    width: DAYS_COL_WIDTH,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  columns: {
    flexDirection: 'row',
  },
});

export default React.memo(TimelineRow);
