import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActivityInputProps {
  onAddActivity: (name: string) => void;
}

const ActivityInput: React.FC<ActivityInputProps> = ({ onAddActivity }) => {
  const [activityName, setActivityName] = useState('');

  const handleAdd = () => {
    if (activityName.trim()) {
      onAddActivity(activityName);
      setActivityName('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="+ Add new activity"
        placeholderTextColor="#999"
        value={activityName}
        onChangeText={setActivityName}
      />
      <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0B4850',
    borderRadius: 8,
    padding: 8,
  },
});

export default ActivityInput;
