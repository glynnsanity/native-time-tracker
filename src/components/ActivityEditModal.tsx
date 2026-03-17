import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';
import { BottomSheet, Button } from './ui';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, typography, borderRadius } from '../theme';

interface ActivityEditModalProps {
  visible: boolean;
  activity: Activity | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEditName?: (id: string, newName: string) => void;
  onEditTime?: (id: string, newTime: number) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  visible,
  activity,
  onClose,
  onDelete,
  onEditName,
  onEditTime,
}) => {
  const colors = useThemeColors();
  const [editingName, setEditingName] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [hoursValue, setHoursValue] = useState('');
  const [minutesValue, setMinutesValue] = useState('');
  const [secondsValue, setSecondsValue] = useState('');

  useEffect(() => {
    if (activity) {
      setNameValue(activity.name);
      const hours = Math.floor(activity.time / 3600);
      const minutes = Math.floor((activity.time % 3600) / 60);
      const seconds = Math.floor(activity.time % 60);
      setHoursValue(hours.toString());
      setMinutesValue(minutes.toString());
      setSecondsValue(seconds.toString());
    }
  }, [activity]);

  if (!activity) return null;

  const handleDelete = () => {
    onDelete(activity.id);
    onClose();
  };

  const handleSaveName = () => {
    if (nameValue.trim() && onEditName) {
      onEditName(activity.id, nameValue.trim());
    }
    setEditingName(false);
  };

  const handleSaveTime = () => {
    const hours = parseInt(hoursValue) || 0;
    const minutes = parseInt(minutesValue) || 0;
    const seconds = parseInt(secondsValue) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (onEditTime) {
      onEditTime(activity.id, totalSeconds);
    }
    setEditingTime(false);
  };

  const handleCancelEdit = () => {
    setEditingName(false);
    setEditingTime(false);
    setNameValue(activity.name);
    const hours = Math.floor(activity.time / 3600);
    const minutes = Math.floor((activity.time % 3600) / 60);
    const seconds = Math.floor(activity.time % 60);
    setHoursValue(hours.toString());
    setMinutesValue(minutes.toString());
    setSecondsValue(seconds.toString());
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setEditingName(true)}
          activeOpacity={0.7}
          disabled={editingName}
        >
          <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Activity</Text>
          {editingName ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary, backgroundColor: colors.backgroundSecondary }]}
                value={nameValue}
                onChangeText={setNameValue}
                autoFocus
                selectTextOnFocus
                maxLength={50}
                onSubmitEditing={handleSaveName}
              />
              <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                <Ionicons name="checkmark" size={20} color={colors.success} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                <Ionicons name="close" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{activity.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setEditingTime(true)}
          activeOpacity={0.7}
          disabled={editingTime}
        >
          <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Time</Text>
          {editingTime ? (
            <View style={styles.editContainer}>
              <View style={[styles.timeInputContainer, { backgroundColor: colors.backgroundSecondary }]}>
                <TextInput
                  style={[styles.timeInput, { color: colors.textPrimary }]}
                  value={hoursValue}
                  onChangeText={setHoursValue}
                  keyboardType="number-pad"
                  maxLength={2}
                  selectTextOnFocus
                />
                <Text style={[styles.timeSeparator, { color: colors.textSecondary }]}>:</Text>
                <TextInput
                  style={[styles.timeInput, { color: colors.textPrimary }]}
                  value={minutesValue}
                  onChangeText={setMinutesValue}
                  keyboardType="number-pad"
                  maxLength={2}
                  selectTextOnFocus
                />
                <Text style={[styles.timeSeparator, { color: colors.textSecondary }]}>:</Text>
                <TextInput
                  style={[styles.timeInput, { color: colors.textPrimary }]}
                  value={secondsValue}
                  onChangeText={setSecondsValue}
                  keyboardType="number-pad"
                  maxLength={2}
                  selectTextOnFocus
                />
              </View>
              <TouchableOpacity onPress={handleSaveTime} style={styles.saveButton}>
                <Ionicons name="checkmark" size={20} color={colors.success} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                <Ionicons name="close" size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.rowRight}>
              <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{formatTime(activity.time)}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </View>
          )}
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
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    minHeight: 56,
  },
  rowLabel: {
    ...typography.body,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowValue: {
    ...typography.body,
    marginRight: spacing.sm,
  },
  divider: {
    height: spacing.md,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.sm,
  },
  timeInput: {
    ...typography.body,
    width: 32,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  timeSeparator: {
    ...typography.body,
  },
  saveButton: {
    padding: spacing.sm,
  },
  cancelButton: {
    padding: spacing.sm,
  },
  deleteButtonContainer: {
    marginTop: spacing['2xl'],
  },
});

export default ActivityEditModal;
