import { useMemo } from 'react';
import { Activity, TimeEntry } from '../types';
import { colors } from '../theme';

export type Period = 'day' | 'week' | 'month';

export interface DailyData {
  date: string;
  dayName: string;
  dayNum: number;
  totalSeconds: number;
}

export interface ActivityBreakdown {
  id: string;
  name: string;
  totalSeconds: number;
  percentage: number;
  color: string;
}

export interface AnalyticsData {
  dailyData: DailyData[];
  avgDailySeconds: number;
  totalSeconds: number;
  activityBreakdown: ActivityBreakdown[];
  maxDailySeconds: number;
}

const ACTIVITY_COLORS = [
  colors.chartWork,
  colors.chartStudy,
  colors.chartReading,
  colors.chartExercise,
  colors.chartPurple,
  colors.chartPink,
];

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const getDayName = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getWeekDates = (offset: number = 0): Date[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1 + offset * 7);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Calculate daily totals from time entries
 */
const calculateDailyTotals = (
  activities: Activity[],
  weekDates: Date[]
): Map<string, number> => {
  const dailyTotals = new Map<string, number>();

  // Initialize all days with 0
  weekDates.forEach((date) => {
    dailyTotals.set(getDateString(date), 0);
  });

  // Calculate totals from time entries
  activities.forEach((activity) => {
    if (activity.timeEntries && activity.timeEntries.length > 0) {
      activity.timeEntries.forEach((entry) => {
        const entryDate = new Date(entry.startTime);
        const dateStr = getDateString(entryDate);

        // Only count entries within the week range
        if (weekDates.some((d) => isSameDay(d, entryDate))) {
          const current = dailyTotals.get(dateStr) || 0;
          dailyTotals.set(dateStr, current + entry.duration);
        }
      });
    }
  });

  return dailyTotals;
};

/**
 * Fallback calculation for activities without time entries
 * Uses total activity time distributed across days
 */
const calculateFallbackDailyTotals = (
  activities: Activity[],
  weekDates: Date[]
): Map<string, number> => {
  const dailyTotals = new Map<string, number>();
  const today = new Date();

  // Get activities that don't have time entries but have time tracked
  const activitiesWithoutEntries = activities.filter(
    (a) => a.time > 0 && (!a.timeEntries || a.timeEntries.length === 0)
  );

  if (activitiesWithoutEntries.length === 0) {
    return dailyTotals;
  }

  const totalTime = activitiesWithoutEntries.reduce((sum, a) => sum + a.time, 0);

  // Distribute time across past days of the week
  const pastDays = weekDates.filter((d) => d <= today);
  if (pastDays.length > 0) {
    const perDay = totalTime / pastDays.length;
    pastDays.forEach((date) => {
      dailyTotals.set(getDateString(date), perDay);
    });
  }

  return dailyTotals;
};

export const useAnalytics = (
  activities: Activity[],
  period: Period = 'week',
  weekOffset: number = 0
): AnalyticsData => {
  return useMemo(() => {
    const weekDates = getWeekDates(weekOffset);

    // Calculate daily totals from real time entries
    const realDailyTotals = calculateDailyTotals(activities, weekDates);

    // Calculate fallback totals for activities without entries
    const fallbackTotals = calculateFallbackDailyTotals(activities, weekDates);

    // Merge totals (real entries take precedence)
    const mergedTotals = new Map<string, number>();
    weekDates.forEach((date) => {
      const dateStr = getDateString(date);
      const realTotal = realDailyTotals.get(dateStr) || 0;
      const fallbackTotal = fallbackTotals.get(dateStr) || 0;
      // Use real data if available, otherwise use fallback
      mergedTotals.set(dateStr, realTotal > 0 ? realTotal : fallbackTotal);
    });

    // Generate daily data for the chart
    const dailyData: DailyData[] = weekDates.map((date) => {
      const dateStr = getDateString(date);
      return {
        date: dateStr,
        dayName: getDayName(date),
        dayNum: date.getDate(),
        totalSeconds: mergedTotals.get(dateStr) || 0,
      };
    });

    // Calculate totals
    const totalSeconds = dailyData.reduce((sum, d) => sum + d.totalSeconds, 0);
    const daysWithData = dailyData.filter((d) => d.totalSeconds > 0).length;
    const avgDailySeconds = daysWithData > 0 ? totalSeconds / daysWithData : 0;
    const maxDailySeconds = Math.max(...dailyData.map((d) => d.totalSeconds), 1);

    // Calculate total activity time for breakdown
    const totalActivityTime = activities.reduce((sum, a) => sum + a.time, 0);

    // Activity breakdown
    const activityBreakdown: ActivityBreakdown[] = activities
      .filter((a) => a.time > 0)
      .map((activity, index) => ({
        id: activity.id,
        name: activity.name,
        totalSeconds: activity.time,
        percentage: totalActivityTime > 0 ? (activity.time / totalActivityTime) * 100 : 0,
        color: ACTIVITY_COLORS[index % ACTIVITY_COLORS.length],
      }))
      .sort((a, b) => b.totalSeconds - a.totalSeconds);

    return {
      dailyData,
      avgDailySeconds,
      totalSeconds,
      activityBreakdown,
      maxDailySeconds,
    };
  }, [activities, period, weekOffset]);
};

export const formatTimeDisplay = formatTime;
