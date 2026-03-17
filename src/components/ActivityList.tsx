import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import ActivityItem from './ActivityItem';
import { Activity } from '../types';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, typography } from '../theme';

interface ActivityListProps {
  activities: Activity[];
  onStartStop: (id: string) => void;
  onMenuPress: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onStartStop,
  onMenuPress,
}) => {
  const colors = useThemeColors();

  return (
    <View style={styles.container} testID="activity-list">
      <Text style={[styles.header, { color: colors.textPrimary }]}>Activities</Text>
      {activities.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textTertiary }]} testID="empty-state">No activities yet. Add one above!</Text>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityItem
              activity={item}
              onStartStop={onStartStop}
              onMenuPress={onMenuPress}
            />
          )}
          showsVerticalScrollIndicator={false}
          testID="activities-flatlist"
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
    ...typography.h3,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing['3xl'],
    marginHorizontal: spacing.lg,
  },
});

export default ActivityList;
