/**
 * Activities Service Layer
 *
 * Local-only storage using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, TimeEntry } from '../types';

const LOCAL_STORAGE_KEY = 'timeTrackingActivities';

/**
 * Get all activities from local storage
 */
export async function getActivities(): Promise<Activity[]> {
  try {
    const saved = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading activities:', error);
    return [];
  }
}

/**
 * Save activities to local storage
 */
export async function saveLocalActivities(activities: Activity[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Error saving activities:', error);
  }
}

/**
 * Save or update a single activity
 */
export async function saveActivity(activity: Activity): Promise<void> {
  const activities = await getActivities();
  const existingIndex = activities.findIndex((a) => a.id === activity.id);

  if (existingIndex >= 0) {
    activities[existingIndex] = activity;
  } else {
    activities.push(activity);
  }

  await saveLocalActivities(activities);
}

/**
 * Delete an activity
 */
export async function deleteActivity(id: string): Promise<void> {
  const activities = await getActivities();
  const filtered = activities.filter((a) => a.id !== id);
  await saveLocalActivities(filtered);
}

/**
 * Export activities and time entries as CSV string
 */
export function exportActivitiesAsCSV(activities: Activity[]): string {
  const lines: string[] = [];
  lines.push('Activity,Total Time (hours),Total Time (minutes)');

  for (const activity of activities) {
    const totalMinutes = Math.floor(activity.time / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    lines.push(`"${activity.name}",${hours},${minutes}`);
  }

  lines.push('');
  lines.push('Activity,Start Time,End Time,Duration (minutes)');

  for (const activity of activities) {
    for (const entry of activity.timeEntries || []) {
      const start = new Date(entry.startTime).toLocaleString();
      const end = new Date(entry.endTime).toLocaleString();
      const duration = Math.floor(entry.duration / 60);
      lines.push(`"${activity.name}","${start}","${end}",${duration}`);
    }
  }

  return lines.join('\n');
}
