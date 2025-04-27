
export interface TraditionalTime {
  hour: number;
  minute: number;
  second: number;
  day: number;
  month: number;
  year: number;
  dayOfWeek: number;
}

export interface EnochTime {
  eHour: number; // 1-12 Solar Hours
  dayNumber: number; // 1-364
  week: number; // 1-52
  sabbathDay: boolean;
  phase: "dawn" | "rise" | "ascend";
}

export interface SolarGate {
  id: number;
  name: string;
  startTime: string; // ISO time string
  endTime: string; // ISO time string
  significance: string;
  color: string;
}

export interface TimeReminderSettings {
  enableTraditionalReminders: boolean;
  enableEnochReminders: boolean;
  reminderBeforeMinutes: number; // minutes before an event to send reminder
  soundEnabled: boolean;
  visualEnabled: boolean;
}
