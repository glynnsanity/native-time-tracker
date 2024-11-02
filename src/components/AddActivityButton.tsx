import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

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

// Define styles
const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
