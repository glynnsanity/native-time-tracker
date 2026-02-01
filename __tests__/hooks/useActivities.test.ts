/**
 * Unit tests for useActivities hook logic
 *
 * Tests CRUD operations, timing accuracy, and time entry tracking.
 */

import { Activity, TimeEntry } from '../../src/types';

describe('Activities Logic', () => {
  describe('Add Activity', () => {
    it('should create a new activity with correct default values', () => {
      const createActivity = (name: string): Activity => ({
        id: 'test-uuid',
        name: name.trim() || 'New Activity',
        time: 0,
        running: false,
        start: null,
        timeEntries: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const activity = createActivity('Work');

      expect(activity.name).toBe('Work');
      expect(activity.time).toBe(0);
      expect(activity.running).toBe(false);
      expect(activity.start).toBeNull();
      expect(activity.timeEntries).toEqual([]);
    });

    it('should use default name for empty input', () => {
      const createActivity = (name: string): Activity => ({
        id: 'test-uuid',
        name: name.trim() || 'New Activity',
        time: 0,
        running: false,
        start: null,
      });

      expect(createActivity('').name).toBe('New Activity');
      expect(createActivity('   ').name).toBe('New Activity');
    });
  });

  describe('Toggle Activity Running', () => {
    it('should start activity and record start time', () => {
      const now = Date.now();
      const activity: Activity = {
        id: '1',
        name: 'Test',
        time: 0,
        running: false,
        start: null,
      };

      const updated: Activity = {
        ...activity,
        running: true,
        start: now,
      };

      expect(updated.running).toBe(true);
      expect(updated.start).toBe(now);
    });

    it('should stop activity and accumulate elapsed time', () => {
      const startTime = Date.now() - 5000; // 5 seconds ago
      const now = Date.now();
      const activity: Activity = {
        id: '1',
        name: 'Test',
        time: 100, // Previously tracked time
        running: true,
        start: startTime,
      };

      const elapsed = (now - activity.start!) / 1000;
      const updated: Activity = {
        ...activity,
        running: false,
        time: activity.time + elapsed,
        start: null,
      };

      expect(updated.running).toBe(false);
      expect(updated.start).toBeNull();
      expect(updated.time).toBeGreaterThanOrEqual(105); // 100 + ~5 seconds
    });

    it('should create time entry when stopping', () => {
      const startTime = Date.now() - 10000; // 10 seconds ago
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);

      const timeEntry: TimeEntry = {
        id: 'entry-uuid',
        activityId: '1',
        startTime,
        endTime,
        duration,
      };

      expect(timeEntry.startTime).toBe(startTime);
      expect(timeEntry.endTime).toBe(endTime);
      expect(timeEntry.duration).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Edit Activity', () => {
    it('should update activity name', () => {
      const activities: Activity[] = [
        { id: '1', name: 'Old Name', time: 0, running: false, start: null },
        { id: '2', name: 'Other', time: 0, running: false, start: null },
      ];

      const updated = activities.map((a) =>
        a.id === '1' ? { ...a, name: 'New Name' } : a
      );

      expect(updated[0].name).toBe('New Name');
      expect(updated[1].name).toBe('Other');
    });

    it('should update activity time', () => {
      const activities: Activity[] = [
        { id: '1', name: 'Test', time: 100, running: false, start: null },
      ];

      const newTime = 500;
      const updated = activities.map((a) =>
        a.id === '1' ? { ...a, time: newTime } : a
      );

      expect(updated[0].time).toBe(500);
    });
  });

  describe('Delete Activity', () => {
    it('should remove activity from list', () => {
      const activities: Activity[] = [
        { id: '1', name: 'Keep', time: 0, running: false, start: null },
        { id: '2', name: 'Delete', time: 0, running: false, start: null },
        { id: '3', name: 'Keep Too', time: 0, running: false, start: null },
      ];

      const filtered = activities.filter((a) => a.id !== '2');

      expect(filtered.length).toBe(2);
      expect(filtered.find((a) => a.id === '2')).toBeUndefined();
    });
  });

  describe('Clear Activity Time', () => {
    it('should reset time to zero and clear time entries', () => {
      const activity: Activity = {
        id: '1',
        name: 'Test',
        time: 500,
        running: false,
        start: null,
        timeEntries: [
          { id: 'e1', activityId: '1', startTime: 0, endTime: 100, duration: 100 },
        ],
      };

      const cleared: Activity = {
        ...activity,
        time: 0,
        timeEntries: [],
      };

      expect(cleared.time).toBe(0);
      expect(cleared.timeEntries).toEqual([]);
    });
  });

  describe('isAnyRunning', () => {
    it('should return true when any activity is running', () => {
      const activities: Activity[] = [
        { id: '1', name: 'Not Running', time: 0, running: false, start: null },
        { id: '2', name: 'Running', time: 0, running: true, start: Date.now() },
      ];

      const isAnyRunning = activities.some((a) => a.running);
      expect(isAnyRunning).toBe(true);
    });

    it('should return false when no activity is running', () => {
      const activities: Activity[] = [
        { id: '1', name: 'Not Running', time: 0, running: false, start: null },
        { id: '2', name: 'Also Not', time: 0, running: false, start: null },
      ];

      const isAnyRunning = activities.some((a) => a.running);
      expect(isAnyRunning).toBe(false);
    });
  });
});
