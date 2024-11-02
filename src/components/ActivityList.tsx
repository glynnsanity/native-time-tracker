import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ActivityItem from './ActivityItem';
import { Activity, Timer } from '../types';

interface ActivityListProps {
  activities: Activity[];
  timer: Timer;
  onEditName: (id: string, newName: string) => void;
  onStartStop: (id: string) => void;
  onClearTime: (id: string) => void;
  onEditTime: (id: string, newTime: number) => void;
  onDeleteActivity: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  timer,
  onEditName,
  onStartStop,
  onClearTime,
  onEditTime,
  onDeleteActivity,
}) => {

  if (activities.length === 0) {
    return <Text style={styles.emptyText}>No activities yet. Add one to get started!</Text>;
  }
  
  return (
    <View style={styles.container}>
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          timer={timer}
          onEditName={onEditName}
          onStartStop={onStartStop}
          onClearTime={onClearTime}
          onEditTime={onEditTime}
          onDeleteActivity={onDeleteActivity}
        />
      ))}
    </View>
  );
};

export default ActivityList;

// Define styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});
