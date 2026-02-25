import React, { useMemo, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SC } from '@/constants/semantic-colors';
import { TRIP_COLORS } from '@/constants/trip-colors';
import { getEuDaysTheme } from '@/utils/eu-days-color';
import { TimelineRow, Trip } from '@/types/trip';

interface Props {
  timelineRows: TimelineRow[];
  trips: Trip[];
  todayStr: string;
  showCounts: boolean;
}

type Slot =
  | { kind: 'blank'; key: string }
  | { kind: 'day'; day: number; dateStr: string };

const OUTER_PAD = 4;
const MONTH_GAP = 8;
const MINI_CELL_HEIGHT = 48;
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DOT_SIZE = 5;
const OPACITY_TAIL = 0.4;
const OPACITY_DROPPING = 0.6;

function formatMiniMonth(yyyyMM: string): string {
  const [y, m] = yyyyMM.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('default', { month: 'short', year: 'numeric' });
}

function nextMonth(yyyyMM: string): string {
  const [y, m] = yyyyMM.split('-').map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getAllMonths(min: string, max: string): string[] {
  const months: string[] = [];
  let cur = min;
  while (cur <= max) {
    months.push(cur);
    cur = nextMonth(cur);
  }
  return months;
}

function getSlotsForMonth(yyyyMM: string): Slot[] {
  const [y, m] = yyyyMM.split('-').map(Number);
  const firstDay = new Date(y, m - 1, 1).getDay(); // 0=Sun..6=Sat
  const leadingBlanks = firstDay === 0 ? 6 : firstDay - 1; // Mon=0
  const daysInMonth = new Date(y, m, 0).getDate();

  const result: Slot[] = [];
  for (let b = 0; b < leadingBlanks; b++) {
    result.push({ kind: 'blank', key: `bs${b}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${yyyyMM}-${String(d).padStart(2, '0')}`;
    result.push({ kind: 'day', day: d, dateStr });
  }
  const rem = (leadingBlanks + daysInMonth) % 7;
  if (rem !== 0) {
    for (let b = 0; b < 7 - rem; b++) {
      result.push({ kind: 'blank', key: `be${b}` });
    }
  }
  return result;
}

type TripEntry = { i: number; kind: 'active' | 'tail' | 'dropping' };

interface MiniCellProps {
  slot: Slot;
  row: TimelineRow | undefined;
  trips: Trip[];
  isToday: boolean;
  cellWidth: number;
  showCounts: boolean;
}

const MiniCell = memo(function MiniCell({ slot, row, trips, isToday, cellWidth, showCounts }: MiniCellProps) {
  if (slot.kind === 'blank') {
    return <View style={{ width: cellWidth, height: MINI_CELL_HEIGHT }} />;
  }

  const tripEntries: TripEntry[] = row
    ? (row.columnStates
        .map((cs, i) => cs.kind !== 'none' ? { i, kind: cs.kind as TripEntry['kind'] } : null)
        .filter(Boolean) as TripEntry[])
    : [];

  const euCount = row && row.euDaysUsed > 0 ? row.euDaysUsed : null;
  const euColor = euCount != null ? getEuDaysTheme(euCount).color : null;

  return (
    <View
      style={[
        styles.miniCell,
        { width: cellWidth, height: MINI_CELL_HEIGHT },
        isToday && styles.miniCellToday,
        row && row.euDaysUsed > 90 && styles.miniCellOverLimit,
      ]}
    >
      <Text style={[styles.miniDayNum, isToday && styles.miniDayNumToday]}>{slot.day}</Text>
      <View style={styles.miniEuArea}>
        {euCount != null && (
          <Text style={[styles.miniEuCount, { color: euColor! }]}>{euCount}</Text>
        )}
      </View>
      <View style={styles.miniDotsRow}>
        {tripEntries.slice(0, 4).map(({ i, kind }) => {
          const color = TRIP_COLORS[trips[i]?.colorIndex ?? 0];
          const contribution = row?.columnContributions[i] ?? 0;

          if (showCounts) {
            const opacity = kind === 'active' ? 1 : kind === 'tail' ? OPACITY_TAIL : OPACITY_DROPPING;
            return (
              <Text key={i} style={[styles.miniCountText, { color, opacity }]}>
                {contribution}
              </Text>
            );
          }

          // active → upward-pointing triangle
          if (kind === 'active') {
            return (
              <View key={i} style={styles.triContainer}>
                <View style={[styles.triUp, { borderBottomColor: color }]} />
              </View>
            );
          }
          // tail → faded circle
          if (kind === 'tail') {
            return <View key={i} style={[styles.triCircle, { backgroundColor: color }]} />;
          }
          // dropping → downward-pointing triangle
          return (
            <View key={i} style={[styles.triContainer, { opacity: OPACITY_DROPPING }]}>
              <View style={[styles.triDown, { borderTopColor: color }]} />
            </View>
          );
        })}
      </View>
    </View>
  );
});

interface MiniMonthProps {
  yyyyMM: string;
  rowMap: Map<string, TimelineRow>;
  trips: Trip[];
  todayStr: string;
  monthWidth: number;
  showCounts: boolean;
}

const MiniMonth = memo(function MiniMonth({
  yyyyMM,
  rowMap,
  trips,
  todayStr,
  monthWidth,
  showCounts,
}: MiniMonthProps) {
  const cellWidth = monthWidth / 7;

  const slots = useMemo(() => getSlotsForMonth(yyyyMM), [yyyyMM]);

  const weeks = useMemo(() => {
    const result: Slot[][] = [];
    for (let i = 0; i < slots.length; i += 7) {
      result.push(slots.slice(i, i + 7));
    }
    return result;
  }, [slots]);

  return (
    <View style={[styles.miniMonthContainer, { width: monthWidth }]}>
      <Text style={styles.miniMonthLabel}>{formatMiniMonth(yyyyMM)}</Text>

      <View style={styles.miniWeekdayRow}>
        {WEEKDAYS.map((wd, i) => (
          <Text key={i} style={[styles.miniWeekday, { width: cellWidth }]}>
            {wd}
          </Text>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.miniWeekRow}>
          {week.map(slot => {
            const dateStr = slot.kind === 'day' ? slot.dateStr : null;
            const row = dateStr ? rowMap.get(dateStr) : undefined;
            const isToday = dateStr === todayStr;
            return (
              <MiniCell
                key={slot.kind === 'day' ? slot.dateStr : slot.key}
                slot={slot}
                row={row}
                trips={trips}
                isToday={isToday}
                cellWidth={cellWidth}
                showCounts={showCounts}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
});

export default function CalendarView({ timelineRows, trips, todayStr, showCounts }: Props) {
  const { width } = useWindowDimensions();
  const scrollbarWidth = Platform.OS === 'web' ? 15 : 0;
  const monthWidth = (width - OUTER_PAD * 2 - MONTH_GAP - scrollbarWidth) / 2;

  const rowMap = useMemo(() => {
    const map = new Map<string, TimelineRow>();
    for (const row of timelineRows) map.set(row.dateStr, row);
    return map;
  }, [timelineRows]);

  const months = useMemo(() => {
    if (timelineRows.length === 0) return [todayStr.slice(0, 7)];
    const min = timelineRows[0].dateStr.slice(0, 7);
    const max = timelineRows[timelineRows.length - 1].dateStr.slice(0, 7);
    return getAllMonths(min, max);
  }, [timelineRows, todayStr]);

  const monthPairs = useMemo((): [string, string | null][] => {
    const pairs: [string, string | null][] = [];
    for (let i = 0; i < months.length; i += 2) {
      pairs.push([months[i], months[i + 1] ?? null]);
    }
    return pairs;
  }, [months]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingHorizontal: OUTER_PAD }]}
    >
      {monthPairs.map(([a, b], pi) => (
        <View key={pi} style={styles.pairRow}>
          <MiniMonth
            yyyyMM={a}
            rowMap={rowMap}
            trips={trips}
            todayStr={todayStr}
            monthWidth={monthWidth}
            showCounts={showCounts}
          />
          {b != null ? (
            <MiniMonth
              yyyyMM={b}
              rowMap={rowMap}
              trips={trips}
              todayStr={todayStr}
              monthWidth={monthWidth}
              showCounts={showCounts}
            />
          ) : (
            <View style={{ width: monthWidth }} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: SC.bgPrimary,
  },
  content: {
    paddingBottom: 24,
    gap: 16,
  },
  pairRow: {
    flexDirection: 'row',
    gap: MONTH_GAP,
  },
  miniMonthContainer: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SC.border,
    borderRadius: 8,
  },
  miniMonthLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: SC.textPrimary,
    textAlign: 'center',
    paddingVertical: 6,
    backgroundColor: SC.bgHeader,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SC.border,
  },
  miniWeekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SC.border,
    backgroundColor: SC.bgHeader,
  },
  miniWeekday: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
    color: SC.textMuted,
    paddingVertical: 3,
  },
  miniWeekRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SC.divider,
  },
  miniCell: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: SC.divider,
    paddingTop: 2,
    alignItems: 'center',
  },
  miniCellToday: {
    backgroundColor: SC.rowToday,
  },
  miniCellOverLimit: {
    backgroundColor: SC.rowOverLimit,
  },
  miniDayNum: {
    fontSize: 10,
    fontWeight: '400',
    color: SC.textSecondary,
    width: '100%',
    textAlign: 'right',
    paddingRight: 2,
  },
  miniDayNumToday: {
    color: SC.accent,
    fontWeight: '700',
  },
  miniEuArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniEuCount: {
    fontSize: 10,
    fontWeight: '700',
  },
  miniDotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 1,
    minHeight: 6,
    marginBottom: 2,
  },
  miniCountText: {
    fontSize: 8,
    fontWeight: '700',
    lineHeight: 9,
  },
  triContainer: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  triCircle: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    opacity: OPACITY_TAIL,
  },
  triUp: {
    width: 0,
    height: 0,
    borderLeftWidth: DOT_SIZE / 2,
    borderRightWidth: DOT_SIZE / 2,
    borderBottomWidth: DOT_SIZE,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  triDown: {
    width: 0,
    height: 0,
    borderLeftWidth: DOT_SIZE / 2,
    borderRightWidth: DOT_SIZE / 2,
    borderTopWidth: DOT_SIZE,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
});
