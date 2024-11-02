export interface Timer {
  id: ReturnType<typeof setInterval> | null;
  isActive: boolean;
}

export interface Activity {
  id: string;
  name: string;
  time: number;
  running: boolean;
  start: number | null;
}