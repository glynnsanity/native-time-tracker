import { useState, useCallback, useEffect } from 'react';
import uuid from 'react-native-uuid';
import { Activity, TimeEntry } from '../types';
import {
  getActivities,
  saveActivity,
  deleteActivity as deleteActivityService,
  saveLocalActivities,
  saveTimeEntry,
  syncWithServer,
} from '../services/activitiesService';
import { useAuth } from '../contexts/AuthContext';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    const loadActivities = async () => {
      const storedActivities = await getActivities(userId);
      setActivities(storedActivities);
    };
    loadActivities();
  }, [userId]);

  useEffect(() => {
    // Save to storage whenever activities change
    if (activities.length > 0) {
      saveLocalActivities(activities);
    }
  }, [activities]);

  // Sync with server when user logs in
  useEffect(() => {
    if (userId) {
      syncWithServer(userId);
    }
  }, [userId]);

  const addActivity = useCallback((name: string) => {
    const newActivity: Activity = {
      id: uuid.v4().toString(),
      name: name.trim() || 'New Activity',
      time: 0,
      running: false,
      start: null,
      timeEntries: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setActivities(prev => [...prev, newActivity]);

    // Async save to service
    if (userId) {
      saveActivity(newActivity, userId);
    }
  }, [userId]);

  const editActivityName = useCallback((id: string, newName: string) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          const updated = { ...activity, name: newName, updatedAt: Date.now() };
          if (userId) {
            saveActivity(updated, userId);
          }
          return updated;
        }
        return activity;
      })
    );
  }, [userId]);

  const toggleActivityRunning = useCallback((id: string) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id !== id) return activity;

        if (activity.running && activity.start) {
          // Stopping: accumulate elapsed time and create time entry
          const now = Date.now();
          const elapsed = (now - activity.start) / 1000;

          // Create a time entry for analytics
          const timeEntry: TimeEntry = {
            id: uuid.v4().toString(),
            activityId: activity.id,
            startTime: activity.start,
            endTime: now,
            duration: Math.floor(elapsed),
          };

          // Save time entry if user is authenticated
          if (userId) {
            saveTimeEntry(timeEntry, userId);
          }

          const updated: Activity = {
            ...activity,
            running: false,
            time: activity.time + elapsed,
            start: null,
            timeEntries: [...(activity.timeEntries || []), timeEntry],
            updatedAt: Date.now(),
          };

          if (userId) {
            saveActivity(updated, userId);
          }

          return updated;
        } else {
          // Starting: record start time
          const updated: Activity = {
            ...activity,
            running: true,
            start: Date.now(),
            updatedAt: Date.now(),
          };

          if (userId) {
            saveActivity(updated, userId);
          }

          return updated;
        }
      })
    );
  }, [userId]);

  const clearActivityTime = useCallback((id: string) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          const updated = {
            ...activity,
            time: 0,
            timeEntries: [],
            updatedAt: Date.now(),
          };
          if (userId) {
            saveActivity(updated, userId);
          }
          return updated;
        }
        return activity;
      })
    );
  }, [userId]);

  const editActivityTime = useCallback((id: string, newTime: number) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          const updated = { ...activity, time: newTime, updatedAt: Date.now() };
          if (userId) {
            saveActivity(updated, userId);
          }
          return updated;
        }
        return activity;
      })
    );
  }, [userId]);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    deleteActivityService(id, userId);
  }, [userId]);

  const isAnyRunning = activities.some(activity => activity.running);

  return {
    activities,
    setActivities,
    addActivity,
    editActivityName,
    toggleActivityRunning,
    clearActivityTime,
    editActivityTime,
    deleteActivity,
    isAnyRunning,
  };
}
