import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityBreakdown as ActivityBreakdownType, formatTimeDisplay } from '../../hooks/useAnalytics';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ActivityBreakdownProps {
  data: ActivityBreakdownType[];
}

const ActivityBreakdownItem: React.FC<{ item: ActivityBreakdownType }> = ({ item }) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={[styles.itemTime, { color: item.color }]}>
          {formatTimeDisplay(item.totalSeconds)}
        </Text>
      </View>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(item.percentage, 100)}%`,
              backgroundColor: item.color,
            },
          ]}
        />
      </View>
      <Text style={styles.percentage}>{Math.round(item.percentage)}%</Text>
    </View>
  );
};

const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No activity data yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <ActivityBreakdownItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
  },
  item: {
    marginBottom: spacing.lg,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemName: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  itemTime: {
    ...typography.body,
    fontWeight: '600',
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    ...typography.labelSmall,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});

export default ActivityBreakdown;
