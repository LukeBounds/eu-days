import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Trip } from '@/types/trip';
import { TRIP_COLORS } from '@/constants/trip-colors';
import { formatDateRange } from '@/utils/date-format';
import { SC } from '@/constants/semantic-colors';

interface Props {
  trip: Trip;
  isPendingDelete: boolean;
  isExpired: boolean;
  isOverlapping: boolean;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

function TripListItem({
  trip, isPendingDelete, isExpired, isOverlapping,
  onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
}: Props) {
  if (isPendingDelete) {
    return (
      <View style={styles.confirmRow}>
        <Text style={styles.confirmText}>Delete &quot;{trip.label}&quot;?</Text>
        <TouchableOpacity style={styles.confirmYes} onPress={onDeleteConfirm}>
          <Text style={styles.confirmYesText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmNo} onPress={onDeleteCancel}>
          <Text style={styles.confirmNoText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={[styles.swatch, { backgroundColor: TRIP_COLORS[trip.colorIndex] }, isExpired && styles.swatchExpired]} />
      <View style={styles.info}>
        <Text style={[styles.label, isExpired && styles.labelExpired]}>{trip.label}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.dates, isExpired && styles.datesExpired]}>
            {formatDateRange(trip.startDate, trip.endDate)}
          </Text>
          {isExpired && (
            <View style={styles.badge}>
              <Text style={styles.badgeExpiredText}>Expired</Text>
            </View>
          )}
          {isOverlapping && (
            <View style={[styles.badge, styles.badgeOverlap]}>
              <Text style={styles.badgeOverlapText}>⚠ Overlaps</Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={onEdit}
        accessibilityLabel={`Edit ${trip.label}`}
      >
        <Text style={styles.editBtnText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDeleteRequest}
        accessibilityLabel={`Delete ${trip.label}`}
      >
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SC.divider,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  swatchExpired: {
    opacity: 0.35,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  labelExpired: {
    color: SC.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  dates: {
    fontSize: 13,
    color: SC.textSecondary,
  },
  datesExpired: {
    color: SC.textDisabled,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: SC.bgHeader,
  },
  badgeExpiredText: {
    fontSize: 11,
    fontWeight: '600',
    color: SC.textMuted,
  },
  badgeOverlap: {
    backgroundColor: '#FFF3E0',
  },
  badgeOverlapText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E65100',
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#E8F4F8',
  },
  editBtnText: {
    color: SC.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE',
  },
  deleteBtnText: {
    color: SC.destructive,
    fontSize: 14,
    fontWeight: '700',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SC.divider,
    backgroundColor: SC.bgDeleteTint,
    gap: 10,
  },
  confirmText: {
    flex: 1,
    fontSize: 14,
    color: SC.destructiveDark,
    fontWeight: '500',
  },
  confirmYes: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: SC.destructive,
  },
  confirmYesText: {
    color: SC.textOnAccent,
    fontSize: 13,
    fontWeight: '700',
  },
  confirmNo: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#EEE',
  },
  confirmNoText: {
    color: SC.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default React.memo(TripListItem);
