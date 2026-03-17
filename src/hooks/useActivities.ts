import { useState, useCallback, useEffect } from 'react';
import uuid from 'react-native-uuid';
import { Activity, TimeEntry } from '../types';
import {
  getActivities,
  saveLocalActivities,
} from '../services/activitiesService';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadActivities = async () => {
      const storedActivities = await getActivities();
      setActivities(storedActivities);
    };
    loadActivities();
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      saveLocalActivities(activities);
    }
  }, [activities]);

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
  }, []);

  const editActivityName = useCallback((id: string, newName: string) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          return { ...activity, name: newName, updatedAt: Date.now() };
        }
        return activity;
      })
    );
  }, []);

  const toggleActivityRunning = useCallback((id: string) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id !== id) return activity;

        if (activity.running && activity.start) {
          const now = Date.now();
          const elapsed = (now - activity.start) / 1000;

          const timeEntry: TimeEntry = {
            id: uuid.v4().toString(),
            activityId: activity.id,
            startTime: activity.start,
            endTime: now,
            duration: Math.floor(elapsed),
          };

          return {
            ...activity,
            running: false,
            time: activity.time + elapsed,
            start: null,
            timeEntries: [...(activity.timeEntries || []), timeEntry],
            updatedAt: Date.now(),
          };
        } else {
          return {
            ...activity,
            running: true,
            start: Date.now(),
            updatedAt: Date.now(),
          };
        }
      })
    );
  }, []);

  const clearActivityTime = useCallback((id: string) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          return {
            ...activity,
            time: 0,
            timeEntries: [],
            updatedAt: Date.now(),
          };
        }
        return activity;
      })
    );
  }, []);

  const editActivityTime = useCallback((id: string, newTime: number) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          return { ...activity, time: newTime, updatedAt: Date.now() };
        }
        return activity;
      })
    );
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  }, []);

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
