import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';
import { BottomSheet, Button } from './ui';
import { colors, spacing, typography, borderRadius } from '../theme';

interface ActivityEditModalProps {
  visible: boolean;
  activity: Activity | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEditName?: (id: string) => void;
  onEditTime?: (id: string) => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  visible,
  activity,
  onClose,
  onDelete,
  onEditName,
  onEditTime,
}) => {
  if (!activity) return null;

  const handleDelete = () => {
    onDelete(activity.id);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => onEditName?.(activity.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.rowLabel}>Activity</Text>
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{activity.name}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.row}
          onPress={() => onEditTime?.(activity.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.rowLabel}>Time</Text>
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{formatTime(activity.time)}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>

        <View style={styles.deleteButtonContainer}>
          <Button
            title="Delete"
            onPress={handleDelete}
            variant="danger"
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  divider: {
    height: spacing.md,
  },
  deleteButtonContainer: {
    marginTop: spacing['2xl'],
  },
});

export default ActivityEditModal;
