import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import ActivityItem from './ActivityItem';
import { Activity } from '../types';

interface ActivityListProps {
  activities: Activity[];
  onStartStop: (id: string) => void;
  onMenuPress: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onStartStop, onMenuPress }) => {
  return (
    <View>
      <Text style={styles.header}>Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityItem activity={item} onStartStop={onStartStop} onMenuPress={onMenuPress} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});

export default ActivityList;
