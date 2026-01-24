import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../theme';

interface ActivityInputProps {
  onAddActivity: (name: string) => void;
}

const ActivityInput: React.FC<ActivityInputProps> = ({ onAddActivity }) => {
  const [activityName, setActivityName] = useState('');

  const handleAdd = () => {
    if (activityName.trim()) {
      onAddActivity(activityName.trim());
      setActivityName('');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
    >
      <Ionicons name="add" size={20} color={colors.primary} style={styles.addIcon} />
      <TextInput
        style={styles.input}
        placeholder="Add new activity"
        placeholderTextColor={colors.textTertiary}
        value={activityName}
        onChangeText={setActivityName}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
});

export default ActivityInput;
