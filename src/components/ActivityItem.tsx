import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';

interface ActivityItemProps {
  activity: Activity;
  onStartStop: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onStartStop, onDelete }) => {
  const [displayTime, setDisplayTime] = useState(activity.time);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (activity.running && activity.start) {
      // Update display time every second
      interval = setInterval(() => {
        const elapsed = (Date.now() - activity.start!) / 1000;
        setDisplayTime(activity.time + elapsed);
      }, 100);
    } else {
      setDisplayTime(activity.time);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activity.running, activity.start, activity.time]);

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.activityName}>{activity.name}</Text>
        <Text style={styles.time}>{formatTime(displayTime)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onStartStop(activity.id)}
          style={[styles.iconButton, activity.running && styles.activeButton]}
          accessibilityRole="button"
          accessibilityLabel={activity.running ? "Pause timer" : "Start timer"}
        >
          <Ionicons name={activity.running ? "pause" : "play"} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(activity.id)}
          style={styles.deleteButton}
          accessibilityRole="button"
          accessibilityLabel="Delete activity"
        >
          <Ionicons name="trash-outline" size={20} color="#DC3545" />
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
  info: {
    flex: 1,
  },
  activityName: {
    fontSize: 18,
    fontWeight: '600',
  },
  time: {
    fontSize: 16,
    color: '#555',
    fontVariant: ['tabular-nums'],
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
  activeButton: {
    backgroundColor: '#0D5A64',
  },
  deleteButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DC3545',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
});

export default ActivityItem;
