import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

interface AddActivityButtonProps {
  onAddActivity: () => void;
}

const AddActivityButton: React.FC<AddActivityButtonProps> = ({ onAddActivity }) => {
  return (
    <TouchableOpacity
      onPress={onAddActivity}
      style={styles.button}
      accessibilityLabel="Add new activity"
    >
      <Text style={styles.buttonText}>Add Activity</Text>
    </TouchableOpacity>
  );
};

export default AddActivityButton;

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textInverse,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
