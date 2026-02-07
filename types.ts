

export interface Shift {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  icon: string;
}

export type AssignedShifts = {
  [date: string]: (string | null)[];
};

export type Page = 'calendar' | 'statistics' | 'settings';

export interface HistoryEntry {
  id: number;
  date: string;
  description: string;
  type: 'add' | 'remove' | 'modify' | 'clear';
}

export type Theme = 'light' | 'dark' | 'system';

export type BackupFrequency = 'disabled' | 'daily' | 'weekly' | 'monthly';

export interface Calendar {
  id: string;
  name: string;
  assignedShifts: AssignedShifts;
  notes?: { [date: string]: string };
  alarms?: { [date: string]: { [shiftId: string]: string } };
  history?: HistoryEntry[];
}
