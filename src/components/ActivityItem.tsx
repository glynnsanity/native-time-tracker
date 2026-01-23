import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';

interface ActivityItemProps {
  activity: Activity;
  onStartStop: (id: string) => void;
  onMenuPress: (id: string) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onStartStop, onMenuPress }) => {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.activityName}>{activity.name}</Text>
        <Text style={styles.time}>{activity.time.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onStartStop(activity.id)} style={styles.iconButton}>
          <Ionicons name={activity.running ? "pause" : "play"} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onMenuPress(activity.id)} style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  activityName: {
    fontSize: 18,
    fontWeight: '600',
  },
  time: {
    fontSize: 16,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#0B4850',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
});

export default ActivityItem;
