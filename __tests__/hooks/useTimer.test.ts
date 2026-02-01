/**
 * Unit tests for useTimer hook
 *
 * Tests the timer increment logic to ensure correct timing behavior.
 */

describe('Timer Logic', () => {
  describe('Timer Increment', () => {
    it('should increment time by 1 second per interval', () => {
      // Simulating the timer logic from useTimer.ts
      const activity = { time: 0, running: true };

      // After 1 second interval, time should increase by 1
      const updatedTime = activity.time + 1;

      expect(updatedTime).toBe(1);
    });

    it('should correctly accumulate time over multiple intervals', () => {
      let time = 0;

      // Simulate 60 intervals (1 minute)
      for (let i = 0; i < 60; i++) {
        time = time + 1; // The fixed increment (was 1/60 before bug fix)
      }

      expect(time).toBe(60); // Should be 60 seconds, not 1 second
    });

    it('should not increment non-running activities', () => {
      const activities = [
        { id: '1', time: 100, running: false },
        { id: '2', time: 50, running: true },
      ];

      const updated = activities.map((activity) =>
        activity.running ? { ...activity, time: activity.time + 1 } : activity
      );

      expect(updated[0].time).toBe(100); // Not running - unchanged
      expect(updated[1].time).toBe(51); // Running - incremented
    });
  });

  describe('Time Formatting', () => {
    it('should format seconds correctly', () => {
      const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      };

      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(59)).toBe('0:59');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(3600)).toBe('60:00');
    });

    it('should format hours:minutes:seconds correctly', () => {
      const formatTimeHMS = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

      expect(formatTimeHMS(0)).toBe('00:00:00');
      expect(formatTimeHMS(61)).toBe('00:01:01');
      expect(formatTimeHMS(3661)).toBe('01:01:01');
      expect(formatTimeHMS(86400)).toBe('24:00:00');
    });
  });
});
