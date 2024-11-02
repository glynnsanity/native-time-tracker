import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ActivityItem from './ActivityItem';
import AddActivityButton from './AddActivityButton';
import { useActivities } from '../hooks/useActivities';
import { useTimer } from '../hooks/useTimer';

const TimeTrackingApp: React.FC = () => {
  const {
    activities,
    setActivities,
    addActivity,
    editActivityName,
    toggleActivityRunning,
    clearActivityTime,
    editActivityTime,
    deleteActivity,
    isAnyRunning,
  } = useActivities();

  const { timer, startTimer, stopTimer } = useTimer(activities, setActivities);

  const handleStartStop = (id: string) => {
    toggleActivityRunning(id);
    if (!isAnyRunning) {
      startTimer();
    } else if (activities.every((activity) => activity.id === id || !activity.running)) {
      stopTimer();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Time Tracking App</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityItem
            activity={item}
            timer={timer}
            onEditName={editActivityName}
            onStartStop={handleStartStop}
            onClearTime={clearActivityTime}
            onEditTime={editActivityTime}
            onDeleteActivity={deleteActivity}
          />
        )}
        ListEmptyComponent={<Text>No activities yet. Add one to get started!</Text>}
      />
      <AddActivityButton onAddActivity={addActivity} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default TimeTrackingApp;
