import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import ActivityItem from './ActivityItem';
import { Activity } from '../types';

interface ActivityListProps {
  activities: Activity[];
  onStartStop: (id: string) => void;
  onDelete: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onStartStop, onDelete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activities</Text>
      {activities.length === 0 ? (
        <Text style={styles.emptyText}>No activities yet. Add one above!</Text>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityItem activity={item} onStartStop={onStartStop} onDelete={onDelete} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
    marginHorizontal: 16,
  },
});

export default ActivityList;
