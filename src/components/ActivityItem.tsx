import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

interface ActivityItemProps {
  activity: Activity;
  onStartStop: (id: string) => void;
  onMenuPress: (activity: Activity) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onStartStop, onMenuPress }) => {
  const [displayTime, setDisplayTime] = useState(activity.time);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (activity.running && activity.start) {
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
    <View style={styles.card} testID={`activity-item-${activity.id}`}>
      <View style={styles.info}>
        <Text style={styles.activityName} testID="activity-name">{activity.name}</Text>
        <Text style={styles.time} testID="activity-time">{formatTime(displayTime)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onStartStop(activity.id)}
          style={[styles.playButton, activity.running && styles.playButtonActive]}
          accessibilityRole="button"
          accessibilityLabel={activity.running ? 'Pause timer' : 'Start timer'}
          testID={activity.running ? 'pause-button' : 'play-button'}
        >
          <Ionicons
            name={activity.running ? 'pause' : 'play'}
            size={20}
            color={colors.textInverse}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onMenuPress(activity)}
          style={styles.menuButton}
          accessibilityRole="button"
          accessibilityLabel="Activity options"
          testID="activity-menu"
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
  },
  activityName: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  menuButton: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});

export default ActivityItem;
