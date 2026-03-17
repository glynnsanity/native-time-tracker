import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SegmentedControl, Card } from '../../components/ui';
import SimpleAreaChart from '../../components/charts/SimpleAreaChart';
import ActivityBreakdownChart from '../../components/charts/ActivityBreakdown';
import { useActivities } from '../../hooks/useActivities';
import { useAnalytics, formatTimeDisplay, Period } from '../../hooks/useAnalytics';
import { useThemeColors } from '../../hooks/useThemeColors';
import { spacing, typography, borderRadius } from '../../theme';
import type { MainTabScreenProps } from '../../navigation/types';

type Props = MainTabScreenProps<'Data'>;

const PERIOD_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

const DataScreen: React.FC<Props> = () => {
  const colors = useThemeColors();
  const { activities } = useActivities();
  const [period, setPeriod] = useState<Period>('week');
  const [weekOffset, setWeekOffset] = useState(0);

  const analytics = useAnalytics(activities, period, weekOffset);

  const getWeekLabel = () => {
    if (weekOffset === 0) return 'This week';
    if (weekOffset === -1) return 'Last week';
    return `${Math.abs(weekOffset)} weeks ago`;
  };

  const handlePreviousWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    if (weekOffset < 0) {
      setWeekOffset((prev) => prev + 1);
    }
  };

  const chartMaxValue = Math.max(analytics.maxDailySeconds, 12 * 3600);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Analytics</Text>

        <SegmentedControl
          segments={PERIOD_OPTIONS}
          selectedValue={period}
          onValueChange={(value) => setPeriod(value as Period)}
          style={styles.segmentedControl}
        />

        <View style={styles.weekNavigation}>
          <TouchableOpacity
            onPress={handlePreviousWeek}
            style={styles.navButton}
            accessibilityLabel="Previous week"
          >
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.weekLabel, { color: colors.textPrimary }]}>{getWeekLabel()}</Text>
          <TouchableOpacity
            onPress={handleNextWeek}
            style={[styles.navButton, weekOffset >= 0 && styles.navButtonDisabled]}
            disabled={weekOffset >= 0}
            accessibilityLabel="Next week"
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={weekOffset >= 0 ? colors.textTertiary : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <Card style={[styles.chartCard, { backgroundColor: colors.card }]}>
          <SimpleAreaChart
            data={analytics.dailyData}
            maxValue={chartMaxValue}
          />
        </Card>

        <Card style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                {formatTimeDisplay(analytics.avgDailySeconds)}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Avg daily time</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                {formatTimeDisplay(analytics.totalSeconds)}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total time this week</Text>
            </View>
          </View>
        </Card>

        <ActivityBreakdownChart data={analytics.activityBreakdown} />

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  segmentedControl: {
    marginBottom: spacing.lg,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  navButton: {
    padding: spacing.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  weekLabel: {
    ...typography.body,
    fontWeight: '500',
    marginHorizontal: spacing.lg,
  },
  chartCard: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryValue: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.bodySmall,
  },
  bottomPadding: {
    height: spacing['3xl'],
  },
});

export default DataScreen;
