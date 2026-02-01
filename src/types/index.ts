export interface Timer {
  id: ReturnType<typeof setInterval> | null;
  isActive: boolean;
}

export interface TimeEntry {
  id: string;
  activityId: string;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface Activity {
  id: string;
  name: string;
  time: number;
  running: boolean;
  start: number | null;
  timeEntries?: TimeEntry[];
  createdAt?: number;
  updatedAt?: number;
}