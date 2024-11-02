import { useState, useCallback, useEffect } from 'react';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../types';

const LOCAL_STORAGE_KEY = 'timeTrackingActivities';

const getStoredActivities = async (): Promise<Activity[]> => {
  try {
    const savedActivities = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    return savedActivities ? JSON.parse(savedActivities) : [];
  } catch (error) {
    console.error('Error fetching stored activities:', error);
    return [];
  }
};

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Set initial state from AsyncStorage on client-side after first render
    const loadActivities = async () => {
      const storedActivities = await getStoredActivities();
      setActivities(storedActivities);
    };
    loadActivities();
  }, []);

  useEffect(() => {
    // Save to AsyncStorage whenever activities change
    const saveActivities = async () => {
      try {
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activities));
      } catch (error) {
        console.error('Error saving activities:', error);
      }
    };

    if (activities.length > 0) {
      saveActivities();
    }
  }, [activities]);

  const addActivity = useCallback(() => {
    const newActivity: Activity = {
      id: uuid.v4().toString(),  // Convert to string
      name: 'New Activity',
      time: 0,
      running: false,
      start: null,
    };
    setActivities(prev => [...prev, newActivity]);
  }, []);

  const editActivityName = useCallback((id: string, newName: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, name: newName } : activity
      )
    );
  }, []);

  const toggleActivityRunning = useCallback((id: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id
          ? { ...activity, running: !activity.running, start: !activity.running ? Date.now() : null }
          : activity
      )
    );
  }, []);

  const clearActivityTime = useCallback((id: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, time: 0 } : activity
      )
    );
  }, []);

  const editActivityTime = useCallback((id: string, newTime: number) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id ? { ...activity, time: newTime } : activity
      )
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
