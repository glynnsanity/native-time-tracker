import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, typography, borderRadius } from '../theme';

interface ActivityInputProps {
  onAddActivity: (name: string) => void;
}

const ActivityInput: React.FC<ActivityInputProps> = ({ onAddActivity }) => {
  const [activityName, setActivityName] = useState('');
  const colors = useThemeColors();

  const handleAdd = () => {
    if (activityName.trim()) {
      onAddActivity(activityName.trim());
      setActivityName('');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={1}
    >
      <Ionicons name="add" size={20} color={colors.primary} style={styles.addIcon} />
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
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
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
  },
  addIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    padding: 0,
  },
});

export default ActivityInput;
