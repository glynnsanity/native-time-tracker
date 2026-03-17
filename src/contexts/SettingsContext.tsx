import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TimeFormat = 'hms' | 'hm';
export type WeekStart = 'monday' | 'sunday';
export type ThemeMode = 'light' | 'dark';

interface Settings {
  timeFormat: TimeFormat;
  weekStart: WeekStart;
  themeMode: ThemeMode;
}

interface SettingsContextValue extends Settings {
  setTimeFormat: (format: TimeFormat) => void;
  setWeekStart: (start: WeekStart) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const SETTINGS_KEY = 'appSettings';

const defaultSettings: Settings = {
  timeFormat: 'hms',
  weekStart: 'monday',
  themeMode: 'light',
};

const SettingsContext = createContext<SettingsContextValue>({
  ...defaultSettings,
  setTimeFormat: () => {},
  setWeekStart: () => {},
  setThemeMode: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          setSettings({ ...defaultSettings, ...JSON.parse(saved) });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    load();
  }, []);

  const persist = useCallback(async (updated: Settings) => {
    setSettings(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, []);

  const setTimeFormat = useCallback((timeFormat: TimeFormat) => {
    persist({ ...settings, timeFormat });
  }, [settings, persist]);

  const setWeekStart = useCallback((weekStart: WeekStart) => {
    persist({ ...settings, weekStart });
  }, [settings, persist]);

  const setThemeMode = useCallback((themeMode: ThemeMode) => {
    persist({ ...settings, themeMode });
  }, [settings, persist]);

  return (
    <SettingsContext.Provider value={{ ...settings, setTimeFormat, setWeekStart, setThemeMode }}>
      {children}
    </SettingsContext.Provider>
  );
};
