import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Activity, Timer } from '../types'; // Adjust this path based on where you have the types/interfaces

interface ActivityItemProps {
  activity: Activity;
  timer: Timer;
  onEditName: (id: string, newName: string) => void;
  onStartStop: (id: string) => void;
  onClearTime: (id: string) => void;
  onEditTime: (id: string, newTime: number) => void;
  onDeleteActivity: (id: string) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  timer,
  onEditName,
  onStartStop,
  onClearTime,
  onEditTime,
  onDeleteActivity,
}) => {
  return (
    <View style={[styles.activityItem, activity.running ? styles.runningActivity : timer.isActive ? styles.inactiveActivity : null]}>
      <TextInput
        style={styles.activityNameInput}
        value={activity.name}
        onChangeText={(newName) => onEditName(activity.id, newName)}
        editable={!activity.running}
      />
      <Text>Time: {activity.time.toFixed(2)} minutes</Text>
      <View style={styles.buttonGroup}>
        <Button
          title={activity.running ? 'Stop' : 'Start'}
          onPress={() => onStartStop(activity.id)}
          color={activity.running ? '#f00' : '#00f'}
        />
        <Button
          title="Clear"
          onPress={() => onClearTime(activity.id)}
          disabled={timer.isActive && !activity.running}
        />
        <Button
          title="Delete"
          onPress={() => onDeleteActivity(activity.id)}
          disabled={activity.running}
        />
      </View>
    </View>
  );
};

// Styles for ActivityItem
const styles = StyleSheet.create({
  activityItem: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  runningActivity: {
    backgroundColor: '#cfc',
  },
  inactiveActivity: {
    backgroundColor: '#eee',
  },
  activityNameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default ActivityItem;
