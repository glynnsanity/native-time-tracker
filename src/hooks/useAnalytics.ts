import { useMemo } from 'react';
import { Activity } from '../types';

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
  '#0B4850', // Teal (Work)
  '#FF9500', // Orange (Study)
  '#007AFF', // Blue (Reading)
  '#34C759', // Green
  '#AF52DE', // Purple
  '#FF2D55', // Pink
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

export const useAnalytics = (
  activities: Activity[],
  period: Period = 'week',
  weekOffset: number = 0
): AnalyticsData => {
  return useMemo(() => {
    const weekDates = getWeekDates(weekOffset);

    // For now, we'll simulate daily data based on total activity time
    // In a real app, you'd have time entries with timestamps
    const totalActivityTime = activities.reduce((sum, a) => sum + a.time, 0);
    const avgPerDay = totalActivityTime / 7;

    // Generate simulated daily data (in production, this would come from time entries)
    const dailyData: DailyData[] = weekDates.map((date, index) => {
      // Simulate some variation in daily totals
      const isToday = date.toDateString() === new Date().toDateString();
      const isPast = date < new Date();

      let dayTotal = 0;
      if (isPast || isToday) {
        // Distribute time with some randomness for demo
        const variance = 0.5 + Math.random();
        dayTotal = avgPerDay * variance;
      }

      return {
        date: date.toISOString().split('T')[0],
        dayName: getDayName(date),
        dayNum: date.getDate(),
        totalSeconds: dayTotal,
      };
    });

    // Calculate totals
    const totalSeconds = dailyData.reduce((sum, d) => sum + d.totalSeconds, 0);
    const daysWithData = dailyData.filter((d) => d.totalSeconds > 0).length;
    const avgDailySeconds = daysWithData > 0 ? totalSeconds / daysWithData : 0;
    const maxDailySeconds = Math.max(...dailyData.map((d) => d.totalSeconds), 1);

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
