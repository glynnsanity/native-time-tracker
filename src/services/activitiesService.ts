/**
 * Activities Service Layer
 *
 * Provides CRUD operations for activities with support for both
 * Supabase (when configured) and local AsyncStorage (fallback).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Activity, TimeEntry } from '../types';

// Type assertion helper for Supabase client
const getSupabaseClient = () => supabase as any;

const LOCAL_STORAGE_KEY = 'timeTrackingActivities';
const PENDING_SYNC_KEY = 'pendingSyncActivities';

export interface ActivityWithEntries extends Activity {
  timeEntries?: TimeEntry[];
}

/**
 * Get all activities for a user
 */
export async function getActivities(userId?: string): Promise<Activity[]> {
  // Always try local first for immediate data
  const localActivities = await getLocalActivities();

  if (isSupabaseConfigured && userId) {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform from DB format to app format
        const activities: Activity[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          time: row.time_seconds,
          running: row.running,
          start: row.start_timestamp,
        }));
        return activities;
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
      // Fall back to local data
    }
  }

  return localActivities;
}

/**
 * Get activities from local storage
 */
export async function getLocalActivities(): Promise<Activity[]> {
  try {
    const saved = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading local activities:', error);
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
    console.error('Error saving local activities:', error);
  }
}

/**
 * Save or update an activity
 */
export async function saveActivity(activity: Activity, userId?: string): Promise<void> {
  // Always save locally first
  const activities = await getLocalActivities();
  const existingIndex = activities.findIndex((a) => a.id === activity.id);

  if (existingIndex >= 0) {
    activities[existingIndex] = activity;
  } else {
    activities.push(activity);
  }

  await saveLocalActivities(activities);

  // Sync to Supabase if configured
  if (isSupabaseConfigured && userId) {
    try {
      const client = getSupabaseClient();
      const { error } = await client.from('activities').upsert({
        id: activity.id,
        user_id: userId,
        name: activity.name,
        time_seconds: Math.floor(activity.time),
        running: activity.running,
        start_timestamp: activity.start,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      await markPendingSync(activity.id);
    }
  }
}

/**
 * Delete an activity
 */
export async function deleteActivity(id: string, userId?: string): Promise<void> {
  // Delete locally
  const activities = await getLocalActivities();
  const filtered = activities.filter((a) => a.id !== id);
  await saveLocalActivities(filtered);

  // Delete from Supabase if configured
  if (isSupabaseConfigured && userId) {
    try {
      const client = getSupabaseClient();
      const { error } = await client
        .from('activities')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting from Supabase:', error);
    }
  }
}

/**
 * Save a time entry
 */
export async function saveTimeEntry(entry: TimeEntry, userId?: string): Promise<void> {
  if (isSupabaseConfigured && userId) {
    try {
      const client = getSupabaseClient();
      const { error } = await client.from('time_entries').insert({
        id: entry.id,
        activity_id: entry.activityId,
        user_id: userId,
        start_time: entry.startTime,
        end_time: entry.endTime,
        duration: entry.duration,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  }
}

/**
 * Get time entries for analytics
 */
export async function getTimeEntries(
  userId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<TimeEntry[]> {
  if (!isSupabaseConfigured || !userId) {
    return [];
  }

  try {
    const client = getSupabaseClient();
    let query = client
      .from('time_entries')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false });

    if (startDate) {
      query = query.gte('start_time', startDate.getTime());
    }
    if (endDate) {
      query = query.lte('end_time', endDate.getTime());
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      activityId: row.activity_id,
      startTime: row.start_time,
      endTime: row.end_time,
      duration: row.duration,
    }));
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return [];
  }
}

/**
 * Mark an activity as pending sync
 */
async function markPendingSync(activityId: string): Promise<void> {
  try {
    const pending = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    const pendingIds: string[] = pending ? JSON.parse(pending) : [];

    if (!pendingIds.includes(activityId)) {
      pendingIds.push(activityId);
      await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pendingIds));
    }
  } catch (error) {
    console.error('Error marking pending sync:', error);
  }
}

/**
 * Sync pending local changes to server
 */
export async function syncWithServer(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const pending = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    const pendingIds: string[] = pending ? JSON.parse(pending) : [];

    if (pendingIds.length === 0) return;

    const activities = await getLocalActivities();
    const pendingActivities = activities.filter((a) => pendingIds.includes(a.id));

    const client = getSupabaseClient();
    for (const activity of pendingActivities) {
      try {
        await client.from('activities').upsert({
          id: activity.id,
          user_id: userId,
          name: activity.name,
          time_seconds: Math.floor(activity.time),
          running: activity.running,
          start_timestamp: activity.start,
          updated_at: new Date().toISOString(),
        });

        // Remove from pending list
        const index = pendingIds.indexOf(activity.id);
        if (index > -1) {
          pendingIds.splice(index, 1);
        }
      } catch (error) {
        console.error(`Error syncing activity ${activity.id}:`, error);
      }
    }

    await AsyncStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pendingIds));
  } catch (error) {
    console.error('Error during sync:', error);
  }
}
